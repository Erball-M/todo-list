export function indexedDBStart(setDb) {
    return new Promise((resolve, reject) => {
        const indexedDB =
            window.indexedDB ||
            window.webkitIndexedDB ||
            window.mozIndexedDB ||
            window.msIndexedDB ||
            window.shimIndexedDB;

        const req = indexedDB.open('TodoApp', 2);
        req.onerror = (err) => console.log(err.message)
        req.onupgradeneeded = () => {
            const db = req.result

            if (!db.objectStoreNames.contains('todos')) {
                db.createObjectStore('todos', { keyPath: 'id' });
            }
            if (!db.objectStoreNames.contains('categories')) {
                const store = db.createObjectStore('categories', { keyPath: 'id' });
                store.put({ id: '0', name: 'Без категории', categoryTodos: [] })
            }
            if (!db.objectStoreNames.contains('categoriesOrder')) {
                const store = db.createObjectStore('categoriesOrder', { keyPath: 'id' }, { unique: true });
                store.put({ id: 'order', order: ['0'] })
            }
            if (!db.objectStoreNames.contains('stats')) {
                const store = db.createObjectStore('stats', { keyPath: 'id' }, { unique: true });
                store.put({ id: 'total', count: 0 })
                store.put({ id: 'done', count: 0 })
            }
        }
        req.onsuccess = async () => {
            const db = req.result
            setDb(db)
            const state = {}
            state.todos = await getTodos(db)
            state.categories = await getCategories(db)
            state.categoriesOrder = await getCategoriesOrder(db)
            state.stats = await getStats(db)
            resolve(state)
        }
    })
}

export function addTodo(db, todo, action) {
    const transaction = db.transaction('todos', 'readwrite');
    const store = transaction.objectStore('todos');
    store.put({
        completed: action ? !action.completed : false,
        created: (new Date()).toLocaleDateString(),
        ...todo
    });

    transaction.onerror = function (err) { console.log(err.message) }
}
export function toggleCompleted(db, id) {
    const transaction = db.transaction('todos', 'readwrite');
    const store = transaction.objectStore('todos');

    const toggledTodo = store.get(id)
    toggledTodo.onsuccess = () => {
        const toggled = {
            ...toggledTodo.result,
            completed: !toggledTodo.result.completed
        }
        store.put(toggled)
    }
}
export function getTodos(db) {
    const transaction = db.transaction('todos', 'readwrite');
    transaction.onerror = function (err) { console.log(err.message) }
    const store = transaction.objectStore('todos');

    return new Promise((resolve) => {
        const todos = store.getAll()
        todos.onsuccess = () => {
            if (!todos.result) resolve([])
            resolve(todos.result)
        }
    })
}
export function removeTodo(db, id) {
    const transaction = db.transaction('todos', 'readwrite');
    transaction.onerror = function (err) { console.log(err.message) }
    const store = transaction.objectStore('todos');

    store.delete(id)
}

export function addCategory(db, category, remove = false) {
    const transaction = db.transaction('categories', 'readwrite');
    transaction.onerror = function (err) { console.log(err.message) }
    const store = transaction.objectStore('categories');

    const categoryItem = store.get(category.id)
    categoryItem.onsuccess = async () => {
        const categoryTodos = categoryItem.result.categoryTodos
        if (
            (
                categoryTodos.length !== category.categoryTodos.length !== 0
                && !remove
            )
            || remove
        ) {
            await store.put(category)
        } else {
            await store.put({ ...category, categoryTodos })
        }
    }

    store.put(category)
}
function getCorrectTodosOrders(db, getLength = false) {
    const transaction = db.transaction('todos', 'readwrite');
    const store = transaction.objectStore('todos');

    if (getLength) {
        return new Promise(resolve => {
            const todos = store.getAll()
            todos.onsuccess = () => {
                resolve(todos.result.length)
            }
        })
    }

    return new Promise(resolve => {
        const todos = store.getAll()
        todos.onsuccess = () => {
            const ordersObj = todos.result.reduce((acc, item) => {
                if (!acc[item.categoryId]) {
                    acc[item.categoryId] = []
                }
                acc[item.categoryId].push(item.id)
                return acc
            }, {})
            resolve(ordersObj)
        }
    })
}
export function getCategories(db) {
    const transaction = db.transaction('categories', 'readwrite');
    transaction.onerror = function (err) { console.log(err.message) }
    const store = transaction.objectStore('categories');

    return new Promise((resolve) => {
        const categories = store.getAll()
        categories.onsuccess = async () => {
            const todosLength = await getCorrectTodosOrders(db, true)
            const categoriesTodosLength = categories.result.reduce((acc, item) => {
                acc += item.categoryTodos.length
                return acc
            }, 0)
            if (todosLength !== categoriesTodosLength) {
                const ordersObj = await getCorrectTodosOrders(db)
                Object.keys(ordersObj).forEach(key => {
                    const target = categories.result.find(category => category.id === key)
                    addCategory(db, { ...target, categoryTodos: ordersObj[key] })
                })
            }
            resolve(categories.result)
        }
    })
}

export function setCategoriesOrder(db, order) {
    const transaction = db.transaction('categoriesOrder', 'readwrite');
    const store = transaction.objectStore('categoriesOrder');
    store.put({ id: 'order', order })

    transaction.onerror = function (err) { console.log(err.message) }
}
function getOrder(db) {
    const transaction = db.transaction('categories', 'readwrite');
    const store = transaction.objectStore('categories');

    return new Promise((resolve) => {
        const categories = store.getAll()
        categories.onsuccess = () => {
            const categoriesOrder = categories.result.reduce((acc, item) => {
                acc.push(item.id)
                return acc
            }, [])
            resolve(categoriesOrder)
        }
    })
}
export function getCategoriesOrder(db) {
    const transaction = db.transaction('categoriesOrder', 'readwrite');
    transaction.onerror = function (err) { console.log(err.message) }
    const store = transaction.objectStore('categoriesOrder');

    return new Promise((resolve) => {
        const categoriesOrder = store.getAll()
        categoriesOrder.onsuccess = async () => {
            if (!categoriesOrder.result[0]) {
                const order = await getOrder(db);
                resolve(order)
                return
            }
            resolve(categoriesOrder.result[0].order)
        }
    })
}

export function getStats(db) {
    const transaction = db.transaction('stats', 'readwrite');
    transaction.onerror = function (err) { console.log(err.message) }
    const store = transaction.objectStore('stats');

    return new Promise((resolve) => {
        const stats = store.getAll()
        stats.onsuccess = async () => {
            if (stats.result.length !== 2) {
                await store.put({ id: 'done', count: 0 })
                await store.put({ id: 'total', count: 0 })
                resolve({
                    done: 0,
                    total: 0,
                })
                return
            }
            resolve({ done: stats.result[0].count, total: stats.result[1].count })
        }
    })
}
export function setTotal(db, count) {
    const transaction = db.transaction('stats', 'readwrite');
    const store = transaction.objectStore('stats');

    const totalCount = store.get('total')
    totalCount.onsuccess = () => {
        store.put({ id: 'total', count })
    }

    transaction.onerror = function (err) { console.log(err.message) }
}
export function setDone(db, number) {
    const transaction = db.transaction('stats', 'readwrite');
    const store = transaction.objectStore('stats');

    const doneCount = store.get('done')
    doneCount.onsuccess = () => {
        store.put({ id: 'done', count: doneCount.result.count + number })
    }

    transaction.onerror = function (err) { console.log(err.message) }
}
export function indexedDBStart(setDb) {
    return new Promise((resolve, reject) => {
        const indexedDB =
            window.indexedDB ||
            window.webkitIndexedDB ||
            window.mozIndexedDB ||
            window.msIndexedDB ||
            window.shimIndexedDB;

        const req = indexedDB.open('TodoApp', 1);
        req.onerror = (err) => console.log(err.message)
        req.onupgradeneeded = () => {
            const db = req.result
            setDb(db)

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
        }
        req.onsuccess = async () => {
            const db = req.result
            setDb(db)
            const state = {}
            state.todos = await getTodos(db)
            state.categories = await getCategories(db)
            state.categoriesOrder = await getCategoriesOrder(db)
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

export function addCategory(db, category) {
    const transaction = db.transaction('categories', 'readwrite');
    const store = transaction.objectStore('categories');
    store.put(category);

    // transaction.oncomplete = function () { console.log('category has been added') }
    transaction.onerror = function (err) { console.log(err.message) }
}
export function getCategories(db) {
    const transaction = db.transaction('categories', 'readwrite');
    transaction.onerror = function (err) { console.log(err.message) }
    const store = transaction.objectStore('categories');

    return new Promise((resolve) => {
        const categories = store.getAll()
        categories.onsuccess = () => {
            if (!categories.result) resolve([])
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
export function getCategoriesOrder(db) {
    const transaction = db.transaction('categoriesOrder', 'readwrite');
    transaction.onerror = function (err) { console.log(err.message) }
    const store = transaction.objectStore('categoriesOrder');

    return new Promise((resolve) => {
        const categoriesOrder = store.getAll()
        categoriesOrder.onsuccess = () => {
            resolve(categoriesOrder.result[0].order)
        }
    })
}
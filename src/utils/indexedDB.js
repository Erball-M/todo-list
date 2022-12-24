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
                db.createObjectStore('categories', { keyPath: 'id' });
            }
            if (!db.objectStoreNames.contains('categoriesOrder')) {
                db.createObjectStore('categoriesOrder', { keyPath: 'id', unique: true });
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

//Todo Items
export function addTodo(db, todo) {
    const transaction = db.transaction('todos', 'readwrite');
    const store = transaction.objectStore('todos');
    store.add({
        completed: false,
        created: (new Date()).toLocaleDateString(),
        ...todo
    });

    transaction.oncomplete = function () { console.log('todo has been added') }
    transaction.onerror = function (err) { console.log(err.message) }
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


//Category Items
export function addCategory(db, category, categoryTodos) {
    const transaction = db.transaction('categories', 'readwrite');
    const store = transaction.objectStore('categories');
    store.put({
        categoryTodos: categoryTodos || [],
        ...category,
    });

    transaction.oncomplete = function () { console.log('category has been added') }
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

//Categorie Order Item
export function setCategoriesOrder(db, order) {
    const transaction = db.transaction('categoriesOrder', 'readwrite');
    const store = transaction.objectStore('categoriesOrder');
    store.put({ id: 'order', order })

    transaction.oncomplete = function () { console.log('categories order has been added') }
    transaction.onerror = function (err) { console.log(err.message) }
}
export function getCategoriesOrder(db) {
    const transaction = db.transaction('categoriesOrder', 'readwrite');
    transaction.onerror = function (err) { console.log(err.message) }
    const store = transaction.objectStore('categoriesOrder');

    return new Promise((resolve) => {
        const categoriesOrder = store.getAll()
        categoriesOrder.onsuccess = () => {
            resolve(categoriesOrder.result)
        }
    })
}
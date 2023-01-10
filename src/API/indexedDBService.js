//Создавать новый объект в сторе редукса для многоразавого использования
export default class IndexedDBService {
    constructor() {
        this.db = null
    }
    // constructor(name, db) {
    //     this.dbName = name
    //     // this.schema = schema
    //     this.db = db
    // }

    static async open(name, v = 1) {
        //Get link of db and data from db in one object
        return new Promise((resolve, reject) => {
            const request = indexedDB.open('TodoApp');
            request.onerror = () => reject(request.message)
            request.onsuccess = () => {
                resolve(new Promise(async (resolve) => {
                    this.db = request.result
                    const data = await IndexedDBService.getAll()
                    resolve(data)
                    // const dbInstance = new IndexedDBService(name, db)
                    // resolve(dbInstance)
                }))
            }
            request.onupgradeneeded = () => {
                //Создавать сторы на основе переданной при создании класса объекта 
                const db = request.result

                //Пробежаться по схеме и надобавлять сторы по ключам и впихнуть данные

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
                    store.put({
                        id: 'stats',
                        done: 0,
                        total: 0,
                    })
                }
            }
        })
    }

    //Export json file from DB
    static async export() {
        if (!this.db) return
        return new Promise(async (resolve) => {
            const data = await IndexedDBService.getAll()
            const json = JSON.stringify(data)


            let blob = new Blob([json], { type: 'application/json' });

            const link = document.createElement('a')
            link.download = `TodoApp Data ${(new Date()).toLocaleDateString()}.json`
            link.href = URL.createObjectURL(blob)
            document.body.append(link)
            link.click()
            URL.revokeObjectURL(link.href)
            link.remove()

            resolve()
        })
    }

    //get data from db
    static async getAll() {
        if (!this.db) return
        return new Promise(async (resolve) => {
            const storeNames = ['categories', 'categoriesOrder', 'todos', 'stats']
            const data = {}

            const promises = storeNames.map(name => {
                return new Promise((res, rej) => {
                    const transaction = this.db.transaction(name, 'readonly')
                    const store = transaction.objectStore(name)
                    const request = store.getAll()

                    request.onerror = () => {
                        rej(request.error)
                    }
                    request.onsuccess = () => {
                        data[name] = request.result
                        res(request.result)
                    }
                })
            })

            await Promise.all(promises)

            resolve(data)
        })
    }

    static async get(storeName) {
        if (!this.db) return;

        return new Promise((resolve) => {
            const transaction = this.db.transaction(storeName, 'readonly');
            transaction.onerror = function (err) { console.log(err.message) }
            const store = transaction.objectStore(storeName)

            const data = store.getAll()
            data.onsuccess = () => {
                resolve(data.result)
            }
        })
    }
    static async set(storeName, newData) {
        if (!this.db) return;

        const transaction = this.db.transaction(storeName, 'readwrite');
        transaction.onerror = (err) => console.log(err.message)

        const store = transaction.objectStore(storeName)
        store.put(newData)

        // return new Promise((resolve) => {})
    }
    static async remove(storeName, id) {
        if (!this.db) return;

        //Подумать нужно ли передевать весь объект для того чтобы можно было использовать многоразово апи
        const transaction = this.db.transaction(storeName, 'readwrite');
        transaction.onerror = function (err) { console.log(err.message) }

        const store = transaction.objectStore(storeName);
        store.delete(id)
    }

    //Add or Change data in db from imported json file
    static async updateData(data, type = 'change') {
        if (!this.db) return;

        const types = ['change', 'add']
        const storeNames = Object.values(this.db.objectStoreNames)

        if (types.includes(type)) {
            if (type === 'change') {
                //Очистка данных
                const clearStorePromises = storeNames.map(storeName => {
                    return new Promise((resolve, reject) => {
                        const store = this.db.transaction(storeName, "readwrite").objectStore(storeName);
                        store.clear().onsuccess = () => {
                            resolve();
                        };
                        store.clear().onerror = (err) => {
                            reject(err.message);
                        };
                    });
                })
                await Promise.all(clearStorePromises)
            }

            //Запись данных в базу данных
            //Возможно нужно добавить загрузку пока не будет сохранены вся информация
            Object.keys(data).forEach(key => {
                const transaction = this.db.transaction(key, 'readwrite');
                transaction.onerror = (err) => console.log(err.message)

                const store = transaction.objectStore(key)
                data[key].forEach(item => {
                    store.put(item)
                    //Статистику и порядок нужно сложить если 'add' тип обновления бд
                })
            })
        }
        return
    }
}
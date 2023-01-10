import { v4 } from "uuid"
import { toast } from 'react-toastify'

export function dataCorrector(data) {
    const dataClone = recursiveDataCopy(data)

    function keysCorrector(dataClone)
    function categoriesCorrector(dataClone)
    function todosCorrector(dataClone)
    function statsCorrector(dataClone)

    return dataClone
}

export function fileCorrector(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()

        if (file.type !== 'application/json') {

        }

        reader.readAsText(file)

        reader.onerror = () => { }
        reader.onload = () => { }
    })
}

function recursiveDataCopy(data) { }

function keysCorrector(data) {
    //Keys of data
    const defaultKeys = ['categories', 'categoriesOrder', 'todos', 'stats']
    const dataKeys = Object.keys(data)

    //      Удаление ненужных ключей
    dataKeys.forEach(key => {
        if (!defaultKeys.includes(key)) {
            delete data[key]
        }
    })
    //      Добавление недостающих ключей
    defaultKeys.forEach(key => {
        if (!defaultKeys.includes(key)) {
            data[key] = []
        }
    })
}

function categoriesCorrector(data) {
    //Categories
    const defaultCategory = {
        id: '0',
        name: 'Без категории',
        categoryTodos: [],
    }

    // Фильтрация категорий от неправильных объектов
    data.categories = data.categories.filter(category => category.name)

    //Добавление обязательной категории
    const isDefaultCategory = data.categories.find(category => category.id === '0')
    if (!isDefaultCategory) {
        data.categories.push(defaultCategory)
    } else {
        Object.keys(defaultCategory).forEach(key => {
            if (!isDefaultCategory[key]) {
                isDefaultCategory[key] = defaultCategory[key]
            }
        })
    }

    //Добавление недостающих
    data.categories.forEach(category => {
        if (!category.id) {
            category.id = v4()

            if (category.categoryTodos.length) {
                data.todos.forEach(todo => {
                    if (category.categoryTodos.includes(todo.id)) {
                        todo.categoryId = category.id
                    }
                })
            }
        }
        if (!Array.isArray(category.categoryTodos)) {
            category.categoryTodos = []
        }
    })

    //Фильтрация от лишних ключей
    data.categories = data.categories.map(category => {

    })
}

function orderCorrector(data) { }

function todosCorrector(data) { }

function statsCorrector(data) { }
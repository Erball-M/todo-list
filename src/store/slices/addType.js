// const correctedData = {}

//Новый порядок категорий
// const correctedCategoriesOrder = [...new Set([...state.categoriesOrder[0].order, ...data.categoriesOrder[0].order])]
// state.categoriesOrder[0].order = correctedCategoriesOrder
// console.log(correctedCategoriesOrder, 'correctedCategoriesOrder')

function getArrayFrom(from, what) {
    const result = from.reduce((acc, item) => {
        acc.push(item[what])
        return acc
    }, [])
    return result
}

//Исправление и сложение категорий
const stateIds = getArrayFrom(state.categories, 'id')
const dataIds = getArrayFrom(data.categories, 'id')

let totalPlus = 0;

//Уже существующие категории, нужно добавить его список задач
const existDataIds = dataIds.filter(item => stateIds.includes(item))
existDataIds.forEach(categoryId => {
    const category = state.categories.find(category => category.id === categoryId)
    const categoryData = data.categories.find(category => category.id === categoryId)

    const filteredTodosIds = categoryData.categoryTodos.filter(item => !category.categoryTodos.includes(item))
    filteredTodosIds.forEach(item => {
        const todo = data.todos.find(todo => todo.id === item)
        state.todos.push(todo)
        indexedDBService.set('todos', todo)
    })
    totalPlus += filteredTodosIds.length

    category.categoryTodos.push(...filteredTodosIds)
    indexedDBService.set('categories', { ...category, categoryTodos: filteredTodosIds })
})
indexedDBService.set('stats', { ...state.stats[0], total: state.stats[0].total + totalPlus })

//Абсолютно новые категории
const newCategories = data.categories.filter(item => !existDataIds.includes(item.id))
const newTodosIds = newCategories.reduce((acc, item) => {
    acc.push(...item.categoryTodos)
    return acc
}, [])
const newTodos = newTodosIds.map(item => data.todos.find(todo => todo.id === item))
state.todos.push(...newTodos)

state.categories.push(...newCategories)
newCategories.forEach(item => indexedDBService.set('categories', item))
indexedDBService.set('categoriesOrder', { id: 'order', order: [...state.categoriesOrder[0].order] })
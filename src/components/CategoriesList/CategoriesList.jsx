import React from 'react'
import { DragDropContext } from 'react-beautiful-dnd'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import { setOrder } from '../../store/slices/todosSlice'
import CategoryItem from '../CategoryItem/CategoryItem'
import cl from './CategoriesList.module.scss'

function CategoriesList() {
    const dispatch = useDispatch()

    const categoriesOrder = useSelector(state => state.todos.categoriesOrder)
    const categories = useSelector(state => state.todos.categories)
    const todos = useSelector(state => state.todos.todos)

    const handleDragEnd = result => {
        const { destination, draggableId, source } = result;
        if (!destination) return;
        if (
            destination.droppableId === source.droppableId
            && destination.index === source.index
        ) return;


        if (destination.droppableId !== source.droppableId) {
            const order1 = [...categories.find(category => category.id === source.droppableId).categoryTodos]
            const order2 = [...categories.find(category => category.id === destination.droppableId).categoryTodos]
            order1.splice(source.index, 1)
            order2.splice(destination.index, 0, draggableId)

            dispatch(setOrder({ id: source.droppableId, order: order1 }))
            dispatch(setOrder({ id: destination.droppableId, order: order2 }))
            return
        }

        const order = [...categories.find(category => category.id === source.droppableId).categoryTodos]
        order.splice(source.index, 1)
        order.splice(destination.index, 0, draggableId)

        dispatch(setOrder({ id: source.droppableId, order }))
    }

    if (!todos.length) return <h2 className={cl.title}>Заданий пока нет...</h2>
    return (
        <DragDropContext onDragEnd={handleDragEnd}>
            <div className={cl.list}>

                {
                    categoriesOrder.map(item => (
                        <CategoryItem
                            category={categories.find(category => category.id === item)}
                            key={item}
                        />
                    ))
                }

            </div >
        </DragDropContext>
    )
}

export default CategoriesList
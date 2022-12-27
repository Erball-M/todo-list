import React from 'react'
import { DragDropContext, Droppable } from 'react-beautiful-dnd'
import { useDispatch, useSelector } from 'react-redux'
import { setCategoriesOrder, setOrder } from '../../store/slices/todosSlice'
import { addCategory as addCategoryDB, setCategoriesOrder as setCategoriesOrderDB } from '../../API/indexedDB'
import CategoryItem from '../CategoryItem/CategoryItem'
import cl from './CategoriesList.module.scss'

function CategoriesList() {
    const dispatch = useDispatch()

    const db = useSelector(state => state.indexedDb.db)
    const todos = useSelector(state => state.todos.todos)
    const categoriesOrder = useSelector(state => state.todos.categoriesOrder)
    const categories = useSelector(state => state.todos.categories)

    // const handleBeforeCapture = (result) => {
    //     const { draggableId: id } = result
    //     if (todos.find(todo => todo.id === id)) {
    //         dispatch(toggleIsDragging({ id, isDragging: true }))
    //     }
    // }
    const handleDragEnd = result => {
        const { destination, draggableId, source } = result;
        if (!destination) return
        // {
        //     dispatch(toggleIsDragging({ id: draggableId, isDragging: false }))
        // }
        if (
            destination.droppableId === source.droppableId
            && destination.index === source.index
        ) return
        // {
        // dispatch(toggleIsDragging({ id: draggableId, isDragging: false }))
        // 
        // };


        if (source.droppableId === 'categories-wrapper') {
            const newCategoriesOrder = [...categoriesOrder]
            newCategoriesOrder.splice(source.index, 1)
            newCategoriesOrder.splice(destination.index, 0, draggableId)
            dispatch(setCategoriesOrder(newCategoriesOrder))
            setCategoriesOrderDB(db, newCategoriesOrder)
            return
        }


        if (destination.droppableId !== source.droppableId) {
            const order1 = [...categories.find(category => category.id === source.droppableId).categoryTodos]
            const order2 = [...categories.find(category => category.id === destination.droppableId).categoryTodos]
            order1.splice(source.index, 1)
            order2.splice(destination.index, 0, draggableId)

            const categoryItemFrom = categories.find(category => category.id === source.droppableId)
            const categoryItemTo = categories.find(category => category.id === destination.droppableId)
            addCategoryDB(db, { ...categoryItemFrom, categoryTodos: order1 })
            addCategoryDB(db, { ...categoryItemTo, categoryTodos: order2 })

            dispatch(setOrder({ id: source.droppableId, order: order1 }))
            dispatch(setOrder({ id: destination.droppableId, order: order2 }))
            return
        }

        const order = [...categories.find(category => category.id === source.droppableId).categoryTodos]
        order.splice(source.index, 1)
        order.splice(destination.index, 0, draggableId)

        const categoryItem = categories.find(category => category.id === source.droppableId)
        addCategoryDB(db, { ...categoryItem, categoryTodos: order })

        dispatch(setOrder({ id: source.droppableId, order }))
        // dispatch(toggleIsDragging({ id: draggableId, isDragging: false }))
    }
    if (!todos.length) return <h3 className='title'> Пока нет заданий...</ h3 >
    return (
        <DragDropContext
            // onBeforeCapture={handleBeforeCapture}
            onDragEnd={handleDragEnd}
        >
            <Droppable droppableId='categories-wrapper' type='column'>
                {(provided) => (
                    <div
                        className={cl.list}
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                    >
                        {
                            categoriesOrder?.map((item, index) => (
                                <CategoryItem
                                    category={categories.find(category => category.id === item)}
                                    index={index}
                                    key={item}
                                />
                            ))
                        }
                        {provided.placeholder}
                    </div >
                )}
            </Droppable>
        </DragDropContext>
    )
}

export default CategoriesList
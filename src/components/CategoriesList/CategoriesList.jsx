import React, { useEffect } from 'react'
import { DragDropContext, Droppable } from 'react-beautiful-dnd'
import { useDispatch, useSelector } from 'react-redux'
import { setCategoriesOrder, setOrder } from '../../store/slices/todosSlice'
import { setCategoriesOrder as setCategoriesOrderDB } from '../../utils/indexedDB'
import CategoryItem from '../CategoryItem/CategoryItem'
import cl from './CategoriesList.module.scss'

function CategoriesList() {
    const dispatch = useDispatch()
    const db = useSelector(state => state.indexedDb.db)

    const todos = useSelector(state => state.todos.todos)
    const categoriesOrder = useSelector(state => state.todos.categoriesOrder)
    const categories = useSelector(state => state.todos.categories)
    // const categoriesOrderWithTodos = categories.reduce((acc, category) => {
    //     if (category.categoryTodos.length) {
    //         acc.push(category.id)
    //     }
    //     return acc
    // }, [])
    // const [show, setShow] = useState(false)
    // const list = show ? categoriesOrder : categoriesOrderWithTodos


    // const handleBeforeCapture = result => {
    //     const { draggableId } = result
    //     if (!categoriesOrder.includes(draggableId)) {
    //         setShow(true)
    //     }
    // }
    const handleDragEnd = result => {
        const { destination, draggableId, source } = result;
        if (!destination) return;
        if (
            destination.droppableId === source.droppableId
            && destination.index === source.index
        ) return;


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

            dispatch(setOrder({ id: source.droppableId, order: order1 }))
            dispatch(setOrder({ id: destination.droppableId, order: order2 }))
            return
        }

        const order = [...categories.find(category => category.id === source.droppableId).categoryTodos]
        order.splice(source.index, 1)
        order.splice(destination.index, 0, draggableId)


        dispatch(setOrder({ id: source.droppableId, order }))
    }
    if (!todos.length) return <h3 className='title'> Пока нет заданий...</ h3 >
    return (
        <DragDropContext
            // onBeforeCapture={}={handleBeforeCapture}
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
                            categoriesOrder.map((item, index) => (
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
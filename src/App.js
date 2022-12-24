import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Header from './components/Header/Header'
import AddTodoForm from "./components/AddTodoForm/AddTodoForm";
import CategoriesList from "./components/CategoriesList/CategoriesList";
import { getData } from "./store/slices/todosSlice";

function App() {
  const dispatch = useDispatch()
  const currentTheme = useSelector(state => state.theme.theme)

  useEffect(() => {
    document.body.dataset.theme = currentTheme
  }, [currentTheme])

  useEffect(() => {
    dispatch(getData())
  }, [dispatch])

  return (
    <div className="App">
      <Header />
      <div className="container">
        <AddTodoForm />
        <CategoriesList />
      </div>
    </div>
  );
}

export default App;
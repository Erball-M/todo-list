import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getSaved } from "./store/slices/todosSlice";
import Header from './components/Header/Header'
import AddTodoForm from "./components/AddTodoForm/AddTodoForm";
import CategoriesList from "./components/CategoriesList/CategoriesList";

function App() {
  const dispatch = useDispatch()
  const currentTheme = useSelector(state => state.theme.theme)


  useEffect(() => {
    document.body.dataset.theme = currentTheme
  }, [currentTheme])

  useEffect(() => {
    dispatch(getSaved())
    console.log("%cТудушник с днд!", "color: red; font-family: Roboto; font-size: 3em; font-weight: bold; text-shadow: rgba(0,0,0,.25) 3px 3px;");
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
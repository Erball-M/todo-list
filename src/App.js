import React, { useEffect } from "react";
import Header from './components/Header/Header'
import AddTodoForm from "./components/AddTodoForm/AddTodoForm";
import CategoriesList from "./components/CategoriesList/CategoriesList";
import { useSelector } from "react-redux";

function App() {
  const currentTheme = useSelector(state => state.theme.theme)
  useEffect(() => {
    document.body.dataset.theme = currentTheme
  }, [currentTheme])
  useEffect(() => {
    console.log("%cТудушник с днд йопта!", "color: red; font-family: Roboto; font-size: 3em; font-weight: bold; text-shadow: rgba(0,0,0,.25) 3px 3px;");
  }, [])
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
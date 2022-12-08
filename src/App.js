import React from "react";
import Header from './components/Header/Header'
import AddCategoryForm from "./components/AddCategoryForm/AddCategoryForm";
import AddTodoForm from "./components/AddTodoForm/AddTodoForm";
import CategoriesList from "./components/CategoriesList/CategoriesList";

function App() {
  return (
    <div className="App">
      <Header />
      <div className="container">
        <AddTodoForm />
        <hr />
        <AddCategoryForm />
        <CategoriesList />
      </div>
    </div>
  );
}

export default App;
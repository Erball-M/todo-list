import React from "react";
import { DragDropContext } from 'react-beautiful-dnd'
import AddCategoryForm from "./components/AddCategoryForm/AddCategoryForm";
import AddTodoForm from "./components/AddTodoForm/AddTodoForm";
import CategoriesList from "./components/CategoriesList/CategoriesList";

function App() {
  return (
    <div className="App">

      <AddTodoForm />
      <AddCategoryForm />
      <CategoriesList />

    </div>
  );
}

export default App;
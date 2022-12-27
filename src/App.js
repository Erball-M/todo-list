import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css'
import Header from './components/Header/Header'
import AddTodoForm from "./components/AddTodoForm/AddTodoForm";
import CategoriesList from "./components/CategoriesList/CategoriesList";
import Footer from "./components/Footer/Footer";
import Loader from "./components/UI/Loader/Loader";
import { getData } from "./store/slices/todosSlice";
import useDBStart from "./Hooks/useDBStart";

function App() {
  const dispatch = useDispatch()
  const currentTheme = useSelector(state => state.theme.theme)
  const [fetcher, isDataLoading] = useDBStart(async () => dispatch(getData()))

  useEffect(() => {
    document.body.dataset.theme = currentTheme
  }, [currentTheme])
  useEffect(() => {
    async function fetchData() {
      await fetcher()
    }
    fetchData();
  }, []);

  return (
    <>
      <div className="App">
        <Header />
        <main className='container main' >
          <AddTodoForm />
          {
            isDataLoading
              ? <Loader />
              : <CategoriesList />
          }
        </main>
        <Footer />
      </div>
      <ToastContainer
        position='top-right'
        autoClose={3000}
        newestOnTop={true}
        theme={currentTheme}
        pauseOnFocusLoss={false}
      />
    </>
  );
}

export default App;
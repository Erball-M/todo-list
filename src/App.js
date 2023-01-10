import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css'
import useLoading from "./Hooks/useLoading";
import { openDB } from "./store/slices/todosSlice";
import { getTheme } from "./store/slices/themeSlice";
import { fetchQuote } from "./store/slices/quotesSlice";

function App() {
  const dispatch = useDispatch()

  const theme = useSelector(state => state.theme.theme)

  const [fetcher, isLoading] = useLoading(async () => {
    await dispatch(getTheme())
    await dispatch(openDB())
    await dispatch(fetchQuote())
  })

  useEffect(() => {
    async function fetchData() {
      await fetcher()
    }
    fetchData();
  }, []);

  if (isLoading) return <Loader />
  return (
    <>
      <div
        className="App"
        data-themes={theme}
      >
        <Header />
        <main className='container main' >
          <AddTodoForm />
          <CategoriesList />
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
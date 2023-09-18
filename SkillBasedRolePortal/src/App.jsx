// import './App.css'
import navbar from './components/navbar.jsx'
import home from './components/home.jsx'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'jquery-nice-select/css/nice-select.css'

function App() {
  return (
    <>
    {navbar()}
      <main>
        {home()}
      </main>
    </>
  )
}

export default App

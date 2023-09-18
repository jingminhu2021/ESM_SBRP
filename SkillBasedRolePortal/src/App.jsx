// import './App.css'
import navbar from './components/navbar.jsx'
import home from './components/home.jsx'
import './assets/css/custom-bs.css'
import './assets/css/jquery.fancybox.min.css'
import './assets/css/owl.carousel.min.css'
import './assets/fonts/icomoon/style.css'
import './assets/fonts/line-icons/style.css'
import './assets/css/animate.min.css'
import './assets/css/style.css'

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

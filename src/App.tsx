import "./styles.css"
import { Dashboard } from "./components/Dashboard"
import { Navbar } from "./components/Navbar"
import { Footer } from "./components/Footer"

export default function App() {
  return (
    <div className="app-container">
      <Navbar />
      <main className="main-content">
        <Dashboard />
      </main>
      <Footer />
    </div>
  )
}

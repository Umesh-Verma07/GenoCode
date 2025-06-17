import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
export default function Home() {
  return (
    <div>
      <div className="min-h-screen flex flex-col">
      <Navbar />
      {/* Page Content */}
      <main className="flex-grow">
        {/* All routes/pages go here */}
      </main>
      <Footer />
    </div>
    </div>
  )
}

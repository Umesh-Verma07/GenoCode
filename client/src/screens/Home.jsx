import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
export default function Home() {
  const problemList = [];
  problemList[0] = {"title" :"Sum of 2 Numbers", "level" : "Easy"};
  problemList[1] = {"title" :"Reverse Linked List", "level" : "Medium"};
  problemList[2] = {"title" :"Find gcd of 2 numbers", "level" : "Easy"};
  problemList[3] = {"title" :"Create BST", "level" : "Medium"};
  problemList[4] = {"title" :"Matrix Chain Multiplication", "level" : "Hard"};
  problemList[5] = {"title" :"Find MEX", "level" : "Medium"};
  problemList[6] = {"title" :"Binary Search", "level" : "Easy"};
  problemList[7] = {"title" :"Merge two sorted Linked List", "level" : "Hard"};

  return (
    <div>
      <div className="min-h-screen flex flex-col">
        <Navbar />

        <main className="flex-grow pt-20 p-6">
          <div className="w-full max-w-screen-lg mx-auto space-y-4">
            {problemList.map((p, idx) => (
              <div key={idx} className="flex justify-between items-center bg-white p-4 rounded-lg shadow hover:shadow-md transition w-full">
                <span className="text-gray-800 font-medium">{p.title}</span>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${p.level === 'Easy' ? 'bg-green-100 text-green-800' : p.level === 'Medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`} >{p.level}</span>
              </div>
            ))}
          </div>
        </main>

        <Footer />
      </div>
    </div>
  )
}

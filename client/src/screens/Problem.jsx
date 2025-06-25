import { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import Navbar from '../components/Navbar';
import { useParams } from 'react-router-dom';
const SERVER_URL = import.meta.env.VITE_SERVER_URL;

export default function ProblemPage() {
  const {id} = useParams();
  const [problem, setProblem] = useState('');
  const [language, setLanguage] = useState('cpp');
  const [code, setCode] = useState('');

  useEffect(()=>{
    async function fetchProblem(){
      try{
        const response = await fetch(`${SERVER_URL}/problem/${id}`);
        const data = await response.json();
        if(!data.success){
          return new Error(data.error);
        }
        setProblem(data.problem);
      } catch (e){
        return new Error(e.message);
      }
    }
    fetchProblem();
  }, []);

  if (!problem) {
    return <p className="p-8 text-center">No problem data found.</p>;
  }

  const handleRun = () => {

  };

  const handleSubmit = () => {

  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex flex-1 overflow-hidden mt-10 py-10">
        <aside className="w-full md:w-1/2 p-6 overflow-y-auto h-[calc(100vh-4rem)] bg-gray-50 border-r border-gray-200 overscroll-contain">
          <h1 className="text-2xl font-bold mb-4">{problem.title}</h1>
          <div className="prose max-w-none text-gray-800 whitespace-pre-line">
            {problem.description}
          </div>
        </aside>
        <div className="w-full md:w-1/2 flex flex-col">
          <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
            <div className="flex items-center space-x-2">
              <label htmlFor="lang" className="font-medium">Language:</label>
              <select id="lang" value={language} onChange={e => setLanguage(e.target.value)} className="border rounded px-2 py-1">
                <option value="cpp">C++</option>
                <option value="java">Java</option>
                <option value="python">Python</option>
              </select>
            </div>
            <div className="flex space-x-2">
              <button onClick={handleRun} className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-1 rounded"> Run </button>
              <button onClick={handleSubmit} className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-1 rounded" > Submit </button>
            </div>
          </div>
          <div className="flex-grow">
            <Editor height="calc(100vh - 6rem)" language={language} value={code} theme="vs-dark" onChange={v => setCode(v)} options={{ fontSize: 16, minimap: { enabled: false }, wordWrap: 'on' }} />
          </div>
        </div>
      </div>
    </div>
  );
}
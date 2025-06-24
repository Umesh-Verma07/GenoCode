import { useState} from 'react';
import {useLocation } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import Navbar from '../components/Navbar';


export default function ProblemPage() {
  const {state} = useLocation();
  const problem = state.p;

  const [language, setLanguage] = useState('');
  const [code, setCode] = useState('');
  if(!problem){
    console.log("error");
  }

  const handleSubmit = ()=>{

  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex flex-col md:flex-row flex-1 mt-10 py-10">
        <aside className="md:w-1/2 w-full overflow-y-auto bg-gray-50 p-6">
          <h2 className="text-2xl font-bold mb-4">{problem.title}</h2>
          <p className="text-gray-800 whitespace-pre-line">{problem.description}</p>
        </aside>
        <div className="md:w-1/2 w-full flex flex-col p-6">
          <div className="mb-4 flex justify-center">
            Language &nbsp;
            <select className="border rounded px-3 py-1" name='language' value={language} onChange={e => setLanguage(e.target.value)}>
              <option value="cpp">C++</option>
              <option value="java">Java</option>
              <option value="python">Python</option>
            </select>
          </div>
          <div className="flex-grow">
            <Editor height="70vh" language={language} value={code} theme="vs-dark" onChange={value => setCode(value)}/>
          </div>
          <button onClick={handleSubmit} className="mt-4 bg-primary-600 text-white py-2 rounded hover:bg-primary-700 transition"> Submit Code </button>
        </div>
      </div>
    </div>
  )};

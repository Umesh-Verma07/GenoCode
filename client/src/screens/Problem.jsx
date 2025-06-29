import { useState, useEffect } from 'react'
import Editor from '@monaco-editor/react'
import Navbar from '../components/Navbar'
import { useParams } from 'react-router-dom'
const SERVER_URL = import.meta.env.VITE_SERVER_URL;
const COMPILER_URL = import.meta.env.VITE_COMPILER_URL;

export default function ProblemPage() {
  const { id } = useParams();
  const [problem, setProblem] = useState('');
  const [language, setLanguage] = useState('cpp');
  const [code, setCode] = useState('');
  const [stdin, setStdin] = useState('')
  const [stdout, setStdout] = useState('')

  useEffect(() => {
    async function fetchProblem() {
      try {
        const response = await fetch(`${SERVER_URL}/problem/${id}`);
        const data = await response.json();
        if (!data.success) {
          return new Error(data.error);
        }
        setProblem(data.problem);
        setStdin(data.problem.testCases[0].input);
      } catch (e) {
        return new Error(e.message);
      }
    }
    fetchProblem();
  }, []);

  if (!problem) {
    return <p className="p-8 text-center">No problem data found.</p>;
  }

  const handleRun = async() => {
    const response = await fetch(`${COMPILER_URL}/run`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({code, language, input: stdin})
    })
    const json = await response.json();
    if (!json.success) {
      setStdout(json.error);
    }else{
      setStdout(json.output);
    }
  };

  const handleSubmit = async() => {
    const response = await fetch(`${COMPILER_URL}/submit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({code: code, language: language, email: localStorage.getItem("email"), problemId: id})
    })
    const json = await response.json();
    if (!json.success) {
      setStdout(json.error);
    }else{
      setStdout(json.output.stdout);
    }
  };

  return (
    <div className="flex flex-col min-h-screen scrollFix">
      <Navbar />
      <div className="max-h-full flex flex-1 overflow-hidden mt-16">
        <aside className="w-full md:w-1/2 p-6 overflow-y-auto max-h-[calc(100vh-4rem)] bg-gray-30 border-r border-gray-200 overscroll-contain">
          <h1 className="text-2xl font-bold mb-4">{problem.title}</h1>
          <div className="prose max-w-none text-gray-800 whitespace-pre-line">{problem.description}</div>
        </aside>
        <div className="w-full md:w-1/2 flex flex-col">
          <div className="flex items-center justify-between p-2 border-b border-gray-200 bg-white">
            <div className="flex items-center space-x-2">
              <label htmlFor="lang" className="font-medium">Language:</label>
              <select id="lang" value={language} onChange={e => setLanguage(e.target.value)} className="border rounded px-2 py-1">
                <option value="cpp">C++</option>
                <option value="java">Java</option>
                <option value="py">Python</option>
              </select>
            </div>
            <div className="flex space-x-2">
              <button onClick={handleRun} className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-1 rounded"> Run </button>
              <button onClick={handleSubmit} className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-1 rounded" > Submit </button>
            </div>
          </div>
          <Editor height="calc(65vh - 6rem)" language={language} value={code} theme="vs-dark" onChange={v => setCode(v)} options={{ fontSize: 16, minimap: { enabled: false }, wordWrap: 'on' }} />
          <div className="bg-gray-50 p-4 space-y-3 overflow-auto border-t">
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-1">Input</h4>
              <textarea className="w-full h-20 p-2 bg-white border border-gray-300 rounded font-mono text-sm" value={stdin} placeholder="Enter test input here…" onChange={e => setStdin(e.target.value)} />
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-1">Output</h4>
              <pre className="w-full h-20 p-2 bg-black text-green-200 rounded overflow-auto font-mono text-sm"> {stdout} </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
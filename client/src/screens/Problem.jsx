import { useState, useEffect, useRef } from 'react'
import Editor from '@monaco-editor/react'
import Navbar from '../components/Navbar'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorAlert from '../components/ErrorAlert'
import LoadingSkeleton from '../components/LoadingSkeleton'
import { useParams } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import AIReviewPanel from '../components/AIReviewPanel'

const SERVER_URL = import.meta.env.VITE_SERVER_URL;
const COMPILER_URL = import.meta.env.VITE_COMPILER_URL;

export default function ProblemPage() {
  let navigate = useNavigate();
  const { id } = useParams();
  const [problem, setProblem] = useState('');
  const [language, setLanguage] = useState('cpp');
  const [code, setCode] = useState('');
  const [stdin, setStdin] = useState('')
  const [stdout, setStdout] = useState('')
  const [loadingRun, setLoadingRun] = useState(false)
  const [loadingSubmit, setLoadingSubmit] = useState(false)
  const [loadingReview, setLoadingReview] = useState(false)
  const [loadingProblem, setLoadingProblem] = useState(true)

  const [error, setError] = useState('')
  const [showError, setShowError] = useState(true)
  const [reviewText, setReviewText] = useState('')
  const [showReviewPanel, setShowReviewPanel] = useState(false)
  const [selectedTab, setSelectedTab] = useState('Input')

  const isFirstLoad = useRef(true);

  const codeKey = `${id}${localStorage.getItem("email")}${language}`

  useEffect(() => {
    const draft = localStorage.getItem(codeKey);
    if (draft != null) {
      setCode(draft);
    } else {
      // If no saved code exists for this language, load template
      loadTemplate(language);
    }
  }, [id, language]);

  useEffect(() => {
    if (isFirstLoad.current) {
      isFirstLoad.current = false;
      return;
    }
    localStorage.setItem(codeKey, code);
  }, [code, language]);

  // Function to load template for selected language
  const loadTemplate = async (lang) => {
    try {
      const response = await fetch(`/templates/${lang}.txt`);
      if (response.ok) {
        const template = await response.text();
        setCode(template);
        localStorage.setItem(codeKey, template);
      } else {
        console.warn(`Template for ${lang} not found`);
      }
    } catch (error) {
      console.error('Error loading template:', error);
    }
  };

  useEffect(() => {
    async function fetchProblem() {
      try {
        setLoadingProblem(true);
        const response = await fetch(`${SERVER_URL}/problem/${id}`);
        const data = await response.json();
        if (!data.success) {
          throw new Error(data.error);
        }
        setProblem(data.problem);
        setStdin(data.problem.testCases[0].input);
      } catch (e) {
        setError(e.message);
        setShowError(true);
      } finally {
        setLoadingProblem(false);
      }
    }
    fetchProblem();
  }, [id]);

  if (loadingProblem) {
    return (
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-indigo-50 to-gray-100">
        <Navbar />
        <div className="flex flex-1 gap-6 px-4 pb-6 navbar-spacing mx-auto w-full">
          <LoadingSkeleton type="problem" count={1} className="w-full md:w-[48%]" />
          <LoadingSkeleton type="card" count={1} className="w-full md:w-1/2" />
        </div>
      </div>
    );
  }

  if (!problem) {
    return (
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-indigo-50 to-gray-100">
        <Navbar />
        <div className="flex flex-1 items-center justify-center navbar-spacing">
          <ErrorAlert 
            error={error || "Problem not found"} 
            show={showError} 
            onClose={() => setShowError(false)}
            className="max-w-md"
          />
        </div>
      </div>
    );
  }

  const handleRun = async () => {
    setLoadingRun(true)
    setStdout('Running ....')
    setSelectedTab("Output")
    
    try {
      const response = await fetch(`${COMPILER_URL}/run`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ code, language, input: stdin })
      })
      
      const json = await response.json();
      
      // Handle backend-specific error types (these are expected responses, not HTTP errors)
      if (!json.success && json.type) {
        switch (json.type) {
          case 'TLE':
            setStdout(`⏰ Time Limit Exceeded: ${json.error}`);
            break;
          case 'CE':
            setStdout(`🔧 Compilation Error:\n${json.error}`);
            break;
          case 'RE':
            setStdout(`💥 Runtime Error:\n${json.error}`);
            break;
          case 'WA':
            setStdout(`❌ Wrong Answer: ${json.error}`);
            break;
          default:
            setStdout(`❌ ${json.type}: ${json.error}`);
        }
      } else if (!json.success) {
        setStdout(`❌ Error: ${json.error || "Server error occurred"}`);
      } else {
        setStdout(json.output);
      }
    } catch (error) {
      console.error('Run error:', error);
      if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
        setStdout("❌ Error: Compiler service is not available. Please check if the server is running.");
      } else {
        setStdout(`❌ Error: ${error.message || "An unexpected error occurred"}`);
      }
    } finally {
      setLoadingRun(false)
    }
  };

  const handleSubmit = async () => {
    if (!localStorage.getItem("authToken")) {
      navigate('/login', { state: { from: `/problem/${id}` } });
      return;
    }
    setStdout('Submitting ....')
    setLoadingSubmit(true)
    setSelectedTab("Output")
    
    try {
      const response = await fetch(`${COMPILER_URL}/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code: code, language: language, email: localStorage.getItem("email"), problemId: id })
      })
      
      const json = await response.json();
      
      // Handle backend-specific error types (these are expected responses, not HTTP errors)
      if (!json.success && json.type) {
        switch (json.type) {
          case 'TLE':
            setStdout(`⏰ Time Limit Exceeded: ${json.error}`);
            break;
          case 'CE':
            setStdout(`🔧 Compilation Error:\n${json.error}`);
            break;
          case 'RE':
            setStdout(`💥 Runtime Error:\n${json.error}`);
            break;
          case 'WA':
            setStdout(`❌ Wrong Answer: ${json.error}`);
            break;
          default:
            setStdout(`❌ ${json.type}: ${json.error}`);
        }
      } else if (!json.success) {
        setStdout(`❌ Error: ${json.error || "Server error occurred"}`);
      } else {
        setStdout(`✅ ${json.verdict}`);
      }
    } catch (error) {
      console.error('Submit error:', error);
      if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
        setStdout("❌ Error: Compiler service is not available. Please check if the server is running.");
      } else {
        setStdout(`❌ Error: ${error.message || "An unexpected error occurred"}`);
      }
    } finally {
      setLoadingSubmit(false)
    }
  };
  const handleReview = async () => {
    if (!localStorage.getItem("authToken")) {
      navigate('/login', { state: { from: `/problem/${id}` } });
      return;
    }
    setLoadingReview(true)
    
    try {
      const response = await fetch(`${COMPILER_URL}/review`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ code, problem: problem.description })
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const json = await response.json();
      if (!json.success) {
        if (json.error) {
          setReviewText(json.error.message || json.error);
        } else {
          setReviewText("Some error occurred while generating review");
        }
      } else {
        setReviewText(json.text);
      }
    } catch (error) {
      console.error('Review error:', error);
      if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
        setReviewText("❌ Error: AI Review service is not available. Please check if the server is running.");
      } else {
        setReviewText(`❌ Error: ${error.message || "An unexpected error occurred"}`);
      }
    } finally {
      setLoadingReview(false)
    }
  }

  return (
    <div className="flex flex-col min-h-screen scrollFix bg-gradient-to-br from-indigo-50 to-gray-100">
      <Navbar />
      <div className="flex flex-1 gap-6 px-4 navbar-spacing mx-auto w-full">
        <aside className="w-full md:w-[50%] bg-white rounded-2xl shadow-lg border border-gray-100 p-6 max-h-[calc(100vh-6rem)] overflow-y-auto overscroll-contain">
          <h1 className="text-2xl font-bold mb-4">{problem.title}</h1>
          <div className="prose max-w-none text-gray-800 whitespace-pre-line">{problem.description}</div>
        </aside>
        <div className="w-full md:w-[50%] flex flex-col">
          <div className="flex items-center justify-between p-2 rounded-t-xl border-b border-gray-200 bg-white">
            <div className="flex items-center space-x-2">
              <label htmlFor="lang" className="font-semibold text-gray-700"> Language </label>
              <select 
                id="lang" 
                value={language} 
                onChange={e => setLanguage(e.target.value)} 
                className="border rounded px-2 py-1 focus:ring-primary-400 focus:border-primary-400"
              >
                <option value="cpp">C++</option>
                <option value="java">Java</option>
                <option value="py">Python</option>
                <option value="js">JavaScript</option>
              </select>
              <button 
                onClick={() => loadTemplate(language)}
                className="bg-orange-100 hover:bg-orange-200 text-orange-800 px-3 py-1 rounded text-sm transition"
                title="Reset to template"
              >
                🔄 Reset
              </button>
            </div>
            <div className="flex space-x-2">
              <button onClick={handleRun} disabled={loadingRun} className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-1 rounded transition flex items-center">
                {loadingRun ? (
                  <>
                    <LoadingSpinner size="sm" color="gray" />
                    <span className="ml-2">Running...</span>
                  </>
                ) : (
                  "Run"
                )}
              </button>
              <button onClick={handleSubmit} disabled={loadingSubmit} className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-1 rounded flex items-center" >
                {loadingSubmit ? (
                  <>
                    <LoadingSpinner size="sm" color="white" />
                    <span className="ml-2">Submitting...</span>
                  </>
                ) : (
                  "Submit"
                )}
              </button>
              <button onClick={() => { handleReview(); setShowReviewPanel(true) }} disabled={loadingReview} className="bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded transition flex items-center" >
                {loadingReview ? (
                  <>
                    <LoadingSpinner size="sm" color="white" />
                    <span className="ml-2">Reviewing...</span>
                  </>
                ) : (
                  "AI Review"
                )}
              </button>
            </div>
          </div>
          <Editor height="calc(65vh - 6rem)" language={language} value={code} theme="vs-dark" onChange={v => setCode(v)} options={{ fontSize: 16, minimap: { enabled: false }, wordWrap: 'on', scrollBeyondLastLine: false }} />

          <div className="flex items-center border-b bg-white">
            {['Input', 'Output'].map(tab => (
              <button key={tab} onClick={() => setSelectedTab(tab)} className={`flex-1 py-2 text-center font-semibold transition ${selectedTab === tab ? 'border-b-4 border-primary-500 text-primary-700 bg-gray-100' : 'hover:bg-gray-50 text-gray-600'}`}>
                {tab}
              </button>
            ))}
          </div>
          <div className="flex-1 p-4 mb-3 bg-white rounded-b-xl">
            {selectedTab === 'Input' && (
              <textarea className="w-full h-32 p-2 mt-2 font-mono text-sm border rounded resize-none" value={stdin} onChange={e => setStdin(e.target.value)} />
            )}
            {selectedTab === 'Output' && (
              <div className="w-full h-32 mt-2 bg-black rounded overflow-hidden">
                <pre className="w-full h-full p-2 text-green-200 font-mono text-sm rounded overflow-auto">{stdout}</pre>
              </div>
            )}
          </div>
        </div>
        <AIReviewPanel show={showReviewPanel} onClose={() => setShowReviewPanel(false)} reviewText={reviewText} loading={loadingReview} />
      </div>
    </div>
  );
}
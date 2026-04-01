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
const REVIEW_CACHE_TTL_MS = 10 * 60 * 1000;

const hashText = async (value) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(value);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(digest)).map((b) => b.toString(16).padStart(2, '0')).join('');
};

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
  const [editorTheme, setEditorTheme] = useState('vs')

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

  useEffect(() => {
    const syncTheme = () => {
      const isDark = document.documentElement.classList.contains('dark');
      setEditorTheme(isDark ? 'vs-dark' : 'vs');
    };

    syncTheme();

    const observer = new MutationObserver(syncTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    return () => observer.disconnect();
  }, []);

  if (loadingProblem) {
    return (
      <div className="flex flex-col h-screen overflow-hidden">
        <Navbar />
        <div className="flex flex-1 gap-6 px-4 pt-[102px] pb-4 mx-auto w-full max-w-7xl overflow-hidden">
          <LoadingSkeleton type="problem" count={1} className="w-full lg:w-[46%]" />
          <LoadingSkeleton type="card" count={1} className="w-full lg:w-[54%]" />
        </div>
      </div>
    );
  }

  if (!problem) {
    return (
      <div className="flex flex-col h-screen overflow-hidden">
        <Navbar />
        <div className="flex flex-1 items-center justify-center pt-[102px]">
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
      const reviewFingerprint = await hashText(`${id}::${language}::${code}::${problem?.description || ''}`);
      const reviewCacheKey = `review-cache:${reviewFingerprint}`;
      const cached = localStorage.getItem(reviewCacheKey);
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          if (Date.now() - parsed.timestamp < REVIEW_CACHE_TTL_MS && parsed.text) {
            setReviewText(parsed.text);
            return;
          }
        } catch {
          localStorage.removeItem(reviewCacheKey);
        }
      }

      const response = await fetch(`${COMPILER_URL}/review`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ code, problem: problem.description })
      })
      
      let json = null;
      try {
        json = await response.json();
      } catch {
        json = null;
      }

      if (!response.ok || !json?.success) {
        const serverError = json?.error?.message || json?.error;
        setReviewText(serverError || `Review service failed (HTTP ${response.status})`);
        return;
      }

      setReviewText(json.text);
      localStorage.setItem(reviewCacheKey, JSON.stringify({ text: json.text, timestamp: Date.now() }));
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
    <div className="flex flex-col min-h-screen lg:h-screen overflow-x-hidden lg:overflow-hidden scrollFix">
      <Navbar />
      <div className="w-full max-w-[1400px] mx-auto px-3 sm:px-4 mt-[102px] min-h-[calc(100dvh-102px)] lg:h-[calc(100dvh-102px)] overflow-y-auto lg:overflow-hidden flex flex-col">
        <section className="shrink-0 rounded-xl border border-primary-100 dark:border-slate-700 bg-white/80 dark:bg-slate-900/75 backdrop-blur-sm px-4 py-3 mb-3">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[11px] uppercase tracking-[0.16em] text-primary-700/70 dark:text-slate-400">Problem</p>
              <h1 className="text-lg sm:text-xl font-semibold text-primary-900 dark:text-slate-100 truncate">{problem.title}</h1>
            </div>
            {problem.level && (
              <span className={`inline-flex items-center rounded-lg px-2.5 py-1 text-xs font-semibold border ${problem.level === 'Easy'
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-300 dark:border-emerald-500/30'
                : problem.level === 'Medium'
                  ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/15 dark:text-amber-300 dark:border-amber-500/30'
                  : 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/15 dark:text-rose-300 dark:border-rose-500/30'
              }`}>
                {problem.level}
              </span>
            )}
          </div>
        </section>

        <div className="flex-1 min-h-0 flex flex-col lg:flex-row gap-3 lg:overflow-hidden pb-3 lg:pb-0">
          <aside className="w-full lg:w-[47%] rounded-xl border border-primary-100 dark:border-slate-700 bg-white/80 dark:bg-slate-900/75 p-4 h-auto max-h-[38vh] lg:max-h-none lg:h-full overflow-y-auto overscroll-contain">
            <h2 className="text-lg font-semibold mb-3 text-primary-900 dark:text-slate-100">Description</h2>
            <div className="whitespace-pre-line text-[15px] leading-7 text-primary-900/90 dark:text-slate-200">{problem.description}</div>
          </aside>

          <div className="w-full lg:w-[53%] flex flex-col h-auto lg:h-full min-h-0">
            <div className="flex flex-col gap-2 p-3 rounded-t-xl border border-primary-100 dark:border-slate-700 bg-white/80 dark:bg-slate-900/75">
              <div className="flex flex-col gap-2">
                <div className="flex items-center flex-wrap gap-2">
                  <label htmlFor="lang" className="text-sm font-medium text-primary-900 dark:text-slate-100">Language</label>
                  <select
                    id="lang"
                    value={language}
                    onChange={e => setLanguage(e.target.value)}
                    className="h-9 border border-primary-200 dark:border-slate-600 rounded-md px-2.5 bg-white dark:bg-slate-900 text-primary-900 dark:text-slate-100 focus:ring-primary-400 focus:border-primary-400"
                  >
                    <option value="cpp">C++</option>
                    <option value="java">Java</option>
                    <option value="py">Python</option>
                    <option value="js">JavaScript</option>
                  </select>
                  <button
                    onClick={() => loadTemplate(language)}
                    className="h-9 px-3 rounded-md text-sm font-medium border border-orange-200 dark:border-orange-500/30 bg-orange-50 dark:bg-orange-500/10 text-orange-700 dark:text-orange-300 hover:bg-orange-100 dark:hover:bg-orange-500/20 transition"
                    title="Reset to template"
                  >
                    Reset
                  </button>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-3 gap-2">
                  <button onClick={handleRun} disabled={loadingRun} className="h-9 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 px-2 sm:px-4 rounded-md transition flex items-center justify-center text-xs sm:text-sm font-medium">
                {loadingRun ? (
                  <>
                    <LoadingSpinner size="sm" color="gray" />
                    <span className="ml-2">Running...</span>
                  </>
                ) : (
                  "Run"
                )}
                  </button>
                  <button onClick={handleSubmit} disabled={loadingSubmit} className="h-9 bg-primary-600 hover:bg-primary-700 text-white px-2 sm:px-4 rounded-md flex items-center justify-center text-xs sm:text-sm font-medium" >
                {loadingSubmit ? (
                  <>
                    <LoadingSpinner size="sm" color="white" />
                    <span className="ml-2">Submitting...</span>
                  </>
                ) : (
                  "Submit"
                )}
                  </button>
                  <button onClick={() => { handleReview(); setShowReviewPanel(true) }} disabled={loadingReview} className="h-9 bg-emerald-600 hover:bg-emerald-700 text-white px-2 sm:px-4 rounded-md transition flex items-center justify-center text-xs sm:text-sm font-medium" >
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
            </div>

            <div className="h-[300px] sm:h-[360px] lg:flex-1 lg:min-h-0 border-x border-primary-100 dark:border-slate-700 overflow-hidden">
              <Editor
                height="100%"
                language={language}
                value={code}
                theme={editorTheme}
                onChange={v => setCode(v || '')}
                options={{
                  fontSize: 15,
                  minimap: { enabled: false },
                  wordWrap: 'on',
                  scrollBeyondLastLine: false,
                  padding: { top: 14, bottom: 14 }
                }}
              />
            </div>

            <div className="flex items-center border-x border-b border-primary-100 dark:border-slate-700 bg-white/90 dark:bg-slate-900/90">
              {['Input', 'Output'].map(tab => (
                <button key={tab} onClick={() => setSelectedTab(tab)} className={`flex-1 py-2.5 text-center text-sm font-semibold transition ${selectedTab === tab ? 'border-b-2 border-primary-500 text-primary-700 dark:text-indigo-300 bg-primary-50/70 dark:bg-slate-800/70' : 'hover:bg-gray-50 dark:hover:bg-slate-800 text-gray-600 dark:text-slate-300'}`}>
                  {tab}
                </button>
              ))}
            </div>
            <div className="h-28 sm:h-36 lg:h-48 p-3 bg-white/85 dark:bg-slate-900/85 border border-t-0 border-primary-100 dark:border-slate-700 rounded-b-xl overflow-hidden">
              {selectedTab === 'Input' && (
                <textarea className="w-full h-full p-3 font-mono text-sm border border-primary-200 dark:border-slate-600 bg-white dark:bg-slate-900 text-primary-900 dark:text-slate-100 rounded-md resize-none" value={stdin} onChange={e => setStdin(e.target.value)} />
              )}
              {selectedTab === 'Output' && (
                <div className="w-full h-full bg-[#0a1024] rounded-md overflow-hidden border border-emerald-200/20">
                  <pre className="w-full h-full p-3 text-emerald-200 font-mono text-sm rounded-md overflow-auto">{stdout}</pre>
                </div>
              )}
            </div>
          </div>
        </div>

        <AIReviewPanel show={showReviewPanel} onClose={() => setShowReviewPanel(false)} reviewText={reviewText} loading={loadingReview} />
      </div>
    </div>
  );
}
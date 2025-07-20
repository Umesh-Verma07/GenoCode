import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import ErrorAlert from "../components/ErrorAlert";
import LoadingSkeleton from "../components/LoadingSkeleton";
import EmptyState from "../components/EmptyState";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, X, CheckCircle } from "lucide-react";

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

export default function User() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [heatmapData, setHeatmapData] = useState([]);
  const [easy, setEasy] = useState(0);
  const [medium, setMedium] = useState(0);
  const [hard, setHard] = useState(0);
  const [languages, setLanguages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showError, setShowError] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [problemToDelete, setProblemToDelete] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchUser() {
      try {
        setLoading(true);
        let response = await fetch(`${SERVER_URL}/user/${id}`);
        response = await response.json();
        if (!response.success) {
          throw new Error(response.error);
        }
        setUser(response.user || {});
        setSubmissions(response.problem || []);
        const counts = {};
        const lang = {};
        (response.problem || []).forEach((sub) => {
          const day = new Date(sub.date).toISOString().slice(0, 10);
          counts[day] = (counts[day] || 0) + 1;
          lang[sub.language] = (lang[sub.language] || 0) + 1;
        });
        setHeatmapData(Object.entries(counts).map(([date, count]) => ({ date, count })));
        setLanguages(Object.entries(lang));
        setEasy(response.problem.filter(sub => sub.level === "Easy").length);
        setMedium(response.problem.filter(sub => sub.level === "Medium").length);
        setHard(response.problem.filter(sub => sub.level === "Hard").length);
      } catch (err) {
        setError(err.message);
        setShowError(true);
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, [id]);

  const handleDeleteClick = (problem) => {
    setProblemToDelete(problem);
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    if (!problemToDelete) return;

    try {
      const response = await fetch(`${SERVER_URL}/problem/delete/${problemToDelete._id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem('authToken')
        },
        body: JSON.stringify({ email: user.email })
      });

      const data = await response.json();
      
      if (data.success) {
        // Remove the problem from the local state
        setSubmissions(prev => prev.filter(problem => problem._id !== problemToDelete._id));
        // Show success message
        setSuccessMessage('Problem deleted successfully!');
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
      } else {
        setError(data.error || 'Failed to delete problem');
        setShowError(true);
      }
    } catch (error) {
      setError('Failed to delete problem. Please try again.');
      setShowError(true);
    } finally {
      setShowDeleteConfirm(false);
      setProblemToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirm(false);
    setProblemToDelete(null);
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-100">
        <Navbar />
        <div className="flex flex-1 flex-col md:flex-row max-w-6xl mx-auto w-full navbar-spacing p-4 md:gap-6">
          <LoadingSkeleton type="profile" count={1} className="w-full md:w-80" />
          <div className="flex-1 flex flex-col gap-6">
            <LoadingSkeleton type="card" count={2} />
            <LoadingSkeleton type="card" count={1} />
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-100">
        <Navbar />
        <div className="flex flex-1 items-center justify-center navbar-spacing">
          <ErrorAlert 
            error={error || "User not found"} 
            show={showError} 
            onClose={() => setShowError(false)}
            className="max-w-md"
          />
        </div>
      </div>
    );
  }
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Navbar />

      <div className="flex flex-1 flex-col md:flex-row max-w-6xl mx-auto w-full p-4 md:gap-6 navbar-spacing">
        {/* Error Alert */}
        <ErrorAlert 
          error={error} 
          show={showError} 
          onClose={() => setShowError(false)}
          className="mb-4"
        />
        {/* Sidebar */}
                  <aside className="w-full md:w-80 bg-white rounded-2xl shadow p-6 flex flex-col items-center mb-5 md:mb-0 h-[520px] md:h-[calc(100vh-95px)] overflow-auto sticky sticky-top">
          <img src={user.image || "/avatar-placeholder.png"} alt={user.name} className="w-24 h-24 rounded-full border shadow mb-3" />
          <h2 className="text-2xl font-bold">{user.name}</h2>
          <div className="text-sm text-gray-600 mb-1">@{user.username}</div>
          {user.rank && (
            <div className="mb-2">
              <span className="inline-block bg-gray-100 px-2 py-1 rounded text-xs font-semibold text-gray-700">
                Rank #{user.rank}
              </span>
            </div>
          )}
          <button onClick={() => navigate(`/user/edit/${id}`)} className="px-3 py-1 text-xs rounded bg-primary-100 text-primary-700 font-semibold hover:bg-primary-200 mb-4"> Edit Profile </button>
          <div className="w-full">
            <div className="text-xs text-gray-400 mb-1">Location</div>
            <div className="mb-2">{user.location || "India"}</div>
            <div className="text-xs text-gray-400 mb-1">Institute</div>
            <div className="mb-2">{user.institute || "Unknown"}</div>
            <div className="text-xs text-gray-400 mb-1">Skills</div>
            <div className="flex flex-wrap gap-1 mb-2">
              {(user.skills || ["Java", "Cpp", "JavaScript"]).map((s) => (
                <span key={s} className="bg-gray-200 text-xs px-2 py-1 rounded-full"> {s} </span>
              ))}
            </div>
            <div className="text-xs text-gray-400 mb-1">Community Stats</div>
            <ul className="text-sm mb-2">
              <li className="mb-1">Views: {user.views || 0}</li>
              <li className="mb-1">Solution: {user.solution || 0}</li>
              <li className="mb-1">Discuss: {user.discuss || 0}</li>
              <li className="mb-1">Reputation: {user.reputation || 0}</li>
            </ul>
            <div className="text-xs text-gray-400 mb-1">Languages</div>
            <ul className="flex flex-wrap gap-2">
              {(languages || []).map((l) => (
                <li key={l[0]} className="bg-blue-100 px-2 py-1 rounded text-xs">
                  {l[0] == 'cpp' ? "C++" : l[0] == 'py' ? "Python" : l[0] == "java" ? "Java" : l[0] == 'js' ? "JavaScript" : "Other"}: {l[1]}
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col gap-6">
          {/* Top Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 gap-4">

            {/* Problems Solved */}
            <div className="bg-white rounded-2xl shadow p-6 flex flex-col items-center">
              <div className="text-xl font-bold">{(easy + medium + hard) || "0"}</div>
              <div className="text-gray-600 text-xs mb-2"> Problems Solved </div>
              <div className="flex gap-2 text-xs">
                <span className="text-green-600 font-bold"> {easy || 0} Easy </span>
                <span className="text-orange-500 font-bold"> {medium || 0} Med </span>
                <span className="text-red-600 font-bold"> {hard || 0} Hard </span>
              </div>
            </div>

            {/* Contest Rating */}
            <div className="bg-white rounded-2xl shadow p-6 flex flex-col items-center">
              <div className="text-lg font-bold">{user.contestRating || "--"}</div>
              <div className="text-gray-600 text-xs">Contest Rating</div>
              <div className="flex items-center mt-2">
                {user.level && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 rounded-full text-xs">
                    <img src={user.badges?.[0]?.icon} alt="" className="w-5 h-5" />
                    {user.level}
                  </span>
                )}
              </div>
              <div className="text-xs mt-1 text-gray-400">
                Attended: {user.attended || 0} | Top {user.topPercent || "--"}%
              </div>
            </div>

            {/* Badges
            <div className="bg-white rounded-2xl shadow p-6 flex flex-col items-center">
              <div className="flex gap-2">
                {(user.badges || []).slice(0, 3).map((b, i) => (
                  <img key={b.name || i} src={b.icon || "/badge.svg"} alt={b.name || "Badge"} className="w-8 h-8" />
                ))}
              </div>
              <div className="text-gray-600 text-xs mt-2">
                Badges: {(user.badges && user.badges.length) || 0}
              </div>
              <div className="text-xs text-gray-400 mt-1">
                Most Recent: {user.mostRecentBadge || "--"}
              </div>
            </div> */}

          </div>

          {/* Submission Activity Heatmap */}
          <div className="bg-white rounded-2xl shadow p-6 heatmap">
            <div className="text-lg font-bold mb-2 heatmap"> {submissions.length} submissions </div>
            <CalendarHeatmap
              startDate={new Date(new Date().setFullYear(new Date().getFullYear() - 1))}
              endDate={new Date()}
              values={heatmapData}
              classForValue={(value) => {
                if (!value) return "color-empty";
                if (value.count >= 4) return "color-github-4";
                if (value.count === 3) return "color-github-3";
                if (value.count === 2) return "color-github-2";
                if (value.count === 1) return "color-github-1";
                return "color-empty";
              }}
              showWeekdayLabels={true}
            />
          </div>

          {(user.isAdmin == true) ?
            <div className="bg-white rounded-2xl shadow p-6">
              <h3 className="text-xl font-semibold mb-4">My Problems</h3>
              {submissions.length === 0 ? (
                <EmptyState 
                  type="problems"
                  title="No problems created"
                  description="You haven't created any problems yet."
                  action={
                    <button 
                      onClick={() => navigate('/create', { state: { from: `/user/${id}` } })}
                      className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition"
                    >
                      Create Problem
                    </button>
                  }
                />
              ) : (
                <ul className="divide-y">
                  {submissions.map((problem) => (
                    <li key={problem._id} className="py-3 flex justify-between items-center">
                      <p className="font-small">{problem.title}</p>
                      <div className="text-primary-600 hover:underline text-sm">
                        <button onClick={() => navigate(`/problem/${problem._id}`)} className="text-primary-600 btn mx-2 hover:underline">View</button>
                        <button onClick={() => navigate(`/update/${problem._id}`, { state: { data : {problem, userId: user.username }} })} className="text-primary-600 hover:underline text-sm">Update</button>
                        <button onClick={() => handleDeleteClick(problem)} className="text-red-600 hover:underline text-sm ml-2">Delete</button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            :
            <div className="bg-white rounded-2xl shadow p-6">
              <h3 className="text-xl font-semibold mb-4">Recent Submissions</h3>
              {submissions.length === 0 ? (
                <EmptyState 
                  type="problems"
                  title="No submissions yet"
                  description="Start solving problems to see your submission history."
                  action={
                    <button 
                      onClick={() => navigate('/practice')}
                      className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition"
                    >
                      Start Practicing
                    </button>
                  }
                />
              ) : (
                <ul className="divide-y">
                  {submissions.slice().reverse().map((sub) => (
                    <li onClick={() => navigate(`/problem/${sub.problemId}`)} key={sub._id} className="py-3 flex justify-between items-center">
                      <p className="font-small">{sub.problemName}</p>
                      <p className="text-xs text-gray-500"> {new Date(sub.date).toLocaleString()}</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          }
        </main>
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full mx-4"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="flex-shrink-0">
                  <AlertTriangle className="w-6 h-6 text-red-500" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">Delete Problem</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Are you sure you want to delete "{problemToDelete?.title}"?
                  </p>
                </div>
                <button
                  onClick={handleDeleteCancel}
                  className="flex-shrink-0 p-1 hover:bg-gray-100 rounded-full transition"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>
              
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-6">
                <p className="text-sm text-red-700">
                  This action cannot be undone. The problem and all its test cases will be permanently deleted.
                </p>
              </div>

              <div className="flex gap-3 justify-end">
                <button
                  onClick={handleDeleteCancel}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition flex items-center gap-2"
                >
                  <AlertTriangle className="w-4 h-4" />
                  Delete Problem
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success Notification */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed top-4 right-4 z-50 max-w-sm w-full"
          >
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 shadow-lg">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-green-800">
                    {successMessage}
                  </p>
                </div>
                <button
                  onClick={() => setShowSuccess(false)}
                  className="flex-shrink-0 p-1 hover:bg-green-100 rounded-full transition"
                >
                  <X className="w-4 h-4 text-green-600" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

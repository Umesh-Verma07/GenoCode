import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";

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
  const navigate = useNavigate();
  useEffect(() => {
    async function fetchUser() {
      let response = await fetch(`${SERVER_URL}/user/${id}`);
      response = await response.json();
      if (!response.success) {
        alert(response.error);
        return;
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
    }
    fetchUser();
  }, [id]);

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <span className="text-gray-400">Loading profile...</span>
      </div>
    );
  }
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Navbar />

      <div className="flex flex-1 flex-col md:flex-row max-w-6xl mx-auto w-full mt-16 p-4 md:gap-6">
        {/* Sidebar */}
        <aside className="w-full md:w-80 bg-white rounded-2xl shadow p-6 flex flex-col items-center mb-5 md:mb-0 h-[520px] md:h-[calc(100vh-95px)] overflow-auto sticky top-20">
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
                <p>No problem added yet</p>
              ) : (
                <ul className="divide-y">
                  {submissions.map((problem) => (
                    <li key={problem._id} className="py-3 flex justify-between items-center">
                      <p className="font-small">{problem.title}</p>
                      <div className="text-primary-600 hover:underline text-sm">
                        <button onClick={() => navigate(`/problem/${problem._id}`)} className="text-primary-600 btn mx-2 hover:underline">View</button>
                        <button onClick={() => navigate(`/update/${problem._id}`, { state: { problem } })} className="text-primary-600 hover:underline text-sm">Update</button>
                        <button onClick={() => handleDelete(problem._id)} className="text-red-600 hover:underline text-sm ml-2">Delete</button>
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
                <p>No submissions yet.</p>
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
    </div>
  );
}

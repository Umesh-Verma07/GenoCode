import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
const SERVER_URL = import.meta.env.VITE_SERVER_URL;

export default function User() {
    const { id } = useParams();
    const [user, setUser] = useState('');
    const [submissions, setSubmissions] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchUser() {
            let response = await fetch(`${SERVER_URL}/user/${id}`);
            response = await response.json();
            if (!response.success) {
                return new Error(response.error);
            }
            setUser(response.user);
            setSubmissions(response.problem);
        }
        fetchUser();
    }, []);

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this problem?')) return;
        try {
            const res = await fetch(`${SERVER_URL}/problem/delete/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({email : localStorage.getItem("email")})
            });
            const json = await res.json();
            if (!json.success) throw new Error(json.error);
            window.location.reload();
        } catch (e) {
            alert('Error: ' + e.message);
        }
    }

    return (
        <div className="flex flex-col min-h-screen bg-gray-100">
            <Navbar />
            <section className="flex-grow container p-6 max-w-4xl mx-auto">
                <div className="max-w-4xl bg-white rounded-lg shadow p-6 mb-8 mt-12">
                    <h1 className="text-2xl font-bold mb-4">My Profile</h1>
                    <div className="space-y-2">
                        <p><span className="font-medium">Name:</span> {user.name}</p>
                        <p><span className="font-medium">Email:</span> {user.email}</p>
                        <p><span className="font-medium">Joined:</span> {new Date(user.date).toLocaleDateString()}</p>
                    </div>
                </div>

                {(user.isAdmin == true) ?
                    <>
                        <h2 className="text-xl font-semibold mb-4">My Problems</h2>
                        {submissions.length === 0 ? (
                            <p>No problem added yet.</p>
                        ) : (
                            <ul className="space-y-3">
                                {submissions.map((problem) => (
                                    <li key={problem._id} className="bg-white p-4 rounded-lg shadow flex justify-between items-center">
                                        <div>
                                            <p className="font-medium">{problem.title}</p>
                                            <button onClick={() => navigate(`/update/${problem._id}`, { state: { problem } })} className="text-primary-600 hover:underline text-sm">Update</button>
                                            <button onClick={() => handleDelete(problem._id)} className="text-red-600 hover:underline text-sm ml-2">Delete</button>
                                        </div>
                                        <div className="text-primary-600 hover:underline text-sm">
                                            <button onClick={() => navigate(`/problem/${problem._id}`)} className="text-primary-600 btn">View</button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </>

                    :
                    <>
                        <h2 className="text-xl font-semibold mb-4">My Submissions</h2>
                        {submissions.length === 0 ? (
                            <p>No submissions yet.</p>
                        ) : (
                            <ul className="space-y-3">
                                {submissions.map((sub) => (
                                    <li key={sub._id} className="bg-white p-4 rounded-lg shadow flex justify-between items-center">
                                        <div>
                                            <p className="font-medium">{sub.problemName}</p>
                                            {/* <p className="text-sm text-gray-600">Verdict: {sub.verdict}</p> */}
                                            <p className="text-sm text-gray-500">{new Date(sub.date).toLocaleString()}</p>
                                        </div>
                                        <button onClick={() => navigate(`/problem/${sub.problemId}`)} className="text-primary-600 hover:underline text-sm">View</button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </>}
            </section>
            <Footer />
        </div>
    );
}

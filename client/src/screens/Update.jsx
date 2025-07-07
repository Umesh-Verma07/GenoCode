import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
const SERVER_URL = import.meta.env.VITE_SERVER_URL;

export default function CreateProblem() {
    const { state } = useLocation();
    const problem = state?.data.problem;
    const userId = state?.data.userId;
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [level, setLevel] = useState('');
    const [testCases, setTestCases] = useState([{ input: '', output: '' }]);
    const [error, setError] = useState('');

    useEffect(() => {
        if (problem) {
            setTitle(problem.title);
            setDescription(problem.description);
            setLevel(problem.level);
            setTestCases(problem.testCases);
        }
    }, [state]);


    const handleChangeCase = (idx, field, value) => {
        const updated = [...testCases];
        updated[idx][field] = value;
        setTestCases(updated);
    };

    const addTestCase = () => {
        setTestCases([...testCases, { input: '', output: '' }]);
    };

    const removeTestCase = (idx) => {
        setTestCases(testCases.filter((_, i) => i !== idx));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const problemData = { title, description, level, testCases};
        try {
            const response = await fetch(`${SERVER_URL}/problem/update/${problem._id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization' : localStorage.getItem("authToken")
                },
                body: JSON.stringify(problemData),
            });

            const json = await response.json();
            if (!json.success) {
                throw new Error(json.error);
            }
            navigate(`/user/${userId}`);
        } catch (e) {
            console.error(e);
            setError(e.message);
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <Navbar />
            <main className="flex-grow container mx-auto mt-16 px-4 py-7">
                <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow">
                    <h1 className="text-2xl font-bold mb-4">{title}</h1>

                    {error && (
                        <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block mb-1 font-medium">Title</label>
                            <input type="text" className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500" value={title} onChange={(e) => setTitle(e.target.value)} required />
                        </div>
                        <div>
                            <label className="block mb-1 font-medium">Description</label>
                            <textarea className="w-full border rounded px-3 py-2 h-32 focus:outline-none focus:ring-2 focus:ring-primary-500" value={description} onChange={(e) => setDescription(e.target.value)} required />
                        </div>
                        <div>
                            <label className="block mb-1 font-medium">Difficulty Level</label>
                            <select className="w-full border rounded px-3 py-2" value={level} onChange={(e) => setLevel(e.target.value)} >
                                <option>Easy</option>
                                <option>Medium</option>
                                <option>Hard</option>
                            </select>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-semibold">Test Cases</h2>
                                <button type="button" onClick={addTestCase} className="text-sm text-primary-600 hover:underline"> + Add Case </button>
                            </div>

                            {testCases.map((tc, idx) => (
                                <div key={idx} className="grid grid-cols-6 gap-3 items-end" >
                                    <div className="col-span-2">
                                        <label className="block mb-1 text-sm">Input</label>
                                        <textarea className="w-full border rounded px-2 py-1" value={tc.input} onChange={(e) => handleChangeCase(idx, 'input', e.target.value)} required />
                                    </div>
                                    <div className="col-span-2">
                                        <label className="block mb-1 text-sm">Output</label>
                                        <textarea className="w-full border rounded px-2 py-1" value={tc.output} onChange={(e) => handleChangeCase(idx, 'output', e.target.value)} required />
                                    </div>
                                    <div className="col-span-2 text-right">
                                        <button type="button" onClick={() => removeTestCase(idx)} className="text-red-600 hover:underline text-sm" > Remove </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button type="submit" className="w-full bg-primary-600 text-white py-2 rounded hover:bg-primary-700 transition" > Update </button>
                    </form>
                </div>
            </main>
        </div>
    );
}

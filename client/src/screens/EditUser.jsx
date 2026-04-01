import Navbar from '../components/Navbar';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorAlert from '../components/ErrorAlert';
import LoadingSkeleton from '../components/LoadingSkeleton';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

export default function EditProfile() {
    const { id } = useParams();
    const [user, setUser] = useState({
        name: "",
        institute: "",
        location: "",
        skills: "",
        image: ""
    });
    const [userImage, setUserImage] = useState(null);
    const [error, setError] = useState('');
    const [showError, setShowError] = useState(true);
    const [loading, setLoading] = useState(false);
    const [loadingProfile, setLoadingProfile] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                setLoadingProfile(true);
                const res = await fetch(`${SERVER_URL}/user/${id}`);
                const json = await res.json();
                if (!json.success) throw new Error(json.error);
                setUser({ ...json.user, skills: Array.isArray(json.user.skills) ? json.user.skills.join(', ') : "" });
            } catch (err) {
                setError(err.message || "Failed to load profile.");
                setShowError(true);
            } finally {
                setLoadingProfile(false);
            }
        };
        fetchUser();
    }, [id]);

    const onChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setUserImage(e.target.files[0]);
            setUser({ ...user, image: URL.createObjectURL(e.target.files[0]) });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setShowError(true);
        try {
            const formData = new FormData();
            formData.append('name', user.name);
            formData.append('institute', user.institute);
            formData.append('location', user.location);
            formData.append('skills', user.skills);

            if (!user.image && !userImage) {
                formData.append('removeImage', 'true');
            }
            if (userImage) {
                formData.append('image', userImage);
            }

            const res = await fetch(`${SERVER_URL}/user/update/${id}`, {
                method: 'PUT',
                headers: {
                    'Authorization' : localStorage.getItem("authToken")
                },
                body: formData
            });
            const json = await res.json();
            if (!json.success) throw new Error(json.error);
            navigate(-1);
        } catch (err) {
            setError(err.message || "Update failed");
            setShowError(true);
        } finally {
            setLoading(false);
        }
    };

    if (loadingProfile) {
        return (
            <div className="flex flex-col min-h-screen">
                <Navbar />
                <section className="flex-grow flex items-start justify-center px-4 sm:px-6 navbar-spacing pb-8">
                    <div className="w-full max-w-4xl glass-card rounded-3xl border border-primary-100 dark:border-indigo-200/20 p-6">
                            <LoadingSkeleton type="card" count={1} />
                    </div>
                </section>
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <section className="flex-grow px-4 sm:px-6 navbar-spacing pb-8">
                <div className="w-full max-w-6xl mx-auto">
                    <section className="rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-primary-900 via-primary-800 to-primary-700 dark:from-slate-950 dark:via-[#111936] dark:to-[#1a2856] text-white shadow-2xl mb-6 border border-white/10">
                        <h1 className="text-2xl sm:text-3xl font-bold">Edit Profile</h1>
                        <p className="text-white/80 mt-2">Update your public profile details and personal branding.</p>
                    </section>

                    <div className="max-w-4xl mx-auto glass-card rounded-3xl p-6 sm:p-8 border border-primary-100 dark:border-indigo-200/20">
                        <ErrorAlert 
                            error={error} 
                            show={showError} 
                            onClose={() => setShowError(false)}
                            className="mb-4"
                        />

                        <form onSubmit={handleSubmit} className="space-y-5 text-primary-900 dark:text-slate-100" >
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="name" className="block mb-2 text-sm font-semibold">Name</label>
                                <input type="text" name="name" value={user.name} onChange={onChange} className="bg-white/70 dark:bg-slate-900/80 border border-primary-200 dark:border-indigo-200/20 text-primary-900 dark:text-slate-100 text-sm rounded-xl focus:ring-primary-600 focus:border-primary-600 block w-full p-3" required />
                            </div>
                            <div>
                                <label htmlFor="institute" className="block mb-2 text-sm font-semibold">Institute</label>
                                <input type="text" name="institute" value={user.institute || ""} onChange={onChange} className="bg-white/70 dark:bg-slate-900/80 border border-primary-200 dark:border-indigo-200/20 text-primary-900 dark:text-slate-100 text-sm rounded-xl focus:ring-primary-600 focus:border-primary-600 block w-full p-3" />
                            </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="location" className="block mb-2 text-sm font-semibold">Location</label>
                                <input type="text" name="location" value={user.location || ""} onChange={onChange} className="bg-white/70 dark:bg-slate-900/80 border border-primary-200 dark:border-indigo-200/20 text-primary-900 dark:text-slate-100 text-sm rounded-xl focus:ring-primary-600 focus:border-primary-600 block w-full p-3" />
                            </div>
                            <div>
                                <label htmlFor="skills" className="block mb-2 text-sm font-semibold">Skills (comma separated)</label>
                                <input type="text" name="skills" value={user.skills || ""} onChange={onChange} className="bg-white/70 dark:bg-slate-900/80 border border-primary-200 dark:border-indigo-200/20 text-primary-900 dark:text-slate-100 text-sm rounded-xl focus:ring-primary-600 focus:border-primary-600 block w-full p-3" placeholder="e.g. JavaScript, C++, Python" />
                            </div>
                            </div>

                            <div>
                                <label htmlFor="image" className="block mb-2 text-sm font-semibold">Profile Image</label>
                                <input type="file" name="image" accept="image/*" onChange={handleImageChange}
                                    className="block w-full text-sm text-primary-900 dark:text-slate-100 border border-primary-200 dark:border-indigo-200/20 rounded-xl cursor-pointer bg-white/70 dark:bg-slate-900/80 focus:outline-none p-2" />
                                {user.image && (<img src={user.image} alt="Profile" className="mt-3 w-20 h-20 rounded-full object-cover border border-primary-200 dark:border-indigo-200/20" />)}
                                <button type="button" onClick={() => { setUserImage(null); setUser(prev => ({ ...prev, image: "" })) }} className="text-xs text-red-500 dark:text-rose-300 underline ml-1 mt-2">Remove Photo</button>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                                <button 
                                    type="submit" 
                                    disabled={loading}
                                    className="w-full text-white bg-primary-700 hover:bg-primary-800 font-semibold rounded-xl text-sm px-5 py-3 text-center flex items-center justify-center disabled:opacity-50"
                                >
                                    {loading ? (
                                        <>
                                            <LoadingSpinner size="sm" color="white" />
                                            <span className="ml-2">Updating...</span>
                                        </>
                                    ) : (
                                        "Update Profile"
                                    )}
                                </button>
                                <button type="button" onClick={() => navigate(-1)} className="w-full text-primary-900 dark:text-slate-100 bg-primary-100/70 dark:bg-slate-800 hover:bg-primary-200 dark:hover:bg-slate-700 font-semibold rounded-xl text-sm px-5 py-3 text-center">Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            </section>
        </div>
    );
}

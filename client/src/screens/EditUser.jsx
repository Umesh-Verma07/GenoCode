import Navbar from '../components/Navbar';
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
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await fetch(`${SERVER_URL}/user/${id}`);
                const json = await res.json();
                if (!json.success) throw new Error(json.error);
                setUser({ ...json.user, skills: Array.isArray(json.user.skills) ? json.user.skills.join(', ') : "" });
            } catch (err) {
                setError(err.message || "Failed to load profile.");
            }
        };
        fetchUser();
    }, []);

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
        setError('');
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
        }
    };

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <section className="flex-grow bg-gray-50 flex items-start justify-center px-6 mt-10">
                <div className="w-full bg-white rounded-lg shadow border mt-10 sm:max-w-sm xl:p-0">
                    <div className="p-6 space-y-3 md:space-y-4 sm:p-6">
                        {error && (<div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>)}
                        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">Edit Profile</h1>
                        <form onSubmit={handleSubmit} className="space-y-3 md:space-y-3" >
                            <div>
                                <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900">Name</label>
                                <input type="text" name="name" value={user.name} onChange={onChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" required />
                            </div>
                            <div>
                                <label htmlFor="institute" className="block mb-2 text-sm font-medium text-gray-900">Institute</label>
                                <input type="text" name="institute" value={user.institute || ""} onChange={onChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" />
                            </div>
                            <div>
                                <label htmlFor="location" className="block mb-2 text-sm font-medium text-gray-900">Location</label>
                                <input type="text" name="location" value={user.location || ""} onChange={onChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" />
                            </div>
                            <div>
                                <label htmlFor="skills" className="block mb-2 text-sm font-medium text-gray-900">Skills (comma separated)</label>
                                <input type="text" name="skills" value={user.skills || ""} onChange={onChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" placeholder="e.g. JavaScript, C++, Python" />
                            </div>
                            <div>
                                <label htmlFor="image" className="block mb-2 text-sm font-medium text-gray-900">Profile Image</label>
                                <input type="file" name="image" accept="image/*" onChange={handleImageChange}
                                    className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none" />
                                {user.image && (<img src={user.image} alt="Profile" className="mt-2 w-20 h-20 rounded-full object-cover" />)}
                                <button type="button" onClick={() => { setUserImage(null); setUser(prev => ({ ...prev, image: "" })) }} className="text-xs text-red-500 underline ml-2">Remove Photo</button>
                            </div>
                            <button type="submit" className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">Update Profile</button>
                            <button type="button" onClick={() => navigate(-1)} className="w-full text-gray-600 bg-gray-100 hover:bg-gray-200 focus:ring-2 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mt-2">Cancel</button>
                        </form>
                    </div>
                </div>
            </section>
        </div>
    );
}

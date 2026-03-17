import { useState, useContext, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ShieldCheck } from 'lucide-react';

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [submitError, setSubmitError] = useState('');
    
    const { login, user } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (user && user.isAdmin) {
            navigate('/admin/dashboard');
        } else if (user && !user.isAdmin) {
            navigate('/');
        }
    }, [user, navigate]);

    const submitHandler = async (e) => {
        e.preventDefault();
        setSubmitError('');
        try {
            await login(email, password, true); // true for admin login
        } catch (error) {
            setSubmitError(error.response?.data?.message || error.message || 'Login failed');
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="flex justify-center">
                    <ShieldCheck className="w-16 h-16 text-blue-500" />
                </div>
                <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
                    Admin Portal
                </h2>
                <p className="mt-2 text-center text-sm text-gray-400">
                    Restricted access for authorized personnel only
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-gray-800 py-8 px-4 shadow-2xl sm:rounded-xl sm:px-10 border border-gray-700">
                    {submitError && (
                        <div className="bg-red-900/50 border border-red-500 rounded p-4 mb-6">
                            <p className="text-sm text-red-200 text-center">{submitError}</p>
                        </div>
                    )}

                    <form className="space-y-6" onSubmit={submitHandler}>
                        <div>
                            <label className="block text-sm font-medium text-gray-300">Admin Email</label>
                            <div className="mt-1">
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="appearance-none block w-full px-3 py-3 border border-gray-600 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300">Password</label>
                            <div className="mt-1">
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="appearance-none block w-full px-3 py-3 border border-gray-600 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors"
                                />
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-blue-500 transition-all uppercase tracking-wider"
                            >
                                Secure Login
                            </button>
                        </div>
                    </form>
                    
                    <div className="mt-6 text-center">
                        <Link to="/" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">
                            &larr; Return to Storefront
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;

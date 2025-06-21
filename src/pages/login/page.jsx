import { useState } from 'react';
import { LuArrowLeft, LuCheck, LuMail, LuLock, LuEye, LuEyeOff, LuCar } from 'react-icons/lu';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Loading from '../../components/Loading';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { session, login } = useAuth();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (!email || !password) {
            setError('Fyll i alla fält!');
            setLoading(false);
            return;
        }

        try {
            const { error } = await login(email, password);
            if (error) throw error;
            navigate('/dashboard');
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    if (session === undefined) {
        return <Loading />;
    }

    if (session) {
        return <Navigate to='/dashboard' replace />;
    }

    return (
        <div className='absolute inset-0 min-h-screen max-h-[100dvh] flex items-center justify-center p-4 overflow-y-auto'>
            <div className='w-full max-w-md my-4'>
                {/* Header */}
                <div className='text-center mb-6 sm:mb-8'>
                    <div className='inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl sm:rounded-2xl mb-3 sm:mb-4 shadow-lg'>
                        <LuCar className='w-6 h-6 sm:w-8 sm:h-8 text-white' />
                    </div>
                    <h1 className='text-xl sm:text-2xl font-bold text-gray-900 mb-1 sm:mb-2'>Bilskadeportalen</h1>
                    <p className='text-sm sm:text-base text-gray-600'>Företagsadministratör</p>
                </div>

                {/* Login Card */}
                <div className='bg-white rounded-xl sm:rounded-2xl shadow-xl border border-gray-100 p-6 sm:p-8'>
                    <div className='mb-4 sm:mb-6'>
                        <h2 className='text-lg sm:text-xl font-semibold text-gray-900 mb-1 sm:mb-2'>Välkommen tillbaka</h2>
                        <p className='text-xs sm:text-sm text-gray-600'>Logga in på ditt konto för att fortsätta</p>
                    </div>

                    <form onSubmit={handleLogin} className='space-y-4 sm:space-y-5'>
                        <div>
                            <label htmlFor='email' className='block text-sm font-medium text-gray-700 mb-1.5 sm:mb-2'>
                                E-postadress
                            </label>
                            <div className='relative'>
                                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                                    <LuMail className='h-4 w-4 sm:h-5 sm:w-5 text-gray-400' />
                                </div>
                                <input
                                    id='email'
                                    type='email'
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className='text-black block w-full pl-9 sm:pl-10 pr-3 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-base'
                                    placeholder='din@email.se'
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor='password' className='block text-sm font-medium text-gray-700 mb-1.5 sm:mb-2'>
                                Lösenord
                            </label>
                            <div className='relative'>
                                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                                    <LuLock className='h-4 w-4 sm:h-5 sm:w-5 text-gray-400' />
                                </div>
                                <input
                                    id='password'
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className='text-black block w-full pl-9 sm:pl-10 pr-10 sm:pr-12 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-base'
                                    placeholder='••••••••'
                                />
                                <button
                                    type='button'
                                    onClick={() => setShowPassword(!showPassword)}
                                    className='cursor-pointer absolute inset-y-0 right-0 pr-3 flex items-center'>
                                    {showPassword ? (
                                        <LuEyeOff className='h-4 w-4 sm:h-5 sm:w-5 text-gray-400 hover:text-gray-600' />
                                    ) : (
                                        <LuEye className='h-4 w-4 sm:h-5 sm:w-5 text-gray-400 hover:text-gray-600' />
                                    )}
                                </button>
                            </div>
                        </div>

                        {error && (
                            <div className='bg-red-50 border border-red-200 rounded-lg p-3 sm:p-4'>
                                <div className='flex'>
                                    <div className='flex-shrink-0'>
                                        <svg className='h-4 w-4 sm:h-5 sm:w-5 text-red-400' viewBox='0 0 20 20' fill='currentColor'>
                                            <path
                                                fillRule='evenodd'
                                                d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z'
                                                clipRule='evenodd'
                                            />
                                        </svg>
                                    </div>
                                    <div className='ml-2 sm:ml-3'>
                                        <p className='text-xs sm:text-sm text-red-800'>{error}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        <button
                            type='submit'
                            disabled={loading}
                            className='cursor-pointer w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2.5 sm:py-3 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl text-base'>
                            {loading ? (
                                <div className='flex items-center justify-center'>
                                    <svg
                                        className='animate-spin -ml-1 mr-2 sm:mr-3 h-4 w-4 sm:h-5 sm:w-5 text-white'
                                        xmlns='http://www.w3.org/2000/svg'
                                        fill='none'
                                        viewBox='0 0 24 24'>
                                        <circle
                                            className='opacity-25'
                                            cx='12'
                                            cy='12'
                                            r='10'
                                            stroke='currentColor'
                                            strokeWidth='4'></circle>
                                        <path
                                            className='opacity-75'
                                            fill='currentColor'
                                            d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'></path>
                                    </svg>
                                    Loggar in...
                                </div>
                            ) : (
                                'Logga in'
                            )}
                        </button>
                    </form>
                </div>

                {/* Footer Link */}
                <div className='text-center mt-4 sm:mt-6'>
                    <a
                        href='https://bilskadeportalen-customer.vercel.app'
                        target='_blank'
                        rel='noopener noreferrer'
                        className='inline-flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-gray-600 hover:text-blue-600 transition-colors'>
                        <LuArrowLeft className='w-3 h-3 sm:w-4 sm:h-4' />
                        Gå till kundformuläret
                    </a>
                </div>
            </div>
        </div>
    );
}

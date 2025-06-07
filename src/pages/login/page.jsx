import { useState } from 'react';
import carImg from '../../images/car.png';
import { LuArrowLeft, LuCheck } from 'react-icons/lu';
import { Navigate, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import Loading from '../../components/Loading';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
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
        <div className='fixed inset-0 min-h-screen flex'>
            {/* Left Section - Information */}
            <div className='hidden lg:flex lg:w-1/2 bg-gradient-to-br from-gray-900 to-gray-800 text-white p-8 flex-col justify-between relative overflow-hidden'>
                {/* Subtle pattern overlay */}
                <div className='absolute inset-0 opacity-5'>
                    <div
                        className='absolute inset-0'
                        style={{
                            backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
                            backgroundSize: '40px 40px',
                        }}
                    />
                </div>

                <div className='relative z-10'>
                    <h1 className='text-2xl font-bold mb-4 text-white/90'>Bilskadeportalen Företag</h1>
                    <p className='text-base text-white/70 max-w-md'>
                        Välkommen till Bilskadeportalen Företag - din plattform för enkel hantering av olika ärenden.
                    </p>
                    <a
                        href='https://bilskadeportalen-customer.vercel.app'
                        target='_blank'
                        rel='noopener noreferrer'
                        className='inline-flex items-center gap-2 mt-4 text-white/80 hover:text-white transition-colors group'>
                        <LuArrowLeft className='w-4 h-4 group-hover:translate-x-1 transition-transform' />
                        <span className='text-sm'>Gå till kundformuläret</span>
                    </a>
                </div>
                <div className='space-y-4 relative z-10'>
                    <div className='flex items-center gap-3'>
                        <div className='w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10'>
                            <LuCheck className='w-5 h-5 text-white/70' />
                        </div>
                        <div>
                            <h3 className='text-sm font-medium text-white/90'>Enkel hantering</h3>
                            <p className='text-xs text-white/60'>Hantera alla dina ärenden på ett ställe</p>
                        </div>
                    </div>
                    <div className='flex items-center gap-3'>
                        <div className='w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10'>
                            <LuCheck className='w-5 h-5 text-white/70' />
                        </div>
                        <div>
                            <h3 className='text-sm font-medium text-white/90'>Snabb service</h3>
                            <p className='text-xs text-white/60'>Effektiv hantering av dina ärenden</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Section - Login Form */}
            <div className='w-full lg:w-1/2 flex items-center justify-center p-4 lg:p-6 relative'>
                {/* Background Image with Overlay */}
                <div className='absolute inset-0 z-0'>
                    <img src={carImg} alt='Car background' className='w-full h-full object-cover' />
                    <div className='absolute inset-0 bg-black/50' />
                </div>
                <h1 className='lg:hidden text-xl font-bold mb-4 text-white/90 absolute left-[50%] -translate-x-1/2 top-8 text-center'>
                    Bilskadeportalen Företag
                </h1>
                {/* Glass Effect Form */}
                <div className='w-full max-w-md z-10'>
                    <div className='bg-white/10 backdrop-blur-xl rounded-xl px-4 lg:px-8 py-12 lg:py-12 border border-white/20 shadow-xl'>
                        <h2 className='text-xl font-bold text-white mb-6 text-center'>Logga in</h2>
                        <form onSubmit={handleLogin} className='space-y-4'>
                            <div>
                                <label htmlFor='email' className='block text-xs font-medium text-white/90 mb-1.5'>
                                    E-post
                                </label>
                                <input
                                    id='email'
                                    type='email'
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className='w-full px-3 py-1.5 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-accent-blue focus:border-transparent text-sm'
                                    placeholder='din@email.se'
                                />
                            </div>
                            <div>
                                <label htmlFor='password' className='block text-xs font-medium text-white/90 mb-1.5'>
                                    Lösenord
                                </label>
                                <input
                                    id='password'
                                    type='password'
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className='w-full px-3 py-1.5 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-accent-blue focus:border-transparent text-sm'
                                    placeholder='••••••••'
                                />
                            </div>
                            {error && (
                                <div className='text-[var(--accent-red)] text-xs bg-[var(--accent-red)]/10 p-3 rounded-lg text-center'>
                                    {error}
                                </div>
                            )}
                            <button
                                type='submit'
                                disabled={loading}
                                className='cursor-pointer w-full bg-[var(--accent-blue)] text-white py-1.5 px-4 rounded-lg text-sm font-medium hover:bg-[var(--accent-blue)]/90 focus:outline-none focus:ring-2 focus:ring-[var(--accent-blue)] focus:ring-offset-2 focus:ring-offset-[var(--bg-primary)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed'>
                                {loading ? 'Loggar in...' : 'Logga in'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LuLayoutDashboard, LuLogOut, LuCar, LuKeySquare, LuSun, LuMoon } from 'react-icons/lu';
import { useTheme } from '../contexts/ThemeContext';

export default function SideNav() {
    const { session, logout } = useAuth();
    const [companyInfo, setCompanyInfo] = useState(null);
    const [claimTypes, setClaimTypes] = useState([]);
    const location = useLocation();
    const navigate = useNavigate();
    const { isDarkMode, toggleDarkMode } = useTheme();

    useEffect(() => {
        const fetchCompanyInfo = async () => {
            try {
                const { data, error } = await supabase
                    .from('profiles')
                    .select(
                        `
                        companies (
                            name,
                            city,
                            address,
                            services
                        )
                    `
                    )
                    .eq('id', session.user.id)
                    .single();

                if (error) throw error;
                setCompanyInfo(data.companies);
                setClaimTypes(data.companies.services || []);
            } catch (error) {
                console.error('Error fetching company info:', error);
            }
        };

        fetchCompanyInfo();
    }, []);

    const isActive = (path) => {
        // For dashboard, we want exact match
        if (path === '/dashboard') {
            return location.pathname === path;
        }
        // For other routes, check if the current path starts with the route path
        return location.pathname.startsWith(path);
    };

    const getClaimTypeIcon = (type) => {
        switch (type) {
            case 'glas':
                return <LuCar className='w-6 h-6 lg:w-5 lg:h-5' />;
            case 'keys':
                return <LuKeySquare className='w-6 h-6 lg:w-5 lg:h-5' />;
            default:
                return <LuCar className='w-6 h-6 lg:w-5 lg:h-5' />;
        }
    };

    const getClaimTypeLabel = (type) => {
        switch (type) {
            case 'glas':
                return 'Glasskador';
            case 'keys':
                return 'Nyckelbeställning';
            default:
                return type;
        }
    };

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    return (
        <div className='h-screen bg-[var(--bg-primary)] border-r border-[var(--border-color)] lg:w-64 w-20'>
            <div className='h-full flex flex-col'>
                {/* User Info Section */}
                <div className='p-4 border-b border-[var(--border-color)]'>
                    <div className='flex flex-col items-center gap-3'>
                        <div className='w-12 h-12 lg:w-10 lg:h-10 rounded-full bg-[var(--accent-blue)]/10 flex items-center justify-center transition-colors'>
                            <span className='text-[var(--accent-blue)] font-medium text-lg lg:text-base'>
                                {session.user.email.charAt(0).toUpperCase()}
                            </span>
                        </div>
                        <div className='hidden lg:block text-center'>
                            <div className='text-[var(--text-primary)] font-medium text-sm mb-1 break-all'>{session.user.email}</div>
                            <div className='text-[var(--text-secondary)] text-xs'>{companyInfo?.name}</div>
                            <div className='text-[var(--text-secondary)] text-xs'>{companyInfo?.city}</div>
                            <div className='text-[var(--text-secondary)] text-xs'>{companyInfo?.address}</div>
                        </div>
                    </div>
                </div>

                {/* Navigation Links */}
                <nav className='flex-1 p-4'>
                    <Link
                        to='/dashboard'
                        className={`flex items-center gap-2 px-3 py-3 lg:py-2 rounded-md mb-1 transition-colors ${
                            isActive('/dashboard')
                                ? 'bg-[var(--accent-blue)]/10 text-[var(--accent-blue)] hover:bg-[var(--accent-blue)]/20'
                                : 'text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)]'
                        }`}>
                        <LuLayoutDashboard className='w-6 h-6 lg:w-5 lg:h-5' />
                        <span className='hidden lg:inline'>Dashboard</span>
                    </Link>

                    {/* Dynamic Claim Type Links */}
                    {claimTypes.map((type) => (
                        <Link
                            key={type}
                            to={`/${type}`}
                            className={`flex items-center gap-2 px-3 py-3 lg:py-2 rounded-md mb-1 transition-colors ${
                                isActive(`/${type}`)
                                    ? 'bg-[var(--accent-blue)]/10 text-[var(--accent-blue)] hover:bg-[var(--accent-blue)]/20'
                                    : 'text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)]'
                            }`}>
                            {getClaimTypeIcon(type)}
                            <span className='hidden lg:inline'>{getClaimTypeLabel(type)}</span>
                        </Link>
                    ))}
                </nav>

                <div className='p-4 border-t border-[var(--border-color)]'>
                    <button
                        onClick={toggleDarkMode}
                        className='cursor-pointer w-full flex items-center justify-center gap-2 px-3 py-3 lg:py-2 text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)] rounded-md transition-colors'>
                        {isDarkMode ? (
                            <>
                                <LuSun className='w-6 h-6 lg:w-5 lg:h-5' />
                                <span className='hidden lg:inline'>Ljust läge</span>
                            </>
                        ) : (
                            <>
                                <LuMoon className='w-6 h-6 lg:w-5 lg:h-5' />
                                <span className='hidden lg:inline'>Mörkt läge</span>
                            </>
                        )}
                    </button>
                </div>

                {/* Logout Button */}
                <div className='p-4 border-t border-[var(--border-color)]'>
                    <button
                        onClick={handleLogout}
                        className='cursor-pointer w-full flex items-center justify-center gap-2 px-3 py-3 lg:py-2 text-[var(--accent-red)] hover:bg-[var(--accent-red)]/10 rounded-md transition-colors'>
                        <LuLogOut className='w-6 h-6 lg:w-5 lg:h-5' />
                        <span className='hidden lg:inline'>Logga ut</span>
                    </button>
                </div>
            </div>
        </div>
    );
}

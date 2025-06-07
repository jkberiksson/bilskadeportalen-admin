import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { Link, useLocation } from 'react-router-dom';
import { LuLayoutDashboard, LuLogOut, LuCar, LuKeySquare, LuSun, LuMoon } from 'react-icons/lu';
import { useTheme } from '../contexts/ThemeContext';

export default function SideNav() {
    const { session, logout } = useAuth();
    const [companyInfo, setCompanyInfo] = useState(null);
    const [claimTypes, setClaimTypes] = useState([]);
    const location = useLocation();
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
        if (path === '/dashboard') {
            return location.pathname === path;
        }
        return location.pathname.startsWith(path);
    };

    const getClaimTypeIcon = (type) => {
        switch (type) {
            case 'glas':
                return <LuCar className='w-5 h-5' />;
            case 'keys':
                return <LuKeySquare className='w-5 h-5' />;
            default:
                return <LuCar className='w-5 h-5' />;
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
    };

    return (
        <div className='h-screen bg-[var(--bg-primary)] border-r border-[var(--border-color)] w-16 lg:w-56 transition-all duration-200'>
            <div className='h-full flex flex-col'>
                {/* User Info Section */}
                <div className='p-3 border-b border-[var(--border-color)]'>
                    <div className='flex flex-col items-center gap-2'>
                        <div className='w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-[var(--accent-blue)]/10 flex items-center justify-center transition-colors'>
                            <span className='text-[var(--accent-blue)] font-medium text-sm lg:text-base'>
                                {session.user.email.charAt(0).toUpperCase()}
                            </span>
                        </div>
                        <div className='hidden lg:block text-center'>
                            <div className='text-[var(--text-primary)] font-medium text-xs mb-0.5 break-all'>{session.user.email}</div>
                            <div className='text-[var(--text-secondary)] text-xs'>{companyInfo?.name}</div>
                            <div className='text-[var(--text-secondary)] text-xs'>{companyInfo?.city}</div>
                            <div className='text-[var(--text-secondary)] text-xs'>{companyInfo?.address}</div>
                        </div>
                    </div>
                </div>

                {/* Navigation Links */}
                <nav className='flex-1 p-2'>
                    <Link
                        to='/dashboard'
                        className={`flex items-center justify-center lg:justify-start gap-2 px-2 py-2 rounded-md mb-1 transition-colors ${
                            isActive('/dashboard')
                                ? 'bg-[var(--accent-blue)]/10 text-[var(--accent-blue)] hover:bg-[var(--accent-blue)]/20'
                                : 'text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)]'
                        }`}>
                        <LuLayoutDashboard className='w-5 h-5' />
                        <span className='hidden lg:inline text-sm'>Dashboard</span>
                    </Link>

                    {/* Dynamic Claim Type Links */}
                    {claimTypes.map((type) => (
                        <Link
                            key={type}
                            to={`/${type}`}
                            className={`flex items-center justify-center lg:justify-start gap-2 px-2 py-2 rounded-md mb-1 transition-colors ${
                                isActive(`/${type}`)
                                    ? 'bg-[var(--accent-blue)]/10 text-[var(--accent-blue)] hover:bg-[var(--accent-blue)]/20'
                                    : 'text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)]'
                            }`}>
                            {getClaimTypeIcon(type)}
                            <span className='hidden lg:inline text-sm'>{getClaimTypeLabel(type)}</span>
                        </Link>
                    ))}
                </nav>

                <div className='p-2 border-t border-[var(--border-color)]'>
                    <button
                        onClick={toggleDarkMode}
                        className='cursor-pointer w-full flex items-center justify-center gap-2 px-2 py-2 text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)] rounded-md transition-colors'>
                        {isDarkMode ? (
                            <>
                                <LuSun className='w-5 h-5' />
                                <span className='hidden lg:inline text-sm'>Ljust läge</span>
                            </>
                        ) : (
                            <>
                                <LuMoon className='w-5 h-5' />
                                <span className='hidden lg:inline text-sm'>Mörkt läge</span>
                            </>
                        )}
                    </button>
                </div>

                {/* Logout Button */}
                <div className='p-2 border-t border-[var(--border-color)]'>
                    <button
                        onClick={handleLogout}
                        className='cursor-pointer w-full flex items-center justify-center gap-2 px-2 py-2 text-[var(--accent-red)] hover:bg-[var(--accent-red)]/10 rounded-md transition-colors'>
                        <LuLogOut className='w-5 h-5' />
                        <span className='hidden lg:inline text-sm'>Logga ut</span>
                    </button>
                </div>
            </div>
        </div>
    );
}

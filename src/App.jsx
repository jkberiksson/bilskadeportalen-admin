import { Routes, Route, Navigate } from 'react-router-dom';

import { useAuth } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import SideNav from './components/SideNav';

import DashboardPage from './pages/dashboard/page';
import LoginPage from './pages/login/page';
import GlasPage from './pages/glas/page';
import KeysPage from './pages/keys/page';
import NotFoundPage from './pages/not-found/page';
import GlasPageItem from './pages/glas/item/page';
import KeysPageItem from './pages/keys/item/page';

export default function App() {
    const { session } = useAuth();

    return (
        <div className='flex h-screen'>
            {session && <SideNav />}
            <main className='flex-1 overflow-y-auto p-4 md:p-8'>
                <Routes>
                    <Route path='/' element={<LoginPage />} />
                    <Route
                        path='/dashboard'
                        element={
                            <ProtectedRoute>
                                <DashboardPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path='/glas'
                        element={
                            <ProtectedRoute>
                                <GlasPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path='/keys'
                        element={
                            <ProtectedRoute>
                                <KeysPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path='/glas/:id'
                        element={
                            <ProtectedRoute>
                                <GlasPageItem />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path='/keys/:id'
                        element={
                            <ProtectedRoute>
                                <KeysPageItem />
                            </ProtectedRoute>
                        }
                    />
                    <Route path='/not-found' element={<NotFoundPage />} />
                    <Route path='/*' element={<Navigate to='/not-found' replace />} />
                </Routes>
            </main>
        </div>
    );
}

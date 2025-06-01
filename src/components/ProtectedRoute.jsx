import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Loading from './Loading';

export default function ProtectedRoute({ children }) {
    const { session } = useAuth();

    if (session === undefined) {
        return <Loading />;
    }

    if (!session) {
        return <Navigate to='/' />;
    }

    return children;
}

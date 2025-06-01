import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [session, setSession] = useState(undefined);
    const navigate = useNavigate();

    useEffect(() => {
        if (session) {
            const verifyUserExists = async () => {
                const { data, error } = await supabase.from('profiles').select('id').eq('id', session.user.id).single();
                if (!data || error) {
                    await supabase.auth.signOut();
                    setSession(null);
                }
            };
            verifyUserExists();
        }
    }, [session]);

    useEffect(() => {
        // Get initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
        });

        // Listen for auth changes
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((event, session) => {
            setSession(session);
        });

        // Cleanup subscription
        return () => {
            subscription.unsubscribe();
        };
    }, []);

    const login = async (email, password) => {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
    };

    const logout = async () => {
        try {
            // Clear any remaining session data from localStorage first
            const keys = Object.keys(localStorage);
            keys.forEach((key) => {
                if (key.startsWith('sb-')) {
                    localStorage.removeItem(key);
                }
            });

            // Clear session state before attempting signOut
            setSession(null);

            // Try to sign out, but don't worry if it fails
            await supabase.auth.signOut();

            navigate('/');
        } catch (error) {
            // If we get here, we're already logged out, just navigate
            navigate('/');
        }
    };

    return <AuthContext.Provider value={{ session, logout, login }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    return useContext(AuthContext);
}

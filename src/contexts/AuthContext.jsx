import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [session, setSession] = useState(undefined);

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
        } = supabase.auth.onAuthStateChange((_event, session) => {
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
        await supabase.auth.signOut();
        setSession(null);
    };

    return <AuthContext.Provider value={{ session, logout, login }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    return useContext(AuthContext);
}

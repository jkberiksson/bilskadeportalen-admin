import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { Link, useLocation } from 'react-router-dom';

export default function GlasPage() {
    const [glassDamage, setGlassDamage] = useState([]);
    const [filteredGlassDamage, setFilteredGlassDamage] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({
        status: '',
        registrationNumber: '',
        customer: '',
    });
    const { session } = useAuth();
    const location = useLocation();
    const path = location.pathname.split('/')[1];

    useEffect(() => {
        const checkAccessAndFetch = async () => {
            try {
                const { data } = await supabase.from('profiles').select(`companies (services)`).eq('id', session.user.id).single();

                if (data.companies.services.includes(path)) {
                    await fetchGlassDamage();
                } else {
                    setError('Du har inte tillgång till denna tjänst');
                    setLoading(false);
                }
            } catch (err) {
                setError('Ett fel uppstod vid verifiering av åtkomst');
                setLoading(false);
            }
        };

        checkAccessAndFetch();
    }, [path]);

    useEffect(() => {
        const filtered = glassDamage.filter((claim) => {
            const matchesStatus = !filters.status || claim.status === filters.status;
            const matchesRegNr =
                !filters.registrationNumber || claim.registrationnumber.toLowerCase().includes(filters.registrationNumber.toLowerCase());
            const matchesCustomer =
                !filters.customer || `${claim.firstname} ${claim.lastname}`.toLowerCase().includes(filters.customer.toLowerCase());

            return matchesStatus && matchesRegNr && matchesCustomer;
        });

        setFilteredGlassDamage(filtered);
    }, [filters, glassDamage]);

    const handleFilterChange = (key, value) => {
        setFilters((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    const fetchGlassDamage = async () => {
        try {
            const { data: profile, error: profileError } = await supabase
                .from('profiles')
                .select('company_id')
                .eq('id', session.user.id)
                .single();

            if (profileError) throw profileError;

            const { data, error } = await supabase
                .from('glas_claims')
                .select('*')
                .eq('companyid', profile.company_id)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setGlassDamage(data);
            setFilteredGlassDamage(data);
            setLoading(false);
        } catch (err) {
            setError('Kunde inte hämta glasskador');
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className='p-8'>
                <div className='flex items-center justify-center h-64'>
                    <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--accent-blue)]'></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className='p-8'>
                <div className='bg-[var(--accent-red)]/10 border border-[var(--accent-red)]/20 text-[var(--accent-red)] px-4 py-3 rounded'>
                    {error}
                </div>
            </div>
        );
    }

    return (
        <div className='p-4 lg:p-8 space-y-8'>
            {/* Header */}
            <div className='flex items-center justify-between'>
                <h1 className='text-2xl font-bold text-[var(--text-primary)]'>Glasskador</h1>
            </div>

            {/* Filters */}
            <div className='bg-[var(--bg-primary)] rounded-2xl p-6 shadow-sm border border-[var(--border-color)]'>
                <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                    <div>
                        <label className='text-sm font-medium text-[var(--text-secondary)] block mb-2'>Status</label>
                        <select
                            value={filters.status}
                            onChange={(e) => handleFilterChange('status', e.target.value)}
                            className='w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg px-3 py-2 text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-blue)]'>
                            <option value=''>Alla</option>
                            <option value='Ej påbörjad'>Ej påbörjad</option>
                            <option value='Under behandling'>Under behandling</option>
                            <option value='Avslutad'>Avslutad</option>
                        </select>
                    </div>
                    <div>
                        <label className='text-sm font-medium text-[var(--text-secondary)] block mb-2'>Registreringsnummer</label>
                        <input
                            type='text'
                            value={filters.registrationNumber}
                            onChange={(e) => handleFilterChange('registrationNumber', e.target.value)}
                            placeholder='ABC123'
                            className='w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg px-3 py-2 text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-blue)]'
                        />
                    </div>
                    <div>
                        <label className='text-sm font-medium text-[var(--text-secondary)] block mb-2'>Kund</label>
                        <input
                            type='text'
                            value={filters.customer}
                            onChange={(e) => handleFilterChange('customer', e.target.value)}
                            placeholder='Sök efter kund...'
                            className='w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg px-3 py-2 text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-blue)]'
                        />
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className='bg-[var(--bg-primary)] rounded-2xl shadow-sm border border-[var(--border-color)] overflow-hidden'>
                <div className='overflow-x-auto'>
                    <table className='w-full'>
                        <thead>
                            <tr className='bg-[var(--bg-secondary)]'>
                                <th className='px-6 py-3 text-left text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider'>
                                    Registreringsnummer
                                </th>
                                <th className='px-6 py-3 text-left text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider'>
                                    Kund
                                </th>
                                <th className='px-6 py-3 text-left text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider'>
                                    Status
                                </th>
                                <th className='px-6 py-3 text-left text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider'>
                                    Åtgärder
                                </th>
                            </tr>
                        </thead>
                        <tbody className='divide-y divide-[var(--border-color)]'>
                            {filteredGlassDamage.map((claim) => (
                                <tr key={claim.id} className='hover:bg-[var(--bg-secondary)]/50 transition-colors'>
                                    <td className='px-6 py-4 whitespace-nowrap text-sm text-[var(--text-primary)] uppercase'>
                                        {claim.registrationnumber}
                                    </td>
                                    <td className='px-6 py-4 whitespace-nowrap text-sm text-[var(--text-primary)]'>
                                        {claim.firstname} {claim.lastname}
                                    </td>
                                    <td className='px-6 py-4 whitespace-nowrap'>
                                        <span
                                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                claim.status === 'Avslutad'
                                                    ? 'bg-[var(--accent-green)]/10 text-[var(--accent-green)]'
                                                    : claim.status === 'Under behandling'
                                                    ? 'bg-[var(--accent-yellow)]/10 text-[var(--accent-yellow)]'
                                                    : 'bg-[var(--accent-red)]/10 text-[var(--accent-red)]'
                                            }`}>
                                            {claim.status}
                                        </span>
                                    </td>
                                    <td className='px-6 py-4 whitespace-nowrap text-sm text-[var(--text-primary)]'>
                                        <Link
                                            to={`/glas/${claim.id}`}
                                            className='text-[var(--accent-blue)] hover:text-[var(--accent-blue)]/80 transition-colors'>
                                            Visa detaljer
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {filteredGlassDamage.length === 0 && (
                <div className='text-center py-12'>
                    <div className='bg-[var(--bg-secondary)] rounded-lg p-8 max-w-md mx-auto'>
                        <h3 className='text-lg font-medium text-[var(--text-primary)] mb-1'>Inga glasskador hittades</h3>
                        <p className='text-[var(--text-secondary)]'>
                            {glassDamage.length === 0
                                ? 'Det finns inga glasskador registrerade för ditt företag än.'
                                : 'Inga glasskador matchar dina sökkriterier.'}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}

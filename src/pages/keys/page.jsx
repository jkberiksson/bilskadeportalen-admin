import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { Link, useLocation } from 'react-router-dom';

export default function KeysPage() {
    const [keys, setKeys] = useState([]);
    const [filteredKeys, setFilteredKeys] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({
        status: '',
        registrationNumber: '',
        customer: '',
        startDate: '',
        endDate: '',
    });
    const { session } = useAuth();
    const location = useLocation();
    const path = location.pathname.split('/')[1];

    useEffect(() => {
        const checkAccessAndFetch = async () => {
            try {
                const { data } = await supabase.from('profiles').select(`companies (services)`).eq('id', session.user.id).single();

                if (data.companies.services.includes(path)) {
                    await fetchKeys();
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
        const filtered = keys.filter((key) => {
            const matchesStatus = !filters.status || key.status === filters.status;
            const matchesRegNr =
                !filters.registrationNumber || key.registrationnumber.toLowerCase().includes(filters.registrationNumber.toLowerCase());
            const matchesCustomer =
                !filters.customer || `${key.firstname} ${key.lastname}`.toLowerCase().includes(filters.customer.toLowerCase());

            // Date filtering
            const keyDate = new Date(key.created_at);
            const startDate = filters.startDate ? new Date(filters.startDate) : null;
            const endDate = filters.endDate ? new Date(filters.endDate) : null;

            const matchesStartDate = !startDate || keyDate >= startDate;
            const matchesEndDate = !endDate || keyDate <= new Date(endDate.setHours(23, 59, 59, 999)); // Include the entire end date

            return matchesStatus && matchesRegNr && matchesCustomer && matchesStartDate && matchesEndDate;
        });

        setFilteredKeys(filtered);
    }, [filters, keys]);

    const handleFilterChange = (key, value) => {
        setFilters((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    const handleClearFilters = () => {
        setFilters({
            status: '',
            registrationNumber: '',
            customer: '',
            startDate: '',
            endDate: '',
        });
    };

    const fetchKeys = async () => {
        try {
            const { data: profile, error: profileError } = await supabase
                .from('profiles')
                .select('company_id')
                .eq('id', session.user.id)
                .single();

            if (profileError) throw profileError;

            const { data, error } = await supabase
                .from('key_claims')
                .select('*')
                .eq('companyid', profile.company_id)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setKeys(data);
            setFilteredKeys(data);
            setLoading(false);
        } catch (err) {
            setError('Kunde inte hämta nycklar');
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className='flex items-center justify-center h-64'>
                <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--accent-blue)]'></div>
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
        <div className='space-y-4'>
            {/* Header */}
            <div className='flex items-center justify-between'>
                <h1 className='text-xl font-bold text-[var(--text-primary)]'>Nycklar</h1>
            </div>

            {/* Filters */}
            <div className='bg-[var(--bg-primary)] rounded-xl p-6 shadow-sm border border-[var(--border-color)]'>
                <div className='flex items-center justify-between mb-4'>
                    <h2 className='text-lg font-semibold text-[var(--text-primary)]'>Filtrera glasskador</h2>
                    <button
                        onClick={handleClearFilters}
                        className='text-sm text-[var(--accent-blue)] hover:text-[var(--accent-blue)]/80 font-medium transition-colors'>
                        Rensa alla filter
                    </button>
                </div>

                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4'>
                    <div>
                        <label className='text-sm font-medium text-[var(--text-secondary)] block mb-2'>Status</label>
                        <select
                            value={filters.status}
                            onChange={(e) => handleFilterChange('status', e.target.value)}
                            className='w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg px-3 py-2 text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-blue)] focus:border-transparent transition-all'>
                            <option value=''>Alla statusar</option>
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
                            className='w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg px-3 py-2 text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-blue)] focus:border-transparent transition-all placeholder-[var(--text-secondary)]'
                        />
                    </div>

                    <div>
                        <label className='text-sm font-medium text-[var(--text-secondary)] block mb-2'>Kund</label>
                        <input
                            type='text'
                            value={filters.customer}
                            onChange={(e) => handleFilterChange('customer', e.target.value)}
                            placeholder='Sök efter kund...'
                            className='w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg px-3 py-2 text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-blue)] focus:border-transparent transition-all placeholder-[var(--text-secondary)]'
                        />
                    </div>

                    <div>
                        <label className='text-sm font-medium text-[var(--text-secondary)] block mb-2'>Från datum</label>
                        <input
                            type='date'
                            value={filters.startDate}
                            onChange={(e) => handleFilterChange('startDate', e.target.value)}
                            className='w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg px-3 py-2 text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-blue)] focus:border-transparent transition-all'
                        />
                    </div>

                    <div>
                        <label className='text-sm font-medium text-[var(--text-secondary)] block mb-2'>Till datum</label>
                        <input
                            type='date'
                            value={filters.endDate}
                            onChange={(e) => handleFilterChange('endDate', e.target.value)}
                            className='w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg px-3 py-2 text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-blue)] focus:border-transparent transition-all'
                        />
                    </div>
                </div>
            </div>

            {/* Table */}
            {filteredKeys.length > 0 && (
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
                    {filteredKeys.map((claim) => {
                        const getStatusColor = (status) => {
                            switch (status) {
                                case 'Avslutad':
                                    return 'bg-[var(--accent-green)]/10 border-[var(--accent-green)]/20';
                                case 'Under behandling':
                                    return 'bg-[var(--accent-yellow)]/10 border-[var(--accent-yellow)]/20';
                                default:
                                    return 'bg-[var(--accent-red)]/10 border-[var(--accent-red)]/20';
                            }
                        };

                        const getStatusTextColor = (status) => {
                            switch (status) {
                                case 'Avslutad':
                                    return 'text-[var(--accent-green)]';
                                case 'Under behandling':
                                    return 'text-[var(--accent-yellow)]';
                                default:
                                    return 'text-[var(--accent-red)]';
                            }
                        };

                        return (
                            <Link
                                key={claim.id}
                                to={`/keys/${claim.id}`}
                                className={`block p-4 rounded-xl border transition-all duration-200 hover:shadow-md hover:scale-[1.01] ${getStatusColor(
                                    claim.status
                                )}`}>
                                <div className='space-y-3'>
                                    <div className='flex items-center justify-between'>
                                        <span className='text-base font-semibold text-[var(--text-primary)] uppercase tracking-wide'>
                                            {claim.registrationnumber}
                                        </span>
                                        <span
                                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusTextColor(
                                                claim.status
                                            )}`}>
                                            {claim.status}
                                        </span>
                                    </div>

                                    <div className='space-y-2'>
                                        <div>
                                            <p className='text-sm text-[var(--text-secondary)]'>Kund</p>
                                            <p className='text-sm text-[var(--text-primary)] font-medium'>
                                                {claim.firstname} {claim.lastname}
                                            </p>
                                        </div>

                                        <div>
                                            <p className='text-sm text-[var(--text-secondary)]'>Datum</p>
                                            <p className='text-sm text-[var(--text-primary)]'>
                                                {new Date(claim.created_at).toLocaleDateString('sv-SE')}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            )}

            {filteredKeys.length === 0 && (
                <div className='text-center py-12'>
                    <div className='bg-[var(--bg-secondary)] rounded-lg p-8 max-w-md mx-auto'>
                        <h3 className='text-lg font-medium text-[var(--text-primary)] mb-1'>Inga nyckelbeställningar hittades</h3>
                        <p className='text-[var(--text-secondary)]'>
                            {keys.length === 0
                                ? 'Det finns inga nyckelbeställningar registrerade för ditt företag än.'
                                : 'Inga nyckelbeställningar matchar dina sökkriterier.'}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}

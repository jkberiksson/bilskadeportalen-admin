import { LuConstruction } from 'react-icons/lu';

export default function DashboardPage() {
    return (
        <div className='space-y-4'>
            {/* Header */}
            <div className='flex items-center justify-between'>
                <h1 className='text-xl font-bold text-[var(--text-primary)]'>Dashboard</h1>
            </div>

            {/* Coming Soon Message */}
            <div className='bg-[var(--bg-primary)] rounded-xl p-6 shadow-sm border border-[var(--border-color)]'>
                <div className='flex flex-col items-center justify-center text-center space-y-4 py-8'>
                    <div className='w-16 h-16 rounded-full bg-[var(--accent-blue)]/10 flex items-center justify-center'>
                        <LuConstruction className='w-8 h-8 text-[var(--accent-blue)]' />
                    </div>
                    <div className='space-y-2'>
                        <h2 className='text-xl font-bold text-[var(--text-primary)]'>Kommer snart!</h2>
                        <p className='text-sm text-[var(--text-secondary)] max-w-md'>
                            Vi arbetar för fullt med att bygga ut dashboarden med fler funktioner och statistik. Här kommer du snart kunna
                            se en översikt över alla dina ärenden och aktiviteter.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

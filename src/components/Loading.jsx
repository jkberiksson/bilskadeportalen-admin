export default function Loading() {
    return (
        <div className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex justify-center items-center'>
            <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--accent-blue)]'></div>
        </div>
    );
}

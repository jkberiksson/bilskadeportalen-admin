import { LuLoader } from 'react-icons/lu';

export default function DeleteModal({ onConfirm, onCancel, title, description, isDeleting }) {
    return (
        <div className='fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50'>
            <div className='bg-white p-8 rounded-lg w-full max-w-md'>
                <h2 className='text-xl font-bold mb-2 text-black'>{title}</h2>
                <p className='mb-4 text-gray-500'>{description}</p>
                <div className='flex justify-end'>
                    <button
                        onClick={onCancel}
                        disabled={isDeleting}
                        className='cursor-pointer bg-gray-200 text-gray-800 px-4 py-2 rounded-md mr-2'>
                        Avbryt
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={isDeleting}
                        className='cursor-pointer bg-[var(--accent-red)] text-white px-4 py-2 rounded-md'>
                        {isDeleting ? <LuLoader className='w-4 h-4 animate-spin' /> : 'Ta bort'}
                    </button>
                </div>
            </div>
        </div>
    );
}

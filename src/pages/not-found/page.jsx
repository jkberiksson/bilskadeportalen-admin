import { Link } from 'react-router-dom';
import { LuArrowLeft } from 'react-icons/lu';

export default function NotFoundPage() {
    return (
        <div className='min-h-screen flex items-center justify-center p-8 absolute inset-0 overflow-hidden'>
            {/* Background Image with Overlay */}
            <div className='absolute inset-0 z-0'>
                <div className='absolute inset-0 bg-gradient-to-br from-gray-900 to-gray-800' />
                <div className='absolute inset-0 opacity-5'>
                    <div
                        className='absolute inset-0'
                        style={{
                            backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
                            backgroundSize: '40px 40px',
                        }}
                    />
                </div>
            </div>
            s{/* Content */}
            <div className='relative z-10 text-center'>
                <div className='bg-white/10 backdrop-blur-xl rounded-2xl px-12 py-16 border border-white/20 shadow-xl max-w-2xl mx-auto'>
                    <h1 className='text-9xl font-bold text-white/90 mb-4'>404</h1>
                    <h2 className='text-3xl font-bold text-white/90 mb-4'>Sidan kunde inte hittas</h2>
                    <p className='text-lg text-white/70 mb-8 max-w-md mx-auto'>
                        Sidan du letar efter finns inte eller har flyttats. Kontrollera webbadressen eller gå tillbaka till startsidan.
                    </p>
                    <Link to='/' className='inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors group'>
                        <LuArrowLeft className='w-5 h-5 group-hover:translate-x-1 transition-transform' />
                        <span>Gå tillbaka till startsidan</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}

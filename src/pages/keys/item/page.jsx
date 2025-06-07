import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../../../lib/supabase';
import {
    LuArrowLeft,
    LuCalendar,
    LuUser,
    LuPhone,
    LuMail,
    LuCar,
    LuFileText,
    LuCheck,
    LuChevronDown,
    LuSignature,
    LuDownload,
    LuTrash2,
} from 'react-icons/lu';
import { Link } from 'react-router-dom';
import PDFDoc from '../../../components/PdfDoc';
import DeleteModal from '../../../components/DeleteModal';

export default function KeysDetails() {
    const { id } = useParams();
    const [claim, setClaim] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isStatusOpen, setIsStatusOpen] = useState(false);
    const [signature, setSignature] = useState(null);
    const [showPDF, setShowPDF] = useState(false);
    const [logo, setLogo] = useState(null);
    const [images, setImages] = useState([]);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const navigate = useNavigate();

    const statusOptions = ['Ej påbörjad', 'Under behandling', 'Avslutad'];

    const handleStatusChange = async (newStatus) => {
        try {
            const { error } = await supabase.from('key_claims').update({ status: newStatus }).eq('id', id);

            if (error) throw error;
            setClaim({ ...claim, status: newStatus });
            setIsStatusOpen(false);
        } catch (err) {
            setError('Kunde inte uppdatera status');
        }
    };

    const handleDownloadImage = async (image) => {
        try {
            // Get the signed URL from Supabase
            const { data, error } = await supabase.storage.from('damage-images').createSignedUrl(`${id}/${image.name}`, 5);
            if (error) throw error;

            // Fetch the blob from the signed URL
            const response = await fetch(data.signedUrl);
            const blob = await response.blob();

            // Create a temporary link element and trigger download
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = image.name;
            document.body.appendChild(a);
            a.click();

            // Cleanup
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (err) {
            setError('Kunde inte ladda ner bilden');
        }
    };

    const handleDeleteClaim = async () => {
        setIsDeleting(true);
        try {
            const { error: signatureError } = await supabase.storage.from('signatures').remove([`${id}/signature.png`]);
            if (signatureError) throw signatureError;

            const imgsToDelete = images.map((img) => `${id}/${img.name}`);
            const { error: imagesError } = await supabase.storage.from('damage-images').remove(imgsToDelete);
            if (imagesError) throw imagesError;

            const { error } = await supabase.from('key_claims').delete().eq('id', id);
            if (error) throw error;
            navigate('/keys');
        } catch (err) {
            setError(err.message);
        } finally {
            setIsDeleting(false);
        }
    };

    useEffect(() => {
        const fetchClaim = async () => {
            try {
                const { data, error } = await supabase.from('key_claims').select('*').eq('id', id).single();
                if (error) throw error;

                const { data: signatureData, error: signatureError } = await supabase.storage
                    .from('signatures')
                    .createSignedUrl(`${id}/signature.png`, 5);
                if (signatureError) throw new Error('Något gick fel vid hämtning av signaturen');

                const { data: logoData, error: logoError } = await supabase
                    .from('companies')
                    .select('logo')
                    .eq('id', data.companyid)
                    .single();
                if (logoError) throw new Error('Något gick fel vid hämtning av logon');

                const { data: imagesData, error: imagesError } = await supabase.storage.from('damage-images').list(id);
                if (imagesError) throw new Error('Något gick fel vid hämtning av bilder');

                const uploadedImages = [];
                for (const img of imagesData) {
                    const { data, error } = await supabase.storage.from('damage-images').createSignedUrl(`${id}/${img.name}`, 3600);
                    if (error) throw new Error('Något gick fel vid hämtning av bilder');
                    uploadedImages.push({ name: img.name, url: data.signedUrl });
                }

                setImages(uploadedImages);
                setSignature(signatureData.signedUrl);
                setLogo(logoData.logo);
                setClaim(data);
                setLoading(false);
            } catch (err) {
                setError('Kunde inte hämta nyckelbeställning');
                setLoading(false);
            }
        };

        fetchClaim();
    }, [id]);

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
        <div className='space-y-4'>
            {/* Header */}
            <div className='flex items-center justify-between'>
                <div className='flex items-center gap-2 lg:gap-4'>
                    <Link to='/keys' className='p-2 hover:bg-[var(--bg-secondary)] rounded-full transition-colors'>
                        <LuArrowLeft className='w-5 h-5 text-[var(--text-secondary)]' />
                    </Link>
                    <h1 className='text-xl font-bold text-[var(--text-primary)]'>Nyckelbeställning</h1>
                </div>
                <div className='hidden lg:flex items-center gap-4'>
                    <button
                        onClick={() => setShowPDF(true)}
                        className='cursor-pointer px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-2 bg-[var(--accent-blue)]/10 text-[var(--accent-blue)]'>
                        <LuFileText className='w-4 h-4' />
                        Visa PDF
                    </button>
                    <div className='relative'>
                        <button
                            onClick={() => setIsStatusOpen(!isStatusOpen)}
                            className={`cursor-pointer px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-2 ${
                                claim.status === 'Avslutad'
                                    ? 'bg-[var(--accent-green)]/10 text-[var(--accent-green)]'
                                    : claim.status === 'Under behandling'
                                    ? 'bg-[var(--accent-yellow)]/10 text-[var(--accent-yellow)]'
                                    : 'bg-[var(--accent-red)]/10 text-[var(--accent-red)]'
                            }`}>
                            {claim.status}
                            <LuChevronDown className='w-4 h-4' />
                        </button>
                        {isStatusOpen && (
                            <div className='absolute right-0 mt-2 w-48 bg-[var(--bg-primary)] rounded-lg shadow-lg border border-[var(--border-color)] py-1 z-10'>
                                {statusOptions.map((status) => (
                                    <button
                                        key={status}
                                        onClick={() => handleStatusChange(status)}
                                        className={`cursor-pointer w-full text-left px-3 py-1.5 text-sm hover:bg-[var(--bg-secondary)] ${
                                            status === claim.status ? 'text-[var(--accent-blue)] font-medium' : 'text-[var(--text-primary)]'
                                        }`}>
                                        {status}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                    <button
                        onClick={() => setShowDeleteModal(true)}
                        className='cursor-pointer px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-2 bg-[var(--accent-red)]/10 text-[var(--accent-red)]'>
                        <LuTrash2 className='w-4 h-4' />
                        Ta bort claim
                    </button>
                </div>
            </div>

            <div className='grid grid-cols-1 lg:grid-cols-3 gap-4'>
                {/* Main Information */}
                <div className='lg:col-span-2 space-y-4'>
                    {/* Damage Details */}
                    <div className='bg-[var(--bg-primary)] rounded-xl p-4 shadow-sm border border-[var(--border-color)]'>
                        <h2 className='text-base font-semibold text-[var(--text-primary)] mb-4'>Skadeinformation</h2>
                        <div className='space-y-4'>
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                                <div className='bg-[var(--bg-secondary)] p-3 rounded-lg'>
                                    <label className='text-xs font-medium text-[var(--text-secondary)] block mb-1.5'>Skadedatum</label>
                                    <p className='text-sm text-[var(--text-primary)]'>{new Date(claim.date).toLocaleDateString('sv-SE')}</p>
                                </div>
                                <div className='bg-[var(--bg-secondary)] p-3 rounded-lg'>
                                    <label className='text-xs font-medium text-[var(--text-secondary)] block mb-1.5'>Mätarställning</label>
                                    <p className='text-sm text-[var(--text-primary)]'>{claim.odometer} km</p>
                                </div>
                            </div>
                            <div className='bg-[var(--bg-secondary)] p-3 rounded-lg'>
                                <label className='text-xs font-medium text-[var(--text-secondary)] block mb-1.5'>Beskrivning</label>
                                <p className='text-sm text-[var(--text-primary)]'>{claim.description}</p>
                            </div>
                        </div>
                    </div>

                    {/* Images */}
                    <div className='bg-[var(--bg-primary)] rounded-xl p-4 shadow-sm border border-[var(--border-color)]'>
                        <h2 className='text-base font-semibold text-[var(--text-primary)] mb-4'>Bilder</h2>
                        {images.length > 0 && (
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                                {images.map((image) => (
                                    <div key={image.name} className='relative bg-[var(--bg-secondary)] rounded-lg overflow-hidden'>
                                        <div className='absolute top-2 right-2 z-10 flex gap-2'>
                                            <button
                                                onClick={() => handleDownloadImage(image)}
                                                className='hidden lg:block cursor-pointer p-1.5 bg-[var(--accent-blue)] text-white rounded-lg hover:bg-[var(--accent-blue)]/90 transition-colors'>
                                                <LuDownload className='w-4 h-4' />
                                            </button>
                                        </div>
                                        <img src={image.url} alt={image.name} className='w-full h-[200px] object-contain p-2' />
                                    </div>
                                ))}
                            </div>
                        )}
                        {images.length === 0 && <p className='text-sm text-[var(--text-secondary)]'>Inga bilder tillagda</p>}
                    </div>
                </div>

                {/* Side Information */}
                <div className='space-y-8'>
                    {/* Customer Information */}
                    <div className='bg-[var(--bg-primary)] rounded-2xl p-6 shadow-sm border border-[var(--border-color)]'>
                        <h2 className='text-lg font-semibold text-[var(--text-primary)] mb-6'>Kundinformation</h2>
                        <div className='space-y-4'>
                            <div className='flex items-center gap-3 bg-[var(--bg-secondary)] p-4 rounded-lg'>
                                <LuUser className='w-5 h-5 text-[var(--text-secondary)]' />
                                <div>
                                    <p className='text-[var(--text-primary)] font-medium'>
                                        {claim.firstname} {claim.lastname}
                                    </p>
                                    <p className='text-sm text-[var(--text-secondary)]'>{claim.personalnum}</p>
                                </div>
                            </div>
                            <div className='flex items-center gap-3 bg-[var(--bg-secondary)] p-4 rounded-lg'>
                                <LuPhone className='w-5 h-5 text-[var(--text-secondary)]' />
                                <p className='text-[var(--text-primary)]'>{claim.phone}</p>
                            </div>
                            <div className='flex items-center gap-3 bg-[var(--bg-secondary)] p-4 rounded-lg'>
                                <LuMail className='w-5 h-5 text-[var(--text-secondary)]' />
                                <p className='text-[var(--text-primary)] break-all'>{claim.email}</p>
                            </div>
                        </div>
                    </div>

                    {/* Vehicle Information */}
                    <div className='bg-[var(--bg-primary)] rounded-2xl p-6 shadow-sm border border-[var(--border-color)]'>
                        <h2 className='text-lg font-semibold text-[var(--text-primary)] mb-6'>Fordon</h2>
                        <div className='space-y-4'>
                            <div className='flex items-center gap-3 bg-[var(--bg-secondary)] p-4 rounded-lg'>
                                <LuCar className='w-5 h-5 text-[var(--text-secondary)]' />
                                <p className='text-[var(--text-primary)] uppercase'>{claim.registrationnumber}</p>
                            </div>
                            <div className='flex items-center gap-3 bg-[var(--bg-secondary)] p-4 rounded-lg'>
                                <LuFileText className='w-5 h-5 text-[var(--text-secondary)]' />
                                <p className='text-[var(--text-primary)]'>{claim.insurancecompany}</p>
                            </div>
                            <div className='flex items-center gap-3 bg-[var(--bg-secondary)] p-4 rounded-lg'>
                                <LuCheck className='w-5 h-5 text-[var(--text-secondary)]' />
                                <p className='text-[var(--text-primary)]'>Momspliktig: {claim.vat}</p>
                            </div>
                        </div>
                    </div>

                    {/* Signature */}
                    <div className='bg-[var(--bg-primary)] rounded-2xl p-6 shadow-sm border border-[var(--border-color)]'>
                        <h2 className='text-lg font-semibold text-[var(--text-primary)] mb-6'>Signatur</h2>
                        <div className='space-y-4'>
                            <div className='flex items-center gap-3 bg-[var(--bg-secondary)] p-4 rounded-lg'>
                                <img src={signature} alt='Signature' className='object-contain h-[130px] w-full' />
                            </div>
                            <div className='flex items-center gap-3 bg-[var(--bg-secondary)] p-4 rounded-lg'>
                                <LuSignature className='w-5 h-5 text-[var(--text-secondary)]' />
                                <p className='text-[var(--text-primary)]'>{claim.signature}</p>
                            </div>
                        </div>
                    </div>

                    {/* Timestamps */}
                    <div className='bg-[var(--bg-primary)] rounded-2xl p-6 shadow-sm border border-[var(--border-color)]'>
                        <h2 className='text-lg font-semibold text-[var(--text-primary)] mb-6'>Tidsstämplar</h2>
                        <div className='space-y-4'>
                            <div className='flex items-center gap-3 bg-[var(--bg-secondary)] p-4 rounded-lg'>
                                <LuCalendar className='w-5 h-5 text-[var(--text-secondary)]' />
                                <div>
                                    <p className='text-sm text-[var(--text-secondary)]'>Skapad</p>
                                    <p className='text-[var(--text-primary)]'>{new Date(claim.created_at).toLocaleDateString('sv-SE')}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {showPDF && <PDFDoc claim={claim} signature={signature} setShowPDF={setShowPDF} title='Nyckelbeställning' logo={logo} />}
            {showDeleteModal && (
                <DeleteModal
                    onConfirm={handleDeleteClaim}
                    onCancel={() => setShowDeleteModal(false)}
                    title='Ta bort claim'
                    description='Är du säker på att du vill ta bort detta claim?'
                    isDeleting={isDeleting}
                />
            )}
        </div>
    );
}

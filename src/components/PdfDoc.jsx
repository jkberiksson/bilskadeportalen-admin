import { Document, Page, Text, View, StyleSheet, PDFViewer, Image } from '@react-pdf/renderer';
import { LuX } from 'react-icons/lu';

const styles = StyleSheet.create({
    page: {
        padding: '20px 50px',
        fontSize: '12px',
        backgroundColor: '#ffffff',
        minHeight: '100%',
        position: 'relative',
    },
    title: {
        fontSize: '18px',
        marginBottom: '20px',
        color: '#111827',
        fontWeight: 'bold',
    },
    content: {
        border: '1px solid #111827',
        borderBottom: 'none',
        marginBottom: '20px',
    },
    section: {
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
        padding: '6px',
        borderBottom: '1px solid #111827',
    },
    label: {
        fontSize: '8px',
    },
    value: {
        fontSize: '10px',
        fontWeight: 'bold',
    },
    signature: {
        width: '50%',
        height: '50px',
        objectFit: 'contain',
    },
    signatureContainer: {
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
        borderBottom: '1px solid #111827',
    },
    bottomContainer: {
        position: 'absolute',
        bottom: '20px',
        left: '50px',
        width: '80%',
    },
    logo: {
        width: '150px',
        objectFit: 'contain',
        marginBottom: '20px',
    },
    confirmation: {
        fontSize: '8px',
        fontWeight: 'bold',
    },
});

const ClaimDocument = ({ claim, signature, title, logo }) => (
    <Document>
        <Page size='A4' style={styles.page}>
            <Text style={styles.title}>{title}</Text>
            <View style={styles.content}>
                <View style={styles.section}>
                    <Text style={styles.label}>Försäkringsbolag</Text>
                    <Text style={styles.value}>{claim.insurancecompany}</Text>
                </View>
                <View style={styles.section}>
                    <Text style={styles.label}>Namn</Text>
                    <Text style={styles.value}>
                        {claim.firstname} {claim.lastname}
                    </Text>
                </View>
                <View style={styles.section}>
                    <Text style={styles.label}>Registreringsnummer</Text>
                    <Text style={styles.value}>{claim.registrationnumber.toUpperCase()}</Text>
                </View>
                <View style={styles.section}>
                    <Text style={styles.label}>Person-/Organisationsnummer</Text>
                    <Text style={styles.value}>{claim.personalnum}</Text>
                </View>
                <View style={styles.section}>
                    <Text style={styles.label}>Momspliktig</Text>
                    <Text style={styles.value}>{claim.vat}</Text>
                </View>
                <View style={styles.section}>
                    <Text style={styles.label}>Telefonnummer</Text>
                    <Text style={styles.value}>{claim.phone}</Text>
                </View>
                <View style={styles.section}>
                    <Text style={styles.label}>E-post</Text>
                    <Text style={styles.value}>{claim.email}</Text>
                </View>
            </View>

            <View style={styles.content}>
                {claim.damagetype && (
                    <View style={styles.section}>
                        <Text style={styles.label}>Skademoment</Text>
                        <Text style={styles.value}>{claim.damagetype}</Text>
                    </View>
                )}
                {claim.damagecause && (
                    <View style={styles.section}>
                        <Text style={styles.label}>Skadeorsak</Text>
                        <Text style={styles.value}>{claim.damagecause}</Text>
                    </View>
                )}
                {claim.damagedwindow && (
                    <View style={styles.section}>
                        <Text style={styles.label}>Skadat fönster</Text>
                        <Text style={styles.value}>{claim.damagedwindow}</Text>
                    </View>
                )}
                {claim.location && (
                    <View style={styles.section}>
                        <Text style={styles.label}>Plats</Text>
                        <Text style={styles.value}>{claim.location}</Text>
                    </View>
                )}
                <View style={styles.section}>
                    <Text style={styles.label}>Skadedatum</Text>
                    <Text style={styles.value}>{new Date(claim.date).toLocaleDateString('sv-SE')}</Text>
                </View>
                <View style={styles.section}>
                    <Text style={styles.label}>Mätarställning</Text>
                    <Text style={styles.value}>{claim.odometer} km</Text>
                </View>
                <View style={styles.section}>
                    <Text style={styles.label}>Beskrivning</Text>
                    <Text style={styles.value}>{claim.description}</Text>
                </View>
            </View>
            <View style={styles.content}>
                <View style={styles.signatureContainer}>
                    <Text style={styles.label}>Försäkringstagares signatur</Text>
                    <Image style={styles.signature} src={signature} />
                </View>
                <View style={styles.section}>
                    <Text style={styles.label}>Försäkringstagarens namnförtydligande</Text>
                    <Text style={styles.value}>{claim.signature}</Text>
                </View>
            </View>
            <View style={styles.bottomContainer}>
                <Image style={styles.logo} src={`/images/${logo}.png`} />
                <Text style={styles.confirmation}>
                    Härmed intygas riktigheten av ovanstående uppgifter samt att försäkringen omfattar glasruteskada och att premien var
                    betald vid skadetillfället. Godar försäkringsbolaget inte skadan som försäkringsgrundande är fordonsägaren alltid
                    betalningsskyldig.
                </Text>
            </View>
        </Page>
    </Document>
);

export default function PDFDoc({ claim, signature, setShowPDF, title, logo }) {
    return (
        <div className='fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50'>
            <div className='bg-white text-black w-full max-w-4xl h-[90vh] rounded-xl shadow-lg overflow-hidden flex flex-col'>
                <div className='p-4 border-b'>
                    <div className='flex items-center justify-between'>
                        <h2 className='text-base font-black uppercase tracking-tight text-text-primary'>Förhandsgranska dokument</h2>
                        <button onClick={() => setShowPDF(false)} className='cursor-pointer'>
                            <LuX className='w-5 h-5' />
                        </button>
                    </div>
                </div>
                <div className='flex-1 p-4'>
                    <PDFViewer style={{ width: '100%', height: '100%' }}>
                        <ClaimDocument claim={claim} signature={signature} title={title} logo={logo} />
                    </PDFViewer>
                </div>
            </div>
        </div>
    );
}

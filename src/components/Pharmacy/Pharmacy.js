import { useEffect, useState } from 'react';
import Image from 'next/image';
import styles from './Pharmacy.module.css';
import { pharmacyService } from '../../api/services/pharmacy.service';

const Pharmacy = ({ patientId }) => {
    const [pharmacyInfo, setPharmacyInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPharmacy = async () => {
            try {
                const data = await pharmacyService.getPreferredPharmacy(patientId);
                setPharmacyInfo(data);
            } catch (err) {
                setError('Failed to load pharmacy information');
                console.error('Error fetching pharmacy:', err);
            } finally {
                setLoading(false);
            }
        };

        if (patientId) {
            fetchPharmacy();
        }
    }, [patientId]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;
    if (!pharmacyInfo) return <div>No pharmacy information available</div>;

    // Format phone number
    const formatPhone = (phone) => {
        if (!phone) return '';
        const cleaned = phone.replace(/\D/g, '');
        return `(${cleaned.slice(0,3)}) ${cleaned.slice(3,6)}-${cleaned.slice(6)}`;
    };

    // Format address
    const formatAddress = () => {
        const parts = [];
        if (pharmacyInfo.Address1) parts.push(pharmacyInfo.Address1);
        if (pharmacyInfo.Address2) parts.push(pharmacyInfo.Address2);
        if (pharmacyInfo.City) parts.push(pharmacyInfo.City);
        if (pharmacyInfo.State) parts.push(pharmacyInfo.State);
        if (pharmacyInfo.Zipcode) parts.push(pharmacyInfo.Zipcode);
        return parts.join(', ');
    };

    return (
        <div className={styles.card}>
            <div className={styles.header}>
                <div className={styles.titleWithIcon}>
                    <Image
                        src="/assets/icons/pharmacyIcon.png"
                        alt="Pharmacy"
                        width={20}
                        height={20}
                    />
                    <h2 className={styles.title}>Preferred Pharmacy</h2>
                </div>
            </div>
            <div className={styles.pharmacyInfo}>
                <h3 className={styles.pharmacyName}>{pharmacyInfo.Name}</h3>
                <div className={styles.contactInfo}>
                    <div className={styles.infoItem}>
                        <Image
                            src="/assets/icons/phoneIcon.png"
                            alt="Phone"
                            width={20}
                            height={20}
                        />
                        <span>{formatPhone(pharmacyInfo.PhoneNo)}</span>
                    </div>
                    <div className={styles.infoItem}>
                        <Image
                            src="/assets/icons/locationIcon.png"
                            alt="Location"
                            width={15}
                            height={25}
                        />
                        <span>{formatAddress()}</span>
                    </div>
                    {pharmacyInfo.FaxNo && (
                        <div className={styles.infoItem}>
                            <Image
                                src="/assets/icons/faxIcon.png"
                                alt="Fax"
                                width={20}
                                height={20}
                            />
                            <span>Fax: {formatPhone(pharmacyInfo.FaxNo)}</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Pharmacy; 
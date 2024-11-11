import Image from 'next/image';
import styles from './Physicians.module.css';
import { physicianService } from '../../api/services/physician.service';
import { useState, useEffect } from 'react';
import { authService } from '../../api/services/auth.service';

const Physicians = () => {
    const [physicianInfo, setPhysicianInfo] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPhysician = async () => {
            try {
                setLoading(true);
                const user = authService.getCurrentUser();
                
                if (!user) {
                    throw new Error('Patient ID not found');
                }
                const data = await physicianService.getPrimaryPhysician(user.patient_id);
                setPhysicianInfo(data);
                console.log('physician info', data);
            } catch (err) {
                setError('Failed to load physician information');
                console.error('Error fetching physician:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchPhysician();
    }, []);

    // if (!physicianInfo || loading) return <div>No Physician Information Available</div>;

    return (
        <div className={styles.card}>
            <div className={styles.header}>
                <div className={styles.titleWithIcon}>
                    <Image
                        src="/assets/icons/doctorIcon.png"
                        alt="Physician"
                        width={20}
                        height={20}
                    />
                    <h2 className={styles.title}>Primary Care Physician</h2>
                </div>
            </div>
            <div className={styles.physiciansList}>
                {Array.isArray(physicianInfo) && (
                    <div className={styles.physicianItem}>
                        <div className={styles.physicianInfo}>
                        <Image
                            src="/assets/images/person3.png"
                            alt={physicianInfo.name}
                            width={48}
                            height={48}
                            className={styles.physicianImage}
                        />
                        <div className={styles.physicianDetails}>
                            <span className={styles.physicianName}>{physicianInfo.name}</span>
                            <span className={styles.specialty}>{physicianInfo.specialty || 'Primary Care Physician'}</span>
                        </div>
                        </div>
                    </div>
                )}
                {!physicianInfo || !(Array.isArray(physicianInfo)) && (
                    <p style={{color: '#808080'}}>No primary physician is available</p>
                )}
                {loading && (
                    <p style={{color: '#808080'}}>Loading...</p>
                )}
            </div>
        </div>
    );
};

export default Physicians; 
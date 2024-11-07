import { useState, useEffect } from 'react';
import Image from 'next/image';
import Button from '../Button/Button';
import styles from './Consultations.module.css';
import { useRouter } from 'next/router';
import { encounterService } from '../../api/services/encounter.service';
import { authService } from '../../api/services/auth.service';


const Consultations = () => {
    const [consultations, setConsultations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    const router = useRouter();

    // useEffect(() => {
    //     const fetchConsultations = async () => {
    //         try {
    //             setLoading(true);
    //             const user = authService.getCurrentUser();
                
    //             if (!user) {
    //                 throw new Error('Patient ID not found');
    //             }

    //             const data = await encounterService.getEncounters(parseInt(user.patient_id));
                
    //             // Format the data to match our component's needs
    //             const formattedConsultations = data.map(encounter => ({
    //                 id: encounter.ID,
    //                 condition: encounter.Reason.Title,
    //                 type: encounter.Type,
    //                 date: new Date(encounter.Date).toLocaleDateString(),
    //                 time: new Date(encounter.Date).toLocaleTimeString([], { 
    //                     hour: '2-digit', 
    //                     minute: '2-digit' 
    //                 }),
    //                 status: encounter.Status
    //             }));

    //             setConsultations(formattedConsultations);
    //         } catch (error) {
    //             console.error('Error fetching consultations:', error);
    //             setError('Failed to load consultations');
    //         } finally {
    //             setLoading(false);
    //         }
    //     };

    //     fetchConsultations();
    // }, []);

    const handleRequestConsultationClick = () => {
        router.push('/consultation');
    };

    if (loading) {
        return <div className={styles.loading}>Loading consultations...</div>;
    }

    if (error) {
        return <div className={styles.error}>{error}</div>;
    }

    return (
        <div className={styles.card}>
            <div className={styles.header}>
                <div className={styles.titleWithIcon}>
                    <Image
                        src="/assets/icons/myConsultationsIcon.png"
                        alt="Consultation"
                        width={20}
                        height={20}
                    />
                    <h2 className={styles.title}>My Consultations</h2>
                </div>
                <Button
                    icon="/assets/icons/addIcon.png"
                    variant="primary"
                    onClick={handleRequestConsultationClick}
                >
                    Request Consultation
                </Button>
            </div>
            <div className={styles.consultationsList}>
                {consultations.length === 0 ? (
                    <div className={styles.noConsultations}>
                        No consultations found
                    </div>
                ) : (
                    consultations.map(consultation => (
                        <div key={consultation.id} className={styles.consultationItem}>
                            <h3 className={styles.condition}>{consultation.condition}</h3>
                            <div className={styles.consultationDetails}>
                                <div className={styles.doctorInfo}>
                                    <Image 
                                        src="/assets/icons/doctorIcon.png" 
                                        alt="Doctor" 
                                        width={16} 
                                        height={16} 
                                    />
                                    <span>{consultation.type}</span>
                                </div>
                                <div className={styles.timeInfo}>
                                    <Image 
                                        src="/assets/icons/dateIcon.png" 
                                        alt="Calendar" 
                                        width={16} 
                                        height={16} 
                                    />
                                    <span>{consultation.date}</span>
                                    <Image 
                                        src="/assets/icons/timeIcon.png" 
                                        alt="Time" 
                                        width={16} 
                                        height={16} 
                                    />
                                    <span>{consultation.time}</span>
                                </div>
                                <div className={styles.status}>
                                    Status: {consultation.status}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Consultations; 
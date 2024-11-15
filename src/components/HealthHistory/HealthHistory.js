import { healthHistoryData } from './healthHistoryData';
import styles from './HealthHistory.module.css';
import Image from 'next/image';
import Button from '../Button/Button';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { lifestyleService } from '../../api/services/lifestyle.service';

const HealthHistory = ({ patientId }) => {
    const router = useRouter();
    const [lifestyleData, setLifestyleData] = useState(null);
    const [loading, setLoading] = useState(true);

    const convertDateTime = (dateTimeString) => {
        const date = new Date(dateTimeString);

        // Format date as YYYY-MM-DD
        const formattedDate = date.toISOString().split('T')[0];

        // Format time as HH:MM:SS
        const formattedTime = date.toTimeString().split(' ')[0];

        return { formattedDate, formattedTime };
    };

    useEffect(() => {
        const fetchLifestyleData = async () => {
            try {
                const data = await lifestyleService.getLifestyle(patientId);
                console.log('lifestyle data:', data);
                setLifestyleData(data);
            } catch (error) {
                console.error('Error fetching lifestyle data:', error);
            } finally {
                setLoading(false);
            }
        };

        if (patientId) {
            fetchLifestyleData();
        }
    }, [patientId]);

    const handleEditHealthHistoryClick = () => {
        router.push('/health-history');
    };

    // const formatLifestyleSection = (data) => {
    //     if (!data) return null;

    //     return (
    //         <div className={styles.lifestyleSection}>
    //             <h2 className={styles.categoryTitle}>Lifestyle Information</h2>
    //             <div className={styles.lifestyleDetails}>
    //                 {data.smokingStatus && (
    //                     <div className={styles.lifestyleItem}>
    //                         <span className={styles.label}>Smoking Status:</span>
    //                         <span className={styles.value}>{data.smokingStatus}</span>
    //                     </div>
    //                 )}
    //                 {data.alcoholConsumption && (
    //                     <div className={styles.lifestyleItem}>
    //                         <span className={styles.label}>Alcohol Consumption:</span>
    //                         <span className={styles.value}>{data.alcoholConsumption}</span>
    //                     </div>
    //                 )}
    //                 {data.exerciseFrequency && (
    //                     <div className={styles.lifestyleItem}>
    //                         <span className={styles.label}>Exercise Frequency:</span>
    //                         <span className={styles.value}>{data.exerciseFrequency}</span>
    //                     </div>
    //                 )}
    //                 {data.dietType && (
    //                     <div className={styles.lifestyleItem}>
    //                         <span className={styles.label}>Diet Type:</span>
    //                         <span className={styles.value}>{data.dietType}</span>
    //                     </div>
    //                 )}
    //                 {data.occupation && (
    //                     <div className={styles.lifestyleItem}>
    //                         <span className={styles.label}>Occupation:</span>
    //                         <span className={styles.value}>{data.occupation}</span>
    //                     </div>
    //                 )}
    //             </div>
    //         </div>
    //     );
    // };

    return (
        <div>
            <div className={styles.card}>
                <div className={styles.header}>
                    <div className={styles.titleSection}>
                        <Image
                            src="/assets/icons/myConsultationsIcon.png"
                            alt="Consultation"
                            width={20}
                            height={20}
                        />
                        <h2 className={styles.title}>Health History</h2>
                    </div>
                    <Button
                        icon="/assets/icons/editIcon.png"
                        variant="primary"
                        onClick={handleEditHealthHistoryClick}
                    >
                        Edit Profile
                    </Button>
                </div>

                <div className={styles.historyContent}>

                    <div className={styles.historyItem}>
                        <h2 className={styles.categoryTitle}>Lifestyle Information</h2>
                        <p className={styles.details}>
                            Height: {lifestyleData?.Height}, Weight: {lifestyleData?.Weight}, BMI: {lifestyleData?.BMI}
                        </p>

                        <div className={styles.reportInfo}>
                            <span>1. {lifestyleData?.IsSmoke ? "Smoke" : "Does not smoke"}</span>
                            <div className={styles.timeInfo}>
                                <div className={styles.dateWrapper}>
                                    <Image src="/assets/icons/dateIcon.png" alt="Calendar" width={16} height={16} />
                                    {lifestyleData &&
                                        <span>{convertDateTime(lifestyleData?.CreatedOn).formattedDate}</span>
                                    }
                                </div>
                                <div className={styles.timeWrapper}>
                                    <Image src="/assets/icons/timeIcon.png" alt="Clock" width={16} height={16} />
                                    {lifestyleData &&
                                        <span>{convertDateTime(lifestyleData?.CreatedOn).formattedTime}</span>
                                    }
                                </div>
                            </div>
                        </div>

                    </div>


                    {/* {loading ? (
                        <div>Loading lifestyle data...</div>
                    ) : (
                        formatLifestyleSection(lifestyleData)
                    )} */}
                </div>
            </div>
        </div>
    );
};

export default HealthHistory; 
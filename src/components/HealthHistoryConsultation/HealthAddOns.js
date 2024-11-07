import styles from './HealthHistoryConsultation.module.css';
import Image from 'next/image';

const HealthAddOns = () => {
    return (
        <div className={styles.section}>
            <h2 className={styles.sectionTitle}>
                <Image 
                    src="/assets/icons/health.png" 
                    alt="Health" 
                    width={24} 
                    height={24} 
                />
                Health Add-ons
            </h2>
            <div className={styles.addOnsGrid}>
                <div className={styles.checkbox}>
                    <input type="checkbox" id="diabetes" />
                    <label htmlFor="diabetes">Diabetes</label>
                </div>
                <div className={styles.checkbox}>
                    <input type="checkbox" id="hypertension" />
                    <label htmlFor="hypertension">Hypertension</label>
                </div>
                <div className={styles.checkbox}>
                    <input type="checkbox" id="heartDisease" />
                    <label htmlFor="heartDisease">Heart Disease</label>
                </div>
                <div className={styles.checkbox}>
                    <input type="checkbox" id="thyroid" />
                    <label htmlFor="thyroid">Thyroid</label>
                </div>
                {/* Add more health conditions as needed */}
            </div>
        </div>
    );
};

export default HealthAddOns; 
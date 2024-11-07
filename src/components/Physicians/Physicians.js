import Image from 'next/image';
import styles from './Physicians.module.css';

const Physicians = () => {
    const physicians = [
        {
            id: 1,
            name: 'Dr. Julia Alvin',
            image: '/assets/images/person3.png',
            specialty: 'Health Specialist'
        },
        {
            id: 2,
            name: 'Dr. Clark',
            image: '/assets/images/person4.png',
            specialty: 'Health Specialist'
        }
    ];

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
                {physicians.map(physician => (
                    <div key={physician.id} className={styles.physicianItem}>
                        <div className={styles.physicianInfo}>
                            <Image
                                src={physician.image}
                                alt={physician.name}
                                width={48}
                                height={48}
                                className={styles.physicianImage}
                            />
                            <div className={styles.physicianDetails}>
                                <span className={styles.physicianName}>{physician.name}</span>
                                <span className={styles.specialty}>{physician.specialty}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Physicians; 
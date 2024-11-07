import Image from 'next/image';
import Button from '../Button/Button';
import styles from './Members.module.css';
import { useRouter } from 'next/router';

const Members = () => {
  const router = useRouter();

  const handleAddSpouseClick = () => {
    router.push('/add-spouse');
  };

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.titleWithIcon}>
          <Image 
            src="/assets/icons/membersIcon.png" 
            alt="Members" 
            width={20} 
            height={20}
          />
          <h2 className={styles.title}>Members</h2>
        </div>
        <Button 
          icon="/assets/icons/addIcon.png"
          onClick={handleAddSpouseClick}
        >
          Add Spouse
        </Button>
      </div>
      <div className={styles.membersList}>
        <div className={styles.memberItem}>
          <Image 
            src="/assets/images/person1.png" 
            alt="Jalin Smith" 
            width={48} 
            height={48} 
            className={styles.memberImage}
          />
          <div className={styles.memberInfo}>
            <span className={styles.memberName}>Jalin Smith</span>
          </div>
        </div>
        <div className={styles.memberItem}>
          <Image 
            src="/assets/images/person2.png" 
            alt="Gennifer" 
            width={48} 
            height={48} 
            className={styles.memberImage}
          />
          <div className={styles.memberInfo}>
            <span className={styles.memberName}>Gennifer</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Members; 
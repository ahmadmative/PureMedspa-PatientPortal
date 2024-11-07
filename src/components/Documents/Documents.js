import Image from 'next/image';
import Button from '../Button/Button';
import styles from './Documents.module.css';

const Documents = () => {
    return (
        <div className={styles.card}>
            <div className={styles.header}>
                <div className={styles.titleSection}>
                    <div className={styles.titleWithIcon}>
                        <Image
                            src="/assets/icons/documentsIcon.png"
                            alt="Documents"
                            width={20}
                            height={24}
                        />
                        <h2 className={styles.title}>Documents</h2>
                    </div>
                    <span className={styles.subtitle}>(uploaded by Admin)</span>
                </div>
                <Button
                    icon="/assets/icons/downloadIcon.png"
                    variant="primary"
                >
                    Download
                </Button>
            </div>
            <div className={styles.documentPreview}>
                <div className={styles.imageWrapper}>
                    <Image
                        src="/assets/images/docImage.png"
                        alt="Medical Document"
                        fill
                        style={{ objectFit: 'contain' }}
                        className={styles.previewImage}
                    />
                </div>
            </div>
        </div>
    );
};

export default Documents; 
import React from 'react';
import DashboardLayout from '../components/DashboardLayout/DashboardLayout';
import RequestConsultation from '../components/RequestConsultation/RequestConsultation';
import styles from '../styles/Consultation.module.css';

const Consultation = () => {
  return (
    <DashboardLayout>
      <div className={styles.mainContent}>
        <RequestConsultation />
      </div>
    </DashboardLayout>
  );
};

export default Consultation; 
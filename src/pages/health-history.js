import React from 'react';
import DashboardLayout from '../components/DashboardLayout/DashboardLayout';
import HealthHistoryConsultation from '../components/HealthHistoryConsultation/HealthHistoryConsultation';
import styles from '../styles/HealthHistory.module.css';

const HealthHistoryPage = () => {
  return (
    <DashboardLayout>
      <div className={styles.mainContent}>
          <HealthHistoryConsultation continueFalse={true} />
      </div>
    </DashboardLayout>
  );
};

export default HealthHistoryPage; 
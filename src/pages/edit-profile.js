import React from 'react';
import DashboardLayout from '../components/DashboardLayout/DashboardLayout';
import EditProfileComponent from '../components/EditProfile/EditProfileComponent';
import styles from '../styles/EditProfile.module.css';

const EditProfilePage = () => {
  return (
    <DashboardLayout>
      <div className={styles.mainContent}>
        <EditProfileComponent />
      </div>
    </DashboardLayout>
  );
};

export default EditProfilePage; 
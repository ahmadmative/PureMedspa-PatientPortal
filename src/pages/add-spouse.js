import React from 'react';
import DashboardLayout from '../components/DashboardLayout/DashboardLayout';
import AddSpouse from '../components/AddSpouse/AddSpouse';
import styles from '../styles/AddSpouse.module.css';

const AddSpousePage = () => {
  return (
    <DashboardLayout>
      <div className={styles.mainContent}>
        <AddSpouse />
      </div>
    </DashboardLayout>
  );
};

export default AddSpousePage; 
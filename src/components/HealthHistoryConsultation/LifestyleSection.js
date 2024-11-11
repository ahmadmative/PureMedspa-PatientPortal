import Input from '../Input';
import styles from './HealthHistoryConsultation.module.css';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { lifestyleService } from '../../api/services/lifestyle.service';
import { authService } from '../../api/services/auth.service';

const LifestyleSection = () => {
    const [weight, setWeight] = useState('');
    const [feet, setFeet] = useState('');
    const [inches, setInches] = useState('');
    const [bmi, setBmi] = useState('');
    const [smoke, setSmoke] = useState('');
    const [height, setHeight] = useState('');
    const [loading, setLoading] = useState(false);

    // Add useEffect to calculate BMI when weight, feet, or inches change
    useEffect(() => {
        if (weight && feet && inches) {
            const heightInInches = (parseInt(feet) * 12) + parseInt(inches);
            const weightInPounds = parseInt(weight);
            const calculatedBMI = ((weightInPounds / (heightInInches * heightInInches)) * 703).toFixed(1);
            setBmi(calculatedBMI);
        } else {
            setBmi('');
        }
    }, [weight, feet, inches]);

    // Add form validation function
    const isFormValid = () => {
        return weight && feet && inches && smoke;
    };

    const handleSave = async () => {
        try {
            setLoading(true);

            // Get PatientId from window.localStorage
            const user = authService.getCurrentUser();

            console.log('Patient ID:', user.patient_id);

            if (!user) {
                // throw new Error('Patient ID not found');
                alert('User not found');
            }
            else{
                const lifestyleData = {
                    PatientId: parseInt(user.patient_id),
                    Height: feet,
                    Weight: weight,
                    IsSmoke: smoke === 'yes' ? "1" : "0",
                    EncounterId: "0"
                };
    
                console.log(lifestyleData);
    
                await lifestyleService.saveLifestyle(lifestyleData);
                // Show success message or handle success case
                alert('Lifestyle data saved successfully');
    
            }

           
        } catch (error) {
            console.error('Error saving lifestyle data:', error);
            alert('Failed to save lifestyle data');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.section}>
            <h2 className={styles.sectionTitle}>
                <Image
                    src="/assets/icons/lifeStyle.png"
                    alt="Lifestyle"
                    width={13}
                    height={24}
                />
                Life Style
            </h2>
            <div className={styles.formContainer}>
                <div className={styles.inputGroup}>
                    <Input
                        type="number"
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                        className={styles.input}
                        placeholder="What is the patient weight (lbs)?"
                    />
                </div>

                <div className={styles.inputGroup}>
                    <label>What is the patient Height?</label>
                    <div className={styles.heightInputs}>
                        <select
                            value={feet}
                            onChange={(e) => setFeet(e.target.value)}
                            className={styles.select}
                        >
                            <option value="">Select Feet</option>
                            <option value="5">5</option>
                            <option value="6">6</option>
                            <option value="7">7</option>
                            <option value="8">8</option>
                            <option value="9">9</option>
                        </select>

                        <select
                            value={inches}
                            onChange={(e) => setInches(e.target.value)}
                            className={styles.select}
                        >
                            <option value="">Select Inches</option>
                            <option value="0">0</option>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                            <option value="6">6</option>
                            <option value="7">7</option>
                            <option value="8">8</option>
                            <option value="9">9</option>
                        </select>
                    </div>
                </div>

                <div className={styles.inputGroup}>
                    <div className={styles.heightInputs}>
                        <Input
                            type="number"
                            value={bmi}
                            className={styles.input}
                            placeholder="BMI"
                            disabled={true}  // Make BMI input read-only
                        />
                        <div className={styles.smokeBox}>
                            <label>Do the patient smoke or use tobacco?</label>
                            <div className={styles.radioGroup}>
                                <label className={styles.radioText}>
                                    <input
                                        type="radio"
                                        name="smoke"
                                        value="yes"
                                        checked={smoke === 'yes'}
                                        onChange={(e) => setSmoke(e.target.value)}
                                    />
                                    Yes
                                </label>
                                <label className={styles.radioText}>
                                    <input
                                        type="radio"
                                        name="smoke"
                                        value="no"
                                        checked={smoke === 'no'}
                                        onChange={(e) => setSmoke(e.target.value)}
                                    />
                                    No
                                </label>
                            </div>
                        </div>
                    </div>
                </div>


            </div>

            <button
                className={styles.saveButton}
                onClick={handleSave}
                disabled={loading || !isFormValid()}  // Add form validation check
            >
                {loading ? 'Saving...' : 'Save'}
            </button>
        </div>
    );
};

export default LifestyleSection; 
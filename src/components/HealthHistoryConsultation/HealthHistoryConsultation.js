import styles from './HealthHistoryConsultation.module.css';
import LifestyleSection from './LifestyleSection';
import Button from '../Button/Button';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { medicationService } from '../../api/services/medication.service';
import SearchableDropdown from '../SearchableDropdown/SearchableDropdown';
import DosageDropdown from '../DosageDropdown/DosageDropdown';
import { authService } from '../../api/services/auth.service';
import { allergyService } from '@components/api/services/allergy.service';


const HealthHistoryConsultation = ({ currentMedications, onComplete }) => {
    const [showMedicationForm, setShowMedicationForm] = useState(false);
    const [showAllergyForm, setShowAllergyForm] = useState(false);
    const [showPastMedicalHistoryForm, setShowPastMedicalHistoryForm] = useState(false);
    const [showPrimaryCarePhysicianForm, setShowPrimaryCarePhysicianForm] = useState(false);
    const [medicationData, setMedicationData] = useState({
        drug: '',
        dosage: '',
        direction: ''
    });
    const [primaryCarePhysicianData, setPrimaryCarePhysicianData] = useState({
        name: '',
        phone: '',
        email: '',
        fax: '',
        zip: '',
        city: '',
        state: '',
        address1: '',
        address2: ''
    });
    const [medicalCondition, setMedicalCondition] = useState('');
    const [noKnownAllergies, setNoKnownAllergies] = useState(false);
    const [loadingCurrentMedication, setloadingCurrentMedication] = useState(false);
    const [loadingAllergy, setLoadingAllergy] = useState(false);
    const [selectedMedication, setSelectedMedication] = useState(null);
    const [selectedAllergy, setSelectedAllergy] = useState('');
    const [otherAllergyId, setOtherAllergyId] = useState('');
    const [showOtherAllergySearch, setShowOtherAllergySearch] = useState(false);
    const [allergySearchText, setAllergySearchText] = useState('');
    const [medications, setMedications] = useState([]);
    const [loadingMedications, setLoadingMedications] = useState(false);
    const [allergies, setAllergies] = useState([]);
    const [loadingAllergies, setLoadingAllergies] = useState(false);

    const [renderMedications, setRenderMedications] = useState(false);
    const [renderAllergies, setRenderAllergies] = useState(false);

    useEffect(() => {
        const delayMedications = setTimeout(() => setRenderMedications(true), 500); // 500ms delay
        const delayAllergies = setTimeout(() => setRenderAllergies(true), 1000); // 1000ms delay
      
        return () => {
          clearTimeout(delayMedications);
          clearTimeout(delayAllergies);
        };
    }, []);

    useEffect(() => {
        renderMedications && fetchMedications();
        renderAllergies && fetchAllergies();
    }, [renderMedications, renderAllergies]);

    const fetchMedications = async () => {
        try {
            console.log("fetchMedications");
            setLoadingMedications(true);
            const user = authService.getCurrentUser();
            if (!user) {
                throw new Error('User not found');
            }

            const medicationsData = await medicationService.getCurrentMedications(user.patient_id);
            setMedications(medicationsData);
        } catch (error) {
            console.error('Error fetching medications:', error);
        } finally {
            setLoadingMedications(false);
        }
    };

    const fetchAllergies = async () => {
        try {
            console.log("fetchAllergies");
            setLoadingAllergy(true);
            const user = authService.getCurrentUser();
            if (!user) {
                throw new Error('User not found');
            }

            const allergiesData = await allergyService.getCurrentAllergies(user.patient_id);
            setAllergies(allergiesData);
        } catch (error) {
            console.error('Error fetching allergies:', error);
        } finally {
            setLoadingAllergy(false);
        }
    };

    const commonAllergies = [
        { id: 'sulfa', label: 'Sulfa (Sulfamethoxazole/Trimethoprim, Bactrim, Septra)' },
        { id: 'penicillin', label: 'Penicillin' },
        { id: 'tetracycline', label: 'Tetracycline' },
        { id: 'erythromycin', label: 'Erythromycin' },
        { id: 'cipro', label: 'Cipro (Ciprofloxacin)' },
        { id: 'levaquin', label: 'Levaquin (Levofloxacin)' },
        { id: 'zithromax', label: 'Zithromax' },
        { id: 'other', label: 'Other' }
    ];

    const handleMedicationChange = (field, value) => {
        setMedicationData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handlePrimaryCarePhysicianData = (field, value) => {
        setPrimaryCarePhysicianData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const isMedicationFormValid = () => {
        return medicationData.drug &&
            medicationData.dosage &&
            medicationData.direction;
    };

    const isAllergyFormValid = () => {
        if (selectedAllergy === 'other') {
            return otherAllergyId && allergySearchText;
        }
        return selectedAllergy !== '';
    };

    const handleSaveCurrentMedication = async () => {
        try {
            setloadingCurrentMedication(true);
            const user = authService.getCurrentUser();

            if (!user) {
                throw new Error('Patient ID not found');
            }

            const medicationPayload = {
                MedicationId: 0,
                PatientId: parseInt(user.patient_id),
                Direction: medicationData.direction,
                Drug: medicationData.drug,
                Dosage: medicationData.dosage,
                CreatedBy: parseInt(user.patient_id),
                ModifiedBy: parseInt(user.patient_id)
            };

            await medicationService.saveCurrentMedication(medicationPayload);

            // Clear form and collapse section after successful save
            setMedicationData({
                drug: '',
                dosage: '',
                direction: ''
            });
            setSelectedMedication(null);
            setShowMedicationForm(false);
            alert('Medication saved successfully');

            fetchMedications();

        } catch (error) {
            console.error('Error saving medication:', error);
            alert('Failed to save medication');
        } finally {
            setloadingCurrentMedication(false);
        }
    };

    const formatDate = (date) => {
        return date.toISOString().split('T')[0];
    };

    const [loadingSaveAllergy, setLoadingSaveAllergy] = useState(false);

    const handleSaveAllergy = async () => {
        try {
            if (!selectedAllergy) {
                alert('Please select an allergy');
                return;
            }

            setLoadingSaveAllergy(true);
            const user = authService.getCurrentUser();

            if (!user) {
                throw new Error('Patient ID not found');
            }

            const currentDate = formatDate(new Date());

            let allergyName, allergyCode;

            if (selectedAllergy === 'other') {
                // For "Other" allergies, use the selected allergy from search
                if (!otherAllergyId) {
                    alert('Please select an allergy from the search');
                    return;
                }
                allergyName = allergySearchText;
                allergyCode = otherAllergyId;
            } else {
                // For common allergies, use the selected allergy from the list
                const selectedAllergyData = commonAllergies.find(a => a.id === selectedAllergy);
                allergyName = selectedAllergyData.label;
                allergyCode = selectedAllergyData.id;
            }

            const allergyPayload = {
                AllergyId: 0,
                PatientId: parseInt(user.patient_id),
                Name: allergyName,
                Code: allergyCode,
                StartDate: currentDate,
                EndDate: currentDate,
                CreatedBy: parseInt(user.patient_id),
                ModifiedBy: parseInt(user.patient_id)
            };

            console.log('allergyPayload:', allergyPayload);

            await allergyService.addAllergy(allergyPayload);

            // Clear form and collapse section after successful save
            setSelectedAllergy('');
            setOtherAllergyId('');
            setAllergySearchText('');
            setShowOtherAllergySearch(false);
            setShowAllergyForm(false);
            alert('Allergy saved successfully');

            fetchAllergies();

        } catch (error) {
            console.error('Error saving allergy:', error);
            alert('Failed to save allergy');
        } finally {
            setLoadingSaveAllergy(false);
        }
    };

    const handleMedicationSelect = (medication) => {
        setSelectedMedication(medication);
        handleMedicationChange('drug', medication.text);
        // Reset dosage when new medication is selected
        handleMedicationChange('dosage', '');
    };

    const handleAllergySelect = (allergyId) => {
        setSelectedAllergy(allergyId);
        setShowOtherAllergySearch(allergyId === 'other');
        if (allergyId !== 'other') {
            setOtherAllergyId('');
        }
    };

    const handleOtherAllergySelect = (allergy) => {
        setOtherAllergyId(allergy.id);
        setAllergySearchText(allergy.text);
        setSelectedAllergy('other');
    };

    const handleComplete = () => {
        // Add any validation if needed
        onComplete();
    };

    const handleDeleteMedication = async (medication) => {
        try {
            const user = authService.getCurrentUser();
            if (!user) {
                throw new Error('User not found');
            }

            const deletePayload = {
                MedicationId: medication.Id,
                PatientId: parseInt(user.patient_id),
                Direction: medication.Drug.MedicationName,
                Drug: medication.Drug.MedicationName,
                Dosage: medication.Drug.Strength,
                CreatedBy: parseInt(user.patient_id),
                ModifiedBy: parseInt(user.patient_id)
            };

            const deleted = await medicationService.deleteCurrentMedication(deletePayload);
            console.log('deleted:', deleted);

            // Update medications list after successful deletion
            setMedications(prevMeds => prevMeds.filter(med => med.Id !== medication.Id));

        } catch (error) {
            console.error('Error deleting medication:', error);
            alert('Failed to delete medication');
        }
    };

    const handleDeleteAllergy = async (allergy) => {
        console.log('allergy:', allergy);
        try {
            const user = authService.getCurrentUser();
            if (!user) {
                throw new Error('User not found');
            }

            const deletePayload = {
                AllergyId: allergy.AllergyId,
                PatientId: allergy.PatientId,
                ModifiedBy: allergy.ModifiedBy
            };

            console.log('deletePayload:', deletePayload);

            const deleted = await allergyService.deleteAllergy(deletePayload);
            console.log('deleted:', deleted);

            // setAllergies(prevAllergies => prevAllergies.filter(allergy => allergy.Id !== allergy.Id));

            fetchAllergies();
        } catch (error) {
            console.error('Error deleting allergy:', error);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.sections}>
                <LifestyleSection />
                <div className={styles.addhistoryData}>
                    <div className={styles.headerRow}>
                        <div className={styles.sectionHeader}>
                            <Image src="/assets/icons/pharmacyIcon.png" alt="medication" width={24} height={24} />
                            <h3>Current Medication</h3>
                        </div>
                        <Button
                            icon="/assets/icons/addIcon.png"
                            onClick={() => setShowMedicationForm(true)}
                        >
                            Add
                        </Button>
                    </div>
                    {!showMedicationForm && (
                        <div className={styles.medicationList}>
                            {loadingMedications ? (
                                <p className={styles.loadingText}>Loading medications...</p>
                            ) : medications.length > 0 ? (
                                medications.map((med) => (
                                    <div key={med.Id} className={styles.medicationItem}>
                                        <span>{med.Drug.MedicationName} - {med.Drug.Strength}</span>
                                        <button
                                            className={styles.deleteButton}
                                            onClick={() => handleDeleteMedication(med)}
                                        >
                                            <Image
                                                src="/assets/icons/delete-blue.png"
                                                alt="Delete"
                                                width={20}
                                                height={20}
                                            />
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <p className={styles.noMedicationsText}>No medications found</p>
                            )}
                        </div>
                    )}
                    {showMedicationForm && (
                        <div className={styles.medicationForm}>
                            <div className={styles.formRow}>
                                <SearchableDropdown
                                    value={medicationData.drug}
                                    onChange={(value) => handleMedicationChange('drug', value)}
                                    onMedicationSelect={handleMedicationSelect}
                                    placeholder="Search medication..."
                                />

                                <DosageDropdown
                                    strengths={selectedMedication?.Strengths || []}
                                    value={medicationData.dosage}
                                    onChange={(value) => handleMedicationChange('dosage', value)}
                                    disabled={!selectedMedication}
                                />
                            </div>
                            <input
                                type="text"
                                value={medicationData.direction}
                                onChange={(e) => handleMedicationChange('direction', e.target.value)}
                                placeholder="Direction (Exactly as written on patient's current medication)"
                                className={styles.input}
                            />
                            <div style={{ height: '10px' }} />
                            <button
                                className={styles.saveButton}
                                onClick={handleSaveCurrentMedication}
                                disabled={loadingCurrentMedication || !isMedicationFormValid()}
                            >
                                {loadingCurrentMedication ? 'Saving...' : 'Save'}
                            </button>
                        </div>
                    )}
                </div>
                <div className={styles.addhistoryData}>
                    <div className={styles.headerRow}>
                        <div className={styles.sectionHeader}>
                            <Image src="/assets/icons/documentsIcon.png" alt="medication" width={24} height={30} />
                            <h3>Allergy</h3>
                        </div>

                        <Button
                            icon="/assets/icons/addIcon.png"
                            onClick={() => setShowAllergyForm(true)}
                        >
                            Add
                        </Button>
                    </div>
                    {!showAllergyForm && (
                        <div className={styles.medicationForm}>
                            <div className={styles.medicationList}>
                                {loadingAllergies ? (
                                    <p className={styles.loadingText}>Loading allergies...</p>
                                ) : allergies.length > 0 ? (
                                    allergies.map((allergy) => (
                                        <div key={allergy.Id} className={styles.medicationItem}>
                                            <span>{allergy.Name}</span>
                                            <button
                                                className={styles.deleteButton}
                                                onClick={() => handleDeleteAllergy(allergy)}
                                            >
                                                <Image
                                                    src="/assets/icons/delete-blue.png"
                                                    alt="Delete"
                                                    width={20}
                                                    height={20}
                                                />
                                            </button>
                                        </div>
                                    ))
                                ) : (
                                    <div className={styles.checkboxContainer}>
                                        <input
                                            type="checkbox"
                                            id="noKnownAllergies"
                                            checked={noKnownAllergies}
                                            onChange={(e) => setNoKnownAllergies(e.target.checked)}
                                            className={styles.checkbox}
                                        />
                                        <label htmlFor="noKnownAllergies">No Known Allergies</label>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                    {showAllergyForm && (
                        <div className={styles.medicationForm}>
                            <h3>Common Allergies</h3>
                            <div className={styles.allergyOptions}>
                                {commonAllergies.map((allergy) => (
                                    <label key={allergy.id} className={styles.allergyLabel}>
                                        <input
                                            type="checkbox"
                                            checked={selectedAllergy === allergy.id}
                                            onChange={() => handleAllergySelect(allergy.id)}
                                            className={styles.allergyCheckbox}
                                        />
                                        <span className={styles.allergyText}>{allergy.label}</span>
                                    </label>
                                ))}
                            </div>

                            {showOtherAllergySearch && (
                                <div className={styles.otherAllergySearch}>
                                    <SearchableDropdown
                                        value={allergySearchText}
                                        onChange={(value) => setAllergySearchText(value)}
                                        onMedicationSelect={handleOtherAllergySelect}
                                        placeholder="Search for other allergies..."
                                        apiEndpoint="allergy"
                                    />
                                </div>
                            )}
                            <div className={styles.formActions}>
                                <Button
                                    onClick={handleSaveAllergy}
                                    disabled={loadingSaveAllergy || !isAllergyFormValid()}
                                    className={styles.saveButton}
                                >
                                    {loadingSaveAllergy ? 'Saving...' : 'Save Allergy'}
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
                {/* <div className={styles.addhistoryData}>
                    <div className={styles.headerRow}>
                        <div className={styles.sectionHeader}>
                            <Image src="/assets/icons/requestConsultationIconBlue.png" alt="medication" width={24} height={27} />
                            <h3>Past Medical History</h3>
                        </div>
                        <Button
                            icon="/assets/icons/addIcon.png"
                            onClick={() => setShowPastMedicalHistoryForm(true)}
                        >
                            Add
                        </Button>
                    </div>
                    {showPastMedicalHistoryForm && (
                        <div className={styles.medicationForm}>
                            <input
                                type="text"
                                value={medicalCondition}
                                onChange={(e) => setMedicalCondition(e.target.value)}
                                placeholder="Medical Condition)"
                                className={styles.input}
                            />
                        </div>
                    )}
                </div> */}
                {/* <div className={styles.addhistoryData}>
                    <div className={styles.headerRow}>
                        <div className={styles.sectionHeader}>
                            <Image src="/assets/icons/doctorIcon.png" alt="medication" width={24} height={27} />
                            <h3>Primary Care Physician</h3>
                        </div>
                        <Button
                            icon="/assets/icons/addIcon.png"
                            onClick={() => setShowPrimaryCarePhysicianForm(true)}
                        >
                            Add
                        </Button>
                    </div>
                    {showPrimaryCarePhysicianForm && (
                        <div className={styles.medicationForm}>
                            <input
                                type="text"
                                value={primaryCarePhysicianData.name}
                                onChange={(e) => handlePrimaryCarePhysicianData('name', e.target.value)}
                                placeholder="Name of the physician"
                                className={styles.input}
                            />
                            <div style={{ height: '15px' }} />
                            <div className={styles.formRow}>
                                <input
                                    type="text"
                                    value={primaryCarePhysicianData.phone}
                                    onChange={(e) => handlePrimaryCarePhysicianData('phone', e.target.value)}
                                    placeholder="Phone Number"
                                    className={styles.input}
                                />

                                <input
                                    type="text"
                                    value={primaryCarePhysicianData.email}
                                    onChange={(e) => handlePrimaryCarePhysicianData('email', e.target.value)}
                                    placeholder="Email"
                                    className={styles.input}
                                />
                            </div>
                            <div className={styles.formRow}>
                                <input
                                    type="text"
                                    value={primaryCarePhysicianData.fax}
                                    onChange={(e) => handlePrimaryCarePhysicianData('fax', e.target.value)}
                                    placeholder="Fax"
                                    className={styles.input}
                                />

                                <input
                                    type="text"
                                    value={primaryCarePhysicianData.zip}
                                    onChange={(e) => handlePrimaryCarePhysicianData('zip', e.target.value)}
                                    placeholder="Zip Code"
                                    className={styles.input}
                                />
                            </div>
                            <div className={styles.formRow}>
                                <select
                                    value={primaryCarePhysicianData.city}
                                    onChange={(e) => handlePrimaryCarePhysicianData('city', e.target.value)}
                                    className={styles.select}
                                >
                                    <option value="">City</option>
                                </select>

                                <select
                                    value={primaryCarePhysicianData.state}
                                    onChange={(e) => handlePrimaryCarePhysicianData('state', e.target.value)}
                                    className={styles.select}
                                >
                                    <option value="">State</option>
                                </select>
                            </div>
                            <div className={styles.formRow}>
                                <input
                                    type="text"
                                    value={primaryCarePhysicianData.address1}
                                    onChange={(e) => handlePrimaryCarePhysicianData('address1', e.target.value)}
                                    placeholder="Address 1"
                                    className={styles.input}
                                />

                                <input
                                    type="text"
                                    value={primaryCarePhysicianData.email}
                                    onChange={(e) => handlePrimaryCarePhysicianData('address2', e.target.value)}
                                    placeholder="Address 2"
                                    className={styles.input}
                                />
                            </div>

                        </div>
                    )}
                </div> */}

            </div>
            <div className={styles.navigationButtons}>
                <Button onClick={handleComplete} className={styles.saveButton} width="15%">Continue</Button>
            </div>
            {/* <div className={styles.footer}>
                <button
                    className={styles.continueButton}
                    onClick={handleComplete}
                >
                    Continue
                </button>
            </div> */}
        </div>
    );
};

export default HealthHistoryConsultation; 
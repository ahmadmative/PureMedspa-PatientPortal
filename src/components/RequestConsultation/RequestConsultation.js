import { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from './RequestConsultation.module.css';
import HealthHistoryConsultation from '../HealthHistoryConsultation/HealthHistoryConsultation';
import { conditionsService } from '../../api/services/conditions.service';
import { symptomsService } from '../../api/services/symptoms.service';
import { medicationService } from '../../api/services/medication.service';
import { encounterService } from '../../api/services/encounter.service';
import { pharmacyService } from '../../api/services/pharmacy.service';
import { authService } from '../../api/services/auth.service';

function RequestConsultation() {
  const [currentStep, setCurrentStep] = useState('conditions'); // 'conditions', 'symptoms', or 'upload'
  const [user, setUser] = useState(null);
  const [selectedCondition, setSelectedCondition] = useState('');
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [showHealthHistory, setShowHealthHistory] = useState(false);

  const [generalCareOptions, setGeneralCareOptions] = useState([]);
  const [specialSituationsOptions, setSpecialSituationsOptions] = useState([]);

  const [symptoms, setSymptoms] = useState([]);

  const [currentMedications, setCurrentMedications] = useState([]);
  const [loadingMedications, setLoadingMedications] = useState(false);

  const [showPharmacy, setShowPharmacy] = useState(false);

  const [showPayment, setShowPayment] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [requestMedicalNote, setRequestMedicalNote] = useState(false);

  const [submitting, setSubmitting] = useState(false);

  const [preferredPharmacy, setPreferredPharmacy] = useState(null);
  const [loadingPharmacy, setLoadingPharmacy] = useState(true);

  const [pharmacies, setPharmacies] = useState([]);
  const [selectedPharmacy, setSelectedPharmacy] = useState(null);

  const [searchParams, setSearchParams] = useState({
    name: '',
    city: '',
    state: '',
    zipcode: '',
    distance: ''
  });

  const stateOptions = [
    'Alaska', 'California', 'Colorado', 'Connecticut', 'Georgia',
    'Hawaii', 'Illinois', 'Indiana', 'Michigan', 'New Jersey',
    'New York', 'North Carolina', 'Tennessee'
  ];

  const distanceOptions = [
    { label: '5 miles', value: '5' },
    { label: '10 miles', value: '10' },
    { label: '15 miles', value: '15' },
    { label: '25 miles', value: '25' }
  ];

  const [showPharmacySearch, setShowPharmacySearch] = useState(true);

  const formatPhoneNumber = (value) => {
    // Remove all non-digits
    let phoneNumber = value.replace(/\D/g, '');
    
    // Limit to 10 digits
    phoneNumber = phoneNumber.substring(0, 10);
    
    // Format as (XXX) XXX-XXXX
    if (phoneNumber.length === 0) {
        return '';
    } else if (phoneNumber.length <= 3) {
        return `(${phoneNumber}`;
    } else if (phoneNumber.length <= 6) {
        return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
    } else {
        return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
    }
};

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'phoneNumber') {
        const formattedNumber = formatPhoneNumber(value);
        setPhoneNumber(formattedNumber);
    } else {
        setSearchParams(prev => ({
            ...prev,
            [name]: value
        }));
    }
  };

  const getPreferredPharmacy = async () => {
    const user = authService.getCurrentUser();
    const data = await pharmacyService.getPreferredPharmacy(parseInt(user.patient_id));
    setPreferredPharmacy(data);
    setPharmacies(data || []);
    console.log("preferredPharmacy in RequestConsultation.js", data);
  };

  const handleSearch = async (e) => {
    const user = authService.getCurrentUser();
    e.preventDefault();
    try {
      setLoadingPharmacy(true);
      const params = {
        ...searchParams,
        type: '1',
        patientId: parseInt(user.patient_id), 
        distance: searchParams.distance || '1'
      };

      const data = await pharmacyService.searchPharmacy(params);
      setPharmacies(data || []);
      
      if (data && data.length > 0) {
        setSelectedPharmacy(data[0]);
      }
    } catch (error) {
      console.error('Error searching pharmacies:', error);
    } finally {
      setLoadingPharmacy(false);
    }
  };

  useEffect(() => {
    const fetchConditions = async () => {
      try {
        const data = await conditionsService.getConditions();
        
        // Split data into general care (A) and special situations (S)
        const generalCare = data
          .filter(item => item.Type === 'A' || item.Type === 'Q' || item.Type === 'R')
          .map(item => ({
            id: item.ID.toString(),
            label: item.Title,
            learnMore: Boolean(item.PublicText),
            description: item.Description,
            condition: item.Condition,
            publicText: item.PublicText
          }));

        const specialSituations = data
          .filter(item => item.Type === 'S')
          .map(item => ({
            id: item.ID.toString(),
            label: item.Title,
            learnMore: Boolean(item.PublicText),
            description: item.Description,
            condition: item.Condition,
            publicText: item.PublicText
          }));

        setGeneralCareOptions(generalCare);
        setSpecialSituationsOptions(specialSituations);
      } catch (error) {
        console.error('Error fetching conditions:', error);
      }
    };

    const user = authService.getCurrentUser();
    setUser(user);

    fetchConditions();
  }, []);

  useEffect(() => {
    const fetchSymptoms = async () => {
      if (selectedCondition) {
        try {
          const data = await symptomsService.getSymptoms(selectedCondition);
          const formattedSymptoms = data.map(symptom => ({
            id: symptom.ID.toString(),
            label: symptom.Name
          }));
          setSymptoms(formattedSymptoms);
        } catch (error) {
          console.error('Error fetching symptoms:', error);
        }
      }
    };

    fetchSymptoms();
  }, [selectedCondition]);

  // useEffect(() => {
  //   const fetchCurrentMedications = async () => {
  //     try {
  //       setLoadingMedications(true);
  //       const user = authService.getCurrentUser();
        
  //       if (!user) {
  //         console.error('Patient ID not found');
  //         return;
  //       }

  //       const data = await medicationService.getCurrentMedications(parseInt(user.patient_id));
  //       setCurrentMedications(data);
  //     } catch (error) {
  //       console.error('Error fetching current medications:', error);
  //     } finally {
  //       setLoadingMedications(false);
  //     }
  //   };

  //   fetchCurrentMedications();
  // }, []);

  // useEffect(() => {
  //   const user = authService.getCurrentUser();
  //   const fetchPharmacies = async () => {
  //     try {
  //       setLoadingPharmacy(true);
  //       const params = {
  //         name: '',
  //         city: '',
  //         state: 'CA',
  //         zipcode: '',
  //         distance: '1',
  //         type: '1',
  //         patientId: parseInt(user.patient_id)
  //       };

  //       const data = await pharmacyService.searchPharmacy(params);
  //       setPharmacies(data || []);
        
  //       // Set the first pharmacy as selected by default
  //       if (data && data.length > 0) {
  //         setSelectedPharmacy(data[0]);
  //       }
  //     } catch (error) {
  //       console.error('Error fetching pharmacies:', error);
  //     } finally {
  //       setLoadingPharmacy(false);
  //     }
  //   };

  //   fetchPharmacies();
  // }, []);

  const handleConditionSelect = (event) => {
    setSelectedCondition(event.target.value);
  };

  const handleSymptomToggle = (symptomId) => {
    setSelectedSymptoms(prev => {
      if (prev.includes(symptomId)) {
        return prev.filter(id => id !== symptomId);
      }
      return [...prev, symptomId];
    });
  };

  const handleContinue = () => {
    if (currentStep === 'conditions' && selectedCondition) {
      setCurrentStep('symptoms');
    } else if (currentStep === 'symptoms' && selectedSymptoms.length > 0) {
      setCurrentStep('upload');
    }
  };

  const handleCancel = () => {
    if (currentStep === 'upload') {
      setCurrentStep('symptoms');
    } else if (currentStep === 'symptoms') {
      setCurrentStep('conditions');
      setSelectedSymptoms([]);
    } else {
      setCurrentStep('conditions');
      setSelectedCondition('');
      setSelectedSymptoms([]);
    }
  };

  const handleUploadContinue = () => {
    setShowHealthHistory(true);
  };

  const handleHealthHistoryComplete = () => {
    setShowHealthHistory(false);
    setShowPharmacy(true);
    // getPreferredPharmacy();
  };

  const [savingPharmacy, setSavingPharmacy] = useState(false);

  const handlePharmacyContinue = async () => {
    const user = authService.getCurrentUser();
    if (!selectedPharmacy) {
        return;
    }

    try {
        setSavingPharmacy(true);
        
        await pharmacyService.addPreferredPharmacy(
            parseInt(user.patient_id), 
            selectedPharmacy.Code
        );

        // Continue to next step
        setShowPharmacy(false);
        setShowPayment(true);
    } catch (error) {
        console.error('Error saving preferred pharmacy:', error);
        alert('Failed to save preferred pharmacy. Please try again.');
    } finally {
        setSavingPharmacy(false);
    }
  };

  const handlePaymentSubmit = async () => {
    // Add phone validation
    const phoneDigits = phoneNumber.replace(/\D/g, '');
    if (phoneDigits.length !== 10) {
      alert('Please enter a valid 10-digit phone number');
      return;
    }

    const user = authService.getCurrentUser();
    try {
      if (!phoneNumber) {
        alert('Please enter your phone number');
        return;
      }

      setSubmitting(true);

      if (!user) {
        throw new Error('Patient ID not found');
      }

      // Format symptom IDs as comma-separated string
      const symptomIdsString = selectedSymptoms.join(',');

      const encounterData = {
        // PatientId: parseInt(patientId),
        PatientId: parseInt(user.patient_id),
        ReasonId: selectedCondition,
        SymptomIds: symptomIdsString,
        CreatedBy: parseInt(user.patient_id)
      };

      await encounterService.createEncounter(encounterData);

      // Clear all states and show success message
      setSelectedCondition('');
      setSelectedSymptoms([]);
      setShowPayment(false);
      setPhoneNumber('');
      setRequestMedicalNote(false);
      setCurrentStep('conditions');
      
      // You can redirect to a success page or show a success message
      alert('Consultation request submitted successfully');

    } catch (error) {
      console.error('Error submitting consultation:', error);
      alert('Failed to submit consultation request. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handlePharmacySelect = (pharmacy) => {
    setSelectedPharmacy(pharmacy);
    setShowPharmacySearch(false);
  };

  const handleChangePharmacy = () => {
    setShowPharmacySearch(true);
  };

  const renderContent = () => {
    if (showPayment) {
      return (
        <div className={styles.fullWidthColumn}>
          <div className={styles.uploadSection}>
            {/* <div className={styles.doctorAlert}>
              This consultation is assigned to Dr. Narendra Garg
            </div> */}

            <div className={styles.paymentContent}>
              <div className={styles.pharmacySection}>
                <div className={styles.sectionIcon}>
                  <Image 
                    src="/assets/icons/pharmacyIcon.png" 
                    alt="Pharmacy" 
                    width={24} 
                    height={24} 
                  />
                </div>
                <div>
                  <h3>Preferred Pharmacy</h3>
                  <h2>{selectedPharmacy.Name} #{selectedPharmacy.Code}</h2>
                  <a href={`tel:${selectedPharmacy.PhoneNo}`} className={styles.pharmacyPhone}>
                    {selectedPharmacy.PhoneNo.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3')}
                  </a>
                  <div style={{marginTop: '16px', display: 'flex', alignItems: 'center', gap: '8px'}}>
                    <Image 
                      src="/assets/icons/locationIcon.png" 
                      alt="Location" 
                      width={17} 
                      height={28} 
                    />
                    <span style={{color: '#000'}}>
                      {[
                        selectedPharmacy.Address1,
                        selectedPharmacy.Address2,
                        selectedPharmacy.City,
                        selectedPharmacy.State,
                        selectedPharmacy.Zipcode
                      ].filter(Boolean).join(', ')}
                    </span>
                  </div>
                </div>
              </div>

              <div className={styles.consultationType}>
                <div className={styles.typeIcon}>
                  <Image 
                    src="/assets/icons/routineConsultation.png" 
                    alt="Routine" 
                    width={24} 
                    height={24} 
                  />
                </div>
                <div>
                  <h3 style={{color: '#000'}}>Routine Consultation</h3>
                  <p style={{color: 'grey'}}>(Physician will contact you on a recorded line.)</p>
                </div>
              </div>

              <p className={styles.turnAroundNote}>
                Please note, usual turn around time is less than 1 hour except late night and early mornings.
              </p>

              <div className={styles.phoneSection}>
                <h3 style={{color: '#000'}}>Phone Number</h3>
                <div className={styles.phoneAlert}>
                  Physician will call you from 855-613-0942 on a recorded line.
                  <br />
                  Please UNBLOCK your phone for unknown or anonymous numbers.
                </div>
                <input
                  type="tel"
                  placeholder="(XXX) XXX-XXXX"
                  value={phoneNumber}
                  onChange={(e) => {
                    const formattedNumber = formatPhoneNumber(e.target.value);
                    setPhoneNumber(formattedNumber);
                  }}
                  className={styles.phoneInput}
                />
              </div>

              <label className={styles.medicalNoteCheckbox}>
                <input
                  type="checkbox"
                  checked={requestMedicalNote}
                  onChange={(e) => setRequestMedicalNote(e.target.checked)}
                />
                <span>Request for Medical Note</span>
              </label>

              <div className={styles.paymentButtons}>
                <button 
                  className={styles.cancelButton}
                  onClick={() => setShowPayment(false)}
                >
                  Cancel
                </button>
                <button 
                  className={styles.submitButton}
                  onClick={handlePaymentSubmit}
                  disabled={submitting}
                >
                  {submitting ? 'Submitting...' : 'Submit'}
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (showPharmacy) {
      return (
        <div className={styles.fullWidthColumn}>
          <div className={styles.uploadSection}>
            <div className={styles.pharmacyAlert}>
              On holidays and weekends you may want to confirm pharmacy hours
            </div>

            <div className={styles.pharmacyContent}>
              {showPharmacySearch ? (
                <>
                  <form onSubmit={handleSearch} className={styles.searchForm}>
                    <div className={styles.formRow}>
                      <div className={styles.formGroup}>
                        <label htmlFor="name">Pharmacy Name</label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={searchParams.name}
                          onChange={handleInputChange}
                          placeholder="Enter pharmacy name"
                          className={styles.input}
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <label htmlFor="zipcode">Zip Code</label>
                        <input
                          type="text"
                          id="zipcode"
                          name="zipcode"
                          value={searchParams.zipcode}
                          onChange={handleInputChange}
                          placeholder="Enter zip code"
                          className={styles.input}
                        />
                      </div>
                    </div>

                    <div className={styles.formRow}>
                      <div className={styles.formGroup}>
                        <label htmlFor="city">City</label>
                        <input
                          type="text"
                          id="city"
                          name="city"
                          value={searchParams.city}
                          onChange={handleInputChange}
                          placeholder="Enter city"
                          className={styles.input}
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <label htmlFor="state">State</label>
                        <select
                          id="state"
                          name="state"
                          value={searchParams.state}
                          onChange={handleInputChange}
                          className={styles.select}
                        >
                          <option value="">Select State</option>
                          {stateOptions.map(state => (
                            <option key={state} value={state}>
                              {state}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className={styles.formGroup}>
                        <label htmlFor="distance">Distance</label>
                        <select
                          id="distance"
                          name="distance"
                          value={searchParams.distance}
                          onChange={handleInputChange}
                          className={styles.select}
                        >
                          <option value="">Select Distance</option>
                          {distanceOptions.map(option => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <button type="submit" className={styles.searchButton}>
                      Search Pharmacies
                    </button>
                  </form>

                  {pharmacies.length > 0 ? (
                    <div className={styles.pharmacyList}>
                      {pharmacies.map((pharmacy) => (
                        <div 
                          key={pharmacy.Code} 
                          className={styles.pharmacyItem}
                          onClick={() => handlePharmacySelect(pharmacy)}
                        >
                          <div className={styles.pharmacyHeader}>
                            <h3 style={{color: '#000'}}>{pharmacy.Name}</h3>
                          </div>
                          
                          <a href={`tel:${pharmacy.PhoneNo}`} className={styles.pharmacyPhone}>
                            {pharmacy.PhoneNo.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3')}
                          </a>
                          
                          <div className={styles.pharmacyAddress}>
                            <Image 
                              src="/assets/icons/locationIcon.png" 
                              alt="Location" 
                              width={17} 
                              height={28} 
                            />
                            <span>
                              {[
                                pharmacy.Address1,
                                pharmacy.Address2,
                                pharmacy.City,
                                pharmacy.State,
                                pharmacy.Zipcode
                              ].filter(Boolean).join(', ')}
                            </span>
                          </div>
                          
                          {pharmacy.miles && (
                            <div className={styles.distance}>
                              {pharmacy.miles} miles away
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={{color: '#808080'}}>No pharmacies found</div>
                  )}
                </>
              ) : selectedPharmacy && (
                <div className={styles.selectedPharmacyContainer}>
                  <div className={styles.selectedPharmacyDetails}>
                    <h2>{selectedPharmacy.Name}</h2>
                    <a href={`tel:${selectedPharmacy.PhoneNo}`} className={styles.pharmacyPhone}>
                      {selectedPharmacy.PhoneNo.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3')}
                    </a>
                    
                    <div className={styles.pharmacyAddress}>
                      <Image 
                        src="/assets/icons/locationIcon.png" 
                        alt="Location" 
                        width={17} 
                        height={28} 
                      />
                      <span>
                        {[
                          selectedPharmacy.Address1,
                          selectedPharmacy.Address2,
                          selectedPharmacy.City,
                          selectedPharmacy.State,
                          selectedPharmacy.Zipcode
                        ].filter(Boolean).join(', ')}
                      </span>
                    </div>
                  </div>

                  <div className={styles.pharmacyButtons}>
                    <button 
                      className={styles.changePharmacyButton}
                      onClick={handleChangePharmacy}
                    >
                      Change Pharmacy
                    </button>
                    <button 
                      className={styles.continueButton}
                      onClick={handlePharmacyContinue}
                      disabled={savingPharmacy}
                    >
                      {savingPharmacy ? 'Saving...' : 'Continue with current pharmacy'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }

    if (showHealthHistory) {
      return <HealthHistoryConsultation 
        currentMedications={currentMedications} 
        onComplete={handleHealthHistoryComplete}
      />;
    }

    switch(currentStep) {
      case 'conditions':
        return (
          <div className={styles.conditionsColumns}>
            <div className={styles.column}>
              <h2>General Care</h2>
              <div className={styles.options}>
                {generalCareOptions.map((option) => (
                  <label key={option.id} className={styles.radioLabel}>
                    <input 
                      type="radio" 
                      name="condition" 
                      value={option.id}
                      checked={selectedCondition === option.id}
                      onChange={handleConditionSelect}
                    />
                    <span className={styles.radioText}>{option.label}</span>
                    {/* {option.learnMore && (
                      <span className={styles.learnMore}>Learn More »</span>
                    )} */}
                  </label>
                ))}
              </div>
            </div>

            <div className={styles.column}>
              <h2>Special Situations</h2>
              <div className={styles.options}>
                {specialSituationsOptions.map((option) => (
                  <label key={option.id} className={styles.radioLabel}>
                    <input 
                      type="radio" 
                      name="condition" 
                      value={option.id}
                      checked={selectedCondition === option.id}
                      onChange={handleConditionSelect}
                    />
                    <span className={styles.radioText}>{option.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        );
      
      case 'symptoms':
        return (
          <div className={styles.fullWidthColumn}>
            <h2>Please check all the symptoms that are applicable to patient:</h2>
            <div className={styles.options}>
              {symptoms.map((symptom) => (
                <label key={symptom.id} className={styles.radioLabel}>
                  <input
                    type="checkbox"
                    checked={selectedSymptoms.includes(symptom.id)}
                    onChange={() => handleSymptomToggle(symptom.id)}
                  />
                  <span className={styles.radioText}>{symptom.label}</span>
                </label>
              ))}
            </div>
            
            <h2 className={styles.additionalInfoTitle}>Additional Information</h2>
            <textarea 
              className={styles.textarea}
              placeholder="Enter any additional information here..."
            />
          </div>
        );
      
      case 'upload':
        return (
          <div className={styles.fullWidthColumn}>
            <div className={styles.uploadSection}>
              <div className={styles.emergencyAlert}>
                In case of emergency please call 911 or go to the emergency room
              </div>

              <div className={styles.uploadContent}>
                <h2>Upload Medical and laboratory Reports:</h2>
                <p>Please upload any relevant medical reports and lab results.</p>
                
                <div className={styles.uploadButtons}>
                  <button className={styles.uploadButton}>
                    <Image 
                      src="/assets/icons/uploadBlue.png" 
                      alt="Upload" 
                      width={20} 
                      height={20} 
                    />
                    Upload
                  </button>
                  <button 
                    className={styles.continueButton}
                    onClick={handleUploadContinue}
                  >
                    Continue
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.leftSection}>
          <Image 
            src={showPharmacy 
              ? "/assets/icons/pharmacyIcon.png" 
              : showHealthHistory 
                ? "/assets/icons/requestConsultationIconBlue.png" 
                : currentStep === 'upload' 
                  ? "/assets/icons/documentsIcon.png" 
                  : "/assets/icons/doctorIcon.png"} 
            alt="icon" 
            width={24} 
            height={currentStep === 'upload' ? 30 : 24} 
          />
          <div className={styles.headerText}>
            <h1>
              {showPharmacy 
                ? 'Pharmacy' 
                : showHealthHistory 
                  ? 'Health History' 
                  : currentStep === 'upload' 
                    ? 'Reports Upload'
                    : showPayment 
                      ? 'Payment Configuration'
                      : 'Conditions We Treat'
              }
            </h1>
            <p>
              {showPharmacy 
                ? 'Please confirm your pharmacy'
                : showHealthHistory 
                  ? 'Please provide your health information'
                  : currentStep === 'upload' 
                    ? 'Please upload any relevant medical reports and lab results.'
                    : showPayment 
                      ? 'Please confirm your payment information'
                      : 'Please select the condition that describes patient ailment the best'
              }
            </p>
          </div>
        </div>
        <div className={styles.rightSection}>
          <Image src="/assets/images/person1.png" alt="Profile" width={40} height={40} className={styles.profileImage} />
          <span>{user?.name}</span>
        </div>
      </div>

      <div className={styles.content}>
        {renderContent()}
      </div>

      {currentStep !== 'upload' && !showHealthHistory && (
        <div className={styles.footer}>
          <button className={styles.cancelButton} onClick={handleCancel}>
            Cancel
          </button>
          <button 
            className={styles.continueButton} 
            onClick={handleContinue}
            disabled={currentStep === 'conditions' && !selectedCondition}
          >
            Continue
          </button>
        </div>
      )}
    </div>
  );
};

export default RequestConsultation; 
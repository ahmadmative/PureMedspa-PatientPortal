import Image from 'next/image';
import styles from './AddSpouse.module.css';
import Input from '../Input';
import { useState } from 'react';
import { patientService } from '../../api/services/patient.service';
import axios from 'axios';

function AddSpouse() {
    const [relation, setRelation] = useState('');
    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [gender, setGender] = useState('');
    const [address1, setAddress1] = useState('');
    const [address2, setAddress2] = useState('');
    const [zipcode, setZipcode] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [cellPhone, setCellPhone] = useState('');
    const [homePhone, setHomePhone] = useState('');
    const [guardianFirstName, setGuardianFirstName] = useState('');
    const [guardianLastName, setGuardianLastName] = useState('');
    const [guardianDateOfBirth, setGuardianDateOfBirth] = useState('');
    const [errors, setErrors] = useState({});
    const [isValidatingLocation, setIsValidatingLocation] = useState(false);
    const [apiError, setApiError] = useState('');

    const formatPhoneNumber = (value) => {
        if (!value) return value;
        
        // Remove all non-digits
        const phoneNumber = value.replace(/[^\d]/g, '');
        
        // Apply masking based on length
        if (phoneNumber.length < 4) return phoneNumber;
        if (phoneNumber.length < 7) {
            return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
        }
        return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
    };

    const handleCellPhoneChange = (e) => {
        const formattedNumber = formatPhoneNumber(e.target.value);
        // Only update if length is <= 14 (including formatting characters)
        if (formattedNumber.length <= 14) {
            setCellPhone(formattedNumber);
        }
    };

    const handleHomePhoneChange = (e) => {
        const formattedNumber = formatPhoneNumber(e.target.value);
        // Only update if length is <= 14 (including formatting characters)
        if (formattedNumber.length <= 14) {
            setHomePhone(formattedNumber);
        }
    };

    const validateZipCodeAndCity = async (zipcode, city) => {
        try {
            setIsValidatingLocation(true);
            const response = await axios.post('https://alturahc.com/wp-json/zipcode-validator/v1/check', {
                zip: zipcode,
                city: city,
            });

            if (response.status === 200 && response.data.valid) {
                return true;
            } else {
                setErrors(prev => ({
                    ...prev,
                    zipcode: 'Zipcode does not match the city',
                    city: 'City does not match the zipcode'
                }));
                return false;
            }
        } catch (error) {
            console.error('Zipcode validation error:', error);
            setErrors(prev => ({
                ...prev,
                zipcode: 'Error validating location',
                city: 'Error validating location'
            }));
            return false;
        } finally {
            setIsValidatingLocation(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Clear previous errors
        setErrors({});
        setApiError('');

        // Validate zipcode and city
        const isLocationValid = await validateZipCodeAndCity(zipcode, city);
        if (!isLocationValid) {
            return;
        }

        try {
            const patientData = {
                ID: 0,
                FirstName: firstName,
                LastName: lastName,
                Email: email,
                VendorId: 66,
                Gender: gender.charAt(0).toUpperCase(),
                DateOfBirth: new Date(dateOfBirth).toLocaleDateString('en-US'),
                PhoneNo: '+1' + cellPhone.replace(/\D/g, ''),
                Address1: address1,
                Address2: address2 || '',
                City: city,
                State: state,
                Zipcode: zipcode,
                AccountType: 2,
                Relation: relation
            };

            console.log('patientData:', patientData);

            const response = await patientService.createPatient(patientData);
            // Handle success
        } catch (error) {
            console.error('Error creating family member:', error);
            
            // Handle 400 errors and other error cases
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                if (error.response.status === 400) {
                    // Get the error message from the response
                    const errorMessage = error.response.data.Message || 
                                       'Unable to create family member. Please check your information.';
                    setApiError(errorMessage);
                } else {
                    setApiError('An error occurred while creating the family member. Please try again.');
                }
            } else if (error.request) {
                // The request was made but no response was received
                setApiError('Unable to connect to the server. Please check your internet connection.');
            } else {
                // Something happened in setting up the request
                setApiError('An unexpected error occurred. Please try again.');
            }
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.formContainer}>
                {apiError && (
                    <div className={styles.apiError}>
                        <Image
                            src="/assets/icons/error.png"
                            alt="Error"
                            width={20}
                            height={20}
                        />
                        <span>{apiError}</span>
                    </div>
                )}

                <div className={styles.formSection}>
                    <form className={styles.form} onSubmit={handleSubmit}>
                        <div className={styles.formRow}>
                            <select 
                                className={styles.select} 
                                value={relation} 
                                onChange={(e) => setRelation(e.target.value)}
                                required
                            >
                                <option value="" disabled>Relation</option>
                                <option value="Spouse">Spouse</option>
                                <option value="Son">Son</option>
                                <option value="Daughter">Daughter</option>
                            </select>
                            <Input
                                type="email"
                                placeholder="Email Address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className={styles.inputField}
                                required
                            />
                        </div>

                        <div className={styles.formRow}>
                            <Input
                                type="text"
                                placeholder="First Name"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                className={styles.inputField}
                            />
                            <Input
                                type="text"
                                placeholder="Last Name"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                className={styles.inputField}
                            />
                        </div>

                        <div className={styles.formRow}>
                            <Input
                                type="date"
                                placeholder="Date of Birth"
                                value={dateOfBirth}
                                onChange={(e) => setDateOfBirth(e.target.value)}
                                className={styles.inputField}
                            />
                            <select 
                                className={styles.select} 
                                value={gender}
                                onChange={(e) => setGender(e.target.value)}
                            >
                                <option value="" disabled>Gender</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                            </select>
                        </div>

                        <Input
                            type="text"
                            placeholder="Address 1"
                            value={address1}
                            onChange={(e) => setAddress1(e.target.value)}
                            className={styles.inputField}
                        />
                        <Input
                            type="text"
                            placeholder="Address 2"
                            value={address2}
                            onChange={(e) => setAddress2(e.target.value)}
                            className={styles.inputField}
                        />

                        <div className={styles.formRow}>
                            <Input
                                type="text"
                                placeholder="Zipcode"
                                value={zipcode}
                                onChange={(e) => {
                                    setZipcode(e.target.value);
                                    // Clear error when user starts typing
                                    if (errors.zipcode) {
                                        setErrors(prev => ({ ...prev, zipcode: '' }));
                                    }
                                }}
                                className={`${styles.inputField} ${errors.zipcode ? styles.errorInput : ''}`}
                            />
                            {errors.zipcode && <span className={styles.errorText}>{errors.zipcode}</span>}
                            
                            <Input
                                type="text"
                                placeholder="City"
                                value={city}
                                onChange={(e) => {
                                    setCity(e.target.value);
                                    // Clear error when user starts typing
                                    if (errors.city) {
                                        setErrors(prev => ({ ...prev, city: '' }));
                                    }
                                }}
                                className={`${styles.inputField} ${errors.city ? styles.errorInput : ''}`}
                            />
                            {errors.city && <span className={styles.errorText}>{errors.city}</span>}
                        </div>

                        <div className={styles.formRow}>
                            <Input
                                type="text"
                                placeholder="State"
                                value={state}
                                onChange={(e) => setState(e.target.value)}
                                className={styles.inputField}
                            />
                            <Input
                                type="tel"
                                placeholder="Cell Phone"
                                value={cellPhone}
                                onChange={handleCellPhoneChange}
                                className={styles.inputField}
                                maxLength={14}
                            />
                        </div>

                        <Input
                            type="tel"
                            placeholder="Home Phone"
                            value={homePhone}
                            onChange={handleHomePhoneChange}
                            className={styles.inputField}
                            maxLength={14}
                        />

                        {/* <h3 className={styles.sectionTitle}>Parent\Guardian Information</h3>

                        <div className={styles.formRow}>
                            <Input
                                type="text"
                                placeholder="Guardian First Name"
                                value={guardianFirstName}
                                onChange={(e) => setGuardianFirstName(e.target.value)}
                                className={styles.inputField}
                            />
                            <Input
                                type="text"
                                placeholder="Guardian Last Name"
                                value={guardianLastName}
                                onChange={(e) => setGuardianLastName(e.target.value)}
                                className={styles.inputField}
                            />
                            <Input
                                type="date"
                                placeholder="Guardian Date of Birth"
                                value={guardianDateOfBirth}
                                onChange={(e) => setGuardianDateOfBirth(e.target.value)}
                                className={styles.inputField}
                            />
                        </div> */}

                        <div className={styles.buttonContainer}>
                            <button type="button" className={styles.saveButton}>
                                <Image
                                    src="/assets/icons/save.png"
                                    alt="Save"
                                    width={20}
                                    height={20}
                                />
                                Save
                            </button>
                            <button 
                                type="submit" 
                                className={styles.sendButton}
                                disabled={isValidatingLocation}
                            >
                                {isValidatingLocation ? 'Validating...' : 'Send Invitation →'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default AddSpouse; 
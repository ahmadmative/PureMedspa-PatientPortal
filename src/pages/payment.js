import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Header from '../components/Header';
import Input from '../components/Input';
import Button from '../components/Button';
import Image from 'next/image';
import styles from '../styles/ActivateAccount.module.css';
import successIcon from '../../public/assets/icons/success.png';
import axios from 'axios';
import { authUtils } from '../utils/auth';
import { patientService } from '../api/services/patient.service';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

// Add this constant for the patient ID storage key
const PATIENT_ID_KEY = 'patient_id';

// Add error handling for missing Stripe key
const getStripePromise = () => {
  const key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
  if (!key) {
    console.error('Stripe publishable key is missing. Please check your environment variables.');
    return null;
  }
  return loadStripe(key);
};

// Initialize Stripe with error handling
const stripePromise = getStripePromise();

// Create a wrapper component
function SignupForm() {
    const [formData, setFormData] = useState({
        email: '',
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        gender: '',
        cellPhone: '',
        zipcode: '',
        state: '',
        city: '',
        address1: '',
        address2: '',
    });
    const [errors, setErrors] = useState({});
    const [showModal, setShowModal] = useState(false);
    const [data, setData] = useState([]);
    const router = useRouter();
    const [isValidatingLocation, setIsValidatingLocation] = useState(false);
    const [isProcessingPayment, setIsProcessingPayment] = useState(false);
    const [paymentResponse, setPaymentResponse] = useState(null);
    const stripe = useStripe();
    const elements = useElements();

    // Enhanced phone number formatter
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

    // Enhanced validation function
    const validateForm = () => {
        const newErrors = {};

        // Required fields validation with specific messages
        const requiredFields = {
            email: 'Email is required',
            firstName: 'First name is required',
            lastName: 'Last name is required',
            dateOfBirth: 'Date of birth is required',
            gender: 'Gender is required',
            cellPhone: 'Phone number is required',
            zipcode: 'Zipcode is required',
            state: 'State is required',
            city: 'City is required',
            address1: 'Address is required'
        };

        // Check each required field
        Object.entries(requiredFields).forEach(([field, message]) => {
            if (!formData[field] || formData[field].trim() === '') {
                newErrors[field] = message;
            }
        });

        // Email validation
        if (formData.email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formData.email.trim())) {
                newErrors.email = 'Please enter a valid email address';
            }
        }

        // Phone number validation
        if (formData.cellPhone) {
            const phoneRegex = /^\(\d{3}\) \d{3}-\d{4}$/;
            if (!phoneRegex.test(formData.cellPhone)) {
                newErrors.cellPhone = 'Please enter a complete phone number';
            }
        }

        // Zipcode validation
        if (formData.zipcode) {
            const zipcodeRegex = /^\d{5}(-\d{4})?$/;
            if (!zipcodeRegex.test(formData.zipcode)) {
                newErrors.zipcode = 'Please enter a valid 5-digit zipcode';
            }
        }

        // Date of birth validation
        if (formData.dateOfBirth) {
            const dob = new Date(formData.dateOfBirth);
            const today = new Date();
            if (dob > today) {
                newErrors.dateOfBirth = 'Date of birth cannot be in the future';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
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

    // Modify handleSubmit to check for stripe and elements
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Check if stripe is loaded
        if (!stripe || !elements) {
            console.log('Stripe has not loaded yet');
            return;
        }

        if (validateForm()) {
            const isLocationValid = await validateZipCodeAndCity(formData.zipcode, formData.city);

            if (isLocationValid) {
                try {
                    setIsProcessingPayment(true);

                    // Get card element
                    const cardElement = elements.getElement(CardElement);
                    if (!cardElement) {
                        throw new Error('Card element not found');
                    }

                    // Create payment intent
                    const amount = data?.subscription_plan?.price ? parseInt(data.subscription_plan.price) * 100 : 5000;
                    const response = await axios.post('/api/create-payment-intent', {
                        amount,
                        email: formData.email
                    });

                    console.log('Payment Intent Response:', response.data);

                    // Confirm payment
                    const { error, paymentIntent } = await stripe.confirmCardPayment(
                        response.data.clientSecret,
                        {
                            payment_method: {
                                card: cardElement,
                                billing_details: {
                                    name: `${formData.firstName} ${formData.lastName}`,
                                    email: formData.email
                                }
                            }
                        }
                    );

                    if (error) {
                        throw new Error(error.message);
                    }

                    console.log('Payment Success Response:', paymentIntent);
                    
                    // If payment successful, prepare payment details for your API
                    if (paymentIntent.status === 'succeeded') {
                        const paymentDetails = {
                            payment_id: paymentIntent.id,
                            amount: paymentIntent.amount / 100, // Convert cents to dollars
                            currency: paymentIntent.currency,
                            status: paymentIntent.status,
                            payment_method: paymentIntent.payment_method,
                            receipt_email: formData.email,
                            created_at: new Date(paymentIntent.created * 1000).toISOString(),
                            subscription_id: data?.subscription_plan?.id || null
                        };

                        console.log('Payment Details for API:', paymentDetails);
                        setPaymentResponse(paymentDetails);

                        await createPatient(paymentDetails);

                        // router.push('/');
                    }

                } catch (error) {
                    console.error('Payment failed:', error);
                    setErrors(prev => ({
                        ...prev,
                        submit: error.message || 'Payment failed. Please try again.'
                    }));
                } finally {
                    setIsProcessingPayment(false);
                }
            }
        }
    };

    // Move patient creation logic to separate function
    const createPatient = async (paymentDetails) => {
        try {
            const patientData = {
                ID: 0,
                FirstName: formData.firstName,
                LastName: formData.lastName,
                Email: formData.email,
                VendorId: 23,
                Gender: formData.gender.charAt(0).toUpperCase(),
                DateOfBirth: new Date(formData.dateOfBirth).toLocaleDateString('en-US'),
                PhoneNo: '+1' + formData.cellPhone.replace(/\D/g, ''),
                Address1: formData.address1,
                Address2: formData.address2 || '',
                City: formData.city,
                Zipcode: formData.zipcode,
                AccountType: 2,
                ParentId: 0
            };

            const response = await patientService.createPatient(patientData);

            if (typeof response === 'number' && response > 0) {
                window.localStorage.setItem(PATIENT_ID_KEY, response.toString());

                // Create FormData for the second API
                const formData2 = new FormData();
                formData2.append('first_name', formData.firstName);
                formData2.append('last_name', formData.lastName);
                formData2.append('phone_no', '+1' + formData.cellPhone.replace(/\D/g, ''));
                formData2.append('address1', formData.address1);
                formData2.append('address2', formData.address2 || '');
                formData2.append('city', formData.city);
                formData2.append('state', formData.state);
                formData2.append('gender', formData.gender.charAt(0).toUpperCase());
                formData2.append('dob', new Date(formData.dateOfBirth).toLocaleDateString('en-US'));
                formData2.append('zipcode', formData.zipcode);
                formData2.append('email', formData.email);
                formData2.append('patient_id', response.toString());
                formData2.append('payment_id', paymentDetails?.payment_id || '');
                formData2.append('amount', data?.Subscription_plan.price || '');
                formData2.append('plan_id', data?.Subscription_plan.id || '');

                for (const [key, value] of formData2.entries()) {
                    console.log(`${key}: ${value}`);
                }

                try {
                    // Call the second API
                    const registerResponse = await axios.post(
                        'https://alturahealth.webjerky.com/api/register',
                        formData2,
                        {
                            headers: {
                                'Content-Type': 'multipart/form-data',
                            },
                        }
                    );

                    if (registerResponse.status == 201) {
                        setShowModal(true);
                    } else {
                        throw new Error('Registration failed in the second API');
                    }
                } catch (registerError) {
                    console.error('Registration API Error:', registerError);
                    setErrors(prev => ({
                        ...prev,
                        submit: 'Registration failed. Please contact support.'
                    }));
                }
            } else {
                throw new Error('Invalid patient ID received');
            }
        } catch (error) {
            console.error('\n=== SUBMISSION ERROR ===');
            console.error('Error:', error);
            console.error('Response:', error.response?.data);
            console.error('Status:', error.response?.status);

            // Handle different types of errors
            let errorMessage = 'An unexpected error occurred. Please try again.';

            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                if (error.response.status === 400) {
                    errorMessage = error.response.data.Message || 'Invalid request data';
                } else if (error.response.status === 401) {
                    errorMessage = 'Authentication failed';
                } else if (error.response.status === 500) {
                    errorMessage = 'Server error. Please try again later';
                }
            } else if (error.request) {
                // The request was made but no response was received
                errorMessage = 'No response from server. Please check your internet connection';
            }

            setErrors(prev => ({
                ...prev,
                submit: errorMessage
            }));
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === 'cellPhone') {
            const formattedPhone = formatPhoneNumber(value);
            setFormData(prev => ({
                ...prev,
                [name]: formattedPhone
            }));
        } else if (name === 'zipcode') {
            // Only allow numbers and limit to 5 digits
            const formattedZip = value.replace(/\D/g, '').substring(0, 5);
            setFormData(prev => ({
                ...prev,
                [name]: formattedZip
            }));

            // Clear location errors when editing
            setErrors(prev => ({
                ...prev,
                zipcode: '',
                city: ''
            }));
        } else if (name === 'city') {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));

            // Clear location errors when editing
            setErrors(prev => ({
                ...prev,
                zipcode: '',
                city: ''
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    useEffect(() => {
        const validateLocation = async () => {
            // Only validate if both fields are filled
            if (formData.zipcode.length === 5 && formData.city.trim()) {
                await validateZipCodeAndCity(formData.zipcode, formData.city);
            }
        };

        // Create a debounced version of the validation
        const timeoutId = setTimeout(validateLocation, 1000);

        return () => clearTimeout(timeoutId);
    }, [formData.zipcode, formData.city]);

    // Modify the useEffect to include logging
    useEffect(() => {
        const handleSubscription = async () => {
            const { id } = router.query;

            if (id) {
                try {
                    const formData = new FormData();
                    formData.append('id', id);

                    console.log('Fetching subscription with ID:', id); // Debug log

                    const response = await axios.post(
                        'https://alturahealth.webjerky.com/api/subscription',
                        formData,
                        {
                            headers: {
                                'Content-Type': 'multipart/form-data',
                            }
                        }
                    );

                    console.log('Raw subscription response:', response); // Debug log
                    console.log('Subscription data:', response.data); // Debug log

                    setData(response.data);

                    if (response.status !== 200) {
                        console.error('Subscription API Error:', response);
                    }
                } catch (error) {
                    console.error('Subscription Error:', error);
                }
            } else {
                console.log('No id found in query params'); // Debug log
            }
        };

        if (router.isReady) {
            handleSubscription();
        }
    }, [router.isReady, router.query]);

    // Add a useEffect to monitor data changes
    useEffect(() => {
        console.log('Current data state:', data); // Debug log
    }, [data]);

    return (
        <div className={styles.container}>
            <Header
                userName="Jalin Smith"
                userType="Patient"
                showLogo={true}
            />

            <main className={styles.main}>
                <div className={styles.formSection}>
                    <div className={styles.formHeader}>
                        <div className={styles.formHeaderText}>
                            {/* <Image
                                src="/assets/icons/profileIcon.png"
                                alt="Profile Icon"
                                width={32}
                                height={32}
                            /> */}
                            {data?.Subscription_plan ? (
                                <p className={styles.subscriptionDetails}>
                                    {data.Subscription_plan.name} - ${data.Subscription_plan.price}
                                </p>
                            ) : (
                                <p className={styles.subscriptionDetails}>Loading subscription details...</p>
                            )}
                        </div>
                        {/* <p>Hello <br />Please fill in the following information to continue.</p> */}

                    </div>

                    <form onSubmit={handleSubmit} className={styles.form}>
                        <div className={styles.twoColumns}>
                            <Input
                                type="text"
                                name="firstName"
                                placeholder="First Name"
                                value={formData.firstName}
                                onChange={handleChange}
                            />
                            <Input
                                type="text"
                                name="lastName"
                                placeholder="Last Name"
                                value={formData.lastName}
                                onChange={handleChange}
                            />
                        </div>

                        <Input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={handleChange}
                        />

                        <div className={styles.twoColumns}>
                            <Input
                                type="date"
                                name="dateOfBirth"
                                placeholder="Date of Birth"
                                value={formData.dateOfBirth}
                                onChange={handleChange}
                            />
                            <select
                                name="gender"
                                value={formData.gender}
                                onChange={handleChange}
                                className={styles.select}
                            >
                                <option value="">Gender</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                            </select>
                        </div>

                        <div className={styles.twoColumns}>
                            <Input
                                type="tel"
                                name="cellPhone"
                                placeholder="Cell Phone"
                                value={formData.cellPhone}
                                onChange={handleChange}
                            />
                            <Input
                                type="text"
                                name="zipcode"
                                placeholder="Zipcode"
                                value={formData.zipcode}
                                onChange={handleChange}
                                error={errors.zipcode}
                                disabled={isValidatingLocation}
                            />
                        </div>

                        <div className={styles.twoColumns}>
                            <Input
                                type="text"
                                name="city"
                                placeholder="City"
                                value={formData.city}
                                onChange={handleChange}
                                error={errors.city}
                                disabled={isValidatingLocation}
                            />
                            <Input
                                type="text"
                                name="state"
                                placeholder="State"
                                value={formData.state}
                                onChange={handleChange}
                            />
                        </div>

                        <div className={styles.twoColumns}>
                            <Input
                                type="text"
                                name="address1"
                                placeholder="Address 1"
                                value={formData.address1}
                                onChange={handleChange}
                            />
                            <Input
                                type="text"
                                name="address2"
                                placeholder="Address 2"
                                value={formData.address2}
                                onChange={handleChange}
                            />
                        </div>

                        {errors.submit && (
                            <div className={styles.errorContainer}>
                                <span className={styles.errorIcon}>⚠️</span>
                                <span className={styles.errorMessage}>{errors.submit}</span>
                            </div>
                        )}

                        <div className={styles.stripeElement}>
                            <CardElement options={{
                                style: {
                                    base: {
                                        fontSize: '16px',
                                        color: '#424770',
                                        '::placeholder': {
                                            color: '#aab7c4',
                                        },
                                    },
                                    invalid: {
                                        color: '#9e2146',
                                    },
                                },
                            }} />
                        </div>
                        <div style={{marginTop: '20px'}}/>
                            <Button
                                type="submit"
                                width="300px"
                                disabled={isValidatingLocation || isProcessingPayment}
                            >
                                {isProcessingPayment ? 'Processing Payment...' : 'Sign up'}
                            </Button>
                    </form>
                </div>

                <div className={styles.infoSection}>
                    <h2>With Pure Medspa get started in a few minutes</h2>
                    <ul>
                        <li>Average Emergency Room wait: 90 minutes</li>
                        <li>Average Urgent Care wait: 60 minutes</li>
                        <li>Average Physician Office wait: 30 minutes</li>
                        <li>No narcotic pain killers will be prescribed under any circumstances</li>
                    </ul>
                </div>
            </main>

            {showModal && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modal}>
                        <button
                            className={styles.closeButton}
                            onClick={() => setShowModal(false)}
                        >
                            ×
                        </button>
                        <Image
                            src={successIcon}
                            alt="Success"
                            width={120}
                            height={120}
                            className={styles.successIcon}
                        />
                        <h2>Activated Successfully</h2>
                        <p>Your profile has been activated<br />successfully</p>
                        <Button
                            onClick={() => {
                                setShowModal(false);
                                router.push('/');
                            }}
                            width="50%"
                        >
                            Okay
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}

// Main component that wraps SignupForm with Elements
export default function Payment() {
    if (!stripePromise) {
        return <div>Unable to load payment system. Please try again later.</div>;
    }

    return (
        <Elements stripe={stripePromise}>
            <SignupForm />
        </Elements>
    );
} 

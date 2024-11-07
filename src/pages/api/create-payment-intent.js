import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const { amount, email } = req.body;

        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency: 'usd',
            receipt_email: email,
            automatic_payment_methods: {
                enabled: true,
            },
        });

        res.status(200).json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
        console.error('Error creating payment intent:', error);
        res.status(500).json({ message: error.message });
    }
} 
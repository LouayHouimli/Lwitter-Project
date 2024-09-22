import express from 'express';
import stripe from '../lib/stripe.js';
import User from '../models/user.model.js';

const router = express.Router();

router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
    const sig = req.headers['stripe-signature'];

    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
        console.error(`Webhook Error: ${err.message}`);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    switch (event.type) {
        case 'checkout.session.completed':
            const session = event.data.object;
            try {
                const userId = session.client_reference_id;
                const user = await User.findById(userId);
                if (!user) {
                    throw new Error('User not found');
                }
                user.isVerified = true;
                await user.save();
                console.log('User verified successfully');
            } catch (error) {
                console.error('Error verifying user:', error);
            }
            break;
        // ... handle other event types
        default:
            console.log(`Unhandled event type ${event.type}`);
    }

    // Return a response to acknowledge receipt of the event
    res.json({ received: true });
});

export default router;
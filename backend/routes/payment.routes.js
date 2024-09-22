import express from 'express';
import stripe from '../lib/stripe.js';
import { protectRoute } from '../middleware/protectRoute.js';
import User from '../models/user.model.js';

const router = express.Router();

// Create a checkout session for subscription
router.post('/create-checkout-session', protectRoute, async (req, res) => {
    try {
        console.log("Creating checkout session...");
        console.log("User ID:", req.user._id);
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: 'Verified Membership',
                        },
                        unit_amount: 500, // $5.00
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${process.env.FRONTEND_URL}/payment-success`,
            cancel_url: `${process.env.FRONTEND_URL}/payment-failure`,
            client_reference_id: req.user._id.toString(),
        });
        console.log("Checkout session created:", session.id);
        res.json({ url: session.url });
    } catch (error) {
        console.error('Error creating checkout session:', error);
        res.status(500).json({ error: error.message || 'Failed to create checkout session' });
    }
});

// Add this new route for user verification
router.post("/verify-user", protectRoute, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.isVerified = true;
        await user.save();

        res.status(200).json({ message: "User verified successfully" });
    } catch (error) {
        console.error("Error verifying user:", error);
        res.status(500).json({ message: "Error verifying user" });
    }
});

export default router;
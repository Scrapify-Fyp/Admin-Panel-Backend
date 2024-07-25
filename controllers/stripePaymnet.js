const express = require('express');
const stripe = require('stripe')('sk_test_51PbjfgI6d1FWRgWEocwHnZQYav3IG08sHZmzRqcMmE0teyDHmEPQX5WCVqCuuoaizxRe6Pu59jlr84fnJTIunjPs00fxZb1z6G'); // Use environment variable
const router = express.Router();

router.post('/create-checkout-session', async (req, res) => {
    // console.log("APIHIT!");
    const { products, order } = req.body;
    const orderid =order.orderID;

    const transformedItems = products.map(item => ({
        quantity: item.quantity,
        price_data: {
            currency: 'usd',
            unit_amount: item.product.price * 100,
            product_data: {
                name: item.product.name,
            },
        },
    }));

    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: transformedItems,
            mode: 'payment',
            success_url: `http://localhost:3000/orderConfirmation?orderID=${orderid}`, // Include orderID in success URL
            cancel_url: "http://localhost:3000/cancel",
        });

        res.json({ id: session.id });
    } catch (error) {
        console.error('Error creating checkout session:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


router.get('/payments', async (req, res) => {
    // console.log("Api HIT");
    try {
      const payments = await stripe.paymentIntents.list({
        limit: 100, // Fetches the last 100 payments
      });
      res.json(payments);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
module.exports = router;

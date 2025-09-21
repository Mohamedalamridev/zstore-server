// controllers/paymentController.js
const axios = require("axios");
const Order = require("../Models/orderModel");
const User = require(".././Models/User");
const PAYMOB_API_KEY = process.env.PAYMOB_API_KEY;

const INTEGRATION_ID = process.env.INTEGRATION_ID;
const IFRAME_ID = process.env.IFRAME_ID;
exports.createPayment = async (req, res) => {
  const {
    userId,
    items,
    totalAmount,
    address,
    deliveryDateFrom,
    deliveryDateTo,
  } = req.body;
  try {
    const user = await User.findById(userId);
    const auth = await axios.post("https://accept.paymob.com/api/auth/tokens", {
      api_key: PAYMOB_API_KEY,
    });
    const token = auth.data.token;

    const order = await axios.post(
      "https://accept.paymob.com/api/ecommerce/orders",
      {
        auth_token: token,
        delivery_needed: false,
        amount_cents: totalAmount * 100,
        currency: "EGP",
        items: items,
      }
    );

    //  Save Order in DB

    await Order.create({
      userId,
      items,
      address,
      name: user.name,
      totalAmount,
      paymobOrderId: order.data.id,
      paymentStatus: "pending",
      deliveryDateFrom,
      deliveryDateTo,
    });

    // Payment Key with Default Billing Data
    const paymentKey = await axios.post(
      "https://accept.paymob.com/api/acceptance/payment_keys",
      {
        auth_token: token,
        amount_cents: totalAmount * 100,
        expiration: 3600,
        order_id: order.data.id,
        billing_data: {
          apartment: "NA",
          email: user.email,
          floor: "NA",
          first_name: user.name.split(" ")[0] || "NA",
          last_name: user.name.split(" ")[1] || "NA",
          street: address.street || "NA",
          building: address.street,
          phone_number: address.phone,
          shipping_method: "PKG",
          postal_code: address.postalCode,
          city: address.city,
          country: address.country || "EG",
          state: address.state,
        },
        currency: "EGP",
        integration_id: INTEGRATION_ID,
        redirect_url: `https://zstore-fashion.vercel.app/success`,
      }
    );

    // 5 Payment Iframe URL
    const iframeUrl = `https://accept.paymob.com/api/acceptance/iframes/${IFRAME_ID}?payment_token=${paymentKey.data.token}`;
    res.json({ url: iframeUrl });
  } catch (err) {
    console.error("Payment Error:", err.response?.data || err.message);
    res.status(500).json({ error: "Payment failed" });
  }
};

// controllers/paymentController.js
const axios = require("axios");
const Order = require("../Models/orderModel");

const PAYMOB_API_KEY =
  "ZXlKaGJHY2lPaUpJVXpVeE1pSXNJblI1Y0NJNklrcFhWQ0o5LmV5SmpiR0Z6Y3lJNklrMWxjbU5vWVc1MElpd2ljSEp2Wm1sc1pWOXdheUk2TVRBMU5EZzFNeXdpYm1GdFpTSTZJbWx1YVhScFlXd2lmUS5YcWtURjk2bnBQRGVSRXNXT0YyT2hnb0kzUHYtUGdzcS1xSS1yRDZob1ZPc2VYWFktT25fY3poWDlNZVBseGpTUlkxbTUxaUhLS2J2MFJMQ3NJSXN6Zw==";

const INTEGRATION_ID = "5149108";
const IFRAME_ID = "933665";
exports.createPayment = async (req, res) => {
  const { userId, items, totalAmount } = req.body;

  try {
    // 1️⃣ Auth Token
    const auth = await axios.post("https://accept.paymob.com/api/auth/tokens", {
      api_key: PAYMOB_API_KEY,
    });
    const token = auth.data.token;

    // 2️⃣ Create Order in Paymob
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

    // 3️⃣ Save Order in DB
    await Order.create({
      userId,
      items,
      totalAmount,
      paymobOrderId: order.data.id,
      paymentStatus: "pending",
    });

    // 4️⃣ Payment Key with Default Billing Data
    const paymentKey = await axios.post(
      "https://accept.paymob.com/api/acceptance/payment_keys",
      {
        auth_token: token,
        amount_cents: totalAmount * 100,
        expiration: 3600,
        order_id: order.data.id,
        billing_data: {
          apartment: "NA",
          email: "customer@example.com",
          floor: "NA",
          first_name: "Guest",
          last_name: "User",
          street: "Cairo",
          building: "NA",
          phone_number: "+201234567890",
          shipping_method: "NA",
          postal_code: "NA",
          city: "Cairo",
          country: "EG",
          state: "NA",
        },
        currency: "EGP",
        integration_id: INTEGRATION_ID,
        redirect_url: `https://z--store.vercel.app/success/success`,
      }
    );

    // 5️⃣ Payment Iframe URL
    const iframeUrl = `https://accept.paymob.com/api/acceptance/iframes/${IFRAME_ID}?payment_token=${paymentKey.data.token}`;
    res.json({ url: iframeUrl });
  } catch (err) {
    console.error("Payment Error:", err.response?.data || err.message);
    res.status(500).json({ error: "Payment failed" });
  }
};

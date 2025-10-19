import Payment from "../models/paymentModel.js";
import stripe from "stripe";
import userModel from "../models/userModel.js";
import dotenv from "dotenv";
dotenv.config();

const Plans = [
  {
    _id: "basic",
    name: "Basic",
    price: 10,
    credits: 100,
    features: [
      "100 text generations",
      "50 image generations",
      "Standard support",
      "Access to basic models",
    ],
  },
  {
    _id: "pro",
    name: "Pro",
    price: 20,
    credits: 500,
    features: [
      "500 text generations",
      "200 image generations",
      "Priority support",
      "Access to pro models",
      "Faster response time",
    ],
  },
  {
    _id: "premium",
    name: "Premium",
    price: 30,
    credits: 1000,
    features: [
      "1000 text generations",
      "500 image generations",
      "24/7 VIP support",
      "Access to premium models",
      "Dedicated account manager",
    ],
  },
];

// Api to get all plans
export const getPlans = async (req, res) => {
  try {
    return res.status(200).json({ success: true, Plans });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const stripeApi = new stripe(process.env.STRIPE_SECRET_KEY);

// Purchase Plan
export const purchasePlan = async (req, res) => {
  try {
    const { planId } = req.body;
    const userId = req.user._id;

    const plan = Plans.find((plan) => plan._id === planId);
    if (!plan) {
      return res.status(404).json({ message: "Plan not found" });
    }

    const paymentData = await Payment.create({
      userId,
      planId: plan._id,
      amount: plan.price,
      credits: plan.credits,
      status: "pending",
    });

    const { origin } = req.headers;
    const successUrl = `${origin}`;
    const cancelUrl = `${origin}/payment/cancel`;

    const session = await stripeApi.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            unit_amount: plan.price * 100,
            product_data: { name: plan.name },
          },
          quantity: 1,
        },
      ],
      metadata: {
        transactionId: paymentData._id.toString(),
        appId: "chatgpt",
      },
      success_url: successUrl,
      cancel_url: cancelUrl,
      expires_at: Math.floor(Date.now() / 1000) + 60 * 60 * 24, // 24 hours
    });

    return res.status(200).json({ success: true, url: session.url });
  } catch (error) {
    console.error("Error in purchasePlan:", error);
    return res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
};

// Webhook of Stripe
export const webhookStripe = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    console.error("⚠️  Webhook signature verification failed.", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
        const session = event.data.object;
        const { transactionId, appId } = session.metadata;

        console.log("eee", appId);

        if (appId === "chatgpt") {
          const payment = await Payment.findOne({
            _id: transactionId,
            status: "pending",
          });

          if (payment) {
            await userModel.findOneAndUpdate(
              { _id: payment.userId },
              { $inc: { credits: payment.credits } }
            );

            payment.status = "success";
            await payment.save();
          } else {
            console.warn(
              "Payment not found or already processed:",
              transactionId
            );
          }
        } else {
          console.log("Unhandled app ID in metadata:", appId);
        }
        break;

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return res.status(500).json({
      message: "Something went wrong during webhook processing",
      error: error.message,
    });
  }
};

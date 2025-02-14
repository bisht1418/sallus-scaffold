const express = require("express");
const bodyParser = require("body-parser");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const User = require("../model/user");
const PaymentDatabase = require("../model/paymentDatabaseModal");
const Subscription = require("../model/subscriptionSchema");

const app = express();
app.use(bodyParser.json());

// Constants
const SUBSCRIPTION_TYPES = {
  INDIVIDUAL: 4,
};

const DURATION = {
  MONTH: 'month',
  YEAR: 'year'
};

// Utility functions
const removeNonNumericCharacters = (str) => {
  if (!str) return 0;
  const matches = str.match(/\d/g);
  return matches ? parseInt(matches.join("")) : 0;
};

const calculatePrice = (priceObj, priceType, users = 1) => {
  const basePrice = priceType === DURATION.MONTH
    ? removeNonNumericCharacters(priceObj.month)
    : removeNonNumericCharacters(priceObj.year);
  return basePrice * users;
};

// Helper function to validate and format dates
const formatDateForMongoDB = (date) => {
  // If it's already a Date object, validate it
  if (date instanceof Date) {
    if (isNaN(date.getTime())) {
      throw new Error('Invalid Date object');
    }
    return date.toISOString();
  }

  // If it's a string, try to create a valid Date
  const parsedDate = new Date(date);
  if (isNaN(parsedDate.getTime())) {
    throw new Error('Invalid date string');
  }
  return parsedDate.toISOString();
};

const calculateEndDate = (startDate, priceType) => {
  // Create a new Date object for start
  const start = new Date();

  // Create end date based on start
  const end = new Date(start);

  // Calculate end date based on price type
  switch (priceType) {
    case 'month':
      end.setMonth(end.getMonth() + 1);
      break;
    case 'year':
      end.setFullYear(end.getFullYear() + 1);
      break;
    default:
      // Default to one month if price type is invalid
      end.setMonth(end.getMonth() + 1);
  }

  return end.toISOString(); // Return as ISO string
};

exports.checkPaymentStatus = async (req, res) => {

  try {
    console.log('Checking payment status...');
    const { session_id } = req.query;

    if (!session_id) {
      return res.status(400).json({
        status: 'failed',
        message: 'Session ID is required'
      });
    }

    // Get the session from Stripe
    const session = await stripe.checkout.sessions.retrieve(session_id);
    console.log('Stripe session status:', session.payment_status);

    // Get our internal payment record
    const paymentRecord = await PaymentDatabase.findOne({ sessionId: session_id });

    if (!paymentRecord) {
      return res.status(404).json({
        status: 'failed',
        message: 'Payment record not found'
      });
    }

    let status;
    let message = '';

    switch (session.payment_status) {
      case 'paid':
        status = 'complete';
        message = 'Payment successful';

        // Update subscription if payment is successful and not already processed
        if (paymentRecord.status !== 'complete') {
          try {
            const user = await User.findById(paymentRecord.userId);
            if (user) {
              // Update user subscription status
              user.isSubscription = true;
              user.subscriptionType = paymentRecord.requestData.subscriptionType;
              user.planType = paymentRecord.requestData.priceType;
              if (!user.isDemoAccount) {
                user.isDemoExpire = false;
              }
              await user.save();
              console.log('User subscription updated');

              try {
                // Generate start and end dates
                const startTime = new Date().toISOString();
                const endTime = calculateEndDate(startTime, paymentRecord.requestData.priceType);

                console.log('Start time:', startTime);
                console.log('End time:', endTime);

                // Check for existing subscription
                const existingSubscription = await Subscription.findOne({
                  userId: user._id,
                  isInvitedUser: false
                });

                if (existingSubscription) {
                  console.log('Found existing subscription:', existingSubscription._id);

                  // Update existing subscription
                  existingSubscription.isActive = true;
                  existingSubscription.plan = paymentRecord.requestData.subscriptionType;
                  existingSubscription.planType = paymentRecord.requestData.priceType;
                  existingSubscription.startTime = startTime;
                  existingSubscription.endTime = endTime;
                  existingSubscription.paidSubscriptionByItself = true;

                  await existingSubscription.save();
                  console.log('Subscription updated successfully:', existingSubscription._id);
                } else {
                  console.log('No existing subscription found, creating new one');

                  // Create new subscription
                  const newSubscriptionData = new Subscription({
                    userId: user._id,
                    userEmail: user.email,
                    isActive: true,
                    plan: paymentRecord.requestData.subscriptionType,
                    planType: paymentRecord.requestData.priceType,
                    paidSubscriptionByItself: true,
                    startTime: startTime,
                    endTime: endTime,
                    isInvitedUser: false
                  });

                  await newSubscriptionData.save();
                  console.log('New subscription created successfully:', newSubscriptionData._id);
                }
              } catch (dateError) {
                console.error('Subscription processing error:', dateError);
                throw dateError;
              }
            }
          } catch (error) {
            console.error('Error updating subscription:', error);
            // Continue with the response even if subscription update fails
          }
        }
        break;

      case 'unpaid':
        status = 'pending';
        message = 'Payment pending';
        break;

      default:
        status = 'failed';
        message = 'Payment failed or cancelled';
    }

    // Update payment record status
    paymentRecord.status = status;
    await paymentRecord.save();

    return res.json({
      status,
      message,
      paymentDetails: {
        amount: session.amount_total,
        currency: session.currency,
        paymentMethod: session.payment_method_types[0]
      }
    });

  } catch (error) {
    console.error('Error checking payment status:', error);
    return res.status(500).json({
      status: 'failed',
      message: 'Error checking payment status'
    });
  }
};

// Modify your existing processPayment function
exports.processPayment = async (req, res) => {

  try {
    const { subscriptionType, users, priceType, price, customerId } = req.body;

    if (!customerId || !price || !priceType) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const noOfUsers = subscriptionType === 4 ? 1 : users;
    const finalPrice = calculatePrice(price, priceType, noOfUsers);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Subscription Amount",
            },
            unit_amount: finalPrice * 100,
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.BASE_URL}/payment-status?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.BASE_URL}/payment-status?session_id={CHECKOUT_SESSION_ID}`,
    });

    // Save payment record
    await PaymentDatabase.create({
      sessionId: session.id,
      userId: customerId,
      requestData: req.body,
      status: 'pending',
      amount: finalPrice,
      currency: 'usd'
    });

    return res.status(200).json({ sessionId: session.id });

  } catch (error) {
    console.error('Payment processing error:', error);
    return res.status(500).json({
      error: "Payment processing failed",
      message: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
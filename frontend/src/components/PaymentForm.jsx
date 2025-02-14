import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { handlePayment } from '../Services/paymentService';

const PaymentForm = () => {
 const stripe = useStripe();
 const elements = useElements();
 const [error, setError] = useState(null);

 const handleSubmit = async (event) => {
  event.preventDefault();

  if (!stripe || !elements) {
   return;
  }

  const { error, paymentMethod } = await stripe.createPaymentMethod({
   type: 'card',
   card: elements.getElement(CardElement),
  });

  if (error) {
   setError(error.message);
  } else {
   handlePayment(paymentMethod);
  }
 };

 return (
  <form onSubmit={handleSubmit}>
   <CardElement />
   {error && <div>{error}</div>}
   <button type="submit" disabled={!stripe}>Pay</button>
  </form>
 );
};

export default PaymentForm;

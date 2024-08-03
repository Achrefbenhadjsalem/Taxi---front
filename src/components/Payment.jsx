import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe('your_stripe_public_key'); // Remplacez par votre clé publique Stripe

const CheckoutForm = ({ amount }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: elements.getElement(CardElement),
    });

    if (error) {
      setError(error.message);
    } else {
      const { id } = paymentMethod;
      const response = await fetch('http://localhost:3000/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount }),
      });

      const paymentIntent = await response.json();

      const confirmCardPayment = await stripe.confirmCardPayment(paymentIntent.clientSecret, {
        payment_method: id,
      });

      if (confirmCardPayment.error) {
        setError(confirmCardPayment.error.message);
      } else {
        setSuccess(true);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="credit-card w-full sm:w-auto shadow-lg mx-auto rounded-xl bg-white p-4">
      <h1 className="text-xl font-semibold text-gray-700 text-center">Card payment</h1>
      <div className="my-3">
        <label className="block text-gray-700">Cardholder Name</label>
        <input
          type="text"
          className="block w-full px-5 py-2 border rounded-lg bg-white shadow-lg placeholder-gray-400 text-gray-700 focus:ring focus:outline-none"
          placeholder="Card holder"
        />
      </div>
      <div className="my-3">
        <label className="block text-gray-700">Card Number</label>
        <CardElement className="block w-full px-5 py-2 border rounded-lg bg-white shadow-lg placeholder-gray-400 text-gray-700 focus:ring focus:outline-none" />
      </div>
      <div className="my-3 flex flex-col">
        <label className="block text-gray-700">Expiration Date</label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <input
            type="text"
            className="form-select block w-full px-5 py-2 border rounded-lg bg-white shadow-lg placeholder-gray-400 text-gray-700 focus:ring focus:outline-none"
            placeholder="MM/YY"
          />
          <input
            type="text"
            className="block w-full col-span-2 px-5 py-2 border rounded-lg bg-white shadow-lg placeholder-gray-400 text-gray-700 focus:ring focus:outline-none"
            placeholder="Security code"
          />
        </div>
      </div>
      <div className="mt-6 p-4">
        <button
          className="submit-button px-4 py-3 rounded-full bg-blue-300 text-blue-900 focus:ring focus:outline-none w-full text-xl font-semibold transition-colors"
          disabled={!stripe}
        >
          Pay now
        </button>
        {error && <div className="text-red-500 mt-4">{error}</div>}
        {success && <div className="text-green-500 mt-4">Payment successful!</div>}
      </div>
    </form>
  );
};

const Payment = () => {
  const [selectedPlan, setSelectedPlan] = useState(null);

  const handleBuyPlan = (amount) => {
    setSelectedPlan(amount);
  };

  return (
    <div className="tw-bg-white tw-py-24 sm:tw-py-32">
      <div className="tw-mx-auto tw-max-w-7xl tw-px-6 lg:tw-px-8">
        <div className="tw-mx-auto tw-max-w-4xl tw-text-center">
          <h2 className="tw-text-base tw-font-semibold tw-leading-7 tw-text-teal-600">Pricing</h2>
          <p className="tw-mt-2 tw-text-4xl tw-font-bold tw-tracking-tight tw-text-blue-500 sm:tw-text-5xl">
            Pricing plans for taxi users
          </p>
        </div>
        <p className="tw-mx-auto tw-mt-6 tw-max-w-2xl tw-text-center tw-text-lg tw-leading-8 tw-text-cyan-600">
          Choose a plan that fits your needs and enjoy our taxi services with added benefits.
        </p>
        {!selectedPlan ? (
          <div className="tw-isolate tw-mx-auto tw-mt-10 tw-grid tw-max-w-md tw-grid-cols-1 tw-gap-8 lg:tw-mx-0 lg:tw-max-w-none lg:tw-grid-cols-3">
            <div className="tw-rounded-3xl tw-p-8 tw-ring-1 xl:tw-p-10 tw-ring-yellow-400">
              <h3 id="tier-basic" className="tw-text-lg tw-font-semibold tw-leading-8 tw-text-orange-600">Basic</h3>
              <p className="tw-mt-4 tw-text-sm tw-leading-6 tw-text-green-600">Basic offers for 2 months.</p>
              <p className="tw-mt-6 tw-flex tw-items-baseline tw-gap-x-1">
                <span className="tw-text-4xl tw-font-bold tw-tracking-tight tw-text-pink-900">$15</span>
                <span className="tw-text-sm tw-font-semibold tw-leading-6 tw-text-purple-600">/2 months</span>
              </p>
              <button onClick={() => handleBuyPlan(1500)} className="tw-mt-6 tw-block tw-rounded-md tw-py-2 tw-px-3 tw-text-center tw-text-sm tw-font-semibold tw-leading-6 tw-focus-visible:tw-outline tw-focus-visible:tw-outline-2 tw-focus-visible:tw-outline-offset-2 tw-bg-cyan-600 tw-text-gray-600 tw-shadow-sm hover:tw-bg-red-500 focus-visible:tw-outline-orange-600">
                Buy plan
              </button>
            </div>
            <div className="tw-rounded-3xl tw-p-8 tw-ring-1 xl:tw-p-10 tw-ring-gray-700">
              <h3 id="tier-intermediate" className="tw-text-lg tw-font-semibold tw-leading-8 tw-text-gray-900">Intermediate</h3>
              <p className="tw-mt-4 tw-text-sm tw-leading-6 tw-text-cyan-600">Intermediate offers for 6 months.</p>
              <p className="tw-mt-6 tw-flex tw-items-baseline tw-gap-x-1">
                <span className="tw-text-4xl tw-font-bold tw-tracking-tight tw-text-yellow-700">$31</span>
                <span className="tw-text-sm tw-font-semibold tw-leading-6 tw-text-teal-600">/6 months</span>
              </p>
              <button onClick={() => handleBuyPlan(3100)} className="tw-mt-6 tw-block tw-rounded-md tw-py-2 tw-px-3 tw-text-center tw-text-sm tw-font-semibold tw-leading-6 tw-focus-visible:tw-outline tw-focus-visible:tw-outline-2 tw-focus-visible:tw-outline-offset-2 tw-bg-green-600 tw-text-white tw-shadow-sm hover:tw-bg-green-800 focus-visible:tw-outline-red-600">
                Buy plan
              </button>
            </div>
            <div className="tw-rounded-3xl tw-p-8 tw-ring-1 xl:tw-p-10 tw-bg-gray-900 tw-ring-gray-900">
              <h3 id="tier-premium" className="tw-text-lg tw-font-semibold tw-leading-8 tw-text-white">Premium</h3>
              <p className="tw-mt-4 tw-text-sm tw-leading-6 tw-text-gray-300">Premium offers and more benefits for 12 months.</p>
              <p className="tw-mt-6 tw-flex tw-items-baseline tw-gap-x-1">
                <span className="tw-text-4xl tw-font-bold tw-tracking-tight tw-text-white">$50</span>
                <span className="tw-text-sm tw-font-semibold tw-leading-6 tw-text-gray-300">/year</span>
              </p>
              <button onClick={() => handleBuyPlan(5000)} className="tw-mt-6 tw-block tw-rounded-md tw-py-2 tw-px-3 tw-text-center tw-text-sm tw-font-semibold tw-leading-6 tw-focus-visible:tw-outline tw-focus-visible:tw-outline-2 tw-focus-visible:tw-outline-offset-2 tw-bg-white/10 tw-text-white hover:tw-bg-white/20 focus-visible:tw-outline-white">
                Buy plan
              </button>
            </div>
          </div>
        ) : (
          <Elements stripe={stripePromise}>
            <CheckoutForm amount={selectedPlan} />
          </Elements>
        )}
      </div>
    </div>
  );
};

export default Payment;

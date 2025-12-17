'use client';

import React, { useState } from 'react';
import {
  useStripe,
  useElements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
} from '@stripe/react-stripe-js';

interface PaymentFormProps {
  onSuccess?: (paymentMethodId: string) => void;
  onError?: (error: string) => void;
  buttonText?: string;
  className?: string;
}

const cardElementOptions = {
  style: {
    base: {
      fontSize: '16px',
      color: '#424770',
      '::placeholder': {
        color: '#aab7c4',
      },
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    },
    invalid: {
      color: '#9e2146',
    },
  },
};

export const PaymentForm: React.FC<PaymentFormProps> = ({
  onSuccess,
  onError,
  buttonText = 'Save Payment Method',
  className = '',
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cardholderName, setCardholderName] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const cardNumberElement = elements.getElement(CardNumberElement);

      if (!cardNumberElement) {
        throw new Error('Card element not found');
      }

      // Create payment method
      const { error: stripeError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardNumberElement,
        billing_details: {
          name: cardholderName,
        },
      });

      if (stripeError) {
        throw new Error(stripeError.message);
      }

      if (!paymentMethod) {
        throw new Error('Failed to create payment method');
      }

      // Call success callback with payment method ID
      if (onSuccess) {
        onSuccess(paymentMethod.id);
      }
    } catch (err: any) {
      const errorMessage = err.message || 'An error occurred';
      setError(errorMessage);
      if (onError) {
        onError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`space-y-4 ${className}`}>
      <div>
        <label htmlFor="cardholderName" className="block text-sm font-medium text-gray-700 mb-2">
          Cardholder Name
        </label>
        <input
          id="cardholderName"
          type="text"
          value={cardholderName}
          onChange={(e) => setCardholderName(e.target.value)}
          placeholder="John Doe"
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Card Number
        </label>
        <div className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus-within:ring-blue-500 focus-within:border-blue-500">
          <CardNumberElement options={cardElementOptions} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Expiration Date
          </label>
          <div className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus-within:ring-blue-500 focus-within:border-blue-500">
            <CardExpiryElement options={cardElementOptions} />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            CVC
          </label>
          <div className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus-within:ring-blue-500 focus-within:border-blue-500">
            <CardCvcElement options={cardElementOptions} />
          </div>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? 'Processing...' : buttonText}
      </button>

      <p className="text-xs text-gray-500 text-center">
        Your payment information is encrypted and secure.
      </p>
    </form>
  );
};

export default PaymentForm;

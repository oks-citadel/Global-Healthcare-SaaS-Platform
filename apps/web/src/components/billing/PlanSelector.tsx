'use client';

import React from 'react';

export interface Plan {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  interval: 'monthly' | 'annual';
  features: string[];
  active: boolean;
  popular?: boolean;
}

interface PlanSelectorProps {
  plans: Plan[];
  currentPlanId?: string;
  onSelectPlan: (planId: string) => void;
  loading?: boolean;
  className?: string;
}

export const PlanSelector: React.FC<PlanSelectorProps> = ({
  plans,
  currentPlanId,
  onSelectPlan,
  loading = false,
  className = '',
}) => {
  const formatPrice = (price: number, currency: string, interval: string) => {
    const formattedPrice = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(price);

    return `${formattedPrice}/${interval === 'monthly' ? 'mo' : 'yr'}`;
  };

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
      {plans.map((plan) => (
        <div
          key={plan.id}
          className={`relative rounded-lg border-2 p-6 flex flex-col ${
            plan.id === currentPlanId
              ? 'border-blue-500 bg-blue-50'
              : plan.popular
              ? 'border-green-500'
              : 'border-gray-200'
          } ${!plan.active ? 'opacity-50' : ''}`}
        >
          {plan.popular && (
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <span className="bg-green-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                Most Popular
              </span>
            </div>
          )}

          {plan.id === currentPlanId && (
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <span className="bg-blue-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                Current Plan
              </span>
            </div>
          )}

          <div className="flex-1">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {plan.name}
            </h3>

            <p className="text-gray-600 text-sm mb-4">{plan.description}</p>

            <div className="mb-6">
              <span className="text-4xl font-bold text-gray-900">
                {formatPrice(plan.price, plan.currency, plan.interval)}
              </span>
            </div>

            <ul className="space-y-3 mb-6">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <svg
                    className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span className="text-sm text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          <button
            onClick={() => onSelectPlan(plan.id)}
            disabled={!plan.active || loading || plan.id === currentPlanId}
            className={`w-full py-2 px-4 rounded-md font-medium transition-colors ${
              plan.id === currentPlanId
                ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                : plan.popular
                ? 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500'
                : 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500'
            } focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {loading
              ? 'Processing...'
              : plan.id === currentPlanId
              ? 'Current Plan'
              : 'Select Plan'}
          </button>
        </div>
      ))}
    </div>
  );
};

export default PlanSelector;

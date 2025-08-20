import React from 'react';
import { Link } from 'react-router-dom';
import { CheckIcon } from '@heroicons/react/24/outline';

const PricingPage = () => {
  const plans = [
    {
      name: 'Basic',
      price: '$9.99',
      period: 'month',
      description: 'Perfect for individual students',
      features: [
        'Access to basic book library',
        '5 quizzes per month',
        'Basic AI assistance',
        'Email support',
        'Mobile responsive'
      ],
      popular: false,
      cta: 'Get Started',
      href: '/register'
    },
    {
      name: 'Pro',
      price: '$19.99',
      period: 'month',
      description: 'Ideal for serious learners',
      features: [
        'Full access to book library',
        'Unlimited quizzes',
        'Advanced AI assistance',
        'Priority support',
        'Progress tracking',
        'Offline downloads',
        'Certificate of completion'
      ],
      popular: true,
      cta: 'Start Free Trial',
      href: '/register'
    },
    {
      name: 'Institute',
      price: 'Custom',
      period: 'year',
      description: 'For schools and organizations',
      features: [
        'Multi-user management',
        'Custom content creation',
        'Advanced analytics',
        'White-label options',
        'Dedicated support',
        'API access',
        'Custom integrations',
        'Training and onboarding'
      ],
      popular: false,
      cta: 'Contact Sales',
      href: '/contact'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <Link to="/" className="text-2xl font-bold text-indigo-600">
              Ilm Kademy
            </Link>
            <div className="flex space-x-4">
              <Link
                to="/login"
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
            Choose Your Learning Path
          </h1>
          <p className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto">
            Transform your education with our comprehensive learning platform. 
            Choose the plan that fits your needs and start your journey today.
          </p>
        </div>

        {/* Pricing Toggle */}
        <div className="mt-12 flex justify-center">
          <div className="bg-gray-100 p-1 rounded-lg">
            <button className="px-4 py-2 text-sm font-medium text-gray-900 bg-white rounded-md shadow-sm">
              Monthly
            </button>
            <button className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-900">
              Yearly
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="mt-16 grid gap-8 lg:grid-cols-3 lg:gap-x-8 lg:gap-y-10">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative bg-white rounded-2xl shadow-lg ring-1 ring-gray-200 p-8 ${
                plan.popular ? 'ring-2 ring-indigo-500' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 -translate-y-1/2">
                  <span className="inline-flex rounded-full bg-indigo-600 px-4 py-1 text-sm font-semibold text-white">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900">{plan.name}</h3>
                <div className="mt-4 flex items-baseline justify-center">
                  <span className="text-5xl font-extrabold text-gray-900">
                    {plan.price}
                  </span>
                  {plan.price !== 'Custom' && (
                    <span className="ml-1 text-xl text-gray-500">/{plan.period}</span>
                  )}
                </div>
                <p className="mt-2 text-gray-600">{plan.description}</p>
              </div>

              <ul className="mt-8 space-y-4">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start">
                    <CheckIcon className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="ml-3 text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-8">
                <Link
                  to={plan.href}
                  className={`block w-full px-4 py-3 text-center text-sm font-medium rounded-md ${
                    plan.popular
                      ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                      : 'bg-gray-800 text-white hover:bg-gray-900'
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mt-24">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">
              Frequently Asked Questions
            </h2>
          </div>
          
          <div className="mt-12 max-w-3xl mx-auto">
            <dl className="space-y-8">
              <div>
                <dt className="text-lg font-medium text-gray-900">
                  Can I change my plan later?
                </dt>
                <dd className="mt-2 text-gray-600">
                  Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.
                </dd>
              </div>
              
              <div>
                <dt className="text-lg font-medium text-gray-900">
                  Is there a free trial?
                </dt>
                <dd className="mt-2 text-gray-600">
                  Yes, we offer a 7-day free trial for our Pro plan so you can experience all the features before committing.
                </dd>
              </div>
              
              <div>
                <dt className="text-lg font-medium text-gray-900">
                  What payment methods do you accept?
                </dt>
                <dd className="mt-2 text-gray-600">
                  We accept all major credit cards, PayPal, and bank transfers for annual plans.
                </dd>
              </div>
              
              <div>
                <dt className="text-lg font-medium text-gray-900">
                  Can I cancel anytime?
                </dt>
                <dd className="mt-2 text-gray-600">
                  Absolutely! You can cancel your subscription at any time with no cancellation fees.
                </dd>
              </div>
            </dl>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-24 text-center">
          <h2 className="text-3xl font-bold text-gray-900">
            Ready to Start Learning?
          </h2>
          <p className="mt-4 text-xl text-gray-600">
            Join thousands of students already learning on Ilm Kademy
          </p>
          <div className="mt-8 flex justify-center space-x-4">
            <Link
              to="/register"
              className="bg-indigo-600 text-white px-8 py-3 rounded-md text-lg font-medium hover:bg-indigo-700"
            >
              Get Started Free
            </Link>
            <Link
              to="/contact"
              className="bg-gray-800 text-white px-8 py-3 rounded-md text-lg font-medium hover:bg-gray-900"
            >
              Contact Sales
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingPage; 
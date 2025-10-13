import React, { useState, useEffect } from 'react';
import { 
  CheckIcon, 
  XMarkIcon,
  CreditCardIcon,
  CalendarIcon,
  DocumentTextIcon,
  CogIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import { API_ENDPOINTS } from '../../config/api';

const SubscriptionsPage = () => {
  const { user, tokens } = useAuth();
  const [currentPlan, setCurrentPlan] = useState(null);
  const [billingHistory, setBillingHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);

  const plans = [
    {
      id: 'basic',
      name: 'Basic',
      price: 9.99,
      period: 'month',
      description: 'Perfect for individual students',
      features: [
        'Access to basic book library',
        '5 quizzes per month',
        'Basic AI assistance',
        'Email support',
        'Mobile responsive'
      ],
      current: false
    },
    {
      id: 'pro',
      name: 'Pro',
      price: 19.99,
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
      current: true
    },
    {
      id: 'institute',
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
      current: false
    }
  ];

  useEffect(() => {
    fetchSubscriptionData();
  }, []);

  const fetchSubscriptionData = async () => {
    try {
      // Check if user is authenticated
      if (!tokens?.access) {
        console.log('No authentication token found, using mock data');
        loadMockData();
        return;
      }

      // Make authenticated API calls using axios
      const [subscriptionResponse, billingResponse] = await Promise.all([
        axios.get(API_ENDPOINTS.SUBSCRIPTIONS + 'current/'),
        axios.get(API_ENDPOINTS.SUBSCRIPTIONS + 'billing-history/')
      ]);

      if (subscriptionResponse.data) {
        setCurrentPlan(subscriptionResponse.data);
      }

      if (billingResponse.data) {
        setBillingHistory(billingResponse.data.results || []);
      }

      // If no data from API, load mock data
      if (!currentPlan) {
        loadMockData();
      }

    } catch (error) {
      console.error('Error fetching subscription data:', error);
      // If API call fails, load mock data for development
      loadMockData();
      toast.error('Failed to load subscription information');
    } finally {
      setIsLoading(false);
    }
  };

  const loadMockData = () => {
    // Mock current plan data
    setCurrentPlan({
      id: 'pro',
      name: 'Pro Plan',
      price: 19.99,
      period: 'month',
      status: 'active',
      next_billing_date: '2024-03-15',
      start_date: '2024-01-15',
      auto_renew: true
    });

    // Mock billing history data
    setBillingHistory([
      {
        id: 1,
        date: '2024-01-15',
        amount: 19.99,
        status: 'paid',
        invoice_number: 'INV-001',
        description: 'Pro Plan - Monthly Subscription'
      },
      {
        id: 2,
        date: '2023-12-15',
        amount: 19.99,
        status: 'paid',
        invoice_number: 'INV-002',
        description: 'Pro Plan - Monthly Subscription'
      },
      {
        id: 3,
        date: '2023-11-15',
        amount: 19.99,
        status: 'paid',
        invoice_number: 'INV-003',
        description: 'Pro Plan - Monthly Subscription'
      }
    ]);
  };

  const handleUpgrade = (planId) => {
    // TODO: Implement plan upgrade logic
    toast.success(`Upgrading to ${planId} plan...`);
    setShowUpgradeModal(false);
  };

  const handleCancel = () => {
    // TODO: Implement cancellation logic
    toast.success('Subscription cancelled successfully');
    setShowCancelModal(false);
  };

  const getStatusBadge = (status) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
      expired: 'bg-gray-100 text-gray-800',
      pending: 'bg-yellow-100 text-yellow-800'
    };
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[status] || colors.pending}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading subscription information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Subscriptions</h1>
            <p className="mt-2 text-gray-600">
              Manage your subscription and billing
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Current Plan */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Current Plan</h2>
                {getStatusBadge(currentPlan?.status)}
              </div>
              
              <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg p-6 mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">{currentPlan?.name}</h3>
                    <p className="text-gray-600 mt-1">
                      ${currentPlan?.price}/{currentPlan?.period}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Next billing</p>
                    <p className="text-lg font-medium text-gray-900">
                      {new Date(currentPlan?.next_billing_date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                
                <div className="mt-4 flex items-center space-x-4">
                  <button
                    onClick={() => setShowUpgradeModal(true)}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors duration-200"
                  >
                    Upgrade Plan
                  </button>
                  <button
                    onClick={() => setShowCancelModal(true)}
                    className="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700 transition-colors duration-200"
                  >
                    Cancel Subscription
                  </button>
                </div>
              </div>

              {/* Plan Features */}
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-3">Your Plan Includes:</h4>
                <ul className="space-y-2">
                  {plans.find(p => p.id === currentPlan?.id)?.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-sm text-gray-600">
                      <CheckIcon className="h-5 w-5 text-green-500 mr-2" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Billing History */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Billing History</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Description
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Invoice
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {billingHistory.map((invoice) => (
                      <tr key={invoice.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(invoice.date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {invoice.description}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ${invoice.amount}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(invoice.status)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <button className="text-indigo-600 hover:text-indigo-900">
                            {invoice.invoice_number}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Available Plans */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Available Plans</h3>
              <div className="space-y-4">
                {plans.map((plan) => (
                  <div
                    key={plan.id}
                    className={`p-4 rounded-lg border ${
                      plan.current ? 'border-indigo-200 bg-indigo-50' : 'border-gray-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{plan.name}</h4>
                      {plan.current && (
                        <span className="text-xs text-indigo-600 font-medium">Current</span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{plan.description}</p>
                    <div className="text-lg font-bold text-gray-900 mb-3">
                      {plan.price === 'Custom' ? 'Custom Pricing' : `$${plan.price}/${plan.period}`}
                    </div>
                    {!plan.current && (
                      <button
                        onClick={() => handleUpgrade(plan.id)}
                        className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors duration-200"
                      >
                        {plan.price === 'Custom' ? 'Contact Sales' : 'Upgrade'}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Payment Method</h3>
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-md">
                <CreditCardIcon className="h-6 w-6 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">•••• •••• •••• 4242</p>
                  <p className="text-xs text-gray-500">Expires 12/25</p>
                </div>
                <button className="ml-auto text-indigo-600 hover:text-indigo-900 text-sm">
                  Edit
                </button>
              </div>
            </div>

            {/* Account Settings */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Account Settings</h3>
              <div className="space-y-3">
                <button className="w-full flex items-center justify-between p-3 text-left hover:bg-gray-50 rounded-md transition-colors duration-200">
                  <span className="text-sm text-gray-700">Billing Preferences</span>
                  <CogIcon className="h-4 w-4 text-gray-400" />
                </button>
                <button className="w-full flex items-center justify-between p-3 text-left hover:bg-gray-50 rounded-md transition-colors duration-200">
                  <span className="text-sm text-gray-700">Download Invoices</span>
                  <DocumentTextIcon className="h-4 w-4 text-gray-400" />
                </button>
                <button className="w-full flex items-center justify-between p-3 text-left hover:bg-gray-50 rounded-md transition-colors duration-200">
                  <span className="text-sm text-gray-700">Tax Information</span>
                  <DocumentTextIcon className="h-4 w-4 text-gray-400" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Upgrade Modal */}
      {showUpgradeModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Upgrade Your Plan</h3>
              <p className="text-sm text-gray-500 mb-6">
                Are you sure you want to upgrade your subscription plan?
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowUpgradeModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleUpgrade('pro')}
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                  Upgrade
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <ExclamationTriangleIcon className="mx-auto h-12 w-12 text-red-500 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-4">Cancel Subscription</h3>
              <p className="text-sm text-gray-500 mb-6">
                Are you sure you want to cancel your subscription? You'll lose access to premium features.
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowCancelModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                >
                  Keep Subscription
                </button>
                <button
                  onClick={handleCancel}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubscriptionsPage; 
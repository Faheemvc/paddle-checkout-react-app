import React, { useEffect, useState } from 'react';

const PlanList = ({ onSelect }) => {
  const [plans, setPlans] = useState([]);
  const [selectedPlanId, setSelectedPlanId] = useState(null);
  const [pricingType, setPricingType] = useState('monthly'); // 'monthly' or 'yearly'
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/v1/plans');
        if (!response.ok) throw new Error('Failed to fetch plans');
        const data = await response.json();
        console.log(data)
        setPlans(data.plans);
      } catch (err) {
        setError(err.message || 'Error fetching plans');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlans();
  }, []);

  const handleSelect = (plan) => {
    const priceId =
      pricingType === 'monthly' ? plan.monthly_price_id : plan.yearly_price_id;

    setSelectedPlanId(plan.id);
    onSelect({ ...plan, priceId, pricingType });
  };

  return (
    <div>
      {error && (
        <div className="mb-6 bg-red-50 border-l-4 border-red-400 p-4" role="alert">
          <p className="text-red-700">
            <strong className="font-bold">Error: </strong>{error}
          </p>
        </div>
      )}

      <div className="flex items-center justify-center mb-6">
        <button
          onClick={() => setPricingType('monthly')}
          className={`py-2 px-4 rounded-l-md border ${
            pricingType === 'monthly'
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-100 text-gray-700'
          }`}
        >
          Monthly
        </button>
        <button
          onClick={() => setPricingType('yearly')}
          className={`py-2 px-4 rounded-r-md border ${
            pricingType === 'yearly'
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-100 text-gray-700'
          }`}
        >
          Yearly
        </button>
      </div>

      {isLoading ? (
        <p>Loading plans...</p>
      ) : (
        <ul className="mb-6">
          {plans.map((plan) => (
            <li key={plan.id} className="mb-4">
              <button
                onClick={() => handleSelect(plan)}
                className={`w-full flex justify-between items-center py-3 px-4 border rounded-md ${
                  selectedPlanId === plan.id
                    ? 'bg-indigo-50 border-indigo-600'
                    : 'bg-gray-100'
                }`}
              >
                <span className="text-lg font-medium text-gray-700">{plan.name}</span>
                <span className="text-gray-500">
                  {pricingType === 'monthly'
                    ? `${plan.monthly_amount} / month`
                    : `${plan.yearly_amount} / year`}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PlanList;

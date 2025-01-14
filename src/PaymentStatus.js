import React from 'react';
import { useSearchParams } from 'react-router-dom';

const PaymentStatus = () => {
  const [searchParams] = useSearchParams();
  const transactionId = searchParams.get('_ptxn');

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-6 bg-white rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Payment Status</h2>
        {transactionId ? (
          <>
            <p className="text-green-600 mb-2">Payment Successful!</p>
            <p className="text-gray-600">Transaction ID: {transactionId}</p>
          </>
        ) : (
          <p className="text-red-600">No transaction ID found</p>
        )}
        <button
          onClick={() => window.location.href = '/'}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          Return to Plans
        </button>
      </div>
    </div>
  );
};

export default PaymentStatus;
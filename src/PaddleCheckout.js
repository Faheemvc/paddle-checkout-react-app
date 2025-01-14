// import React, { useEffect, useState } from 'react';

// const PaddleCheckout = () => {
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const priceId = 'pri_01jeb65ks4hj7ybd9tdfb4bq9q';

//   useEffect(() => {
//     const script = document.createElement('script');
//     script.src = 'https://cdn.paddle.com/paddle/v2/paddle.js';
//     script.async = true;
    
//     script.onload = async () => {
//       try {
//         // Initialize Paddle with the new method
//         window.Paddle.Environment.set("sandbox");
//         await window.Paddle.Initialize({
//           token: 'test_0faad8596d90b231039799029a9',
//         });
//         setIsLoading(false);
//       } catch (err) {
//         setError('Failed to initialize Paddle');
//         setIsLoading(false);
//         console.error('Initialization error:', err);
//       }
//     };

//     script.onerror = () => {
//       setError('Failed to load Paddle script');
//       setIsLoading(false);
//     };

//     document.body.appendChild(script);

//     return () => {
//       document.body.removeChild(script);
//     };
//   }, []);

//   const handleCheckout = async () => {
//     try {
//       setIsLoading(true);
//       await window.Paddle.Checkout.open({
//         items: [{
//           priceId: priceId,
//           quantity: 1
//         }],
//         // transactionId: "txn_01jc8s08aybfmd0aqawqvdjah8",
//         customData: {
//           plan_id: "2616cb36-236a-49d6-9a09-ff5288b4d297",
//           user_id: "d79674de-8701-478a-b51e-20a0710c2a75",
//           organisation_id: "c3da4d18-ab38-4ec9-9748-eeecf303824a"
//         }
//       });
//     } catch (err) {
//       setError('Failed to open checkout');
//       console.error('Checkout error:', err);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div style={{ minHeight: '100vh' }} className="flex items-center justify-center bg-gray-50 p-4">
//       <div className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden">
//         <div className="p-8">
//           <h2 className="text-2xl font-bold text-gray-900 mb-2">
//             Complete Your Purchase
//           </h2>
//           <p className="text-gray-500 text-sm mb-6">
//             Secure checkout powered by Paddle
//           </p>
          
//           {error && (
//             <div className="mb-6 bg-red-50 border-l-4 border-red-400 p-4" role="alert">
//               <div className="flex">
//                 <div>
//                   <p className="text-red-700">
//                     <strong className="font-bold">Error: </strong>
//                     <span>{error}</span>
//                   </p>
//                 </div>
//               </div>
//             </div>
//           )}

//           <button
//             onClick={handleCheckout}
//             disabled={isLoading}
//             className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
//           >
//             {isLoading ? (
//               <span>Loading...</span>
//             ) : (
//               <span>Proceed to Checkout</span>
//             )}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PaddleCheckout;

import React, { useEffect, useState } from 'react';
import PlanList from './PlanList';

const PaddleCheckout = () => {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdn.paddle.com/paddle/v2/paddle.js';
    script.async = true;

    script.onload = async () => {
      try {
        window.Paddle.Environment.set('sandbox');
        await window.Paddle.Initialize({
          token: 'test_0faad8596d90b231039799029a9',
        });
      } catch (err) {
        setError('Failed to initialize Paddle');
      }
    };

    script.onerror = () => {
      setError('Failed to load Paddle script');
    };

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleCheckout = async () => {
    if (!selectedPlan) {
      setError('Please select a plan');
      return;
    }

    try {
      setIsLoading(true);
      await window.Paddle.Checkout.open({
        items: [
          {
            priceId: selectedPlan.priceId,
            quantity: 1,
          },
        ],
        customData: {
          plan_id: selectedPlan.id,
          user_id: '9a546f3e-347b-450c-a3ba-6ed563fad8b2', // Replace with real user ID
          organisation_id: '44c37802-8747-46d8-9459-e3e9e9d216fd', // Replace with real organisation ID
        },
      });
    } catch (err) {
      setError('Failed to open checkout');
      console.error('Checkout error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh' }} className="flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Select a Plan</h2>
          <p className="text-gray-500 text-sm mb-6">
            Choose a plan that fits your needs
          </p>

          <PlanList onSelect={setSelectedPlan} />

          <button
            onClick={handleCheckout}
            disabled={isLoading || !selectedPlan}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Processing...' : 'Proceed to Checkout'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaddleCheckout;

// // TransactionCheckout.js
// import React, { useEffect, useState } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { Card, CardHeader, CardContent } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Loader2 } from 'lucide-react';

// const TransactionCheckout = () => {
//   const { transactionId } = useParams();
//   const navigate = useNavigate();
//   const [status, setStatus] = useState('loading');
//   const [checkoutUrl, setCheckoutUrl] = useState(null);

//   useEffect(() => {
//     const verifyTransaction = async () => {
//       try {
//         // Replace with your actual API endpoint
//         const response = await fetch(`/api/transactions/${transactionId}`);
//         const data = await response.json();
        
//         if (data.checkout?.url) {
//           setCheckoutUrl(data.checkout.url);
//           setStatus('ready');
//         } else {
//           setStatus('error');
//         }
//       } catch (error) {
//         console.error('Error fetching transaction:', error);
//         setStatus('error');
//       }
//     };

//     if (transactionId) {
//       verifyTransaction();
//     }
//   }, [transactionId]);

//   const handleCheckout = () => {
//     if (checkoutUrl) {
//       window.location.href = checkoutUrl;
//     }
//   };

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gray-50">
//       <Card className="w-full max-w-md">
//         <CardHeader>
//           <h2 className="text-2xl font-bold text-center">Checkout</h2>
//         </CardHeader>
//         <CardContent>
//           {status === 'loading' && (
//             <div className="flex flex-col items-center space-y-4">
//               <Loader2 className="h-8 w-8 animate-spin" />
//               <p>Preparing your checkout...</p>
//             </div>
//           )}

//           {status === 'ready' && (
//             <div className="space-y-4">
//               <p className="text-center">Your checkout is ready!</p>
//               <div className="flex justify-center">
//                 <Button onClick={handleCheckout} className="w-full">
//                   Proceed to Payment
//                 </Button>
//               </div>
//             </div>
//           )}

//           {status === 'error' && (
//             <div className="space-y-4">
//               <p className="text-center text-red-600">
//                 There was an error preparing your checkout.
//               </p>
//               <div className="flex justify-center">
//                 <Button onClick={() => navigate('/')} variant="outline">
//                   Return to Homepage
//                 </Button>
//               </div>
//             </div>
//           )}
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

// export default TransactionCheckout;
import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';

const TransactionCheckout = () => {
  const [searchParams] = useSearchParams();
  const transactionId = searchParams.get('_ptxn');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initializePaddle = async () => {
      const script = document.createElement('script');
      script.src = 'https://cdn.paddle.com/paddle/v2/paddle.js';
      script.async = true;

      script.onload = async () => {
        try {
          window.Paddle.Environment.set('sandbox');
          await window.Paddle.Initialize({
            token: 'test_0faad8596d90b231039799029a9',
          });
          openCheckout();
        } catch (err) {
          setError('Failed to initialize Paddle');
          setIsLoading(false);
        }
      };

      script.onerror = () => {
        setError('Failed to load Paddle script');
        setIsLoading(false);
      };

      document.body.appendChild(script);

      return () => {
        document.body.removeChild(script);
      };
    };

    if (transactionId) {
      initializePaddle();
    } else {
      setError('No transaction ID provided');
      setIsLoading(false);
    }
  }, [transactionId]);

  const openCheckout = async () => {
    try {
      await window.Paddle.Checkout.open({
        transactionId: transactionId,
        allowLogout: true,
        successCallback: (data) => {
          console.log('Checkout successful:', data);
          // Handle success - redirect to success page or show success message
          window.location.href = '/billing';
        },
        closeCallback: () => {
          // Handle checkout close
          window.location.href = '/';
        },
      });
      setIsLoading(false);
    } catch (err) {
      setError('Failed to open checkout');
      setIsLoading(false);
      console.error('Checkout error:', err);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-6 bg-white rounded-xl shadow-lg">
        {isLoading ? (
          <div className="text-center">
            <p className="text-gray-600">Loading checkout...</p>
          </div>
        ) : error ? (
          <div className="text-center">
            <p className="text-red-600">{error}</p>
            <button
              onClick={() => window.location.href = '/'}
              className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
            >
              Return Home
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default TransactionCheckout;
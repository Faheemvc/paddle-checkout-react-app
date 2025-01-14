import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const DirectCheckout = () => {
  const { priceId } = useParams();
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
          // Automatically open checkout once Paddle is initialized
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

    initializePaddle();
  }, [priceId]);

  const openCheckout = async () => {
    try {
      await window.Paddle.Checkout.open({
        items: [
          {
            priceId: priceId,
            quantity: 1,
          },
        ],
        customData: {
          plan_id: 'f309cf5f-c11f-46bd-9bd5-68aeda461247',
          user_id: '26ce3c72-920e-484f-92fd-a5ba444213f2', // Replace with real user ID
          organisation_id: '6c9c154c-9bfe-440d-a857-bec0f12aa8f5', // Replace with real organisation ID
        },
        successCallback: (data) => {
          // Handle successful checkout
          console.log('Checkout successful:', data);
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
              Return to Plans
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default DirectCheckout;
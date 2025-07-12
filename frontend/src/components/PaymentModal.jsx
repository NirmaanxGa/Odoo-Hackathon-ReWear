import React, { useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { toast } from 'react-toastify';

const PaymentModal = ({ isOpen, onClose, item, selectedSize, onPaymentSuccess }) => {
  const { user } = useUser();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: ''
  });

  if (!isOpen) return null;

  const handlePayment = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      // Simulate Clerk payment processing
      toast.info("Processing payment with Clerk...", { autoClose: 1500 });
      
      // Simulate payment delay
      await new Promise(resolve => setTimeout(resolve, 2500));

      // Create payment data
      const paymentData = {
        amount: item.price * 100, // Convert to cents
        currency: "inr",
        customer_email: user?.emailAddresses[0]?.emailAddress,
        customer_name: user?.fullName || user?.firstName || "Customer",
        item_id: item.id,
        item_title: item.title,
        size: selectedSize,
        payment_method: paymentMethod,
        payment_id: `pay_${Date.now()}`,
        clerk_customer_id: user?.id,
        status: 'succeeded'
      };

      // Call success handler
      onPaymentSuccess(paymentData);
      
      // Close modal
      onClose();
      
      toast.success("Payment successful! Order confirmed.", {
        autoClose: 3000,
      });

    } catch (error) {
      console.error("Payment failed:", error);
      toast.error("Payment failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCardInputChange = (field, value) => {
    setCardDetails(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-medium text-gray-900">Complete Purchase</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl leading-none w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
              disabled={isProcessing}
            >
              ×
            </button>
          </div>

          {/* Order Summary */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-3">Order Summary</h3>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">{item.title}</span>
              <span className="text-sm font-medium">₹{item.price}</span>
            </div>
            {selectedSize && (
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">Size</span>
                <span className="text-sm">{selectedSize}</span>
              </div>
            )}
            <div className="border-t pt-2 mt-2">
              <div className="flex justify-between items-center">
                <span className="font-medium">Total</span>
                <span className="font-medium text-lg">₹{item.price}</span>
              </div>
            </div>
          </div>

          {/* Payment Form */}
          <form onSubmit={handlePayment}>
            {/* Payment Method */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Payment Method
              </label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="card"
                    checked={paymentMethod === 'card'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mr-2"
                  />
                  <span className="text-sm">Credit/Debit Card</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="upi"
                    checked={paymentMethod === 'upi'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mr-2"
                  />
                  <span className="text-sm">UPI</span>
                </label>
              </div>
            </div>

            {/* Card Details */}
            {paymentMethod === 'card' && (
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Card Number
                  </label>
                  <input
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    value={cardDetails.number}
                    onChange={(e) => handleCardInputChange('number', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-black text-sm"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      value={cardDetails.expiry}
                      onChange={(e) => handleCardInputChange('expiry', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-black text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      CVV
                    </label>
                    <input
                      type="text"
                      placeholder="123"
                      value={cardDetails.cvv}
                      onChange={(e) => handleCardInputChange('cvv', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-black text-sm"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cardholder Name
                  </label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    value={cardDetails.name}
                    onChange={(e) => handleCardInputChange('name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-black text-sm"
                    required
                  />
                </div>
              </div>
            )}

            {/* UPI Details */}
            {paymentMethod === 'upi' && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  UPI ID
                </label>
                <input
                  type="text"
                  placeholder="your-upi@paytm"
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-black text-sm"
                  required
                />
              </div>
            )}

            {/* Customer Info */}
            <div className="mb-6 p-3 bg-gray-50 rounded text-sm">
              <div className="text-gray-600">
                <strong>Customer:</strong> {user?.fullName || user?.firstName || 'Customer'}
              </div>
              <div className="text-gray-600">
                <strong>Email:</strong> {user?.emailAddresses[0]?.emailAddress}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isProcessing}
              className={`w-full py-3 rounded font-medium transition-colors ${
                isProcessing
                  ? 'bg-gray-400 text-white cursor-not-allowed'
                  : 'bg-black text-white hover:bg-gray-800'
              }`}
            >
              {isProcessing ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                  Processing Payment...
                </div>
              ) : (
                `Pay ₹${item.price}`
              )}
            </button>
          </form>

          {/* Powered by Clerk */}
          <div className="text-center mt-4">
            <p className="text-xs text-gray-500">Secured by Clerk</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;

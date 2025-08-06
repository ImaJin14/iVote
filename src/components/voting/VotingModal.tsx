import React, { useState } from 'react';
import { useVoting } from '../../contexts/VotingContext';
import { Contestant, Competition, PaymentMethod } from '../../types';
import { X, CreditCard, Smartphone, CheckCircle, AlertCircle, Loader, Gift } from 'lucide-react';

interface VotingModalProps {
  contestant: Contestant;
  competition: Competition;
  onClose: () => void;
}

const VotingModal: React.FC<VotingModalProps> = ({ contestant, competition, onClose }) => {
  const { submitVote, state } = useVoting();
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod | null>(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState(false);
  const [error, setError] = useState('');

  const requiresPayment = competition.votingRules.requirePayment;
  const votePrice = competition.votingRules.votePrice;

  const paymentMethods = [
    {
      id: 'mtn' as PaymentMethod,
      name: 'MTN Mobile Money',
      icon: <Smartphone className="w-6 h-6" />,
      color: 'bg-yellow-500',
      description: 'Pay with your MTN Mobile Money account'
    },
    {
      id: 'orange' as PaymentMethod,
      name: 'Orange Money',
      icon: <Smartphone className="w-6 h-6" />,
      color: 'bg-orange-500',
      description: 'Pay with your Orange Money account'
    },
    {
      id: 'card' as PaymentMethod,
      name: 'Credit/Debit Card',
      icon: <CreditCard className="w-6 h-6" />,
      color: 'bg-blue-500',
      description: 'Pay with your credit or debit card'
    }
  ];

  const handlePayment = async () => {
    setIsProcessing(true);
    setError('');

    try {
      // Validate inputs for paid voting
      if (requiresPayment) {
        if (!selectedPayment) {
          throw new Error('Please select a payment method');
        }
        
        if ((selectedPayment === 'mtn' || selectedPayment === 'orange') && !phoneNumber) {
          throw new Error('Phone number is required');
        }
        
        if (selectedPayment === 'card' && (!cardDetails.number || !cardDetails.expiry || !cardDetails.cvv)) {
          throw new Error('All card details are required');
        }
      }

      const success = await submitVote(
        competition.id,
        contestant.id,
        requiresPayment ? selectedPayment! : undefined,
        requiresPayment ? votePrice : undefined,
        phoneNumber || undefined
      );

      if (success) {
        setPaymentComplete(true);
      } else {
        throw new Error('Vote submission failed. Please try again.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Vote submission failed');
    } finally {
      setIsProcessing(false);
    }
  };

  if (paymentComplete) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Vote Successful!</h3>
          <p className="text-gray-600 mb-6">
            Your vote for <strong>{contestant.name}</strong> in <strong>{competition.title}</strong> has been recorded successfully.
          </p>
          <button
            onClick={onClose}
            className="bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
          >
            Continue
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">Cast Your Vote</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Competition & Contestant Info */}
        <div className="p-6 border-b">
          <div className="text-center mb-4">
            <h3 className="text-lg font-semibold text-blue-600">{competition.title}</h3>
          </div>
          <div className="flex items-center gap-4">
            <img
              src={contestant.photo}
              alt={contestant.name}
              className="w-16 h-16 rounded-full object-cover"
            />
            <div>
              <h3 className="text-xl font-semibold text-gray-900">{contestant.name}</h3>
              <p className="text-gray-600">{contestant.category}</p>
              <p className={`font-semibold ${requiresPayment ? 'text-blue-600' : 'text-green-600'}`}>
                {requiresPayment ? `Vote Cost: $${votePrice}` : 'Free Vote'}
              </p>
            </div>
          </div>
        </div>

        <div className="p-6">
          {requiresPayment ? (
            <>
              {/* Payment Methods */}
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Select Payment Method</h4>
              
              <div className="space-y-3 mb-6">
                {paymentMethods.map((method) => (
                  <button
                    key={method.id}
                    onClick={() => setSelectedPayment(method.id)}
                    className={`w-full p-4 rounded-xl border-2 transition-all ${
                      selectedPayment === method.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full text-white ${method.color}`}>
                        {method.icon}
                      </div>
                      <div className="text-left">
                        <div className="font-semibold text-gray-900">{method.name}</div>
                        <div className="text-sm text-gray-600">{method.description}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {/* Payment Details */}
              {selectedPayment && (
                <div className="mb-6">
                  {(selectedPayment === 'mtn' || selectedPayment === 'orange') && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="e.g., +237 6XX XXX XXX"
                        className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  )}

                  {selectedPayment === 'card' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Card Number
                        </label>
                        <input
                          type="text"
                          value={cardDetails.number}
                          onChange={(e) => setCardDetails(prev => ({ ...prev, number: e.target.value }))}
                          placeholder="1234 5678 9012 3456"
                          className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Expiry Date
                          </label>
                          <input
                            type="text"
                            value={cardDetails.expiry}
                            onChange={(e) => setCardDetails(prev => ({ ...prev, expiry: e.target.value }))}
                            placeholder="MM/YY"
                            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            CVV
                          </label>
                          <input
                            type="text"
                            value={cardDetails.cvv}
                            onChange={(e) => setCardDetails(prev => ({ ...prev, cvv: e.target.value }))}
                            placeholder="123"
                            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Cardholder Name
                        </label>
                        <input
                          type="text"
                          value={cardDetails.name}
                          onChange={(e) => setCardDetails(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="John Doe"
                          className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </>
          ) : (
            /* Free Voting */
            <div className="mb-6 text-center">
              <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                <Gift className="w-12 h-12 text-green-600 mx-auto mb-3" />
                <h4 className="text-lg font-semibold text-green-900 mb-2">Free Vote!</h4>
                <p className="text-green-700">
                  This competition allows free voting. Click the button below to cast your vote.
                </p>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-red-700">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          {/* Submit Button */}
          <button
            onClick={handlePayment}
            disabled={isProcessing || (requiresPayment && !selectedPayment)}
            className="w-full bg-blue-600 text-white py-4 px-6 rounded-xl font-semibold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            {isProcessing ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                {requiresPayment ? 'Processing Payment...' : 'Submitting Vote...'}
              </>
            ) : (
              requiresPayment ? `Complete Payment - $${votePrice}` : 'Cast Free Vote'
            )}
          </button>

          {/* Security Notice */}
          <div className="mt-4 p-3 bg-gray-50 rounded-xl">
            <p className="text-xs text-gray-600">
              🔒 {requiresPayment 
                ? 'Your payment is secured with industry-standard encryption. All transactions are verified and votes are recorded immediately upon successful payment.'
                : 'Your vote is secure and will be recorded immediately. All voting activity is monitored to ensure fairness.'
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VotingModal;
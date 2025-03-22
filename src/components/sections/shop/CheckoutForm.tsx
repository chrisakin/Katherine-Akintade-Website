import React, { useState } from 'react';
import { X, Truck, MapPin, CreditCard } from 'lucide-react';
import emailjs from '@emailjs/browser';

interface CheckoutFormProps {
  onClose: () => void;
  product: {
    name: string;
    price: number;
  };
}

const PICKUP_ADDRESS = "84/85, Modern Ebute Shopping Complex, Ebute, Ikorodu, Lagos.";

const nigerianStates = [
  'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 
  'Borno', 'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'FCT', 
  'Gombe', 'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 
  'Kwara', 'Lagos', 'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo', 
  'Plateau', 'Rivers', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara'
];

const getShippingFee = (state: string) => {
  if (state === 'pickup') return 0;
  if (state === 'Lagos') return 3500;
  
  const group6000 = [
    'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue',
    'Borno', 'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'FCT',
    'Gombe', 'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi',
    'Kwara', 'Nasarawa', 'Niger', 'Plateau', 'Rivers', 'Sokoto', 'Taraba',
    'Yobe', 'Zamfara'
  ];

  const group4500 = ['Ogun', 'Ondo', 'Osun', 'Oyo'];

  if (group6000.includes(state)) return 6000;
  if (group4500.includes(state)) return 4500;
  
  return 5000;
};

const getDeliveryTime = (state: string) => {
  if (state === 'pickup') return 'Pick up in store';
  if (state === 'Lagos') return '1 - 3 business days';
  return '2 - 5 business days';
};

export default function CheckoutForm({ onClose, product }: CheckoutFormProps) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    deliveryOption: 'pickup',
    state: '',
    shippingAddress: '',
    billingAddress: '',
    sameAsBilling: true,
  });

  const [showConfirmation, setShowConfirmation] = useState(false);
  const [error, setError] = useState('');

  const shippingFee = getShippingFee(formData.deliveryOption);
  const totalAmount = product.price + shippingFee;
  const deliveryTime = getDeliveryTime(formData.deliveryOption);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      await emailjs.send(
        'service_p41p2us',
        'template_t31ik6l',
        {
          to_email: 'imagebyayobola@gmail.com',
          from_name: formData.fullName,
          from_email: formData.email,
          phone: formData.phone,
          delivery_option: formData.deliveryOption,
          state: formData.state,
          shipping_address: formData.deliveryOption === 'pickup' ? PICKUP_ADDRESS : formData.shippingAddress,
          billing_address: formData.sameAsBilling ? formData.shippingAddress : formData.billingAddress,
          product_name: product.name,
          product_price: `₦${product.price.toLocaleString()}`,
          shipping_fee: `₦${shippingFee.toLocaleString()}`,
          total_amount: `₦${totalAmount.toLocaleString()}`,
          delivery_time: deliveryTime,
        },
        'EOH6jN_i_V1bVcO8P'
      );
      
      setShowConfirmation(true);
    } catch (error) {
      console.error('Failed to send email:', error);
      setError('Failed to send order. Please try again or contact us directly.');
    }
  };

  if (showConfirmation) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
          <h3 className="text-2xl font-bold mb-6 text-gray-900">Thank You!</h3>
          <div className="space-y-6">
            <div className="bg-mint/20 p-6 rounded-xl">
              <p className="text-lg font-medium text-gray-900 mb-2">
                Total Amount: ₦{totalAmount.toLocaleString()}
              </p>
              <p className="text-sm text-gray-600">
                Please make a bank transfer to:
              </p>
              <div className="mt-3 space-y-1">
                <p className="font-medium">United Bank for Africa</p>
                <p className="font-medium">1026728341</p>
                <p className="font-medium">Image by Ayobola Studios</p>
              </div>
            </div>
            
            <div className="text-sm text-gray-600">
              <p className="mb-2">
                After making the payment, please send your proof of payment to:
              </p>
              <p className="font-medium text-gray-900">imagebyayobola@gmail.com</p>
            </div>

            <button
              onClick={onClose}
              className="w-full py-4 bg-gray-900 text-white rounded-xl hover:bg-gray-800 
                transition-colors font-medium text-sm"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h3 className="text-2xl font-bold text-gray-900">Checkout</h3>
            <p className="text-sm text-gray-500 mt-1">{product.name}</p>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-xl text-sm">
            {error}
          </div>
        )}

        <div className="mb-8 p-6 bg-gray-50 rounded-xl space-y-3">
          <div className="flex justify-between items-center">
            <p className="text-gray-600">Product Price</p>
            <p className="font-medium">₦{product.price.toLocaleString()}</p>
          </div>
          {formData.deliveryOption !== 'pickup' && (
            <div className="flex justify-between items-center">
              <p className="text-gray-600">Shipping Fee</p>
              <p className="font-medium">₦{shippingFee.toLocaleString()}</p>
            </div>
          )}
          <div className="pt-3 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <p className="font-medium text-gray-900">Total Amount</p>
              <p className="text-xl font-bold text-gray-900">₦{totalAmount.toLocaleString()}</p>
            </div>
            <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
              <Truck size={16} />
              <p>
                {formData.deliveryOption === 'pickup' ? (
                  <>Pick up at our store</>
                ) : (
                  <>Estimated delivery: {deliveryTime}</>
                )}
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900 flex items-center gap-2">
              <CreditCard size={18} />
              Contact Information
            </h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none 
                    focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none 
                    focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none 
                    focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium text-gray-900 flex items-center gap-2">
              <MapPin size={18} />
              Delivery Information
            </h4>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Delivery Option
              </label>
              <select
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none 
                  focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all"
                value={formData.deliveryOption}
                onChange={(e) => setFormData({ ...formData, deliveryOption: e.target.value })}
              >
                <option value="pickup">Pick up in store</option>
                {nigerianStates.map((state) => (
                  <option key={state} value={state}>
                    Ship to {state}
                  </option>
                ))}
              </select>
            </div>

            {formData.deliveryOption === 'pickup' ? (
              <div className="p-4 bg-mint/20 rounded-xl">
                <p className="font-medium text-gray-900 mb-2">Pickup Address:</p>
                <p className="text-gray-600">{PICKUP_ADDRESS}</p>
              </div>
            ) : (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Shipping Address
                  </label>
                  <textarea
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none 
                      focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all"
                    rows={3}
                    value={formData.shippingAddress}
                    onChange={(e) => setFormData({ ...formData, shippingAddress: e.target.value })}
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="sameAsBilling"
                    checked={formData.sameAsBilling}
                    onChange={(e) => setFormData({ ...formData, sameAsBilling: e.target.checked })}
                    className="rounded border-gray-300 text-gray-900 focus:ring-gray-400"
                  />
                  <label htmlFor="sameAsBilling" className="text-sm text-gray-600">
                    Billing address same as shipping
                  </label>
                </div>

                {!formData.sameAsBilling && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Billing Address
                    </label>
                    <textarea
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none 
                        focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all"
                      rows={3}
                      value={formData.billingAddress}
                      onChange={(e) => setFormData({ ...formData, billingAddress: e.target.value })}
                    />
                  </div>
                )}
              </>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-gray-900 text-white rounded-xl hover:bg-gray-800 
              transition-colors font-medium text-sm mt-8"
          >
            Place Order
          </button>
        </form>
      </div>
    </div>
  );
}
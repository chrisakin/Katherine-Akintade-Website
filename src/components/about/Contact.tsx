import React, { useState } from 'react';
import emailjs from '@emailjs/browser';

export default function Contact() {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    preferredDate: '',
    message: ''
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setStatusMessage('');

    try {
      await emailjs.send(
        'service_p41p2us',
        'template_p9yk90t',
        {
          to_email: 'imagebyayobola@gmail.com',
          from_name: formData.name,
          from_email: formData.email,
          phone: formData.phone,
          preferred_date: formData.preferredDate,
          message: formData.message,
          consultation_type: 'Free Consultation Request'
        },
        'EOH6jN_i_V1bVcO8P'
      );

      setStatus('success');
      setStatusMessage('Thank you! We will contact you shortly to confirm your consultation.');
      setFormData({
        name: '',
        email: '',
        phone: '',
        preferredDate: '',
        message: ''
      });
    } catch (error) {
      setStatus('error');
      setStatusMessage('Something went wrong. Please try again later.');
      console.error('Failed to send email:', error);
    }
  };

  return (
    <div className="bg-gray-50 p-8 rounded-lg border border-gray-200">
      <h2 className="text-3xl font-bold mb-6 text-gray-900">Start Your Journey</h2>
      <p className="text-gray-700 mb-8">
        Ready to explore photography and personal growth? Get in touch to learn more 
        about our programs and how we can support your creative journey.
      </p>

      {!showForm ? (
        <button 
          onClick={() => setShowForm(true)}
          className="w-full sm:w-auto px-6 py-3 bg-gray-900 text-white rounded-lg 
            hover:bg-gray-800 transition-colors"
        >
          Schedule a Free Consultation
        </button>
      ) : (
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-6">Book Your Free Consultation</h3>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="name"
                  required
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 
                    focus:ring-gray-400 focus:border-transparent"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  required
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 
                    focus:ring-gray-400 focus:border-transparent"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  id="phone"
                  required
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 
                    focus:ring-gray-400 focus:border-transparent"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>

              <div>
                <label htmlFor="preferredDate" className="block text-sm font-medium text-gray-700 mb-1">
                  Preferred Date
                </label>
                <input
                  type="date"
                  id="preferredDate"
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 
                    focus:ring-gray-400 focus:border-transparent"
                  value={formData.preferredDate}
                  onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                Message (Optional)
              </label>
              <textarea
                id="message"
                rows={4}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 
                  focus:ring-gray-400 focus:border-transparent"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Tell us about your interests and what you hope to achieve..."
              />
            </div>

            {statusMessage && (
              <div className={`p-4 rounded-lg ${
                status === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
              }`}>
                {statusMessage}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                type="submit"
                disabled={status === 'loading'}
                className="px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 
                  transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex-1"
              >
                {status === 'loading' ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Sending...
                  </span>
                ) : (
                  'Submit Request'
                )}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 
                  transition-colors text-gray-700"
              >
                Cancel
              </button>
            </div>
          </form>

          <p className="text-sm text-gray-600 mt-6">
            Parents and teens welcome. We'll get back to you within 24-48 hours to confirm your consultation.
          </p>
        </div>
      )}
    </div>
  );
}
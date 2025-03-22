import React, { useState } from 'react';
import { Send } from 'lucide-react';
import emailjs from '@emailjs/browser';

export default function Newsletter() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: ''
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setMessage('');

    try {
      await emailjs.send(
        'service_p41p2us',  // Your service ID
        'template_p9yk90t', // Your template ID
        {
          to_email: 'imagebyayobola@gmail.com',
          from_name: `${formData.firstName} ${formData.lastName}`,
          from_email: formData.email,
          subscription_type: 'Newsletter',
        },
        'EOH6jN_i_V1bVcO8P'  // Your public key
      );

      setStatus('success');
      setMessage('Thank you for subscribing to our mailing list!');
      setFormData({ firstName: '', lastName: '', email: '' });
    } catch (error) {
      setStatus('error');
      setMessage('Something went wrong. Please try again later.');
      console.error('Failed to send email:', error);
    }
  };

  return (
    <div>
      <h3 className="font-semibold text-gray-900 mb-2">Join My Mailing List</h3>
      <p className="text-sm text-gray-600 mb-4">
        Stay updated with my latest work, blog posts, and upcoming events.
      </p>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="firstName" className="sr-only">First Name</label>
            <input
              type="text"
              id="firstName"
              placeholder="First Name"
              required
              disabled={status === 'loading'}
              className="w-full px-4 py-2 text-sm bg-white rounded border border-gray-300 
                focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent
                placeholder:text-gray-400 disabled:bg-gray-100 disabled:cursor-not-allowed"
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
            />
          </div>
          <div>
            <label htmlFor="lastName" className="sr-only">Last Name</label>
            <input
              type="text"
              id="lastName"
              placeholder="Last Name"
              required
              disabled={status === 'loading'}
              className="w-full px-4 py-2 text-sm bg-white rounded border border-gray-300 
                focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent
                placeholder:text-gray-400 disabled:bg-gray-100 disabled:cursor-not-allowed"
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            />
          </div>
        </div>
        <div>
          <label htmlFor="email" className="sr-only">Email Address</label>
          <input
            type="email"
            id="email"
            placeholder="Email Address"
            required
            disabled={status === 'loading'}
            className="w-full px-4 py-2 text-sm bg-white rounded border border-gray-300 
              focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent
              placeholder:text-gray-400 disabled:bg-gray-100 disabled:cursor-not-allowed"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </div>
        {message && (
          <div className={`text-sm rounded p-3 ${
            status === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
          }`}>
            {message}
          </div>
        )}
        <button 
          type="submit"
          disabled={status === 'loading'}
          className="w-full px-4 py-2 bg-gray-900 text-white rounded text-sm 
            hover:bg-gray-800 transition-colors flex items-center justify-center gap-2
            disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {status === 'loading' ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Subscribing...
            </>
          ) : (
            <>
              <Send size={16} />
              Subscribe
            </>
          )}
        </button>
      </form>
    </div>
  );
}
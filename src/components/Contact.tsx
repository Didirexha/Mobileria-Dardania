import React, { useState } from 'react';

const Contact: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Define the target phone number (without the +)
      const phoneNumber = '38349514788';
      
      // Construct the message text with URL-encoded newlines (%0A)
      const text = `Name: ${name} | Email: ${email} | Message: ${message}`;
      
      // Encode the text for the URL (encodeURIComponent will handle %0A correctly)
      const encodedText = encodeURIComponent(text);
      
      // Construct the wa.me link
      const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedText}`;
      
      // Open WhatsApp in a new tab
      window.open(whatsappUrl, '_blank');
      
      setSuccess(true);
      // Clear form after successful attempt
      setName('');
      setEmail('');
      setMessage('');

    } catch (err) {
      setError('Could not generate WhatsApp link. Please try again.');
      console.error('Contact form error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="pt-32 pb-20 min-h-screen bg-custom-bg flex items-center justify-center" style={{backgroundColor: 'rgb(249, 245, 240)'}}>
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg p-8 mx-2">
        <h2 className="text-4xl font-light text-center mb-4">Contact Us</h2>
        <p className="text-gray-500 text-center mb-8">We'd love to hear from you! Fill out the form below and our team will get back to you soon.</p>
        
        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
        
        {success && (
          <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
            Opening WhatsApp chat...
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-gray-700 mb-2">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:border-gray-900 bg-gray-100"
              disabled={loading}
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-gray-700 mb-2">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:border-gray-900 bg-gray-100"
              disabled={loading}
            />
          </div>
          <div>
            <label htmlFor="message" className="block text-gray-700 mb-2">Message</label>
            <textarea
              id="message"
              name="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              rows={5}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:border-gray-900 bg-gray-100 resize-none"
              disabled={loading}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-gray-900 text-white py-3 rounded-md font-medium text-lg hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? 'Opening...' : 'Send via WhatsApp'}
          </button>
        </form>
        <div className="mt-12 text-center text-gray-500">
          <div className="mb-2">
            <span className="font-semibold text-gray-700">Email:</span> info@mobileriadardania.com
          </div>
          <div className="mb-2">
            <span className="font-semibold text-gray-700">Phone:</span> +383 48 222 209
          </div>
          <div>
            <span className="font-semibold text-gray-700">Address:</span> 123 Furniture Street, Design District, 10000
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact; 
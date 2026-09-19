import { useState } from 'react';
import toast from 'react-hot-toast';
import { FiMail, FiMessageSquare, FiSend, FiMapPin, FiPhone, FiHelpCircle } from 'react-icons/fi';

const faqs = [
  { q: 'How does GreenRoots calculate CO₂ offset?', a: 'We use established environmental research metrics estimating an average native tree absorbs ~22kg of CO₂ per year as it reaches maturity.' },
  { q: 'Can I track trees planted on private property?', a: 'Yes! You can log trees anywhere — your backyard, community garden, or public reforestation events.' },
  { q: 'Is GreenRoots free to use?', a: 'Yes, GreenRoots is 100% free for community members and non-profit environmental groups.' },
];

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [activeFaq, setActiveFaq] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success('Thank you for your message! Our team will respond shortly 🌱');
    setForm({ name: '', email: '', message: '' });
  };

  return (
    <div className="min-h-screen pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h1 className="text-4xl font-bold font-display text-gradient">Get in Touch</h1>
        <p className="text-gray-300 text-sm mt-2">
          Have questions, partnership inquiries, or suggestions? We’d love to hear from you.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Contact Form */}
        <div className="card glass p-8 border border-forest/30">
          <h2 className="text-xl font-bold font-display text-white mb-6">Send us a message</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">Your Name</label>
              <input
                type="text"
                required
                placeholder="Jane Doe"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full bg-forest-dark/40 border border-forest/30 rounded-xl px-3.5 py-2.5 text-sm text-gray-200 focus:outline-none focus:border-forest-light"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">Email Address</label>
              <input
                type="email"
                required
                placeholder="jane@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full bg-forest-dark/40 border border-forest/30 rounded-xl px-3.5 py-2.5 text-sm text-gray-200 focus:outline-none focus:border-forest-light"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">Message</label>
              <textarea
                rows={4}
                required
                placeholder="How can we help?"
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="w-full bg-forest-dark/40 border border-forest/30 rounded-xl px-3.5 py-2.5 text-sm text-gray-200 focus:outline-none focus:border-forest-light"
              />
            </div>

            <button type="submit" className="btn-primary w-full py-3 text-sm flex items-center justify-center gap-2">
              Send Message <FiSend />
            </button>
          </form>
        </div>

        {/* FAQs & Contact Details */}
        <div className="space-y-6">
          <div className="card glass p-6 border border-forest/20">
            <h3 className="font-bold text-lg text-white mb-4 flex items-center gap-2">
              <FiHelpCircle className="text-light-green" /> Frequently Asked Questions
            </h3>

            <div className="space-y-3">
              {faqs.map((faq, i) => (
                <div key={i} className="glass p-3 rounded-xl border border-white/5 cursor-pointer" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>
                  <h4 className="font-semibold text-xs text-white flex justify-between items-center">
                    {faq.q}
                    <span className="text-light-green">{activeFaq === i ? '−' : '+'}</span>
                  </h4>
                  {activeFaq === i && (
                    <p className="text-xs text-gray-300 mt-2 leading-relaxed pt-2 border-t border-white/10">{faq.a}</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="card glass p-6 border border-forest/20 space-y-3 text-xs text-gray-300">
            <div className="flex items-center gap-3">
              <FiMail className="text-light-green text-base" /> contact@greenroots.org
            </div>
            <div className="flex items-center gap-3">
              <FiMapPin className="text-light-green text-base" /> GreenRoots Earth Foundation, San Francisco, CA
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

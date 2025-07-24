import React, { useState } from 'react';
import { 
  Users, 
  Target, 
  Mail, 
  Phone, 
  MapPin,
  Send,
  Heart,
  Award,
  Globe
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const AboutPage: React.FC = () => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsSubmitting(false);
    setSubmitSuccess(true);
    setFormData({ name: '', email: '', message: '' });
    
    // Reset success message after 3 seconds
    setTimeout(() => setSubmitSuccess(false), 3000);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const teamMembers = [
    {
      name: 'Dr. Priya Sharma',
      role: 'AI Research Lead',
      image: 'https://images.pexels.com/photos/3182812/pexels-photo-3182812.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'PhD in Computer Vision, specialized in agricultural AI applications'
    },
    {
      name: 'Rajesh Kumar',
      role: 'Agricultural Expert',
      image: 'https://images.pexels.com/photos/2709388/pexels-photo-2709388.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: '15+ years experience in crop disease management and organic farming'
    },
    {
      name: 'Anita Patel',
      role: 'Software Engineer',
      image: 'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'Full-stack developer with expertise in mobile and web applications'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      {/* Hero Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-green-800 mb-6">
            {t('about.title')}
          </h1>
          <p className="text-xl text-green-600 max-w-3xl mx-auto leading-relaxed">
            {t('about.hero.subtitle')}
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <Target className="w-8 h-8 text-green-600" />
                <h2 className="text-3xl font-bold text-green-800">
                  {t('about.mission')}
                </h2>
              </div>
              <p className="text-lg text-green-700 leading-relaxed mb-6">
                {t('about.mission.text')}
              </p>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Heart className="w-6 h-6 text-red-500 mt-1" />
                  <div>
                    <h3 className="font-semibold text-green-800">Farmer-First Approach</h3>
                    <p className="text-green-600">{t('about.mission.farmerFirst')}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Award className="w-6 h-6 text-yellow-500 mt-1" />
                  <div>
                    <h3 className="font-semibold text-green-800">Proven Accuracy</h3>
                    <p className="text-green-600">{t('about.mission.accuracy')}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Globe className="w-6 h-6 text-blue-500 mt-1" />
                  <div>
                    <h3 className="font-semibold text-green-800">Local Language Support</h3>
                    <p className="text-green-600">{t('about.mission.languages')}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="lg:order-first">
              <img
                src="https://images.pexels.com/photos/1595104/pexels-photo-1595104.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Farmers working in field"
                className="rounded-2xl shadow-xl w-full h-96 object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <Users className="w-8 h-8 text-green-600" />
              <h2 className="text-3xl font-bold text-green-800">
                {t('about.team')}
              </h2>
            </div>
            <p className="text-lg text-green-600">
              {t('about.team.subtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="text-xl font-semibold text-green-800 mb-2">
                  {member.name}
                </h3>
                <p className="text-green-600 font-medium mb-3">
                  {member.role}
                </p>
                <p className="text-green-700 text-sm leading-relaxed">
                  {member.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <Mail className="w-8 h-8 text-green-600" />
                <h2 className="text-3xl font-bold text-green-800">
                  {t('about.contact')}
                </h2>
              </div>
              
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="bg-green-100 p-3 rounded-lg">
                    <Mail className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-green-800">Email</p>
                    <p className="text-green-600">support@agroguardian.com</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="bg-green-100 p-3 rounded-lg">
                    <Phone className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-green-800">Phone</p>
                    <p className="text-green-600">+91 1800-AGRO-HELP</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="bg-green-100 p-3 rounded-lg">
                    <MapPin className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-green-800">Office</p>
                    <p className="text-green-600">Bengaluru, Karnataka, India</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 p-6 bg-green-50 rounded-xl border border-green-200">
                <h3 className="font-semibold text-green-800 mb-2">Support Hours</h3>
                <p className="text-green-600 text-sm">{t('about.contact.hours')}</p>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-green-50 p-8 rounded-2xl border border-green-200">
              <h3 className="text-2xl font-semibold text-green-800 mb-6">
                {t('about.contact.form')}
              </h3>
              
              {submitSuccess && (
                <div className="mb-6 p-4 bg-green-100 border border-green-300 rounded-lg">
                  <p className="text-green-700 font-medium">{t('about.contact.success')}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-green-800 font-medium mb-2">
                    {t('about.contact.name')}
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full p-3 border border-green-300 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-colors"
                  />
                </div>
                
                <div>
                  <label className="block text-green-800 font-medium mb-2">
                    {t('about.contact.email')}
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full p-3 border border-green-300 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-colors"
                  />
                </div>
                
                <div>
                  <label className="block text-green-800 font-medium mb-2">
                    {t('about.contact.message')}
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={4}
                    className="w-full p-3 border border-green-300 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-colors resize-none"
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2 ${
                    isSubmitting
                      ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                      : 'bg-green-600 hover:bg-green-700 text-white'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-gray-700 border-t-transparent rounded-full animate-spin"></div>
                      <span>{t('about.contact.sending')}</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      <span>{t('about.contact.send')}</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
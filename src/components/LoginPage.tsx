import React, { useState } from 'react';
import { 
  Phone, 
  Mail, 
  User, 
  MapPin, 
  Languages, 
  Shield,
  ArrowRight,
  Loader2
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface LoginPageProps {
  onLogin: (userData: any) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const { t, language } = useLanguage();
  const [step, setStep] = useState<'phone' | 'otp' | 'profile'>('phone');
  const [formData, setFormData] = useState({
    phone: '',
    otp: '',
    name: '',
    email: '',
    location: '',
    language: language
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isNewUser, setIsNewUser] = useState(false);

  const handleSendOTP = async () => {
    if (!formData.phone) {
      setError('Phone number is required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          phone: formData.phone,
          email: formData.email 
        })
      });

      const data = await response.json();

      if (data.success) {
        setStep('otp');
      } else {
        setError(data.error || 'Failed to send OTP');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!formData.otp) {
      setError('OTP is required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: formData.phone,
          otp: formData.otp,
          name: formData.name,
          email: formData.email,
          location: formData.location,
          language: formData.language
        })
      });

      const data = await response.json();

      if (data.success) {
        if (data.isNewUser && !formData.name) {
          setIsNewUser(true);
          setStep('profile');
        } else {
          // Store token and user data
          localStorage.setItem('authToken', data.token);
          localStorage.setItem('userData', JSON.stringify(data.user));
          onLogin(data.user);
        }
      } else {
        setError(data.error || 'Invalid OTP');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteProfile = async () => {
    if (!formData.name) {
      setError('Name is required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: formData.phone,
          otp: formData.otp,
          name: formData.name,
          email: formData.email,
          location: formData.location,
          language: formData.language
        })
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('userData', JSON.stringify(data.user));
        onLogin(data.user);
      } else {
        setError(data.error || 'Failed to create profile');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="bg-green-100 p-4 rounded-full inline-block mb-4">
            <Shield className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-green-800 mb-2">
            {step === 'phone' && 'Welcome to AgroGuardian'}
            {step === 'otp' && 'Verify Your Phone'}
            {step === 'profile' && 'Complete Your Profile'}
          </h1>
          <p className="text-green-600">
            {step === 'phone' && 'Enter your phone number to get started'}
            {step === 'otp' && `We sent a code to ${formData.phone}`}
            {step === 'profile' && 'Tell us a bit about yourself'}
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {/* Phone Step */}
        {step === 'phone' && (
          <div className="space-y-6">
            <div>
              <label className="block text-green-800 font-medium mb-2">
                Phone Number *
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-600" />
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="+91 9876543210"
                  className="w-full pl-12 pr-4 py-3 border border-green-300 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-green-800 font-medium mb-2">
                Email (Optional)
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-600" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="your@email.com"
                  className="w-full pl-12 pr-4 py-3 border border-green-300 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-colors"
                />
              </div>
            </div>

            <button
              onClick={handleSendOTP}
              disabled={loading || !formData.phone}
              className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2 ${
                loading || !formData.phone
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-green-600 hover:bg-green-700 text-white'
              }`}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Sending OTP...</span>
                </>
              ) : (
                <>
                  <span>Send OTP</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
        )}

        {/* OTP Step */}
        {step === 'otp' && (
          <div className="space-y-6">
            <div>
              <label className="block text-green-800 font-medium mb-2">
                Enter 6-digit OTP
              </label>
              <input
                type="text"
                value={formData.otp}
                onChange={(e) => handleInputChange('otp', e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="123456"
                className="w-full p-4 text-center text-2xl font-mono border border-green-300 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-colors"
                maxLength={6}
              />
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => setStep('phone')}
                className="flex-1 py-3 px-6 border border-green-300 text-green-700 rounded-lg hover:bg-green-50 transition-colors"
              >
                Back
              </button>
              <button
                onClick={handleVerifyOTP}
                disabled={loading || formData.otp.length !== 6}
                className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2 ${
                  loading || formData.otp.length !== 6
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-green-600 hover:bg-green-700 text-white'
                }`}
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <span>Verify</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>

            <button
              onClick={handleSendOTP}
              className="w-full text-green-600 hover:text-green-700 text-sm"
            >
              Didn't receive OTP? Resend
            </button>
          </div>
        )}

        {/* Profile Step */}
        {step === 'profile' && (
          <div className="space-y-6">
            <div>
              <label className="block text-green-800 font-medium mb-2">
                Full Name *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-600" />
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Your full name"
                  className="w-full pl-12 pr-4 py-3 border border-green-300 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-green-800 font-medium mb-2">
                Location (Optional)
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-600" />
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  placeholder="City, State"
                  className="w-full pl-12 pr-4 py-3 border border-green-300 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-green-800 font-medium mb-2">
                Preferred Language
              </label>
              <div className="relative">
                <Languages className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-600" />
                <select
                  value={formData.language}
                  onChange={(e) => handleInputChange('language', e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-green-300 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-colors"
                >
                  <option value="en">English</option>
                  <option value="hi">हिंदी (Hindi)</option>
                  <option value="ta">தமிழ் (Tamil)</option>
                  <option value="bn">বাংলা (Bengali)</option>
                </select>
              </div>
            </div>

            <button
              onClick={handleCompleteProfile}
              disabled={loading || !formData.name}
              className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2 ${
                loading || !formData.name
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-green-600 hover:bg-green-700 text-white'
              }`}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <span>Complete Setup</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
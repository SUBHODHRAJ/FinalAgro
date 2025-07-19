import React from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  Wifi, 
  WifiOff, 
  Globe, 
  Zap, 
  Shield, 
  Camera,
  Smartphone,
  MessageCircle
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import ChatAssistant from '../components/ChatAssistant';

const HomePage: React.FC = () => {
  const { t } = useLanguage();
  const [isChatOpen, setIsChatOpen] = useState(false);

  const features = [
    {
      icon: WifiOff,
      title: t('features.offline'),
      description: t('features.offline.desc'),
      color: 'text-blue-600'
    },
    {
      icon: Globe,
      title: t('features.multilingual'),
      description: t('features.multilingual.desc'),
      color: 'text-purple-600'
    },
    {
      icon: Zap,
      title: t('features.instant'),
      description: t('features.instant.desc'),
      color: 'text-yellow-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      {/* Hero Section */}
      <section className="relative pt-16 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-green-800 mb-6 leading-tight">
              {t('hero.title')}
            </h1>
            <p className="text-xl md:text-2xl text-green-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              {t('hero.subtitle')}
            </p>
            <Link
              to="/upload"
              className="inline-flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-4 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <Camera className="w-6 h-6" />
              <span>{t('hero.cta')}</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          {/* Hero Image/Illustration */}
          <div className="mt-16 flex justify-center">
            <div className="relative">
              <div className="w-64 h-64 md:w-80 md:h-80 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center shadow-2xl">
                <div className="text-white text-center">
                  <Smartphone className="w-20 h-20 md:w-24 md:h-24 mx-auto mb-4" />
                  <p className="text-lg font-semibold">AI-Powered Detection</p>
                </div>
              </div>
              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 bg-yellow-400 p-3 rounded-full shadow-lg animate-bounce">
                <Zap className="w-6 h-6 text-yellow-800" />
              </div>
              <div className="absolute -bottom-4 -left-4 bg-blue-400 p-3 rounded-full shadow-lg animate-pulse">
                <Shield className="w-6 h-6 text-blue-800" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-green-800 mb-4">
              {t('features.title')}
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-green-100"
              >
                <div className={`inline-flex p-4 rounded-2xl bg-gray-50 ${feature.color} mb-6`}>
                  <feature.icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold text-green-800 mb-3">
                  {feature.title}
                </h3>
                <p className="text-green-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-green-600">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="text-white">
              <div className="text-3xl md:text-4xl font-bold mb-2">95%</div>
              <div className="text-green-100">Accuracy</div>
            </div>
            <div className="text-white">
              <div className="text-3xl md:text-4xl font-bold mb-2">50+</div>
              <div className="text-green-100">Diseases</div>
            </div>
            <div className="text-white">
              <div className="text-3xl md:text-4xl font-bold mb-2">8</div>
              <div className="text-green-100">Crop Types</div>
            </div>
            <div className="text-white">
              <div className="text-3xl md:text-4xl font-bold mb-2">4</div>
              <div className="text-green-100">Languages</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-green-600 to-emerald-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Protect Your Crops?
          </h2>
          <p className="text-xl text-green-100 mb-8">
            Join thousands of farmers already using AgroGuardian to keep their crops healthy.
          </p>
          <Link
            to="/upload"
            className="inline-flex items-center space-x-2 bg-white text-green-600 hover:bg-green-50 font-semibold py-4 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            <Camera className="w-6 h-6" />
            <span>Start Detection Now</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        {/* Chat Assistant */}
        <ChatAssistant 
          isOpen={isChatOpen}
          onToggle={() => setIsChatOpen(!isChatOpen)}
        />
      </section>
    </div>
  );
};

export default HomePage;
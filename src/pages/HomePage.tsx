import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Upload, 
  Search, 
  FileText, 
  Leaf, 
  Droplets, 
  Sun, 
  Shield,
  ArrowRight,
  Camera,
  Brain,
  Heart
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import Footer from '../components/Footer';

const HomePage: React.FC = () => {
  const { t } = useLanguage();

  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const staggerChildren = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const steps = [
    {
      icon: Upload,
      title: "Upload",
      description: "Take a photo of your crop leaf using your smartphone camera",
      color: "bg-green-100 text-green-600"
    },
    {
      icon: Brain,
      title: "Diagnose", 
      description: "Our AI analyzes the image and identifies potential diseases",
      color: "bg-blue-100 text-blue-600"
    },
    {
      icon: FileText,
      title: "Get Remedies",
      description: "Receive detailed treatment recommendations and prevention tips",
      color: "bg-purple-100 text-purple-600"
    }
  ];

  const sustainabilityBenefits = [
    {
      icon: Leaf,
      title: "Soil Health",
      description: "Enhance soil fertility through organic practices and maintain microbial diversity for long-term productivity",
      color: "from-green-500 to-emerald-600",
      bgColor: "bg-green-50",
      iconBg: "bg-green-100",
      iconColor: "text-green-600"
    },
    {
      icon: ArrowRight,
      title: "Cost Efficiency",
      description: "Reduce input costs by 40% through targeted treatments and prevention strategies that save money",
      color: "from-amber-500 to-orange-600",
      bgColor: "bg-amber-50",
      iconBg: "bg-amber-100",
      iconColor: "text-amber-600"
    },
    {
      icon: Sun,
      title: "Future Yields",
      description: "Increase crop yields by 25% with data-driven insights that optimize growth conditions sustainably",
      color: "from-emerald-500 to-teal-600",
      bgColor: "bg-emerald-50",
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-600"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden" 
               style={{
                 background: 'linear-gradient(135deg, #E8F5E9 0%, #A5D6A7 50%, #4CAF50 100%)'
               }}>
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" 
               style={{
                 backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Cpath d='M30 30c0-16.569 13.431-30 30-30v60c-16.569 0-30-13.431-30-30z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
               }} />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              <span className="block">AgroIndia</span>
              <motion.span 
                className="block text-green-200"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
              >
                Smart Farming
              </motion.span>
            </h1>
            
            <motion.p 
              className="text-xl md:text-2xl text-green-50 mb-8 max-w-3xl mx-auto leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.8 }}
            >
              Revolutionizing agriculture with AI-powered crop disease detection for a sustainable future
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.6 }}
            >
              <Link
                to="/upload"
                className="inline-flex items-center space-x-3 bg-white text-green-600 hover:bg-green-50 font-bold py-4 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-3xl"
              >
                <Camera className="w-6 h-6" />
                <span>Predict Now</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </motion.div>
          </motion.div>

          {/* Floating Elements */}
          <motion.div
            className="absolute top-20 left-10 md:left-20"
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="bg-white/20 backdrop-blur-sm p-4 rounded-full">
              <Leaf className="w-8 h-8 text-white" />
            </div>
          </motion.div>

          <motion.div
            className="absolute bottom-20 right-10 md:right-20"
            animate={{ y: [0, 20, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="bg-white/20 backdrop-blur-sm p-4 rounded-full">
              <Sun className="w-8 h-8 text-white" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Get crop disease diagnosis in three simple steps
            </p>
          </motion.div>

          <motion.div 
            className="grid md:grid-cols-3 gap-8"
            variants={staggerChildren}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {steps.map((step, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="relative"
              >
                <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
                  <div className={`inline-flex p-4 rounded-2xl ${step.color} mb-6`}>
                    <step.icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>
                
                {/* Arrow connector for desktop */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <ArrowRight className="w-8 h-8 text-green-400" />
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Why Sustainable Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8" style={{ background: 'linear-gradient(135deg, #F3E5AB 0%, #E8F5E9 50%, #D7CCC8 100%)' }}>
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Why Sustainable?
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Building a greener future through smart agriculture technology
            </p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto"
            variants={staggerChildren}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {sustainabilityBenefits.map((benefit, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className={`${benefit.bgColor} p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-white/50`}
              >
                <div className={`inline-flex p-4 rounded-2xl ${benefit.iconBg} ${benefit.iconColor} mb-6`}>
                  <benefit.icon className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {benefit.title}
                </h3>
                <p className="text-gray-700 leading-relaxed text-lg">
                  {benefit.description}
                </p>
                <div className={`h-1 w-full bg-gradient-to-r ${benefit.color} rounded-full mt-6`}></div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-green-600 to-emerald-600">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="text-white">
              <motion.div 
                className="text-4xl md:text-5xl font-bold mb-2"
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                viewport={{ once: true }}
              >
                95%
              </motion.div>
              <div className="text-green-100 text-lg">Accuracy Rate</div>
            </div>
            <div className="text-white">
              <motion.div 
                className="text-4xl md:text-5xl font-bold mb-2"
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                viewport={{ once: true }}
              >
                50+
              </motion.div>
              <div className="text-green-100 text-lg">Diseases Detected</div>
            </div>
            <div className="text-white">
              <motion.div 
                className="text-4xl md:text-5xl font-bold mb-2"
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                viewport={{ once: true }}
              >
                10K+
              </motion.div>
              <div className="text-green-100 text-lg">Farmers Helped</div>
            </div>
            <div className="text-white">
              <motion.div 
                className="text-4xl md:text-5xl font-bold mb-2"
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                transition={{ delay: 0.8, duration: 0.5 }}
                viewport={{ once: true }}
              >
                24/7
              </motion.div>
              <div className="text-green-100 text-lg">Support Available</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <motion.div 
          className="max-w-4xl mx-auto text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-12 rounded-3xl shadow-xl">
            <div className="inline-flex p-4 rounded-full bg-green-100 text-green-600 mb-6">
              <Heart className="w-8 h-8" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Ready to Transform Your Farming?
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Join thousands of farmers using AgroIndia for sustainable crop management and disease prevention.
            </p>
            <Link
              to="/upload"
              className="inline-flex items-center space-x-3 bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105 shadow-xl"
            >
              <Camera className="w-6 h-6" />
              <span>Start Your Journey</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
};

export default HomePage;

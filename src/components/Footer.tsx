import React from 'react';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin, Sprout } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-green-800 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <div className="bg-green-600 p-2 rounded-xl">
                <Sprout className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold">AgroIndia</span>
            </div>
            <p className="text-green-100 leading-relaxed">
              Empowering farmers across India with AI-powered crop disease detection for sustainable and profitable agriculture.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="bg-green-700 hover:bg-green-600 p-2 rounded-lg transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="bg-green-700 hover:bg-green-600 p-2 rounded-lg transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="bg-green-700 hover:bg-green-600 p-2 rounded-lg transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="bg-green-700 hover:bg-green-600 p-2 rounded-lg transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h4 className="text-xl font-bold text-green-100">Quick Links</h4>
            <ul className="space-y-3">
              <li><a href="/" className="text-green-200 hover:text-white transition-colors font-medium">Home</a></li>
              <li><a href="/about" className="text-green-200 hover:text-white transition-colors font-medium">About Us</a></li>
              <li><a href="/upload" className="text-green-200 hover:text-white transition-colors font-medium">Predict Disease</a></li>
              <li><a href="/dashboard" className="text-green-200 hover:text-white transition-colors font-medium">Dashboard</a></li>
              <li><a href="/heatmap" className="text-green-200 hover:text-white transition-colors font-medium">Disease Heatmap</a></li>
              <li><a href="#contact" className="text-green-200 hover:text-white transition-colors font-medium">Contact</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-6">
            <h4 className="text-xl font-bold text-green-100">Resources</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-green-200 hover:text-white transition-colors font-medium">Crop Disease Guide</a></li>
              <li><a href="#" className="text-green-200 hover:text-white transition-colors font-medium">Prevention Tips</a></li>
              <li><a href="#" className="text-green-200 hover:text-white transition-colors font-medium">Organic Treatments</a></li>
              <li><a href="#" className="text-green-200 hover:text-white transition-colors font-medium">Expert Consultation</a></li>
              <li><a href="#" className="text-green-200 hover:text-white transition-colors font-medium">Research Papers</a></li>
              <li><a href="#" className="text-green-200 hover:text-white transition-colors font-medium">Community Forum</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <h4 className="text-xl font-bold text-green-100">Contact Us</h4>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Mail className="w-5 h-5 text-green-300 mt-1" />
                <div>
                  <p className="text-green-100 font-medium">Email</p>
                  <p className="text-green-200">support@agroindia.com</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Phone className="w-5 h-5 text-green-300 mt-1" />
                <div>
                  <p className="text-green-100 font-medium">Phone</p>
                  <p className="text-green-200">+91 1800-123-4567</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-green-300 mt-1" />
                <div>
                  <p className="text-green-100 font-medium">Address</p>
                  <p className="text-green-200">Bangalore, Karnataka</p>
                  <p className="text-green-200">India</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-green-700 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-center md:text-left">
              <p className="text-green-200">
                © 2024 AgroIndia. All rights reserved.
              </p>
              <p className="text-green-300 text-sm mt-1">
                Built with ❤️ for Indian farmers
              </p>
            </div>
            
            <div className="flex flex-wrap justify-center md:justify-end space-x-6">
              <a href="#" className="text-green-200 hover:text-white text-sm transition-colors">Privacy Policy</a>
              <a href="#" className="text-green-200 hover:text-white text-sm transition-colors">Terms of Service</a>
              <a href="#" className="text-green-200 hover:text-white text-sm transition-colors">Cookie Policy</a>
              <a href="#" className="text-green-200 hover:text-white text-sm transition-colors">Disclaimer</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

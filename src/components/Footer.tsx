import React from 'react';
import { Facebook, Twitter, Instagram, Linkedin, Sprout } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-green-800 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Company Info */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <div className="bg-green-600 p-2 rounded-xl">
                <Sprout className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold">AgroIndia</span>
            </div>
            <p className="text-green-100 leading-relaxed">
              Empowering farmers with AI-powered crop disease detection for sustainable agriculture.
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
              <li><a href="/about" className="text-green-200 hover:text-white transition-colors font-medium">About</a></li>
              <li><a href="/upload" className="text-green-200 hover:text-white transition-colors font-medium">Predict</a></li>
              <li><a href="/dashboard" className="text-green-200 hover:text-white transition-colors font-medium">Dashboard</a></li>
              <li><a href="/heatmap" className="text-green-200 hover:text-white transition-colors font-medium">Heatmap</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-green-700 mt-12 pt-8 text-center">
          <p className="text-green-200">
            © 2024 AgroIndia. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  MapPin,
  Filter,
  Eye,
  EyeOff,
  AlertTriangle,
  Info,
  Layers,
  Calendar
} from 'lucide-react';

const HeatmapPage: React.FC = () => {
  const [selectedCrop, setSelectedCrop] = useState<string>('all');
  const [selectedDisease, setSelectedDisease] = useState<string>('all');
  const [showPrivacyNote, setShowPrivacyNote] = useState(true);

  const cropTypes = ['all', 'tomato', 'potato', 'wheat', 'rice', 'corn'];
  const diseaseTypes = ['all', 'bacterial_blight', 'leaf_spot', 'rust', 'mosaic_virus', 'powdery_mildew'];

  // Mock data for Nadukuthagai region
  const heatmapData = [
    { id: 1, lat: 11.1271, lng: 78.6569, intensity: 0.8, crop: 'tomato', disease: 'bacterial_blight', cases: 15 },
    { id: 2, lat: 11.1350, lng: 78.6600, intensity: 0.6, crop: 'potato', disease: 'leaf_spot', cases: 8 },
    { id: 3, lat: 11.1200, lng: 78.6500, intensity: 0.9, crop: 'wheat', disease: 'rust', cases: 22 },
    { id: 4, lat: 11.1400, lng: 78.6650, intensity: 0.4, crop: 'rice', disease: 'mosaic_virus', cases: 5 },
    { id: 5, lat: 11.1180, lng: 78.6520, intensity: 0.7, crop: 'tomato', disease: 'powdery_mildew', cases: 12 },
    { id: 6, lat: 11.1320, lng: 78.6580, intensity: 0.5, crop: 'corn', disease: 'leaf_spot', cases: 7 },
  ];

  const getIntensityColor = (intensity: number) => {
    if (intensity >= 0.8) return 'bg-red-500';
    if (intensity >= 0.6) return 'bg-orange-500';
    if (intensity >= 0.4) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getIntensityLabel = (intensity: number) => {
    if (intensity >= 0.8) return 'High Risk';
    if (intensity >= 0.6) return 'Medium Risk';
    if (intensity >= 0.4) return 'Low Risk';
    return 'Very Low Risk';
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-green-800 mb-4">
            Live Outbreak Heatmap
          </h1>
          <p className="text-xl text-green-600">
            Real-time disease density monitoring for Nadukuthagai region
          </p>
        </motion.div>

        {/* Privacy Notice */}
        {showPrivacyNote && (
          <motion.div 
            className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6"
            variants={fadeInUp}
            initial="initial"
            animate="animate"
          >
            <div className="flex items-start space-x-3">
              <Info className="w-5 h-5 text-blue-600 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-semibold text-blue-800 mb-1">Privacy & Data Protection</h4>
                <p className="text-blue-700 text-sm">
                  All location data is anonymized and aggregated. Individual farm locations are not identified. 
                  Data is used solely for community disease monitoring and prevention.
                </p>
              </div>
              <button
                onClick={() => setShowPrivacyNote(false)}
                className="text-blue-600 hover:text-blue-800"
              >
                <EyeOff className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        )}

        {/* Filters */}
        <motion.div 
          className="bg-white rounded-xl shadow-lg p-6 mb-8"
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          transition={{ delay: 0.2 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Filter className="w-4 h-4 inline mr-1" />
                Crop Type
              </label>
              <select
                value={selectedCrop}
                onChange={(e) => setSelectedCrop(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                {cropTypes.map(crop => (
                  <option key={crop} value={crop}>
                    {crop === 'all' ? 'All Crops' : crop.charAt(0).toUpperCase() + crop.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <AlertTriangle className="w-4 h-4 inline mr-1" />
                Disease Type
              </label>
              <select
                value={selectedDisease}
                onChange={(e) => setSelectedDisease(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                {diseaseTypes.map(disease => (
                  <option key={disease} value={disease}>
                    {disease === 'all' ? 'All Diseases' : disease.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-1" />
                Last Updated
              </label>
              <div className="bg-gray-50 p-3 rounded-lg">
                <span className="text-gray-700 font-medium">
                  {new Date().toLocaleDateString()} - {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Heatmap Container */}
        <motion.div 
          className="bg-white rounded-xl shadow-lg overflow-hidden mb-8"
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          transition={{ delay: 0.4 }}
        >
          {/* Map Header */}
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-4">
            <div className="flex items-center justify-between text-white">
              <div className="flex items-center space-x-2">
                <MapPin className="w-5 h-5" />
                <span className="font-semibold">Nadukuthagai Region</span>
              </div>
              <div className="flex items-center space-x-2">
                <Layers className="w-4 h-4" />
                <span className="text-sm">Disease Density Map</span>
              </div>
            </div>
          </div>

          {/* Mock Heatmap Visual */}
          <div className="relative h-96 bg-gradient-to-br from-green-100 to-emerald-100 p-6">
            {/* Grid background */}
            <div 
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Cpath d='M0 0h20v20H0z' fill='none'/%3E%3Cpath d='M0 0h1v1H0zm19 0h1v1h-1zm0 19h1v1h-1zM0 19h1v1H0z'/%3E%3C/g%3E%3C/svg%3E")`
              }}
            />

            {/* Heatmap points */}
            {heatmapData.map((point) => (
              <div
                key={point.id}
                className={`absolute w-8 h-8 rounded-full ${getIntensityColor(point.intensity)} opacity-70 hover:opacity-100 cursor-pointer transition-all duration-300 hover:scale-125`}
                style={{
                  left: `${20 + (point.id * 12)}%`,
                  top: `${15 + (point.id * 8)}%`,
                }}
                title={`${point.crop} - ${point.disease.replace('_', ' ')} - ${point.cases} cases`}
              >
                <div className="w-full h-full rounded-full animate-pulse"></div>
              </div>
            ))}

            {/* Map Labels */}
            <div className="absolute bottom-4 left-4 text-sm text-gray-600">
              <div className="bg-white/80 p-2 rounded">
                📍 Nadukuthagai, Tamil Nadu
              </div>
            </div>
          </div>
        </motion.div>

        {/* Legend */}
        <motion.div 
          className="bg-white rounded-xl shadow-lg p-6 mb-8"
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          transition={{ delay: 0.6 }}
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Disease Intensity Legend</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { intensity: 0.9, color: 'bg-red-500', label: 'High Risk', description: '15+ cases/km²' },
              { intensity: 0.7, color: 'bg-orange-500', label: 'Medium Risk', description: '8-14 cases/km²' },
              { intensity: 0.5, color: 'bg-yellow-500', label: 'Low Risk', description: '3-7 cases/km²' },
              { intensity: 0.3, color: 'bg-green-500', label: 'Very Low Risk', description: '0-2 cases/km²' },
            ].map((item, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className={`w-4 h-4 rounded-full ${item.color}`}></div>
                <div>
                  <div className="font-medium text-gray-900">{item.label}</div>
                  <div className="text-sm text-gray-600">{item.description}</div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Statistics */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          transition={{ delay: 0.8 }}
        >
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Cases</p>
                <p className="text-3xl font-bold text-red-600">69</p>
                <p className="text-sm text-gray-500">Last 7 days</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-400" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Affected Areas</p>
                <p className="text-3xl font-bold text-orange-600">6</p>
                <p className="text-sm text-gray-500">Active hotspots</p>
              </div>
              <MapPin className="w-8 h-8 text-orange-400" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Risk Level</p>
                <p className="text-3xl font-bold text-yellow-600">Medium</p>
                <p className="text-sm text-gray-500">Regional average</p>
              </div>
              <Eye className="w-8 h-8 text-yellow-400" />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default HeatmapPage;

import React, { useState, useRef, useEffect } from 'react';
import { useState as useStateHook } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, 
  Camera, 
  Image as ImageIcon, 
  Loader2,
  Check,
  X,
  MessageCircle,
  Sparkles,
  Zap,
  RefreshCw
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { mockDetectDisease } from '../utils/mockAI';
import { storage } from '../utils/storage';
import { DetectionResult } from '../types';

const crops = [
  { id: 'tomato', name: 'crops.tomato', icon: '🍅' },
  { id: 'potato', name: 'crops.potato', icon: '🥔' },
  { id: 'wheat', name: 'crops.wheat', icon: '🌾' },
  { id: 'rice', name: 'crops.rice', icon: '🌾' },
  { id: 'corn', name: 'crops.corn', icon: '🌽' },
  { id: 'cotton', name: 'crops.cotton', icon: '🌱' },
  { id: 'sugarcane', name: 'crops.sugarcane', icon: '🎋' },
  { id: 'soybean', name: 'crops.soybean', icon: '🌿' }
];

const UploadPage: React.FC = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  
  const [selectedCrop, setSelectedCrop] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string>('');
  const [dragActive, setDragActive] = useState(false);
  const [isBackCamera, setIsBackCamera] = useState(true);
  const [showCamera, setShowCamera] = useState(false);
  const [videoStream, setVideoStream] = useState<MediaStream | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (showCamera) {
      (async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode } });
          setVideoStream(stream);
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        } catch (err) {
          setError('Unable to access camera');
          setShowCamera(false);
        }
      })();
    } else {
      if (videoStream) {
        videoStream.getTracks().forEach(track => track.stop());
        setVideoStream(null);
      }
    }
    // Cleanup on unmount
    return () => {
      if (videoStream) {
        videoStream.getTracks().forEach(track => track.stop());
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showCamera, facingMode]);

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      setError('File size must be less than 5MB');
      return;
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setError('');
    setUploadSuccess(true);
    setShowSuccessAnimation(true);
    
    // Hide success animation after 2 seconds
    setTimeout(() => setShowSuccessAnimation(false), 2000);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        canvas.toBlob(blob => {
          if (blob) {
            const file = new File([blob], 'captured.jpg', { type: 'image/jpeg' });
            handleFileSelect(file);
            setShowCamera(false);
          }
        }, 'image/jpeg');
      }
    }
  };

  const handleFlipCamera = () => {
    setFacingMode(facingMode === 'environment' ? 'user' : 'environment');
  };

  const handleDetection = async () => {
    if (!selectedFile || !selectedCrop) {
      setError('Please select both a crop type and an image');
      return;
    }

    setIsProcessing(true);
    setError('');

    try {
      const result: DetectionResult = await mockDetectDisease(selectedFile, selectedCrop, language);
      
      // Save to local storage
      storage.saveDetection(result);
      
      // Navigate to results page with the result data
      navigate('/result', { state: { result } });
    } catch (err) {
      setError('Failed to analyze image. Please try again.');
      setIsProcessing(false);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const successVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: 1,
      transition: { 
        type: "spring",
        stiffness: 500,
        damping: 30
      }
    },
    exit: { 
      scale: 0, 
      opacity: 0,
      transition: { duration: 0.3 }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 py-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-4 -left-4 w-72 h-72 bg-gradient-to-br from-green-200/30 to-emerald-200/30 rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute -bottom-4 -right-4 w-96 h-96 bg-gradient-to-tl from-teal-200/30 to-green-200/30 rounded-full blur-3xl"
          animate={{
            x: [0, -80, 0],
            y: [0, 60, 0],
            scale: [1, 0.9, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      <motion.div 
        className="max-w-4xl mx-auto relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header with enhanced animations */}
        <motion.div 
          className="text-center mb-8"
          variants={itemVariants}
        >
          <motion.h1 
            className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-green-800 via-emerald-700 to-teal-700 bg-clip-text text-transparent mb-4"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
          >
            {t('upload.title')}
          </motion.h1>
          <motion.p 
            className="text-lg text-green-600"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            {t('upload.subtitle')}
          </motion.p>
        </motion.div>

        <motion.div 
          className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-6 md:p-8 relative overflow-hidden"
          variants={itemVariants}
          whileHover={{ 
            boxShadow: "0 25px 50px rgba(0, 0, 0, 0.1)",
            scale: 1.01
          }}
          transition={{ duration: 0.3 }}
        >
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-green-50/50 via-transparent to-emerald-50/50 pointer-events-none" />
          
          {/* Crop Selection with enhanced styling */}
          <motion.div 
            className="mb-8 relative z-10"
            variants={itemVariants}
          >
            <motion.label 
              className="block text-lg font-semibold text-green-800 mb-4 flex items-center space-x-2"
              whileHover={{ x: 5 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <Sparkles className="w-5 h-5 text-green-600" />
              <span>{t('upload.crop.label')}</span>
            </motion.label>
            <motion.select
              value={selectedCrop}
              onChange={(e) => setSelectedCrop(e.target.value)}
              className="w-full p-4 border-2 border-green-200 rounded-2xl focus:border-green-500 focus:ring-4 focus:ring-green-200/50 transition-all duration-300 text-lg bg-white/90 backdrop-blur-sm shadow-lg hover:shadow-xl"
              whileFocus={{ scale: 1.02 }}
              whileHover={{ 
                borderColor: "#10b981",
                boxShadow: "0 10px 25px rgba(16, 185, 129, 0.15)"
              }}
            >
              <option value="">{t('upload.crop.placeholder')}</option>
              {crops.map((crop) => (
                <option key={crop.id} value={crop.id}>
                  {crop.icon} {t(crop.name)}
                </option>
              ))}
            </motion.select>
          </motion.div>

          {/* Enhanced Image Upload Area */}
          <motion.div 
            className="mb-8 relative z-10"
            variants={itemVariants}
          >
            <motion.label 
              className="block text-lg font-semibold text-green-800 mb-4 flex items-center space-x-2"
              whileHover={{ x: 5 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <Upload className="w-5 h-5 text-green-600" />
              <span>Upload Crop Image</span>
            </motion.label>
            
            {/* Enhanced Drag & Drop Area */}
            <motion.div
              className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-500 cursor-pointer overflow-hidden ${
                dragActive 
                  ? 'border-green-500 bg-gradient-to-br from-green-50 to-emerald-50 scale-105' 
                  : selectedFile 
                    ? 'border-green-400 bg-gradient-to-br from-green-25 to-emerald-25' 
                    : 'border-green-200 hover:border-green-400 bg-gradient-to-br from-white to-green-50/30'
              }`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => fileInputRef.current?.click()}
              whileHover={{ 
                scale: 1.02,
                boxShadow: "0 20px 40px rgba(16, 185, 129, 0.1)"
              }}
              whileTap={{ scale: 0.98 }}
              animate={dragActive ? { 
                borderColor: "#10b981",
                backgroundColor: "rgba(16, 185, 129, 0.05)"
              } : {}}
            >
              {/* Animated background pattern */}
              <motion.div
                className="absolute inset-0 opacity-5"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2310b981' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                }}
                animate={dragActive ? { scale: 1.1, opacity: 0.1 } : { scale: 1, opacity: 0.05 }}
              />

              {previewUrl ? (
                <motion.div 
                  className="relative"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, type: "spring" }}
                >
                  <motion.img
                    src={previewUrl}
                    alt="Preview"
                    className="max-w-full max-h-64 mx-auto rounded-xl shadow-2xl border-4 border-white"
                    whileHover={{ scale: 1.05, rotate: 1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  />
                  <motion.button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedFile(null);
                      setPreviewUrl('');
                      setUploadSuccess(false);
                    }}
                    className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-red-600 text-white p-2 rounded-full hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-lg"
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <X className="w-4 h-4" />
                  </motion.button>
                  
                  {/* Success checkmark animation */}
                  <AnimatePresence>
                    {showSuccessAnimation && (
                      <motion.div
                        className="absolute inset-0 flex items-center justify-center"
                        variants={successVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                      >
                        <div className="bg-green-500 text-white p-4 rounded-full shadow-2xl">
                          <Check className="w-8 h-8" />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ) : (
                <motion.div 
                  className="space-y-4"
                  animate={dragActive ? { scale: 1.05 } : { scale: 1 }}
                >
                  <motion.div 
                    className="flex justify-center"
                    animate={dragActive ? { 
                      y: [-5, 5, -5],
                      rotate: [0, 5, -5, 0]
                    } : {}}
                    transition={{ duration: 0.5, repeat: dragActive ? Infinity : 0 }}
                  >
                    <div className="relative">
                      <Upload className="w-16 h-16 text-green-400" />
                      {dragActive && (
                        <motion.div
                          className="absolute inset-0 bg-green-400 rounded-full opacity-20"
                          animate={{ scale: [1, 1.5, 1], opacity: [0.2, 0, 0.2] }}
                          transition={{ duration: 1, repeat: Infinity }}
                        />
                      )}
                    </div>
                  </motion.div>
                  <motion.div 
                    className="text-lg text-green-600 font-medium"
                    animate={dragActive ? { scale: 1.05 } : { scale: 1 }}
                  >
                    {t('upload.drop.text')}
                  </motion.div>
                  <motion.div 
                    className="text-sm text-green-500"
                    animate={dragActive ? { opacity: 0.7 } : { opacity: 1 }}
                  >
                    {t('upload.drop.formats')}
                  </motion.div>
                </motion.div>
              )}
            </motion.div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
              className="hidden"
            />

            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture={isBackCamera ? "environment" : "user"}
              onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
              className="hidden"
            />

            {/* Enhanced Upload Buttons */}
            <motion.div 
              className="mt-6"
              variants={itemVariants}
            >
              {!selectedFile ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <motion.button
                    onClick={() => setShowCamera(true)}
                    className="flex items-center justify-center space-x-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-2xl group relative overflow-hidden"
                    type="button"
                    whileHover={{ 
                      scale: 1.05,
                      y: -2
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 to-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                    <motion.div
                      animate={{ rotate: [0, 5, -5, 0] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <Camera className="w-5 h-5" />
                    </motion.div>
                    <span>{t('upload.camera')}</span>
                  </motion.button>
                  
                  <motion.button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center justify-center space-x-3 bg-gradient-to-r from-green-100 to-emerald-100 hover:from-green-200 hover:to-emerald-200 text-green-700 font-semibold py-4 px-6 rounded-2xl transition-all duration-300 border-2 border-green-300 hover:border-green-400 shadow-lg hover:shadow-2xl group relative overflow-hidden"
                    type="button"
                    whileHover={{ 
                      scale: 1.05,
                      y: -2
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-green-200/0 to-green-200/50 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                    <motion.div
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.5 }}
                    >
                      <ImageIcon className="w-5 h-5" />
                    </motion.div>
                    <span>{t('upload.gallery')}</span>
                  </motion.button>
                </div>
              ) : (
                <motion.button
                  onClick={() => {
                    setSelectedFile(null);
                    setPreviewUrl('');
                    setError('');
                    setUploadSuccess(false);
                  }}
                  className="w-full flex items-center justify-center space-x-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-2xl group relative overflow-hidden"
                  type="button"
                  whileHover={{ 
                    scale: 1.02,
                    y: -2
                  }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 to-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                  <motion.div
                    animate={{ rotate: [0, 180, 360] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  >
                    <RefreshCw className="w-5 h-5" />
                  </motion.div>
                  <span>Re-upload Photo</span>
                </motion.button>
              )}
            </motion.div>
          </motion.div>

          {/* Enhanced Error Message */}
          <AnimatePresence>
            {error && (
              <motion.div 
                className="mb-6 p-4 bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200 rounded-2xl shadow-lg"
                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                transition={{ duration: 0.3 }}
              >
                <motion.p 
                  className="text-red-600 font-medium flex items-center space-x-2"
                  initial={{ x: -10 }}
                  animate={{ x: 0 }}
                >
                  <X className="w-5 h-5" />
                  <span>{error}</span>
                </motion.p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Enhanced Detect Button */}
          <motion.button
            onClick={handleDetection}
            disabled={!selectedFile || !selectedCrop || isProcessing}
            className={`w-full py-5 px-6 rounded-2xl font-bold text-lg transition-all duration-500 relative overflow-hidden group ${
              !selectedFile || !selectedCrop || isProcessing
                ? 'bg-gradient-to-r from-gray-300 to-gray-400 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 hover:from-green-700 hover:via-emerald-700 hover:to-teal-700 text-white shadow-2xl hover:shadow-3xl'
            }`}
            whileHover={!(!selectedFile || !selectedCrop || isProcessing) ? { 
              scale: 1.02,
              y: -3,
              boxShadow: "0 25px 50px rgba(16, 185, 129, 0.3)"
            } : {}}
            whileTap={!(!selectedFile || !selectedCrop || isProcessing) ? { scale: 0.98 } : {}}
            variants={itemVariants}
          >
            {/* Animated background for enabled state */}
            {!(!selectedFile || !selectedCrop || isProcessing) && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0"
                animate={{ x: ['-100%', '100%'] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              />
            )}
            
            {isProcessing ? (
              <motion.div 
                className="flex items-center justify-center space-x-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <Loader2 className="w-6 h-6" />
                </motion.div>
                <span>{t('upload.processing')}</span>
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  <Zap className="w-5 h-5" />
                </motion.div>
              </motion.div>
            ) : (
              <motion.div 
                className="flex items-center justify-center space-x-3"
                whileHover={{ scale: 1.05 }}
              >
                <motion.div
                  animate={selectedFile && selectedCrop ? { 
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0]
                  } : {}}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Check className="w-6 h-6" />
                </motion.div>
                <span>{t('upload.detect')}</span>
                <motion.div
                  animate={selectedFile && selectedCrop ? { 
                    x: [0, 5, 0],
                    opacity: [0.7, 1, 0.7]
                  } : {}}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <Sparkles className="w-5 h-5" />
                </motion.div>
              </motion.div>
            )}
          </motion.button>
        </motion.div>

        {/* Enhanced Camera Modal Overlay */}
        <AnimatePresence>
          {showCamera && (
            <motion.div 
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div 
                className="relative bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-6 flex flex-col items-center border border-white/50"
                initial={{ scale: 0.8, opacity: 0, y: 50 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.8, opacity: 0, y: 50 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                <motion.video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-[320px] h-[240px] bg-black rounded-2xl mb-4 shadow-xl border-4 border-white"
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2 }}
                />
                <canvas ref={canvasRef} className="hidden" />
                
                <div className="flex flex-col space-y-4 mt-4 w-full">
                  <div className="flex justify-center space-x-4">
                    <motion.button
                      onClick={handleFlipCamera}
                      className="px-6 py-3 bg-gradient-to-r from-green-200 to-emerald-200 text-green-800 rounded-2xl font-semibold hover:from-green-300 hover:to-emerald-300 transition-all duration-300 shadow-lg hover:shadow-xl"
                      type="button"
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {facingMode === 'environment' ? 'Flip to Front Camera' : 'Flip to Back Camera'}
                    </motion.button>
                    
                    <motion.button
                      onClick={handleCapture}
                      className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-2xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl relative overflow-hidden group"
                      type="button"
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-white/0 to-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500" />
                      <span className="relative">Capture Photo</span>
                    </motion.button>
                  </div>
                  
                  <motion.button
                    onClick={() => setShowCamera(false)}
                    className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-2xl font-semibold hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                    type="button"
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Close Camera
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default UploadPage;
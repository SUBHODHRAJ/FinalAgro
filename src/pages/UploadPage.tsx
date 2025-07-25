import React, { useState, useRef, useEffect } from 'react';
import { useState as useStateHook } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Upload, 
  Camera, 
  Image as ImageIcon, 
  Loader2,
  Check,
  X,
  MessageCircle
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { mockDetectDisease } from '../utils/mockAI';
import { storage } from '../utils/storage';
import { DetectionResult } from '../types';
import ChatAssistant from '../components/ChatAssistant';

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
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isBackCamera, setIsBackCamera] = useState(true);
  const [showCamera, setShowCamera] = useState(false);
  const [videoStream, setVideoStream] = useState<MediaStream | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-green-800 mb-4">
            {t('upload.title')}
          </h1>
          <p className="text-lg text-green-600">
            {t('upload.subtitle')}
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
          {/* Crop Selection */}
          <div className="mb-8">
            <label className="block text-lg font-semibold text-green-800 mb-4">
              {t('upload.crop.label')}
            </label>
            <select
              value={selectedCrop}
              onChange={(e) => setSelectedCrop(e.target.value)}
              className="w-full p-4 border-2 border-green-200 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-colors text-lg"
            >
              <option value="">{t('upload.crop.placeholder')}</option>
              {crops.map((crop) => (
                <option key={crop.id} value={crop.id}>
                  {crop.icon} {t(crop.name)}
                </option>
              ))}
            </select>
          </div>

          {/* Image Upload Area */}
          <div className="mb-8">
            <label className="block text-lg font-semibold text-green-800 mb-4">
              Upload Crop Image
            </label>
            
            {/* Drag & Drop Area */}
            <div
              className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
                dragActive 
                  ? 'border-green-500 bg-green-50' 
                  : selectedFile 
                    ? 'border-green-400 bg-green-25' 
                    : 'border-green-200 hover:border-green-400 hover:bg-green-25'
              }`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => fileInputRef.current?.click()}
            >
              {previewUrl ? (
                <div className="relative">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="max-w-full max-h-64 mx-auto rounded-lg shadow-md"
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedFile(null);
                      setPreviewUrl('');
                    }}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex justify-center">
                    <Upload className="w-16 h-16 text-green-400" />
                  </div>
                  <div className="text-lg text-green-600">
                    {t('upload.drop.text')}
                  </div>
                  <div className="text-sm text-green-500">
                    {t('upload.drop.formats')}
                  </div>
                </div>
              )}
            </div>

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

            {/* Upload Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <button
                onClick={() => setShowCamera(true)}
                className="flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                type="button"
              >
                <Camera className="w-5 h-5" />
                <span>{t('upload.camera')}</span>
              </button>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center justify-center space-x-2 bg-green-100 hover:bg-green-200 text-green-700 font-semibold py-3 px-6 rounded-lg transition-colors border border-green-300"
                type="button"
              >
                <ImageIcon className="w-5 h-5" />
                <span>{t('upload.gallery')}</span>
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          {/* Detect Button */}
          <button
            onClick={handleDetection}
            disabled={!selectedFile || !selectedCrop || isProcessing}
            className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 ${
              !selectedFile || !selectedCrop || isProcessing
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-1'
            }`}
          >
            {isProcessing ? (
              <div className="flex items-center justify-center space-x-2">
                <Loader2 className="w-6 h-6 animate-spin" />
                <span>{t('upload.processing')}</span>
              </div>
            ) : (
              <div className="flex items-center justify-center space-x-2">
                <Check className="w-6 h-6" />
                <span>{t('upload.detect')}</span>
              </div>
            )}
          </button>
        </div>

        {/* Chat Assistant */}
        <ChatAssistant 
          isOpen={isChatOpen}
          onToggle={() => setIsChatOpen(!isChatOpen)}
        />
        {/* Camera Modal Overlay */}
        {showCamera && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80">
            <div className="relative bg-white rounded-lg shadow-lg p-4 flex flex-col items-center">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-[320px] h-[240px] bg-black rounded-lg mb-4"
              />
              <canvas ref={canvasRef} className="hidden" />
              <div className="flex space-x-4 mt-2">
                <button
                  onClick={handleFlipCamera}
                  className="px-4 py-2 bg-green-200 text-green-800 rounded-lg font-semibold hover:bg-green-300"
                  type="button"
                >
                  {facingMode === 'environment' ? t('upload.flipToFront') : t('upload.flipToBack')}
                </button>
                <button
                  onClick={handleCapture}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700"
                  type="button"
                >
                  {t('upload.capture')}
                </button>
                <button
                  onClick={() => setShowCamera(false)}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600"
                  type="button"
                >
                  {t('upload.close')}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadPage;
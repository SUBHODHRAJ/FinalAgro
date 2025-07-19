import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Language = 'en' | 'hi' | 'ta' | 'bn';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.upload': 'Detect Disease',
    'nav.about': 'About',
    'nav.admin': 'Admin',
    
    // Homepage
    'hero.title': 'Detect Crop Disease Instantly with AI',
    'hero.subtitle': 'Help your crops stay healthy with instant disease detection using your phone camera',
    'hero.cta': 'Get Started',
    'features.title': 'Why Choose AgroGuardian?',
    'features.offline': 'Works Offline',
    'features.offline.desc': 'No internet? No problem. Works without connection.',
    'features.multilingual': 'Multiple Languages',
    'features.multilingual.desc': 'Available in Hindi, Tamil, Bengali and English.',
    'features.instant': 'Instant Results',
    'features.instant.desc': 'Get disease detection and remedies in seconds.',
    
    // Upload Page
    'upload.title': 'Upload Crop Image',
    'upload.subtitle': 'Take a photo or upload an image of your crop for AI analysis',
    'upload.crop.label': 'Select Crop Type',
    'upload.crop.placeholder': 'Choose your crop...',
    'upload.drop.text': 'Drop image here or click to upload',
    'upload.drop.formats': 'Supports: JPG, PNG (Max 5MB)',
    'upload.camera': 'Take Photo',
    'upload.gallery': 'Choose from Gallery',
    'upload.detect': 'Detect Disease',
    'upload.processing': 'Analyzing image...',
    
    // Results
    'result.title': 'Detection Results',
    'result.crop': 'Crop',
    'result.disease': 'Detected Issue',
    'result.confidence': 'Confidence',
    'result.remedy.title': 'Recommended Treatment',
    'result.remedy.steps': 'Treatment Steps',
    'result.preventive': 'Preventive Measures',
    'result.share': 'Share Report',
    'result.share.whatsapp': 'Share on WhatsApp',
    'result.download': 'Download Report',
    'result.scan.again': 'Scan Another Crop',
    'chat.ask.assistant': 'Ask AI Assistant',
    'chat.placeholder': 'Type your farming question...',
    'chat.voice.start': 'Start voice input',
    'chat.voice.stop': 'Stop voice input',
    'chat.speak': 'Read aloud',
    'chat.stop.speaking': 'Stop reading',
    
    // About
    'about.title': 'About AgroGuardian',
    'about.mission': 'Our Mission',
    'about.mission.text': 'Empowering farmers with AI-powered crop disease detection to improve agricultural productivity and food security.',
    'about.team': 'Our Team',
    'about.contact': 'Contact Us',
    'about.contact.form': 'Send us a message',
    'about.contact.name': 'Name',
    'about.contact.email': 'Email',
    'about.contact.message': 'Message',
    'about.contact.send': 'Send Message',
    
    // Admin
    'admin.title': 'Admin Dashboard',
    'admin.login': 'Admin Login',
    'admin.username': 'Username',
    'admin.password': 'Password',
    'admin.signin': 'Sign In',
    'admin.total.scans': 'Total Scans',
    'admin.diseases.detected': 'Diseases Detected',
    'admin.users.active': 'Active Users',
    'admin.accuracy': 'Detection Accuracy',
    'admin.recent.cases': 'Recent Cases',
    'admin.export': 'Export Data',
    'admin.crop': 'Crop',
    'admin.disease': 'Disease',
    'admin.date': 'Date',
    'admin.language': 'Language',
    
    // Common
    'common.loading': 'Loading...',
    'common.error': 'Something went wrong',
    'common.retry': 'Try Again',
    'common.success': 'Success!',
    'common.cancel': 'Cancel',
    'common.save': 'Save',
    'common.close': 'Close',
    
    // Crops
    'crops.tomato': 'Tomato',
    'crops.potato': 'Potato',
    'crops.wheat': 'Wheat',
    'crops.rice': 'Rice',
    'crops.corn': 'Corn',
    'crops.cotton': 'Cotton',
    'crops.sugarcane': 'Sugarcane',
    'crops.soybean': 'Soybean',
  },
  hi: {
    // Navigation
    'nav.home': 'होम',
    'nav.upload': 'रोग की जांच',
    'nav.about': 'हमारे बारे में',
    'nav.admin': 'एडमिन',
    
    // Homepage
    'hero.title': 'AI के साथ तुरंत फसल रोग का पता लगाएं',
    'hero.subtitle': 'अपने फोन कैमरा से तुरंत रोग का पता लगाकर अपनी फसलों को स्वस्थ रखने में मदद करें',
    'hero.cta': 'शुरू करें',
    'features.title': 'AgroGuardian क्यों चुनें?',
    'features.offline': 'ऑफलाइन काम करता है',
    'features.offline.desc': 'इंटरनेट नहीं? कोई समस्या नहीं। बिना कनेक्शन के काम करता है।',
    'features.multilingual': 'कई भाषाएं',
    'features.multilingual.desc': 'हिंदी, तमिल, बंगाली और अंग्रेजी में उपलब्ध।',
    'features.instant': 'तुरंत परिणाम',
    'features.instant.desc': 'सेकंडों में रोग का पता लगाने और उपचार पाएं।',
    
    // Upload Page
    'upload.title': 'फसल की तस्वीर अपलोड करें',
    'upload.subtitle': 'AI विश्लेषण के लिए अपनी फसल की तस्वीर लें या अपलोड करें',
    'upload.crop.label': 'फसल का प्रकार चुनें',
    'upload.crop.placeholder': 'अपनी फसल चुनें...',
    'upload.drop.text': 'यहां तस्वीर छोड़ें या अपलोड करने के लिए क्लिक करें',
    'upload.drop.formats': 'समर्थित: JPG, PNG (अधिकतम 5MB)',
    'upload.camera': 'फोटो लें',
    'upload.gallery': 'गैलरी से चुनें',
    'upload.detect': 'रोग का पता लगाएं',
    'upload.processing': 'तस्वीर का विश्लेषण...',
    
    // Results
    'result.title': 'जांच परिणाम',
    'result.crop': 'फसल',
    'result.disease': 'पहचाना गया मुद्दा',
    'result.confidence': 'विश्वास',
    'result.remedy.title': 'अनुशंसित उपचार',
    'result.remedy.steps': 'उपचार के चरण',
    'result.preventive': 'निवारक उपाय',
    'result.share': 'रिपोर्ट साझा करें',
    'result.share.whatsapp': 'WhatsApp पर साझा करें',
    'result.download': 'रिपोर्ट डाउनलोड करें',
    'result.scan.again': 'दूसरी फसल स्कैन करें',
    'chat.ask.assistant': 'AI सहायक से पूछें',
    'chat.placeholder': 'अपना कृषि प्रश्न लिखें...',
    'chat.voice.start': 'आवाज़ इनपुट शुरू करें',
    'chat.voice.stop': 'आवाज़ इनपुट बंद करें',
    'chat.speak': 'जोर से पढ़ें',
    'chat.stop.speaking': 'पढ़ना बंद करें',
    
    // About
    'about.title': 'AgroGuardian के बारे में',
    'about.mission': 'हमारा मिशन',
    'about.mission.text': 'कृषि उत्पादकता और खाद्य सुरक्षा में सुधार के लिए AI-संचालित फसल रोग का पता लगाने के साथ किसानों को सशक्त बनाना।',
    'about.team': 'हमारी टीम',
    'about.contact': 'संपर्क करें',
    'about.contact.form': 'हमें संदेश भेजें',
    'about.contact.name': 'नाम',
    'about.contact.email': 'ईमेल',
    'about.contact.message': 'संदेश',
    'about.contact.send': 'संदेश भेजें',
    
    // Crops
    'crops.tomato': 'टमाटर',
    'crops.potato': 'आलू',
    'crops.wheat': 'गेहूं',
    'crops.rice': 'चावल',
    'crops.corn': 'मक्का',
    'crops.cotton': 'कपास',
    'crops.sugarcane': 'गन्ना',
    'crops.soybean': 'सोयाबीन',
  },
  ta: {
    // Navigation
    'nav.home': 'முகப்பு',
    'nav.upload': 'நோய் கண்டறிதல்',
    'nav.about': 'எங்களைப் பற்றி',
    'nav.admin': 'நிர்வாகி',
    
    // Homepage
    'hero.title': 'AI உடன் உடனடியாக பயிர் நோயைக் கண்டறியுங்கள்',
    'hero.subtitle': 'உங்கள் ஃபோன் கேமராவைப் பயன்படுத்தி உடனடி நோய் கண்டறிதலுடன் உங்கள் பயிர்களை ஆரோக்கியமாக வைத்திருக்க உதவுங்கள்',
    'hero.cta': 'தொடங்குங்கள்',
    
    // Upload Page  
    'upload.title': 'பயிர் படத்தைப் பதிவேற்றவும்',
    'upload.crop.label': 'பயிர் வகையைத் தேர்ந்தெடுக்கவும்',
    'upload.crop.placeholder': 'உங்கள் பயிரைத் தேர்ந்தெடுக்கவும்...',
    'upload.detect': 'நோயைக் கண்டறியுங்கள்',
    
    // Crops
    'crops.tomato': 'தக்காளி',
    'crops.potato': 'உருளைக்கிழங்கு',
    'crops.wheat': 'கோதுமை',
    'crops.rice': 'அரிசி',
    'crops.corn': 'சோளம்',
    'crops.cotton': 'பருத்தி',
    'crops.sugarcane': 'கரும்பு',
    'crops.soybean': 'சோயாபீன்',
  },
  bn: {
    // Navigation
    'nav.home': 'হোম',
    'nav.upload': 'রোগ নির্ণয়',
    'nav.about': 'আমাদের সম্পর্কে',
    'nav.admin': 'অ্যাডমিন',
    
    // Homepage
    'hero.title': 'AI দিয়ে তাৎক্ষণিক ফসলের রোগ নির্ণয় করুন',
    'hero.subtitle': 'আপনার ফোন ক্যামেরা ব্যবহার করে তাৎক্ষণিক রোগ নির্ণয়ের মাধ্যমে আপনার ফসল সুস্থ রাখতে সাহায্য করুন',
    'hero.cta': 'শুরু করুন',
    
    // Upload Page
    'upload.title': 'ফসলের ছবি আপলোড করুন',
    'upload.crop.label': 'ফসলের ধরন নির্বাচন করুন',
    'upload.crop.placeholder': 'আপনার ফসল বেছে নিন...',
    'upload.detect': 'রোগ নির্ণয় করুন',
    
    // Crops
    'crops.tomato': 'টমেটো',
    'crops.potato': 'আলু',
    'crops.wheat': 'গম',
    'crops.rice': 'চাল',
    'crops.corn': 'ভুট্টা',
    'crops.cotton': 'তুলা',
    'crops.sugarcane': 'আখ',
    'crops.soybean': 'সয়াবিন',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['en']] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
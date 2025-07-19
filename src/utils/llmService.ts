import { ChatMessage, DetectionResult } from '../types';

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

interface ChatRequest {
  message: string;
  language: string;
  context?: {
    crop?: string;
    disease?: string;
    detectionResult?: DetectionResult;
  };
  chatHistory?: ChatMessage[];
}

interface ChatResponse {
  response: string;
  success: boolean;
  error?: string;
}

// System prompts for different languages
const systemPrompts = {
  en: `You are AgroGuardian AI, an expert agricultural assistant helping farmers in India. You specialize in:
- Crop disease identification and treatment
- Pest management solutions
- Organic and chemical farming methods
- General farming advice

Guidelines:
- Provide practical, actionable advice suitable for Indian farming conditions
- Suggest both organic/natural and chemical treatment options when relevant
- Use simple, clear language that farmers can understand
- Include step-by-step instructions when providing remedies
- Consider local availability of treatments and materials
- Be empathetic and supportive in your responses

Always structure your responses with:
1. Brief explanation of the issue
2. Immediate action steps
3. Treatment options (natural and chemical)
4. Prevention measures
5. When to seek additional help`,

  hi: `आप AgroGuardian AI हैं, भारत के किसानों की मदद करने वाले एक विशेषज्ञ कृषि सहायक हैं। आप इन विषयों में विशेषज्ञ हैं:
- फसल रोग की पहचान और उपचार
- कीट प्रबंधन समाधान
- जैविक और रासायनिक खेती के तरीके
- सामान्य कृषि सलाह

दिशानिर्देश:
- भारतीय कृषि परिस्थितियों के लिए उपयुक्त व्यावहारिक सलाह दें
- प्रासंगिक होने पर जैविक/प्राकृतिक और रासायनिक दोनों उपचार विकल्प सुझाएं
- सरल, स्पष्ट भाषा का उपयोग करें जिसे किसान समझ सकें
- उपचार प्रदान करते समय चरणबद्ध निर्देश शामिल करें
- उपचार और सामग्री की स्थानीय उपलब्धता पर विचार करें
- अपनी प्रतिक्रियाओं में सहानुभूतिपूर्ण और सहायक बनें`,

  ta: `நீங்கள் AgroGuardian AI, இந்தியாவில் உள்ள விவசாயிகளுக்கு உதவும் ஒரு நிபுணத்துவ வேளாண் உதவியாளர். நீங்கள் இந்த துறைகளில் நிபுணர்:
- பயிர் நோய் அடையாளம் மற்றும் சிகிச்சை
- பூச்சி மேலாண்மை தீர்வுகள்
- இயற்கை மற்றும் இரசாயன விவசாய முறைகள்
- பொதுவான விவசாய ஆலோசனை

வழிகாட்டுதல்கள்:
- இந்திய விவசாய நிலைமைகளுக்கு ஏற்ற நடைமுறை ஆலோசனைகளை வழங்கவும்
- பொருத்தமான போது இயற்கை/ஜैவிக மற்றும் இரசாயன சிகிச்சை விருப்பங்களை பரிந்துரைக்கவும்
- விவசாயிகள் புரிந்துகொள்ளக்கூடிய எளிய, தெளிவான மொழியைப் பயன்படுத்தவும்`,

  bn: `আপনি AgroGuardian AI, ভারতের কৃষকদের সাহায্যকারী একজন বিশেষজ্ঞ কৃষি সহায়ক। আপনি এই বিষয়গুলিতে বিশেষজ্ঞ:
- ফসলের রোগ শনাক্তকরণ এবং চিকিৎসা
- কীটপতঙ্গ ব্যবস্থাপনা সমাধান
- জৈবিক এবং রাসায়নিক চাষাবাদ পদ্ধতি
- সাধারণ কৃষি পরামর্শ

নির্দেশিকা:
- ভারতীয় কৃষি পরিস্থিতির জন্য উপযুক্ত ব্যবহারিক পরামর্শ প্রদান করুন
- প্রাসঙ্গিক হলে জৈবিক/প্রাকৃতিক এবং রাসায়নিক উভয় চিকিৎসার বিকল্প সুপারিশ করুন
- সহজ, স্পষ্ট ভাষা ব্যবহার করুন যা কৃষকরা বুঝতে পারেন`
};

// Mock LLM service for demonstration (replace with actual OpenAI integration)
export const chatWithLLM = async (request: ChatRequest): Promise<ChatResponse> => {
  try {
    // For demo purposes, we'll use a mock response
    // In production, replace this with actual OpenAI API call
    
    const mockResponses = {
      en: generateMockResponse(request, 'en'),
      hi: generateMockResponse(request, 'hi'),
      ta: generateMockResponse(request, 'ta'),
      bn: generateMockResponse(request, 'bn')
    };

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));

    return {
      response: mockResponses[request.language as keyof typeof mockResponses] || mockResponses.en,
      success: true
    };

    // Uncomment below for actual OpenAI integration
    /*
    if (!OPENAI_API_KEY) {
      throw new Error('OpenAI API key not configured');
    }

    const messages = [
      {
        role: 'system',
        content: systemPrompts[request.language as keyof typeof systemPrompts] || systemPrompts.en
      }
    ];

    // Add chat history
    if (request.chatHistory) {
      request.chatHistory.forEach(msg => {
        messages.push({
          role: msg.role,
          content: msg.content
        });
      });
    }

    // Add context if available
    let contextualMessage = request.message;
    if (request.context?.detectionResult) {
      const { crop, disease, remedy } = request.context.detectionResult;
      contextualMessage = `Context: Recently detected ${disease} in ${crop}. Previous remedy suggested: ${remedy}\n\nUser question: ${request.message}`;
    }

    messages.push({
      role: 'user',
      content: contextualMessage
    });

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages,
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    return {
      response: data.choices[0].message.content,
      success: true
    };
    */

  } catch (error) {
    console.error('LLM Chat Error:', error);
    return {
      response: 'Sorry, I am unable to respond right now. Please try again later.',
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

function generateMockResponse(request: ChatRequest, language: string): string {
  const { message, context } = request;
  const lowerMessage = message.toLowerCase();

  // Disease-specific responses
  if (context?.disease) {
    const disease = context.disease.toLowerCase();
    
    if (language === 'hi') {
      if (disease.includes('leaf curl') || disease.includes('पत्ती मुड़ना')) {
        return `🌿 **टमाटर पत्ती मुड़ना वायरस (Leaf Curl Virus)**

**तुरंत करें:**
1. संक्रमित पत्तियों को तुरंत हटाएं और जलाएं
2. पौधों के बीच दूरी बढ़ाएं

**प्राकृतिक उपचार:**
• नीम का तेल स्प्रे (10ml प्रति लीटर पानी)
• लहसुन-मिर्च का घोल
• पीले चिपचिपे जाल लगाएं (सफेद मक्खी के लिए)

**रासायनिक उपचार:**
• इमिडाक्लोप्रिड 17.8% SL (0.5ml प्रति लीटर)
• थायामेथोक्साम 25% WG (0.5g प्रति लीटर)

**रोकथाम:**
• वायरस मुक्त बीज का उपयोग
• सफेद मक्खी को नियंत्रित करें
• खेत की सफाई रखें

**कब डॉक्टर से मिलें:** यदि 7 दिन में सुधार न हो तो कृषि विशेषज्ञ से संपर्क करें।`;
      }
    }

    if (language === 'en') {
      if (disease.includes('leaf curl')) {
        return `🌿 **Tomato Leaf Curl Virus Treatment**

**Immediate Actions:**
1. Remove and burn infected leaves immediately
2. Increase spacing between plants for better air circulation

**Natural Treatments:**
• Neem oil spray (10ml per liter water)
• Garlic-chili solution spray
• Yellow sticky traps for whiteflies

**Chemical Treatments:**
• Imidacloprid 17.8% SL (0.5ml per liter)
• Thiamethoxam 25% WG (0.5g per liter)

**Prevention:**
• Use virus-free certified seeds
• Control whitefly population
• Maintain field hygiene
• Avoid overhead watering

**When to seek help:** Contact agricultural extension officer if no improvement in 7 days.`;
      }
    }
  }

  // General farming questions
  if (lowerMessage.includes('worm') || lowerMessage.includes('कीड़े') || lowerMessage.includes('कीट')) {
    if (language === 'hi') {
      return `🐛 **कीड़े-मकोड़े नियंत्रण**

**प्राकृतिक तरीके:**
• नीम का तेल (15ml प्रति लीटर पानी)
• बीटी (Bacillus thuringiensis) स्प्रे
• तंबाकू का पानी
• मैरीगोल्ड के साथ मिश्रित खेती

**रासायनिक स्प्रे:**
• क्लोरपायरीफॉस 20% EC (2ml प्रति लीटर)
• लैम्ब्डा साइहैलोथ्रिन 5% EC (1ml प्रति लीटर)

**स्प्रे का समय:** शाम 4-6 बजे के बीच
**दोहराएं:** 10-15 दिन बाद यदि आवश्यक हो`;
    } else {
      return `🐛 **Worm/Pest Control Guide**

**Natural Methods:**
• Neem oil spray (15ml per liter water)
• BT (Bacillus thuringiensis) spray
• Tobacco water solution
• Companion planting with marigold

**Chemical Sprays:**
• Chlorpyrifos 20% EC (2ml per liter)
• Lambda cyhalothrin 5% EC (1ml per liter)

**Spray timing:** Between 4-6 PM
**Repeat:** After 10-15 days if needed`;
    }
  }

  // Fertilizer questions
  if (lowerMessage.includes('fertilizer') || lowerMessage.includes('खाद') || lowerMessage.includes('उर्वरक')) {
    if (language === 'hi') {
      return `🌱 **उर्वरक गाइड**

**जैविक खाद:**
• गोबर की खाद (5-10 टन प्रति एकड़)
• कम्पोस्ट (3-5 टन प्रति एकड़)
• वर्मी कम्पोस्ट (2-3 टन प्रति एकड़)

**रासायनिक उर्वरक:**
• यूरिया (50-100 किग्रा प्रति एकड़)
• DAP (50-75 किग्रा प्रति एकड़)
• पोटाश (25-50 किग्रा प्रति एकड़)

**समय:** बुआई के समय और फूल आने पर`;
    } else {
      return `🌱 **Fertilizer Application Guide**

**Organic Fertilizers:**
• Farm yard manure (5-10 tons per acre)
• Compost (3-5 tons per acre)
• Vermicompost (2-3 tons per acre)

**Chemical Fertilizers:**
• Urea (50-100 kg per acre)
• DAP (50-75 kg per acre)
• Potash (25-50 kg per acre)

**Timing:** At sowing and during flowering stage`;
    }
  }

  // Default helpful response
  const defaultResponses = {
    hi: `मैं आपकी कृषि संबंधी समस्याओं में मदद करने के लिए यहाँ हूँ। आप मुझसे पूछ सकते हैं:
• फसल की बीमारियों के बारे में
• कीट नियंत्रण के तरीके
• उर्वरक और खाद की जानकारी
• सिंचाई और देखभाल की सलाह

कृपया अपना प्रश्न विस्तार से बताएं।`,
    
    en: `I'm here to help with your farming questions! You can ask me about:
• Crop diseases and treatments
• Pest control methods
• Fertilizer and nutrient management
• Irrigation and crop care advice

Please feel free to ask your specific question.`,
    
    ta: `உங்கள் விவசாய கேள்விகளுக்கு உதவ நான் இங்கே இருக்கிறேன்! நீங்கள் என்னிடம் கேட்கலாம்:
• பயிர் நோய்கள் மற்றும் சிகிச்சைகள்
• பூச்சி கட்டுப்பாட்டு முறைகள்
• உரம் மற்றும் ஊட்டச்சத்து மேலாண்மை
• நீர்ப்பாசனம் மற்றும் பயிர் பராமரிப்பு`,
    
    bn: `আমি আপনার কৃষি প্রশ্নের সাহায্যের জন্য এখানে আছি! আপনি আমাকে জিজ্ঞাসা করতে পারেন:
• ফসলের রোগ এবং চিকিৎসা
• কীটপতঙ্গ নিয়ন্ত্রণ পদ্ধতি
• সার এবং পুষ্টি ব্যবস্থাপনা
• সেচ এবং ফসলের যত্ন`
  };

  return defaultResponses[language as keyof typeof defaultResponses] || defaultResponses.en;
}
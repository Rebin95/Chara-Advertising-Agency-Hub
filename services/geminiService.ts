import { GoogleGenAI, Modality, Type } from "@google/genai";
import type { Employee, ChatMessage, ChatMessagePart, NewsItem, Client } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTIONS: Record<string, string> = {
    "General Assistant": "You are Zana, a helpful and fast general-purpose AI assistant for Chara Advertising. Provide quick, concise, and accurate answers to general questions. All responses must be in Kurdish Sorani.",
    "Social Media Manager": "You are a creative AI strategist for Chara Advertising, a Kurdish marketing agency. Your role is to assist the Social Media Manager. Provide innovative, strategic advice, content ideas, and planning assistance. When asked to create a monthly content plan in a table, you MUST generate a Markdown table with the following columns: 'هەفتە' (Week), 'جۆری ناوەڕۆکی مانگانە (گشتی)' (Monthly Content Type), 'ژمارەی پۆستەکان (وێنە/نووسین)' (Number of Posts), 'ژمارەی ڤیدیۆکان (کورت/درێژ)' (Number of Videos), and 'نموونەی ناوەڕۆک' (Content Example). For all other requests, always write answers in simple punctuation with good spacing. Keep your answers short, concise, and well-structured, often using lists. All responses must be in Kurdish Sorani.",
    "Caption Writer": "You are an expert AI caption writer for Chara Advertising. Your ONLY task is to write captions for social media posts. You will be given a topic or an image, and a desired length (short, medium, or long). Write beautiful, concise, and engaging captions. You MUST include relevant hashtags. Use simple punctuation with good spacing. Your tone should be engaging and conversational. All responses must be in Kurdish Sorani.",
    "Designer": "You are a visual AI muse for Chara Advertising, assisting the designer. Your main role is to generate visual ideas and images. When asked for a design, picture, or anything visual, generate an image. For other questions, describe design concepts, color palettes, and moods. Avoid writing marketing text. All text responses must be in Kurdish Sorani.",
    "Official Document Writer": "You are a professional and meticulous AI assistant for Chara Advertising. You are assisting with official documents. Provide templates, professional phrasing, and structural advice for proposals, reports, and other formal documents. Maintain a formal tone. All responses must be in Kurdish Sorani.",
    "Script Writer": "You are a dynamic AI storyteller for Chara Advertising, helping write scripts for short videos. Generate creative script ideas, dialogues, visual cues, and suggestions for trending audio. Focus on engaging, short-form video content. All responses must be in Kurdish Sorani.",
    "R&D Specialist": "You are a forward-thinking AI research assistant for Chara Advertising. You are helping discover the latest trends, news, and AI tools for marketing. Use your search capabilities to provide up-to-date information. All responses must be in Kurdish Sorani.",
    "Medical Article Writer": "You are a knowledgeable and clear AI writing partner for Chara Advertising. You are assisting in creating accurate and engaging medical content for a general audience on social media. Suggest topics, headlines, and key points, ensuring the information is easy to understand. All responses must be in Kurdish Sorani.",
};

const CHARA_ROBOT_SYSTEM_INSTRUCTION = "You are Chara Robot, a friendly AI assistant for the Chara Advertising Hub application. Your goal is to help users navigate and use the app. Answer questions about the app's features and guide them to the right section. For example, if a user asks how to create a design, tell them to go to the 'Design' tab. If they ask to add a client, guide them to the 'Clients' tab. The app has these sections: Home, Clients, Tasks, Design, Analyzer, Profile, and Settings. Keep your answers concise and helpful. All responses must be in Kurdish Sorani.";

const dataUrlToGeminiPart = (dataUrl: string) => {
  const match = dataUrl.match(/^data:(.+);base64,(.+)$/);
  if (!match) return null;
  return {
    inlineData: {
      mimeType: match[1],
      data: match[2],
    },
  };
};

const toGeminiHistory = (history: ChatMessage[]) => {
  return history.map(msg => ({
    role: msg.role,
    parts: msg.parts.flatMap((part): ({ text: string } | { inlineData: { mimeType: string; data: string; } })[] => {
      if (part.text) {
        return [{ text: part.text }];
      }
      if (part.imageUrl) {
        const geminiPart = dataUrlToGeminiPart(part.imageUrl);
        if (geminiPart && msg.role === 'user') {
          return [geminiPart];
        }
        return [{ text: '[وێنەیەک نیشاندرا]' }];
      }
      return [];
    })
  }));
};

const translateKurdishToEnglish = async (text: string): Promise<string> => {
  if (!text.trim()) {
    return "";
  }
  try {
    const prompt = `Translate the following Kurdish (Sorani) text to English for an image generation model. Return only the translated text, without any additional explanations or introductions:\n\n"${text}"`;
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text.trim();
  } catch (error) {
    console.error("Translation error:", error);
    return text;
  }
};

export const generateSpeech = async (text: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: `Say this in a friendly tone: ${text}` }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' },
          },
        },
      },
    });
    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (base64Audio) {
      return base64Audio;
    }
    throw new Error("No audio data received from API.");
  } catch (error) {
    console.error("Error generating speech:", error);
    throw new Error("Failed to generate speech.");
  }
};

export const getAiNews = async (): Promise<NewsItem[]> => {
  try {
    const prompt = "Provide 3 recent and important news items about AI and marketing. For each item, provide a short headline and a one-sentence summary. All text should be in Kurdish (Sorani). Respond in JSON format.";
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-pro',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            news: {
              type: Type.ARRAY,
              description: "A list of recent news items about AI and marketing.",
              items: {
                type: Type.OBJECT,
                properties: {
                  headline: {
                    type: Type.STRING,
                    description: "The news headline in Kurdish (Sorani).",
                  },
                  summary: {
                    type: Type.STRING,
                    description: "A one-sentence summary of the news in Kurdish (Sorani).",
                  },
                },
                required: ['headline', 'summary'],
              },
            },
          },
          required: ['news'],
        },
      },
    });

    const jsonString = response.text.trim();
    const result = JSON.parse(jsonString);

    if (result.news && Array.isArray(result.news)) {
      return result.news.filter(
        (item): item is NewsItem => 
          typeof item === 'object' &&
          item !== null &&
          'headline' in item &&
          'summary' in item
      );
    }
    return [];
  } catch (error) {
    console.error("Error fetching AI news:", error);
    throw new Error("Failed to fetch AI news from the model.");
  }
};

export const extractTextFromFile = async (file: { base64: string; mimeType: string }): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: file.mimeType,
              data: file.base64,
            },
          },
          { text: "Extract all text content from this file. If the file is an image, perform OCR. If there is no text, return an empty response. Respond only with the extracted text." },
        ],
      },
    });
    return response.text;
  } catch (error) {
    console.error("Text extraction error:", error);
    return "نەتوانرا دەق لە فایلەکە وەربگیرێت.";
  }
};

export const generateTranslations = async (text: string, type: string, languages: ('ar' | 'en')[]): Promise<{ kurdish: string; arabic?: string; english?: string }> => {
  try {
      const targetLangs = ["Kurdish (Sorani)", ...languages.map(l => l === 'ar' ? 'Arabic' : 'English')];
      const prompt = `You are an expert translator specializing in ${type} translations. Translate the following text into these languages: ${targetLangs.join(', ')}. Respond with ONLY a valid JSON object.

The text to translate is:
---
${text}
---`;

      const properties: any = {
          kurdish: { type: Type.STRING, description: 'The translated text in Kurdish (Sorani).' }
      };
      const required = ['kurdish'];

      if (languages.includes('ar')) {
          properties.arabic = { type: Type.STRING, description: 'The translated text in Arabic.' };
          required.push('arabic');
      }
      if (languages.includes('en')) {
          properties.english = { type: Type.STRING, description: 'The translated text in English.' };
          required.push('english');
      }

      const response = await ai.models.generateContent({
          model: 'gemini-2.5-pro',
          contents: prompt,
          config: {
              responseMimeType: "application/json",
              responseSchema: {
                  type: Type.OBJECT,
                  properties,
                  required,
              },
          },
      });

      const jsonString = response.text.trim();
      const result = JSON.parse(jsonString);
      return result;
  } catch (error) {
      console.error("Translation error:", error);
      const errorResult: { kurdish: string; arabic?: string; english?: string } = {
          kurdish: "هەڵەیەک لە وەرگێڕان ڕوویدا.",
      };
      if (languages.includes('ar')) errorResult.arabic = "حدث خطأ أثناء الترجمة.";
      if (languages.includes('en')) errorResult.english = "An error occurred during translation.";
      return errorResult;
  }
};


export const generateAnalyzerResponse = async (prompt: string): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: prompt,
            config: {
                systemInstruction: "You are a multi-purpose analysis and writing assistant AI for Chara Advertising. You can summarize content, answer questions about it, translate text, and correct grammar. Your primary language is Kurdish Sorani, but you must respond in other languages when the task requires it."
            }
        });
        return response.text;
    } catch (error) {
        console.error("Analyzer error:", error);
        return "هەڵەیەک ڕوویدا لەکاتی وەرگرتنی وەڵام. تکایە دووبارە هەوڵبدەرەوە.";
    }
};

export const generateRobotResponse = async (history: ChatMessage[], newUserMessage: ChatMessage): Promise<ChatMessagePart[]> => {
    const geminiHistory = toGeminiHistory(history);
    const newUserMessageParts = [{ text: newUserMessage.parts.find(p => p.text)?.text || "" }];
    const contents = [...geminiHistory, { role: 'user', parts: newUserMessageParts }];

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents,
            config: {
                systemInstruction: CHARA_ROBOT_SYSTEM_INSTRUCTION
            }
        });
        return [{ text: response.text }];
    } catch (error) {
        console.error("Gemini API error in generateRobotResponse:", error);
        return [{ text: "ببورە، کێشەیەک ڕوویدا. تکایە دووبارە هەوڵبدەرەوە." }];
    }
};

export const generateChatResponse = async (employee: Employee, history: ChatMessage[], newUserMessage: ChatMessage, clients: Client[]): Promise<ChatMessagePart[][]> => {
  const isDesigner = employee.role === 'Designer';
  const userText = newUserMessage.parts.find(p => p.text)?.text || '';

  if (isDesigner) {
    // ... (Designer logic remains the same)
    const imagePart = newUserMessage.parts.find(p => p.imageUrl);
    const translatedText = userText ? await translateKurdishToEnglish(userText) : '';
    const designerApiParts: ({ text: string } | { inlineData: { mimeType: string; data: string; } })[] = [];

    if (imagePart?.imageUrl) {
      const geminiPart = dataUrlToGeminiPart(imagePart.imageUrl);
      if (geminiPart) designerApiParts.push(geminiPart);
    }
    if (translatedText) {
      designerApiParts.push({ text: translatedText });
    }

    if (designerApiParts.length === 0) {
      return [[{ text: "بۆ دروستکردنی وێنە، تکایە وەسفێک بنووسە یان وێنەیەک باربکە." }]];
    }

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: { parts: designerApiParts },
        config: { responseModalities: [Modality.IMAGE] },
      });
      const responseParts: ChatMessagePart[] = [];
      const generatedImagePart = response.candidates?.[0]?.content?.parts.find(p => p.inlineData);
      if (generatedImagePart?.inlineData) {
        const base64Image = generatedImagePart.inlineData.data;
        responseParts.push({ imageUrl: `data:${generatedImagePart.inlineData.mimeType};base64,${base64Image}` });
      } else {
        responseParts.push({ text: response.text ? `نەتوانرا وێنە دروست بکرێت. وەڵامی مۆدێل:\n${response.text}` : "ببورە، کێشەیەک لە دروستکردنی وێنەکەدا ڕوویدا." });
      }
      return [responseParts];
    } catch (error) {
      console.error("Gemini API error in designer flow:", error);
      throw new Error("Failed to get response from AI model for designer.");
    }
  } else {
    const systemInstructionTemplate = SYSTEM_INSTRUCTIONS[employee.role] || "You are a helpful AI assistant for Chara Advertising. Respond in Kurdish Sorani.";
    let systemInstruction = systemInstructionTemplate;

    if (newUserMessage.clientTag) {
      const client = clients.find(c => c.name === newUserMessage.clientTag);
      if (client) {
        const clientContext = `
--- CLIENT CONTEXT ---
Name: ${client.name}
Business: ${client.type}
About: ${client.about}
Our Monthly Tasks: We create ${client.tasks.videos} videos and ${client.tasks.posts} posts.
Sponsorship Budget: ${client.tasks.sponsorship}
Social Media Links:
- Facebook: ${client.pages.facebook || 'N/A'}
- Instagram: ${client.pages.instagram || 'N/A'}
- TikTok: ${client.pages.tiktok || 'N/A'}
Only use the provided social media links for information. Always consider this context when responding.
--- END CLIENT CONTEXT ---
`;
        systemInstruction = `${clientContext}\n\n${systemInstructionTemplate}`;
      }
    }

    let modelName: string;
    const config: any = { systemInstruction };

    if (employee.role === 'Caption Writer') {
        modelName = 'gemini-2.5-pro';
    } else {
        modelName = 'gemini-2.5-flash';
    }
    
    if (employee.role === "R&D Specialist") {
        config.tools = [{ googleSearch: {} }];
    }

    const geminiHistory = toGeminiHistory(history);

    const newUserMessageParts = newUserMessage.parts.flatMap((part): ({ text: string } | { inlineData: { mimeType: string; data: string; } })[] => {
      if (part.text) return [{ text: part.text.trim() }];
      if (part.imageUrl) {
        const geminiPart = dataUrlToGeminiPart(part.imageUrl);
        return geminiPart ? [geminiPart] : [];
      }
      return [];
    });

    const contents = [...geminiHistory, { role: 'user', parts: newUserMessageParts }];

    try {
      const response = await ai.models.generateContent({ model: modelName, contents, config });
      const responseParts: ChatMessagePart[] = [];
      const imagePart = response.candidates?.[0]?.content?.parts.find(p => p.inlineData);

      if (imagePart?.inlineData) {
        responseParts.push({ imageUrl: `data:${imagePart.inlineData.mimeType};base64,${imagePart.inlineData.data}` });
      }
      if (response.text) {
        responseParts.push({ text: response.text });
      }
      if (employee.role === "R&D Specialist" && response.candidates?.[0]?.groundingMetadata?.groundingChunks) {
        const sources = response.candidates[0].groundingMetadata.groundingChunks.filter(s => s.web?.uri);
        if (sources.length > 0) {
          const sourcesText = sources.map(s => `[${s.web.title || s.web.uri}](${s.web.uri})`).join('\n');
          responseParts.push({ text: `\n\n**سەرچاوەکان:**\n${sourcesText}` });
        }
      }
      if (responseParts.length === 0) {
        return [[{ text: "ببورە، وەڵامێکم پێنەبوو. تکایە ڕوونتر پرسیار بکە." }]];
      }
      return [responseParts];
    } catch (error) {
      console.error("Gemini API error in generateChatResponse:", error);
      throw new Error("Failed to get response from AI model.");
    }
  }
};
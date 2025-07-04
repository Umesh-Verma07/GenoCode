const { GoogleGenAI } = require('@google/genai')
const ai = new GoogleGenAI({apiKey: process.env.GEMINI_API});

const generateAIReview = async (code) => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents: `${process.env.PROMPT}\n ${code}`,
        });
        return (response.text);
    } catch (error) {
        return Promise.reject(error.message);
    }
}

module.exports = generateAIReview;
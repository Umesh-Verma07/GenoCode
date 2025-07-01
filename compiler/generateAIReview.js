const { GoogleGenAI } = require('@google/genai')
const ai = new GoogleGenAI({apiKey: "AIzaSyDklyZVLBj9lHqFK3gVh3FGpN0pcmzIhGk"});

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
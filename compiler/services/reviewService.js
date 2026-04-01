const { GoogleGenAI } = require('@google/genai')
const crypto = require('crypto')
const ai = new GoogleGenAI({apiKey: process.env.GEMINI_API});

const REVIEW_CACHE_TTL_MS = Number(process.env.REVIEW_CACHE_TTL_MS || 15 * 60 * 1000);
const REVIEW_CACHE_MAX_ITEMS = Number(process.env.REVIEW_CACHE_MAX_ITEMS || 200);
const reviewCache = new Map();

const buildCacheKey = (code, problem) => {
    const payload = `${process.env.PROMPT || ''}\n${code}\n${problem || ''}`;
    return crypto.createHash('sha256').update(payload).digest('hex');
};

const getFromCache = (key) => {
    const cached = reviewCache.get(key);
    if (!cached) return null;
    if (Date.now() - cached.timestamp > REVIEW_CACHE_TTL_MS) {
        reviewCache.delete(key);
        return null;
    }
    return cached.text;
};

const setInCache = (key, text) => {
    if (reviewCache.size >= REVIEW_CACHE_MAX_ITEMS) {
        const firstKey = reviewCache.keys().next().value;
        if (firstKey) reviewCache.delete(firstKey);
    }
    reviewCache.set(key, { text, timestamp: Date.now() });
};

const generateAIReview = async (code, problem) => {
    if (!process.env.GEMINI_API) {
        const err = new Error('GEMINI_API is not configured on compiler server.');
        err.statusCode = 503;
        throw err;
    }

    try {
        const cacheKey = buildCacheKey(code, problem);
        const cachedText = getFromCache(cacheKey);
        if (cachedText) {
            return cachedText;
        }

        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: `${process.env.PROMPT || ''}\n${code}\n${problem || ''}`,
        });

        const text = typeof response.text === 'function' ? await response.text() : response.text;
        if (!text) {
            const err = new Error('AI provider returned an empty review response.');
            err.statusCode = 502;
            throw err;
        }

        setInCache(cacheKey, text);
        return text;
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 502;
        }
        throw error;
    }
}

module.exports = generateAIReview;
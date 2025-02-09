const { GoogleGenerativeAI } = require('@google/generative-ai');
const { ServerConfig } = require('../config');
const AppError = require('../utils/errors/app-error');

const genAI = new GoogleGenerativeAI(ServerConfig.geminiApiKey);

const findMatch = async (query, networkMembers) => {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
        const prompt = `Given the following list of investors and mentors : ${JSON.stringify(networkMembers)} And this user query : "${query}".
        Please analyze the query and find the most suitable investor or mentor from the list.Return only name of the most suitable person.
        If no suitable person is found, return "No match found yet. Try again later".`;

        const result = await model.generateContent(prompt);
        const response = result.response.text();
        return response.trim();
    } catch (error) {
        throw new AppError('AI Service Error', 500);
    }
};

module.exports = findMatch;
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { ServerConfig } = require('../config');
const AppError = require('../utils/errors/app-error');

const genAI = new GoogleGenerativeAI(ServerConfig.geminiApiKey);

const findMatch = async (query, networkMembers) => {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
        const prompt = `Given the following list of investors and mentors : ${JSON.stringify(networkMembers)} And this user query : "${query}".
        Please analyze the query and find the suitable person from the list.Analyze the user query to identify:
        Role Requested: Determine if the user is seeking a mentor or investor. Ignore the other role entirely.
        Category: Extract the specific category mentioned in the query (e.g., "AI", "blockchain", "video").
        From the provided list, strictly filter using these rules:
        Return only a mentor if the query explicitly seeks a mentor, and only an investor if it seeks an investor.
        The person’s expertise/domain must exactly match the extracted category (case-insensitive).
        If no exact match exists for both role and category, return "No match found yet. Try again later".
        Examples to follow:
        Query: "Find me the best mentor for my AI startup" → Only return a mentor in the AI category. Ignore blockchain mentors or investors.
        Query: "Looking for a mentor for my video startup" → Only return an investor in the video category.
        if query is Find me best mentor for my AI startup then do not return name of mentor of blockchain instead return "No match found yet".
        And if query is searching mentor for my video startup then do not return investor name instead return "No match found yet
        Output Format:
        Return only the name of the matching person (e.g., "John Doe").If no match, return "No match found yet. Try again later".
        Do NOT:
        Suggest alternate roles and categories.
        Include explanations, markdown, or additional text.`;

        const result = await model.generateContent(prompt);
        const response = result.response.text();
        return response.trim();
    } catch (error) {
        throw new AppError('AI Service Error', 500);
    }
};

module.exports = findMatch;
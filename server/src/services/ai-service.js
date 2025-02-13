const { GoogleGenerativeAI } = require('@google/generative-ai');
const { ServerConfig } = require('../config');
const AppError = require('../utils/errors/app-error');

const genAI = new GoogleGenerativeAI(ServerConfig.geminiApiKey);

const findMatch = async (query, networkMembers) => {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
        const prompt = `Given the following list of investors and mentors : ${JSON.stringify(networkMembers)} And this user query : "${query}".
        Each network member object contains at least the following properties:
        name, type (with possible values "mentor" or "investor") and category (e.g., "AI startup", "video startup", etc.)
        Your Task:
        Determine the Requested Role:
        Parse the user query to determine whether the request is for a mentor or an investor.
        Strictly ignore any network member whose type does not exactly match the requested role.
        Extract the Requested Category:
        Identify the specific category mentioned in the query (for example, "AI startup", "video startup", etc.).
        Only consider network members whose category exactly matches the category extracted from the query.
        Select the Matching Network Member:
        From the list, find a network member that satisfies both:
        Their type exactly matches the requested role.
        Their category exactly matches the requested category.
        Do not mix roles or categories. For example, if the query is for a mentor in the "video startup" category, do not consider any investors—even if they are in the "video startup" category.
        Output Rules:
        Return ONLY:
        The name (e.g., “Jane Smith”) OR
        “No match found yet. Try again later”.
        No explanations, formatting, or exceptions.
        Example:
        If the query is:
        "Find me the best mentor for my AI startup"
        Then you must only consider network members with type: "mentor" and category: "AI startup".
        If a match is found, output only that network member’s name (e.g., "Alice Smith").
        If no match is found, output exactly:
        No match found yet.Try again later`;

        const result = await model.generateContent(prompt);
        const response = result.response.text();
        return response.trim();
    } catch (error) {
        console.log("error at ai service", error);
        throw new AppError('AI Service Error', 500);
    }
};

module.exports = findMatch;
// Gemini AI integration for chat
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini - you'll need to set GEMINI_API_KEY in your .env file
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';

let genAI = null;
let model = null;

if (API_KEY) {
  try {
    genAI = new GoogleGenerativeAI(API_KEY);
    model = genAI.getGenerativeModel({ model: 'gemini-pro' });
  } catch (error) {
    console.error('Error initializing Gemini:', error);
  }
}

export const chatWithGemini = async (message, conversationHistory = []) => {
  if (!model) {
    // Fallback response if Gemini is not configured
    return {
      response: "I'm a financial AI assistant. To enable full AI capabilities, please configure the Gemini API key. For now, here's a helpful response:\n\n" + 
        getFallbackResponse(message),
      suggestions: getSuggestions(message),
    };
  }

  try {
    // Build conversation context
    const context = `You are a helpful financial AI assistant. Provide clear, actionable financial advice. 
    Keep responses concise and professional. Focus on personal finance topics like budgeting, saving, investing, debt management, and credit optimization.`;

    const chat = model.startChat({
      history: conversationHistory.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }],
      })),
    });

    const result = await chat.sendMessage(context + '\n\nUser: ' + message);
    const response = await result.response;
    const text = response.text();

    return {
      response: text,
      suggestions: getSuggestions(message),
    };
  } catch (error) {
    console.error('Error calling Gemini:', error);
    return {
      response: getFallbackResponse(message),
      suggestions: getSuggestions(message),
    };
  }
};

const getFallbackResponse = (message) => {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('budget') || lowerMessage.includes('spending')) {
    return 'Based on your spending patterns, I recommend tracking your expenses for 30 days to identify areas where you can cut back. Consider using the 50/30/20 rule: 50% for needs, 30% for wants, and 20% for savings and debt repayment.';
  }
  
  if (lowerMessage.includes('debt') || lowerMessage.includes('pay off')) {
    return 'For debt management, I recommend the debt avalanche method: pay minimums on all debts, then put extra money toward the debt with the highest interest rate. This minimizes total interest paid over time.';
  }
  
  if (lowerMessage.includes('credit') || lowerMessage.includes('score')) {
    return 'To improve your credit score: 1) Pay bills on time, 2) Keep credit utilization below 30%, 3) Don\'t close old accounts, 4) Limit new credit applications. Your current score of 745 is good, but you can reach 750+ by reducing utilization.';
  }
  
  if (lowerMessage.includes('invest') || lowerMessage.includes('portfolio')) {
    return 'For investing, consider a diversified portfolio. Your current portfolio shows good diversification. Consider dollar-cost averaging and maintaining a long-term perspective. Rebalance quarterly to maintain your target allocation.';
  }
  
  if (lowerMessage.includes('save') || lowerMessage.includes('emergency')) {
    return 'An emergency fund should cover 3-6 months of expenses. Based on your monthly expenses of $6,200, aim for $18,600-$37,200. Automate your savings by setting up automatic transfers to a high-yield savings account.';
  }
  
  return 'I can help you with budgeting, saving, investing, debt management, credit optimization, and financial planning. What specific area would you like to focus on?';
};

const getSuggestions = (message) => {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('budget') || lowerMessage.includes('spending')) {
    return ['Show me my spending breakdown', 'How can I reduce my expenses?', 'What is my budget for this month?'];
  }
  
  if (lowerMessage.includes('debt')) {
    return ['What is my debt payoff strategy?', 'How much interest am I paying?', 'Should I consolidate my debts?'];
  }
  
  if (lowerMessage.includes('credit')) {
    return ['How can I improve my credit score?', 'What affects my credit score?', 'When will my credit score update?'];
  }
  
  if (lowerMessage.includes('invest')) {
    return ['How is my portfolio performing?', 'Should I rebalance my portfolio?', 'What is my asset allocation?'];
  }
  
  return [
    'What is my financial health score?',
    'Show me my top recommendations',
    'What are my financial goals?',
  ];
};


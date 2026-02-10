import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { SendIcon, RobotIcon, UserIcon } from '../components/Icons';

const Chat = () => {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hello! I'm your AI financial companion powered by Gemini AI. How can I help you with your finances today?",
      timestamp: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const messagesEndRef = useRef(null);
  const conversationIdRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (messageText = input) => {
    if (!messageText.trim() || loading) return;

    const userMessage = {
      role: 'user',
      content: messageText,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    setSuggestions([]);

    try {
      const response = await axios.post('/api/chat/message', {
        message: messageText,
        conversationId: conversationIdRef.current,
      });

      const responseData = response.data.data || response.data;
      conversationIdRef.current = responseData.conversationId;

      const assistantMessage = {
        role: 'assistant',
        content: responseData.response,
        timestamp: responseData.timestamp,
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setSuggestions(responseData.suggestions || []);
    } catch (error) {
      console.error('Error sending message:', error);
      // Fallback response if API fails
      const fallbackResponse = generateFallbackResponse(messageText);
      const assistantMessage = {
        role: 'assistant',
        content: fallbackResponse,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setSuggestions([
        'Tell me about my spending',
        'Help me with debt',
        'Show my financial overview',
      ]);
    } finally {
      setLoading(false);
    }
  };

  const generateFallbackResponse = (message) => {
    const lowerMessage = message.toLowerCase();
    if (lowerMessage.includes('budget') || lowerMessage.includes('spending')) {
      return 'Based on your financial data, you\'re spending about $6,200 per month. Your top spending categories are Housing (40%), Food (19%), and Transportation (13%). Consider reviewing your housing costs as they take up the largest portion of your budget.';
    } else if (lowerMessage.includes('debt')) {
      return 'You currently have $20,950 in total debt across credit cards and loans. I recommend focusing on paying off high-interest debt first. Your credit card at 18.5% APR should be prioritized. Consider making extra payments to reduce interest costs.';
    } else if (lowerMessage.includes('save') || lowerMessage.includes('savings')) {
      return 'You\'re saving about 27% of your income, which is excellent! You\'re saving approximately $2,300 per month. To build a 6-month emergency fund, you\'ll need $37,200. You\'re currently at $30,000, so you\'re about 81% of the way there!';
    } else if (lowerMessage.includes('credit') || lowerMessage.includes('credit score')) {
      return 'Your credit score is 745, which is in the "Good" range. To improve it further, focus on reducing your credit card balances below 30% of your limits. You\'re currently using about 32% of available credit. Paying down $500 could boost your score by 15-20 points.';
    } else if (lowerMessage.includes('invest') || lowerMessage.includes('portfolio')) {
      return 'Your portfolio is valued at $125,430 with a gain of 14.03% over the past year. Your holdings include stocks, ETFs, bonds, and cryptocurrency. Consider rebalancing if any single asset class exceeds 40% of your portfolio.';
    } else {
      return 'I\'m here to help with your financial questions! I can assist with budgeting, debt management, savings goals, investments, and credit optimization. What would you like to know more about?';
    }
  };

  const handleSuggestionClick = (suggestion) => {
    handleSend(suggestion);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const defaultSuggestions = [
    'What is my financial health score?',
    'How can I improve my credit score?',
    'Show me my spending patterns',
    'What are my top recommendations?',
    'Help me create a budget',
    'How much should I save?',
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">AI Financial Companion</h1>
        <p className="text-gray-600 mt-1">Chat with your AI financial advisor powered by Gemini AI</p>
      </div>

      <div className="flex-1 bg-white rounded-lg shadow flex flex-col">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.length === 1 && (
            <div className="text-center py-12">
              <RobotIcon className="h-16 w-16 text-primary-600 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">Start a conversation with your AI assistant</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {defaultSuggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="px-3 py-1 text-sm bg-primary-50 text-primary-700 rounded-full hover:bg-primary-100 transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex items-start space-x-3 ${
                message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
              }`}
            >
              <div
                className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${
                  message.role === 'user'
                    ? 'bg-primary-600'
                    : 'bg-gray-200'
                }`}
              >
                {message.role === 'user' ? (
                  <UserIcon className="h-5 w-5 text-white" />
                ) : (
                  <RobotIcon className="h-5 w-5 text-gray-700" />
                )}
              </div>
              <div
                className={`flex-1 rounded-lg p-4 ${
                  message.role === 'user'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                <p className="whitespace-pre-wrap">{message.content}</p>
                <p
                  className={`text-xs mt-2 ${
                    message.role === 'user'
                      ? 'text-primary-100'
                      : 'text-gray-500'
                  }`}
                >
                  {new Date(message.timestamp).toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                <RobotIcon className="h-5 w-5 text-gray-700" />
              </div>
              <div className="flex-1 rounded-lg p-4 bg-gray-100">
                <div className="flex space-x-2">
                  <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggestions */}
        {suggestions.length > 0 && (
          <div className="px-6 py-3 border-t border-gray-200 bg-gray-50">
            <p className="text-xs text-gray-500 mb-2">Suggestions:</p>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="px-3 py-1 text-sm bg-primary-50 text-primary-700 rounded-full hover:bg-primary-100 transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex space-x-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything about your finances..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              disabled={loading}
            />
            <button
              onClick={() => handleSend()}
              disabled={loading || !input.trim()}
              className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
            >
              <SendIcon className="h-4 w-4" />
              <span>Send</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;

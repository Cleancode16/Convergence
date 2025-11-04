import { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { MessageCircle, X, Send, Loader, Bot, User, Sparkles, Maximize2, Minimize2, ShoppingCart, ExternalLink } from 'lucide-react';
import { sendMessage, getRecommendations } from '../services/chatbotService';

const Chatbot = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [size, setSize] = useState({ width: 600, height: 700 });
  const [isResizing, setIsResizing] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `Hi ${userInfo?.name || 'there'}! 👋 I'm your CraftConnect assistant. I can help you with:

🎨 Product recommendations
💰 Pricing and availability
🏺 Cultural information about art forms
❓ Common questions about our platform

How can I assist you today?`,
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const messagesEndRef = useRef(null);
  const chatboxRef = useRef(null);
  const resizeStartPos = useRef({ x: 0, y: 0, width: 0, height: 0 });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      role: 'user',
      content: inputMessage.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    setRecommendedProducts([]); // Clear previous products

    try {
      const conversationHistory = messages.map(msg => ({
        role: msg.role,
        content: msg.content,
      }));

      const response = await sendMessage(
        userMessage.content,
        conversationHistory,
        userInfo.token
      );

      const assistantMessage = {
        role: 'assistant',
        content: response.message,
        timestamp: new Date(response.timestamp),
      };

      setMessages(prev => [...prev, assistantMessage]);

      // Check if message is about products and fetch recommendations
      const productKeywords = ['product', 'buy', 'purchase', 'show', 'pottery', 'painting', 'craft', 'price', 'under', 'weaving', 'art', 'handicraft'];
      const hasProductKeyword = productKeywords.some(keyword => 
        userMessage.content.toLowerCase().includes(keyword)
      );

      if (hasProductKeyword) {
        await fetchProductRecommendations(userMessage.content);
      }
    } catch (error) {
      console.error('Chat Error:', error);
      const errorMessage = {
        role: 'assistant',
        content: `I apologize, but I'm having trouble connecting right now. Please try again in a moment. Error: ${error.message}`,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchProductRecommendations = async (query) => {
    try {
      // Extract budget from query
      const budgetMatch = query.match(/under\s+₹?(\d+)/i) || query.match(/₹(\d+)/);
      const budget = budgetMatch ? parseInt(budgetMatch[1]) : null;

      // Extract category from query
      const categories = ['pottery', 'weaving', 'paintings', 'tanjore', 'puppetry', 'dokra', 'meenakari'];
      const category = categories.find(cat => query.toLowerCase().includes(cat));

      const response = await getRecommendations(
        {
          preferences: query,
          budget: budget,
          category: category,
        },
        userInfo.token
      );

      if (response.success && response.products && response.products.length > 0) {
        setRecommendedProducts(response.products);
      } else {
        setRecommendedProducts([]);
      }
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      setRecommendedProducts([]);
    }
  };

  const handleBuyProduct = (productId) => {
    setIsOpen(false);
    navigate(`/product/${productId}`);
  };

  const quickQuestions = [
    "Show me pottery products",
    "What's special about Tanjore paintings?",
    "Products under ₹500",
    "How does CraftConnect support artisans?",
    "Tell me about Indian handicrafts",
  ];

  const handleQuickQuestion = (question) => {
    setInputMessage(question);
  };

  const handleResizeStart = (e, direction) => {
    e.preventDefault();
    setIsResizing(true);
    resizeStartPos.current = {
      x: e.clientX,
      y: e.clientY,
      width: size.width,
      height: size.height,
      direction,
    };
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isResizing) return;

      const { x, y, width, height, direction } = resizeStartPos.current;
      const deltaX = x - e.clientX;
      const deltaY = y - e.clientY;

      let newWidth = width;
      let newHeight = height;

      if (direction.includes('left')) {
        newWidth = Math.max(400, Math.min(800, width + deltaX));
      }
      if (direction.includes('top')) {
        newHeight = Math.max(500, Math.min(900, height + deltaY));
      }

      setSize({ width: newWidth, height: newHeight });
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);

  const toggleMaximize = () => {
    setIsMaximized(!isMaximized);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 w-20 h-20 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 flex items-center justify-center group z-50 hover:scale-110"
      >
        <MessageCircle className="w-10 h-10 group-hover:scale-110 transition-transform" />
        <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full animate-ping"></span>
        <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full"></span>
      </button>
    );
  }

  return (
    <div
      ref={chatboxRef}
      style={
        isMaximized
          ? {
              width: 'calc(100vw - 64px)',
              height: 'calc(100vh - 64px)',
              top: '32px',
              right: '32px',
              bottom: 'auto',
            }
          : {
              width: `${size.width}px`,
              height: `${size.height}px`,
            }
      }
      className={`fixed ${
        isMaximized ? '' : 'bottom-8 right-8'
      } bg-white rounded-3xl shadow-2xl flex flex-col z-50 overflow-hidden border-2 border-indigo-200 transition-all duration-300`}
    >
      {/* Resize Handles */}
      {!isMaximized && (
        <>
          <div
            onMouseDown={(e) => handleResizeStart(e, 'left')}
            className="absolute left-0 top-0 bottom-0 w-2 cursor-ew-resize hover:bg-indigo-200 transition"
          />
          <div
            onMouseDown={(e) => handleResizeStart(e, 'top')}
            className="absolute top-0 left-0 right-0 h-2 cursor-ns-resize hover:bg-indigo-200 transition"
          />
          <div
            onMouseDown={(e) => handleResizeStart(e, 'topleft')}
            className="absolute top-0 left-0 w-4 h-4 cursor-nwse-resize hover:bg-indigo-300 transition"
          />
        </>
      )}

      {/* Header - Light gradient */}
      <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white p-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center">
            <Bot className="w-8 h-8" />
          </div>
          <div>
            <h3 className="font-bold text-2xl">CraftConnect Assistant</h3>
            <p className="text-base text-indigo-100 flex items-center gap-2">
              <span className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></span>
              Online • Ready to help
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={toggleMaximize}
            className="text-white hover:bg-white/20 rounded-lg p-3 transition"
            title={isMaximized ? 'Restore' : 'Maximize'}
          >
            {isMaximized ? (
              <Minimize2 className="w-6 h-6" />
            ) : (
              <Maximize2 className="w-6 h-6" />
            )}
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="text-white hover:bg-white/20 rounded-lg p-3 transition"
          >
            <X className="w-7 h-7" />
          </button>
        </div>
      </div>

      {/* Messages - Light background */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gradient-to-b from-blue-50 via-purple-50 to-pink-50">
        {messages.map((message, index) => (
          <div key={index}>
            <div className={`flex gap-4 ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                message.role === 'user'
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600'
                  : 'bg-gradient-to-r from-green-500 to-teal-500'
              }`}>
                {message.role === 'user' ? (
                  <User className="w-7 h-7 text-white" />
                ) : (
                  <Bot className="w-7 h-7 text-white" />
                )}
              </div>
              <div className={`flex-1 ${message.role === 'user' ? 'flex justify-end' : ''}`}>
                <div className={`px-6 py-5 rounded-2xl max-w-[85%] ${
                  message.role === 'user'
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-tr-none'
                    : 'bg-white border-2 border-gray-200 text-gray-800 rounded-tl-none shadow-lg'
                }`}>
                  <p className="text-lg whitespace-pre-wrap leading-relaxed">{message.content}</p>
                  <p className={`text-sm mt-2 ${
                    message.role === 'user' ? 'text-indigo-200' : 'text-gray-500'
                  }`}>
                    {new Date(message.timestamp).toLocaleTimeString('en-IN', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
            </div>

            {/* Show Products after assistant message */}
            {message.role === 'assistant' && index === messages.length - 1 && recommendedProducts.length > 0 && (
              <div className="mt-4 ml-16">
                <p className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <ShoppingCart className="w-4 h-4" />
                  Recommended Products:
                </p>
                <div className="space-y-3">
                  {recommendedProducts.map((product) => (
                    <div
                      key={product._id}
                      className="bg-white border-2 border-indigo-100 rounded-xl p-4 hover:border-indigo-300 transition shadow-md hover:shadow-lg"
                    >
                      <div className="flex gap-4">
                        {/* Product Image */}
                        <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                          {product.images && product.images.length > 0 ? (
                            <img
                              src={product.images[0].url}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <ShoppingCart className="w-8 h-8 text-gray-400" />
                            </div>
                          )}
                        </div>

                        {/* Product Details */}
                        <div className="flex-1">
                          <h4 className="font-bold text-gray-900 mb-1 line-clamp-1">{product.name}</h4>
                          <p className="text-sm text-gray-600 mb-2 line-clamp-2">{product.description}</p>
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="text-lg font-bold text-indigo-600">₹{product.price}</span>
                              <span className="text-xs text-gray-500 ml-2">
                                {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                              </span>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleBuyProduct(product._id)}
                                disabled={product.stock === 0}
                                className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm rounded-lg hover:from-indigo-700 hover:to-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-semibold shadow-md"
                              >
                                <ShoppingCart className="w-4 h-4" />
                                View & Buy
                              </button>
                            </div>
                          </div>
                          {product.category && (
                            <span className="inline-block mt-2 text-xs bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full font-medium">
                              {product.category}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-green-500 to-teal-500 flex items-center justify-center">
              <Bot className="w-7 h-7 text-white" />
            </div>
            <div className="bg-white border-2 border-gray-200 px-6 py-5 rounded-2xl rounded-tl-none shadow-lg">
              <div className="flex gap-3">
                <div className="w-4 h-4 bg-indigo-600 rounded-full animate-bounce"></div>
                <div className="w-4 h-4 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></div>
                <div className="w-4 h-4 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Questions - Light theme */}
      {messages.length <= 2 && (
        <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-purple-50 border-t-2 border-indigo-200">
          <p className="text-base text-gray-700 mb-4 flex items-center gap-2 font-semibold">
            <Sparkles className="w-5 h-5 text-indigo-600" />
            Quick questions:
          </p>
          <div className="flex flex-wrap gap-3">
            {quickQuestions.map((question, index) => (
              <button
                key={index}
                onClick={() => handleQuickQuestion(question)}
                className="text-base px-5 py-3 bg-white border-2 border-indigo-200 text-indigo-700 rounded-full hover:bg-indigo-50 hover:border-indigo-400 transition font-semibold shadow-sm hover:shadow-md"
              >
                {question}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input - Light theme */}
      <form onSubmit={handleSendMessage} className="p-6 border-t-2 border-indigo-200 bg-white rounded-b-3xl">
        <div className="flex gap-4">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Type your message..."
            disabled={isLoading}
            className="flex-1 px-6 py-4 text-lg border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed shadow-sm"
          />
          <button
            type="submit"
            disabled={!inputMessage.trim() || isLoading}
            className="px-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-lg hover:shadow-xl"
          >
            {isLoading ? (
              <Loader className="w-7 h-7 animate-spin" />
            ) : (
              <Send className="w-7 h-7" />
            )}
          </button>
        </div>
        <p className="text-sm text-gray-500 mt-4 text-center font-medium">
          Powered by AI • CraftConnect Assistant 🤖
        </p>
      </form>
    </div>
  );
};

export default Chatbot;

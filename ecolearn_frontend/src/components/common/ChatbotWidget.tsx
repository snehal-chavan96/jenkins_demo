import { useState, useRef, useEffect } from 'react';
import { chatbotAPI } from '../../services/chatbotAPI';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MessageCircle, 
  X, 
  Send, 
  Volume2, 
  VolumeX,
  Sparkles,
  Bot
} from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card } from '../ui/card';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export const ChatbotWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hi! 👋 I\'m EcoBuddy, your environmental learning assistant! How can I help you save the planet today?',
      sender: 'bot',
      timestamp: new Date(),
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const speechSynthesis = window.speechSynthesis;

  // Auto scroll to bottom when new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Floating animation position
  const [floatPosition, setFloatPosition] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setFloatPosition((prev) => (prev + 1) % 20);
    }, 100);
    return () => clearInterval(interval);
  }, []);

const handleSend = async () => {
  if (!inputValue.trim()) return;

  // Add user message
  const userMessage: Message = {
    id: Date.now().toString(),
    text: inputValue,
    sender: 'user',
    timestamp: new Date(),
  };
  setMessages(prev => [...prev, userMessage]);
  setInputValue('');
  setIsTyping(true);

  try {
    // Call backend API
    const botAnswer = await chatbotAPI.ask(inputValue);

    // Fallback if API returns empty
    const botText =
      botAnswer && botAnswer.trim().length > 0
        ? botAnswer
        : generateBotResponse(inputValue);

    const botMessage: Message = {
      id: (Date.now() + 1).toString(),
      text: botText,
      sender: 'bot',
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, botMessage]);
  } catch (err) {
    // On error, use fallback responses
    const botMessage: Message = {
      id: (Date.now() + 1).toString(),
      text: generateBotResponse(inputValue),
      sender: 'bot',
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, botMessage]);
    console.error("Chatbot API failed, using fallback:", err);
  } finally {
    setIsTyping(false);
  }
};


  const generateBotResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    
    if (input.includes('quiz') || input.includes('test')) {
      return '📝 You can find quizzes in the Quizzes section! They\'re a great way to test your environmental knowledge. Would you like me to guide you there?';
    }
    if (input.includes('game') || input.includes('play')) {
      return '🎮 Check out our Games section! We have fun challenges like Bubble Shooter, Water Conservation, and the new Eco Placement Challenge!';
    }
    if (input.includes('course') || input.includes('learn')) {
      return '📚 Our Courses section has amazing environmental topics! From Climate Change to Renewable Energy, there\'s so much to explore!';
    }
    if (input.includes('point') || input.includes('reward')) {
      return '🌿 You earn Eco-Points by completing courses, playing games, and taking quizzes! Check your Rewards section to see what you can unlock!';
    }
    if (input.includes('help') || input.includes('how')) {
      return '💡 I can help you with: \n• Finding courses and quizzes\n• Understanding eco-points\n• Playing games\n• Tracking your progress\n\nWhat would you like to know more about?';
    }
    if (input.includes('climate') || input.includes('environment')) {
      return '🌍 Climate change is one of our biggest challenges! I recommend starting with the Climate Change Fundamentals course. It covers the basics and is very engaging!';
    }
    if (input.includes('recycling') || input.includes('waste')) {
      return '♻️ Recycling is super important! Try our Waste Management course or play the "Pick Us Right" game to practice sorting waste correctly!';
    }
    if (input.includes('thank')) {
      return '😊 You\'re welcome! Keep up the great work saving our planet! Is there anything else I can help you with?';
    }
    if (input.includes('bye') || input.includes('goodbye')) {
      return '👋 Goodbye! Keep being an eco-hero! Feel free to chat with me anytime you need help!';
    }
    
    return '🤔 That\'s interesting! I\'m here to help you with your environmental learning journey. You can ask me about courses, quizzes, games, or eco-points. What would you like to know?';
  };

  const handleTextToSpeech = (text: string) => {
    if (isSpeaking) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 1;
    
    utterance.onend = () => {
      setIsSpeaking(false);
    };

    speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  return (
    <>
      {/* Floating Chatbot Button */}
      <motion.div
        className="fixed bottom-6 right-6 z-40"
        animate={{ 
          x: Math.sin(floatPosition / 3) * 10,
          y: Math.cos(floatPosition / 4) * 8,
        }}
        transition={{ 
          duration: 0.1,
          ease: "linear"
        }}
      >
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Button
            onClick={() => setIsOpen(true)}
            className="h-16 w-16 rounded-full bg-gradient-to-r from-green-500 via-emerald-600 to-teal-600 hover:from-green-600 hover:via-emerald-700 hover:to-teal-700 shadow-2xl relative overflow-hidden group"
          >
            {/* Ripple effect */}
            <motion.div
              className="absolute inset-0 bg-white/30 rounded-full"
              animate={{ 
                scale: [1, 1.5, 1],
                opacity: [0.5, 0, 0.5]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            
            <MessageCircle className="h-8 w-8 text-white relative z-10" />
            
            {/* Notification dot */}
            <motion.div
              className="absolute top-1 right-1 h-4 w-4 bg-red-500 rounded-full border-2 border-white"
              animate={{ 
                scale: [1, 1.2, 1],
              }}
              transition={{ 
                duration: 1,
                repeat: Infinity
              }}
            />
          </Button>
        </motion.div>

        {/* Tooltip */}
        <AnimatePresence>
          {!isOpen && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="absolute bottom-20 right-0 bg-gray-900 text-white px-4 py-2 rounded-lg text-sm whitespace-nowrap shadow-xl"
            >
              Chat with EcoBot! 🌱
              <div className="absolute bottom-[-6px] right-6 w-3 h-3 bg-gray-900 transform rotate-45" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop with blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-md z-50"
            />

            {/* Chat Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 50 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[95%] max-w-2xl h-[90vh] max-h-[700px]"
            >
              <Card className="h-full flex flex-col border-4 border-green-300 dark:border-green-700 rounded-3xl shadow-2xl overflow-hidden bg-[#e5ddd5] dark:bg-gray-900">
                {/* Header - WhatsApp Style */}
                <div className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {/* Bot Avatar */}
                    <motion.div
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="h-12 w-12 rounded-full bg-white flex items-center justify-center shadow-lg"
                    >
                      <Bot className="h-7 w-7 text-green-600" />
                    </motion.div>
                    <div>
                      <h3 className="text-white font-semibold text-lg flex items-center gap-2">
                        EcoBot
                        <Sparkles className="h-4 w-4 text-yellow-300" />
                      </h3>
                      <p className="text-green-100 text-xs flex items-center gap-1">
                        <span className="h-2 w-2 bg-green-300 rounded-full animate-pulse" />
                        Online
                      </p>
                    </div>
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsOpen(false)}
                    className="text-white hover:bg-white/20 rounded-full h-10 w-10 p-0"
                  >
                    <X className="h-6 w-6" />
                  </Button>
                </div>

                {/* Messages Area - WhatsApp Style */}
                <div 
                  className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#e5ddd5] dark:bg-gray-800"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23d4cfc5' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                  }}
                >
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[75%] ${message.sender === 'user' ? 'order-2' : 'order-1'}`}>
                        <div
                          className={`rounded-2xl px-4 py-2 shadow-md ${
                            message.sender === 'user'
                              ? 'bg-[#dcf8c6] dark:bg-green-700 text-gray-900 dark:text-white rounded-br-sm'
                              : 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-bl-sm'
                          }`}
                        >
                          <p className="text-sm whitespace-pre-line leading-relaxed">{message.text}</p>
                          <div className="flex items-center justify-end gap-2 mt-1">
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {formatTime(message.timestamp)}
                            </span>
                            {message.sender === 'bot' && (
                              <button
                                onClick={() => handleTextToSpeech(message.text)}
                                className="text-gray-500 hover:text-green-600 dark:hover:text-green-400 transition-colors"
                              >
                                {isSpeaking ? (
                                  <VolumeX className="h-3 w-3" />
                                ) : (
                                  <Volume2 className="h-3 w-3" />
                                )}
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}

                  {/* Typing Indicator */}
                  {isTyping && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex justify-start"
                    >
                      <div className="bg-white dark:bg-gray-700 rounded-2xl rounded-bl-sm px-5 py-3 shadow-md">
                        <div className="flex gap-1">
                          <motion.div
                            className="h-2 w-2 bg-gray-400 rounded-full"
                            animate={{ y: [0, -8, 0] }}
                            transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                          />
                          <motion.div
                            className="h-2 w-2 bg-gray-400 rounded-full"
                            animate={{ y: [0, -8, 0] }}
                            transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                          />
                          <motion.div
                            className="h-2 w-2 bg-gray-400 rounded-full"
                            animate={{ y: [0, -8, 0] }}
                            transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Input Area - WhatsApp Style */}
                <div className="p-4 bg-[#f0f0f0] dark:bg-gray-800 border-t border-gray-300 dark:border-gray-700">
                  <div className="flex items-center gap-2">
                    <Input
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                      placeholder="Type your message..."
                      className="flex-1 h-12 rounded-3xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-5 text-sm focus:border-green-500 dark:focus:border-green-500"
                    />
                    <Button
                      onClick={handleSend}
                      disabled={!inputValue.trim()}
                      className="h-12 w-12 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed p-0"
                    >
                      <Send className="h-5 w-5 text-white" />
                    </Button>
                  </div>
                  
                  {/* Quick Actions */}
                  <div className="flex flex-wrap gap-2 mt-3">
                    {['Help', 'Courses', 'Quizzes', 'Games'].map((action) => (
                      <button
                        key={action}
                        onClick={() => {
                          setInputValue(action);
                          setTimeout(handleSend, 100);
                        }}
                        className="px-3 py-1 text-xs rounded-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-green-900/20 hover:border-green-500 transition-colors"
                      >
                        {action}
                      </button>
                    ))}
                  </div>
                </div>
              </Card>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

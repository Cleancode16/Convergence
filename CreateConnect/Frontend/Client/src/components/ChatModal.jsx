import { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Edit2, Trash2, Check, XCircle, MessageCircle, Moon, Sun } from 'lucide-react';
import { io } from 'socket.io-client';
import { getMessages, sendMessage, editMessage, deleteMessage } from '../services/messageService';

const ChatModal = ({ connection, onClose }) => {
  const { userInfo } = useSelector((state) => state.auth);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [editingMessage, setEditingMessage] = useState(null);
  const [editContent, setEditContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const otherUser = userInfo.role === 'ngo' 
    ? { _id: connection.artisan._id || connection.artisan, name: connection.artisan.name || 'Artisan' }
    : { _id: connection.ngo._id || connection.ngo, name: connection.ngo.name || 'NGO' };

  useEffect(() => {
    socketRef.current = io('http://localhost:3000');
    
    socketRef.current.emit('register', userInfo._id);
    socketRef.current.emit('join-connection', connection._id);
    
    socketRef.current.on('receive-message', (message) => {
      setMessages(prev => [...prev, message]);
    });
    
    socketRef.current.on('message-edited', (editedMessage) => {
      setMessages(prev => prev.map(msg => 
        msg._id === editedMessage._id ? editedMessage : msg
      ));
    });
    
    socketRef.current.on('message-deleted', (messageId) => {
      setMessages(prev => prev.filter(msg => msg._id !== messageId));
    });
    
    socketRef.current.on('user-typing', () => {
      setIsTyping(true);
    });
    
    socketRef.current.on('user-stop-typing', () => {
      setIsTyping(false);
    });
    
    fetchMessages();
    
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [connection._id, userInfo._id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const data = await getMessages(connection._id, userInfo.token);
      setMessages(data.data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleTyping = () => {
    socketRef.current?.emit('typing', { connectionId: connection._id, userId: userInfo._id });
    
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    typingTimeoutRef.current = setTimeout(() => {
      socketRef.current?.emit('stop-typing', { connectionId: connection._id, userId: userInfo._id });
    }, 1000);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || sending) return;

    try {
      setSending(true);
      const data = await sendMessage(connection._id, newMessage.trim(), userInfo.token);
      socketRef.current?.emit('send-message', {
        connectionId: connection._id,
        message: data.data
      });
      setNewMessage('');
      socketRef.current?.emit('stop-typing', { connectionId: connection._id, userId: userInfo._id });
    } catch (error) {
      alert(error.message);
    } finally {
      setSending(false);
    }
  };

  const handleEditMessage = async (messageId) => {
    if (!editContent.trim()) return;

    try {
      const data = await editMessage(messageId, editContent.trim(), userInfo.token);
      socketRef.current?.emit('edit-message', {
        connectionId: connection._id,
        message: data.data
      });
      setEditingMessage(null);
      setEditContent('');
    } catch (error) {
      alert(error.message);
    }
  };

  const handleDeleteMessage = async (messageId) => {
    if (!confirm('Are you sure you want to delete this message?')) return;

    try {
      await deleteMessage(messageId, userInfo.token);
      socketRef.current?.emit('delete-message', {
        connectionId: connection._id,
        messageId
      });
    } catch (error) {
      alert(error.message);
    }
  };

  const startEdit = (message) => {
    setEditingMessage(message._id);
    setEditContent(message.content);
  };

  const cancelEdit = () => {
    setEditingMessage(null);
    setEditContent('');
  };

  const toggleTheme = () => {
    setIsDarkTheme(!isDarkTheme);
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }
  };

  const groupMessagesByDate = (messages) => {
    const groups = {};
    messages.forEach(message => {
      const date = formatDate(message.createdAt);
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(message);
    });
    return groups;
  };

  const messageGroups = groupMessagesByDate(messages);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 50 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        onClick={(e) => e.stopPropagation()}
        className={`rounded-2xl shadow-2xl w-full max-w-5xl h-[90vh] flex flex-col overflow-hidden border-2 ${
          isDarkTheme 
            ? 'bg-gray-900 border-purple-500/30' 
            : 'bg-white border-purple-200'
        }`}
      >
        {/* Header */}
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className={`flex items-center justify-between px-6 py-4 border-b ${
            isDarkTheme 
              ? 'bg-gradient-to-r from-gray-900 via-purple-900/20 to-gray-900 border-purple-500/30' 
              : 'bg-gradient-to-r from-purple-50 via-indigo-50 to-purple-50 border-purple-200'
          }`}
        >
          <div className="flex items-center gap-4">
            <motion.div 
              whileHover={{ scale: 1.15, rotate: 360 }}
              transition={{ duration: 0.6, type: "spring" }}
              className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl shadow-lg ${
                isDarkTheme 
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white' 
                  : 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white'
              }`}
            >
              {otherUser.name.charAt(0).toUpperCase()}
            </motion.div>
            <div>
              <h3 className={`font-bold text-xl ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>
                {otherUser.name}
              </h3>
              <p className={`text-sm font-medium ${isDarkTheme ? 'text-purple-300' : 'text-purple-600'}`}>
                {userInfo.role === 'ngo' ? 'Artisan' : 'NGO'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.15, rotate: 180 }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
              onClick={toggleTheme}
              className={`p-2 rounded-full transition shadow-lg ${
                isDarkTheme 
                  ? 'text-yellow-400 bg-purple-500/20 hover:bg-purple-500/30' 
                  : 'text-purple-600 bg-purple-100 hover:bg-purple-200'
              }`}
              title={isDarkTheme ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDarkTheme ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.15, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
              onClick={onClose}
              className={`p-2 rounded-full transition shadow-lg ${
                isDarkTheme 
                  ? 'text-white bg-red-500/20 hover:bg-red-500/30' 
                  : 'text-red-600 bg-red-100 hover:bg-red-200'
              }`}
            >
              <X className="w-6 h-6" />
            </motion.button>
          </div>
        </motion.div>

        {/* Messages */}
        <div className={`flex-1 overflow-y-auto p-6 ${
          isDarkTheme 
            ? 'bg-gradient-to-b from-gray-800 to-gray-900' 
            : 'bg-gradient-to-b from-purple-50/30 via-indigo-50/30 to-purple-50/30'
        }`}>
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className={`rounded-full h-16 w-16 border-4 ${
                  isDarkTheme 
                    ? 'border-purple-600 border-t-transparent' 
                    : 'border-purple-600 border-t-transparent'
                }`}
              />
            </div>
          ) : messages.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="flex flex-col items-center justify-center h-full"
            >
              <div className={`rounded-2xl p-10 text-center ${
                isDarkTheme 
                  ? 'bg-gradient-to-br from-gray-800 to-purple-900/20 border-2 border-purple-500/30' 
                  : 'bg-white border-2 border-purple-200 shadow-xl'
              }`}>
                <motion.div
                  animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <MessageCircle className={`w-24 h-24 mx-auto mb-6 ${
                    isDarkTheme ? 'text-purple-400' : 'text-purple-600'
                  }`} />
                </motion.div>
                <p className={`font-bold text-xl mb-2 ${
                  isDarkTheme ? 'text-white' : 'text-gray-900'
                }`}>
                  No messages yet
                </p>
                <p className={`text-sm ${
                  isDarkTheme ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Start the conversation!
                </p>
              </div>
            </motion.div>
          ) : (
            <AnimatePresence>
              <div className="space-y-4">
                {Object.entries(messageGroups).map(([date, msgs]) => (
                  <div key={date}>
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center justify-center my-6"
                    >
                      <motion.span 
                        whileHover={{ scale: 1.05 }}
                        className={`px-5 py-2 text-xs font-bold rounded-full shadow-lg ${
                          isDarkTheme 
                            ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white' 
                            : 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white'
                        }`}
                      >
                        {date}
                      </motion.span>
                    </motion.div>
                    {msgs.map((message, index) => {
                      const isSender = message.sender._id === userInfo._id;
                      const isEditing = editingMessage === message._id;
                      const showAvatar = index === 0 || msgs[index - 1].sender._id !== message.sender._id;

                      return (
                        <motion.div
                          key={message._id}
                          initial={{ opacity: 0, y: 20, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8, x: isSender ? 100 : -100 }}
                          transition={{ duration: 0.3, type: "spring", stiffness: 200 }}
                          className={`flex ${isSender ? 'justify-end' : 'justify-start'} mb-3 group`}
                        >
                          <div className={`flex gap-3 max-w-[75%] ${isSender ? 'flex-row-reverse' : 'flex-row'}`}>
                            <div className="w-10 flex items-end pb-1">
                              {!isSender && showAvatar && (
                                <motion.div 
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  whileHover={{ scale: 1.2, rotate: 360 }}
                                  transition={{ type: "spring", stiffness: 300 }}
                                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shadow-lg ${
                                    isDarkTheme 
                                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white' 
                                      : 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white'
                                  }`}
                                >
                                  {message.sender.name?.charAt(0).toUpperCase()}
                                </motion.div>
                              )}
                            </div>

                            <div className="flex-1">
                              {isEditing ? (
                                <motion.div 
                                  initial={{ opacity: 0, scale: 0.9 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  className={`rounded-2xl p-4 ${
                                    isDarkTheme 
                                      ? 'bg-gray-800 border-2 border-purple-500/50' 
                                      : 'bg-white border-2 border-purple-200 shadow-lg'
                                  }`}
                                >
                                  <textarea
                                    value={editContent}
                                    onChange={(e) => setEditContent(e.target.value)}
                                    className={`w-full px-3 py-2 border-2 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-purple-600 text-sm ${
                                      isDarkTheme 
                                        ? 'bg-gray-900 border-purple-500/30 text-white' 
                                        : 'bg-white border-purple-200 text-gray-900'
                                    }`}
                                    rows="3"
                                    autoFocus
                                  />
                                  <div className="flex gap-2 mt-3">
                                    <motion.button
                                      whileHover={{ scale: 1.05 }}
                                      whileTap={{ scale: 0.95 }}
                                      onClick={() => handleEditMessage(message._id)}
                                      className="flex items-center gap-1 px-4 py-2 rounded-xl text-sm font-bold transition bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700 shadow-lg"
                                    >
                                      <Check className="w-4 h-4" />
                                      Save
                                    </motion.button>
                                    <motion.button
                                      whileHover={{ scale: 1.05 }}
                                      whileTap={{ scale: 0.95 }}
                                      onClick={cancelEdit}
                                      className={`flex items-center gap-1 px-4 py-2 rounded-xl text-sm font-bold transition ${
                                        isDarkTheme 
                                          ? 'bg-gray-700 text-white hover:bg-gray-600' 
                                          : 'bg-gray-300 text-gray-900 hover:bg-gray-400'
                                      }`}
                                    >
                                      <XCircle className="w-4 h-4" />
                                      Cancel
                                    </motion.button>
                                  </div>
                                </motion.div>
                              ) : (
                                <div className="relative">
                                  <motion.div
                                    initial={{ scale: 0.95 }}
                                    animate={{ scale: 1 }}
                                    whileHover={{ scale: 1.02 }}
                                    transition={{ type: "spring", stiffness: 300 }}
                                    className={`rounded-2xl px-5 py-3 shadow-lg ${
                                      isSender
                                        ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white'
                                        : isDarkTheme
                                          ? 'bg-gray-800 text-white border-2 border-purple-500/30'
                                          : 'bg-white text-gray-900 border-2 border-purple-200'
                                    }`}
                                    style={{
                                      wordBreak: 'break-word',
                                      borderRadius: isSender ? '20px 20px 4px 20px' : '20px 20px 20px 4px'
                                    }}
                                  >
                                    <p className="text-sm leading-relaxed whitespace-pre-wrap font-medium">
                                      {message.content}
                                    </p>
                                    <div className="flex items-center justify-end gap-2 mt-2">
                                      {message.isEdited && (
                                        <span className={`text-[10px] italic ${
                                          isSender ? 'text-white/70' : isDarkTheme ? 'text-gray-400' : 'text-gray-500'
                                        }`}>
                                          edited
                                        </span>
                                      )}
                                      <span className={`text-[10px] ${
                                        isSender ? 'text-white/80' : isDarkTheme ? 'text-gray-400' : 'text-gray-600'
                                      }`}>
                                        {formatTime(message.createdAt)}
                                      </span>
                                      {isSender && (
                                        <span className="text-xs text-white/90">
                                          {message.readBy?.includes(otherUser._id) ? '✓✓' : '✓'}
                                        </span>
                                      )}
                                    </div>
                                  </motion.div>

                                  {isSender && (
                                    <div className={`absolute top-0 ${
                                      isSender ? 'left-0 -translate-x-full pl-2' : 'right-0 translate-x-full pr-2'
                                    } flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity`}>
                                      <motion.button
                                        whileHover={{ scale: 1.2 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => startEdit(message)}
                                        className="p-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-full hover:from-purple-700 hover:to-indigo-700 transition shadow-lg"
                                        title="Edit"
                                      >
                                        <Edit2 className="w-4 h-4" />
                                      </motion.button>
                                      <motion.button
                                        whileHover={{ scale: 1.2 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => handleDeleteMessage(message._id)}
                                        className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition shadow-lg"
                                        title="Delete"
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </motion.button>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </AnimatePresence>
          )}
          {isTyping && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-start gap-3 mt-3"
            >
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shadow-lg ${
                  isDarkTheme 
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white' 
                    : 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white'
                }`}
              >
                {otherUser.name?.charAt(0).toUpperCase()}
              </motion.div>
              <div className={`rounded-2xl px-5 py-3 shadow-lg ${
                isDarkTheme 
                  ? 'bg-gray-800 border-2 border-purple-500/30' 
                  : 'bg-white border-2 border-purple-200'
              }`} style={{ borderRadius: '20px 20px 20px 4px' }}>
                <div className="flex gap-2">
                  <motion.div 
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 0 }}
                    className={`w-2.5 h-2.5 rounded-full ${
                      isDarkTheme ? 'bg-purple-400' : 'bg-purple-600'
                    }`} 
                  />
                  <motion.div 
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 0, delay: 0.2 }}
                    className={`w-2.5 h-2.5 rounded-full ${
                      isDarkTheme ? 'bg-purple-400' : 'bg-purple-600'
                    }`} 
                  />
                  <motion.div 
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 0, delay: 0.4 }}
                    className={`w-2.5 h-2.5 rounded-full ${
                      isDarkTheme ? 'bg-purple-400' : 'bg-purple-600'
                    }`} 
                  />
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Input */}
        <motion.form 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          onSubmit={handleSendMessage} 
          className={`px-6 py-4 border-t ${
            isDarkTheme 
              ? 'bg-gradient-to-r from-gray-900 via-purple-900/20 to-gray-900 border-purple-500/30' 
              : 'bg-gradient-to-r from-purple-50 via-indigo-50 to-purple-50 border-purple-200'
          }`}
        >
          <div className="flex gap-3 items-center">
            <div className="flex-1 relative">
              <motion.input
                whileFocus={{ scale: 1.01 }}
                type="text"
                value={newMessage}
                onChange={(e) => {
                  setNewMessage(e.target.value);
                  handleTyping();
                }}
                placeholder="Type a message..."
                className={`w-full px-5 py-4 pr-16 border-2 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-600 text-sm font-medium transition-all ${
                  isDarkTheme
                    ? 'bg-gray-800 border-purple-500/30 text-white placeholder-gray-500'
                    : 'bg-white border-purple-200 text-gray-900 placeholder-gray-400'
                }`}
                maxLength="1000"
              />
              {newMessage.length > 900 && (
                <motion.span 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={`absolute right-5 top-1/2 -translate-y-1/2 text-xs font-bold ${
                    isDarkTheme ? 'text-gray-500' : 'text-gray-600'
                  }`}
                >
                  {newMessage.length}/1000
                </motion.span>
              )}
            </div>
            <motion.button
              whileHover={{ scale: 1.1, rotate: 360 }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 400 }}
              type="submit"
              disabled={!newMessage.trim() || sending}
              className="w-14 h-14 rounded-full transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700 shadow-xl disabled:shadow-none"
            >
              {sending ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="rounded-full h-5 w-5 border-2 border-white border-t-transparent"
                />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </motion.button>
          </div>
        </motion.form>
      </motion.div>
    </motion.div>
  );
};

export default ChatModal;
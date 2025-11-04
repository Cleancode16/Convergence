import { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { X, Send, Edit2, Trash2, Check, XCircle, MessageCircle } from 'lucide-react';
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
  messagesEndRef = useRef(null);
  socketRef = useRef(null);
  typingTimeoutRef = useRef(null);

  const otherUser = userInfo.role === 'ngo' 
    ? { _id: connection.artisan._id || connection.artisan, name: connection.artisan.name || 'Artisan' }
    : { _id: connection.ngo._id || connection.ngo, name: connection.ngo.name || 'NGO' };

  useEffect(() => {
    // Initialize Socket.IO
    socketRef.current = io('http://localhost:3000');
    
    socketRef.current.emit('register', userInfo._id);
    socketRef.current.emit('join-connection', connection._id);
    
    // Listen for incoming messages
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="rounded-2xl shadow-2xl w-full max-w-5xl h-[90vh] flex flex-col overflow-hidden bg-white border-2 border-gray-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b bg-gradient-to-r from-indigo-500 to-purple-500 border-gray-200">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl bg-white text-indigo-600">
              {otherUser.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="font-bold text-xl text-white">{otherUser.name}</h3>
              <p className="text-sm text-indigo-100">
                {userInfo.role === 'ngo' ? 'Artisan' : 'NGO'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="text-white hover:bg-white/20 p-2 rounded-full transition"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 bg-gradient-to-b from-gray-50 to-white">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full">
              <div className="rounded-2xl p-8 text-center bg-white shadow-lg border border-gray-200">
                <MessageCircle className="w-20 h-20 mx-auto mb-4 text-indigo-300" />
                <p className="font-semibold text-lg text-gray-900">No messages yet</p>
                <p className="text-sm mt-2 text-gray-600">Start the conversation!</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {Object.entries(messageGroups).map(([date, msgs]) => (
                <div key={date}>
                  <div className="flex items-center justify-center my-6">
                    <span className="px-4 py-2 text-xs font-semibold rounded-full bg-indigo-100 text-indigo-700">
                      {date}
                    </span>
                  </div>
                  {msgs.map((message, index) => {
                    const isSender = message.sender._id === userInfo._id;
                    const isEditing = editingMessage === message._id;
                    const showAvatar = index === 0 || msgs[index - 1].sender._id !== message.sender._id;

                    return (
                      <div
                        key={message._id}
                        className={`flex ${isSender ? 'justify-end' : 'justify-start'} mb-3 group`}
                      >
                        <div className={`flex gap-3 max-w-[75%] ${isSender ? 'flex-row-reverse' : 'flex-row'}`}>
                          {/* Avatar */}
                          <div className="w-10 flex items-end pb-1">
                            {!isSender && showAvatar && (
                              <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold bg-indigo-100 text-indigo-600">
                                {message.sender.name?.charAt(0).toUpperCase()}
                              </div>
                            )}
                          </div>

                          <div className="flex-1">
                            {isEditing ? (
                              <div className="rounded-2xl p-4 bg-white border-2 border-indigo-200 shadow-md">
                                <textarea
                                  value={editContent}
                                  onChange={(e) => setEditContent(e.target.value)}
                                  className="w-full px-3 py-2 border-2 rounded-xl resize-none focus:outline-none text-sm bg-white border-gray-300 text-gray-900 focus:border-indigo-500"
                                  rows="3"
                                  autoFocus
                                />
                                <div className="flex gap-2 mt-3">
                                  <button
                                    onClick={() => handleEditMessage(message._id)}
                                    className="flex items-center gap-1 px-4 py-2 rounded-xl text-sm font-medium transition bg-indigo-600 text-white hover:bg-indigo-700"
                                  >
                                    <Check className="w-4 h-4" />
                                    Save
                                  </button>
                                  <button
                                    onClick={cancelEdit}
                                    className="flex items-center gap-1 px-4 py-2 rounded-xl text-sm font-medium transition bg-gray-200 text-gray-700 hover:bg-gray-300"
                                  >
                                    <XCircle className="w-4 h-4" />
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div className="relative">
                                <div
                                  className={`rounded-2xl px-5 py-3 shadow-md ${
                                    isSender
                                      ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white'
                                      : 'bg-white text-gray-900 border border-gray-200'
                                  }`}
                                  style={{
                                    wordBreak: 'break-word',
                                    borderRadius: isSender ? '20px 20px 4px 20px' : '20px 20px 20px 4px'
                                  }}
                                >
                                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                                  <div className="flex items-center justify-end gap-2 mt-2">
                                    {message.isEdited && (
                                      <span className={`text-[10px] italic ${isSender ? 'text-indigo-200' : 'text-gray-500'}`}>
                                        edited
                                      </span>
                                    )}
                                    <span className={`text-[10px] ${isSender ? 'text-indigo-200' : 'text-gray-500'}`}>
                                      {formatTime(message.createdAt)}
                                    </span>
                                    {isSender && (
                                      <span className="text-xs text-indigo-200">
                                        {message.readBy?.includes(otherUser._id) ? '✓✓' : '✓'}
                                      </span>
                                    )}
                                  </div>
                                </div>

                                {/* Message actions */}
                                {isSender && (
                                  <div className={`absolute top-0 ${isSender ? 'left-0 -translate-x-full pl-2' : 'right-0 translate-x-full pr-2'} flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity`}>
                                    <button
                                      onClick={() => startEdit(message)}
                                      className="p-2 bg-indigo-100 text-indigo-600 rounded-full hover:bg-indigo-200 transition"
                                      title="Edit"
                                    >
                                      <Edit2 className="w-4 h-4" />
                                    </button>
                                    <button
                                      onClick={() => handleDeleteMessage(message._id)}
                                      className="p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition"
                                      title="Delete"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
          {isTyping && (
            <div className="flex items-start gap-3 mt-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold bg-indigo-100 text-indigo-600">
                {otherUser.name?.charAt(0).toUpperCase()}
              </div>
              <div className="rounded-2xl px-5 py-3 bg-white border border-gray-200 shadow-md" style={{ borderRadius: '20px 20px 20px 4px' }}>
                <div className="flex gap-2">
                  <div className="w-2.5 h-2.5 rounded-full animate-bounce bg-indigo-600" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2.5 h-2.5 rounded-full animate-bounce bg-indigo-600" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2.5 h-2.5 rounded-full animate-bounce bg-indigo-600" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <form onSubmit={handleSendMessage} className="px-6 py-4 border-t bg-white border-gray-200">
          <div className="flex gap-3 items-center">
            <div className="flex-1 relative">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => {
                  setNewMessage(e.target.value);
                  handleTyping();
                }}
                placeholder="Type a message..."
                className="w-full px-5 py-4 pr-16 border-2 rounded-full focus:outline-none text-sm bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500 focus:border-indigo-500"
                maxLength="1000"
              />
              {newMessage.length > 900 && (
                <span className="absolute right-5 top-1/2 -translate-y-1/2 text-xs font-semibold text-gray-500">
                  {newMessage.length}/1000
                </span>
              )}
            </div>
            <button
              type="submit"
              disabled={!newMessage.trim() || sending}
              className="w-14 h-14 rounded-full transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 shadow-lg"
            >
              {sending ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatModal;

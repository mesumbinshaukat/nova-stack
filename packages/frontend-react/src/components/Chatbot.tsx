import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AnimatedCard } from './AnimatedCard';

type Message = {
  question: string;
  answer: string;
};

export default function Chatbot() {
  const [chat, setChat] = useState<Message[]>([]);
  const [text, setText] = useState('');

  const sendMessage = async () => {
    if (!text.trim()) return;
    setChat((prev) => [...prev, { question: text, answer: '...' }]);
    const response = await fetch('http://localhost:5000/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });
    const { reply } = await response.json();
    setChat((prev) => {
      const updated = [...prev];
      updated[updated.length - 1].answer = reply;
      return updated;
    });
    setText('');
  };

  return (
    <AnimatedCard>
      <h2 className="card-title font-display text-primary-600">Chat with NovaBot</h2>
      <div className="h-[300px] overflow-y-auto space-y-4">
        <AnimatePresence>
          {chat.map((msg, i) => (
            <React.Fragment key={i}>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="chat chat-start"
              >
                <div className="chat-bubble chat-bubble-primary">{msg.question}</div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="chat chat-end"
              >
                <div className="chat-bubble chat-bubble-secondary">{msg.answer}</div>
              </motion.div>
            </React.Fragment>
          ))}
        </AnimatePresence>
      </div>
      <div className="card-actions justify-end mt-4">
        <div className="join w-full">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type your message..."
            className="input input-bordered join-item w-full focus:ring-2 focus:ring-primary/30 transition-all duration-200"
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          />
          <motion.button 
            onClick={sendMessage}
            className="btn btn-primary join-item"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            Send
          </motion.button>
        </div>
      </div>
    </AnimatedCard>
  );
} 
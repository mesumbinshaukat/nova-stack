import React, { useState } from 'react';

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
    <div style={{ border: '1px solid #ccc', padding: '1rem', borderRadius: '0.5rem' }}>
      <div style={{ maxHeight: '300px', overflowY: 'auto', marginBottom: '0.5rem' }}>
        {chat.map((msg, i) => (
          <div key={i} style={{ marginBottom: '0.75rem' }}>
            <p style={{ margin: 0 }}><strong>You:</strong> {msg.question}</p>
            <p style={{ margin: 0 }}><strong>Bot:</strong> {msg.answer}</p>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex' }}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type your message..."
          style={{ flexGrow: 1, padding: '0.5rem', borderRadius: '0.25rem', border: '1px solid #ccc' }}
        />
        <button onClick={sendMessage} style={{ marginLeft: '0.5rem', padding: '0.5rem 1rem' }}>
          Send
        </button>
      </div>
    </div>
  );
} 
import React from 'react';
import Chatbot from '../src/components/Chatbot';

export default function HomePage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold">Welcome to NovaStackJS React Frontend</h1>
      <p className="mt-2">If you see this, React + Tailwind integration works!</p>
      <div className="mt-8">
        <Chatbot />
      </div>
    </div>
  );
} 
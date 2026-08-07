import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Sparkles, Volume2, CheckCircle2 } from 'lucide-react';

interface VoiceControlBarProps {
  onNavigate: (tab: any) => void;
}

export const VoiceControlBar: React.FC<VoiceControlBarProps> = ({ onNavigate }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState<string>('');
  const [feedback, setFeedback] = useState<string | null>(null);

  const toggleListening = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert('Speech recognition is not supported in this browser. Please use Chrome or Edge.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const SpeechRecognitionAPI = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognitionAPI();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        setFeedback('Listening for voice command (e.g., "Go to dashboard", "Show customers")...');
      };

      recognition.onresult = (event: any) => {
        const current = event.resultIndex;
        const speechText = event.results[current][0].transcript.toLowerCase();
        setTranscript(speechText);

        if (event.results[current].isFinal) {
          handleVoiceCommand(speechText);
        }
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
        setFeedback(null);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (err) {
      console.error('Failed to start speech recognition', err);
      setIsListening(false);
    }
  };

  const handleVoiceCommand = (cmd: string) => {
    if (cmd.includes('dashboard') || cmd.includes('home')) {
      onNavigate('dashboard');
      setFeedback('Voice Command: Navigated to Dashboard 📊');
    } else if (cmd.includes('product') || cmd.includes('inventory')) {
      onNavigate('products');
      setFeedback('Voice Command: Navigated to Products & Inventory 📦');
    } else if (cmd.includes('order') || cmd.includes('shipment')) {
      onNavigate('orders');
      setFeedback('Voice Command: Navigated to Orders 🛍️');
    } else if (cmd.includes('customer insight') || cmd.includes('persona')) {
      onNavigate('customer_insight');
      setFeedback('Voice Command: Navigated to Customer Insight Chat ✨');
    } else if (cmd.includes('customer') || cmd.includes('client')) {
      onNavigate('customers');
      setFeedback('Voice Command: Navigated to Customers 👥');
    } else if (cmd.includes('setting') || cmd.includes('config')) {
      onNavigate('settings');
      setFeedback('Voice Command: Navigated to Settings ⚙️');
    } else {
      setFeedback(`Command "${cmd}" not recognized. Try "Go to Dashboard" or "Show Customers".`);
    }

    setTimeout(() => {
      setFeedback(null);
    }, 4000);
  };

  return (
    <div className="flex items-center gap-2">
      {feedback && (
        <span className="hidden md:inline-flex px-3 py-1 bg-purple-50 text-purple-800 text-[11px] font-bold rounded-lg border border-purple-200 animate-pulse items-center gap-1.5">
          <Sparkles className="w-3 h-3 text-purple-600" />
          <span>{feedback}</span>
        </span>
      )}

      <button
        type="button"
        onClick={toggleListening}
        className={`p-2.5 rounded-xl transition cursor-pointer flex items-center justify-center shadow-2xs ${
          isListening 
            ? 'bg-rose-600 text-white animate-pulse ring-4 ring-rose-500/30' 
            : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
        }`}
        title={isListening ? 'Listening... Click to stop' : 'Click to use Voice Command'}
      >
        {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
      </button>
    </div>
  );
};

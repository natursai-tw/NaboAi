import { useState, useRef, useEffect } from 'react';
import mascotImg from 'figma:asset/559cfa23c202ae2bafadecf045b5807d0bdfb1e6.png';
import robotImg from 'figma:asset/4ad71c793313beb6be7d12942b6b5e3c0720a62b.png';
import exampleImg from 'figma:asset/b7008577ff8399464e36a154dc2603ec45a4101d.png';
import micIcon from '../../imports/mic.svg';
import audioIcon from '../../imports/audio.svg';
import { ScratchTeachingView } from './ScratchTeachingView';

interface Message {
  id: number;
  type: 'bot' | 'user' | 'typing';
  text?: string;
  suggestions?: string[];
  time?: string;
  image?: string;
}

interface ChatAreaProps {
  onSendMessage: (message: string) => void;
  scratchMode?: boolean;
  onExitScratch?: () => void;
}

// ── Native-drag wrapper (replaces react-dnd useDrag) ─────────────────────────
interface DraggableMessageProps {
  message: Message;
  children: React.ReactNode;
  isImageOnly?: boolean;
}

function DraggableMessage({ message, children, isImageOnly = false }: DraggableMessageProps) {
  if (message.type === 'typing' || (!message.text && !message.image)) {
    return <>{children}</>;
  }

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    const payload = {
      content: isImageOnly ? '' : (message.text || ''),
      messageType: isImageOnly ? 'image' : 'text',
      imageUrl: isImageOnly ? message.image : undefined,
    };
    e.dataTransfer.setData('application/nabo-message', JSON.stringify(payload));
    e.dataTransfer.effectAllowed = 'copy';
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      style={{ cursor: 'grab' }}
      title="拖曳到右側影格"
    >
      {children}
    </div>
  );
}
// ─────────────────────────────────────────────────────────────────────────────

export function ChatArea({ onSendMessage, scratchMode = false, onExitScratch }: ChatAreaProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1001,
      type: 'bot',
      text: 'Bojii 有什麼需要協助呢？😊',
      suggestions: ['🎨 我想畫畫', '📚 幫我複習', '🎮 玩遊戲'],
      time: '10:30',
    },
    {
      id: 1002,
      type: 'user',
      text: '我想要畫畫 🎨',
      time: '10:31',
    },
    {
      id: 1003,
      type: 'bot',
      text: '好啊！你能分享你想畫什麼嗎？<br />我可以幫你出題目、或是一起討論構圖喔！✏️🌈',
      suggestions: ['🌸 花卉', '🚀 太空', '🐾 動物', '🏡 風景'],
      time: '10:31',
    },
    {
      id: 1004,
      type: 'user',
      text: '花、花朵的畫法',
      time: '10:32',
    },
  ]);

  const [input, setInput] = useState('');
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [isAudioActive, setIsAudioActive] = useState(true);
  const chatWindowRef = useRef<HTMLDivElement>(null);
  const hasInitialResponseRef = useRef(false);

  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (hasInitialResponseRef.current) return;
    
    // Simulate bot response after initial typing
    const timer = setTimeout(() => {
      hasInitialResponseRef.current = true;
      setMessages((prev) => [
        ...prev.filter((m) => m.type !== 'typing'),
        {
          id: Date.now() + Math.random(),
          type: 'bot',
          text: '太棒了！花朵的畫法有很多種，<br />我們先從簡單的<strong>向日葵</strong>開始吧 🌻<br /><br /><strong>步驟：</strong><br />1️⃣ 先畫一個圓形當花心<br />2️⃣ 圍著圓心畫橢圓形的花瓣<br />3️⃣ 加上莖和葉子<br /><br />準備好了嗎？我們一起畫！✏️',
          suggestions: ['✅ 好，開始！', '🌹 換別種花', '🖼️ 看範例圖'],
          time: '10:33',
        },
      ]);
    }, 2200);

    return () => clearTimeout(timer);
  }, []);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now(),
      type: 'user',
      text: input,
      time: getCurrentTime(),
    };

    setMessages((prev) => [...prev, userMessage]);
    onSendMessage(input);
    setInput('');

    // Add typing indicator
    setTimeout(() => {
      setMessages((prev) => [...prev, { id: Date.now() + 1, type: 'typing' }]);
    }, 600);

    // Add bot response
    setTimeout(() => {
      const botResponses = [
        '好的！我們繼續學習吧 🌟 有什麼具體想知道的嗎？',
        '太棒了！你學得很快 🎉 讓我們挑戰下一步！',
        '這個問題很好！讓我想想...💭<br />我覺得可以從基礎開始練習喔！',
        '嗯嗯！我懂你的意思 😊 我們一起來完成這個任務！',
        '哇，你今天好厲害！ ⭐ 繼續保持這個精神！',
      ];
      const response = botResponses[Math.floor(Math.random() * botResponses.length)];

      setMessages((prev) => [
        ...prev.filter((m) => m.type !== 'typing'),
        {
          id: Date.now() + 2,
          type: 'bot',
          text: response,
          suggestions: ['👍 好的', '❓ 再問一題'],
          time: getCurrentTime(),
        },
      ]);
    }, 2000);
  };

  const handleSuggestionClick = (suggestion: string) => {
    // Check if this is the example image button
    if (suggestion.includes('看範例圖') || suggestion.includes('🖼️')) {
      const userMessage: Message = {
        id: Date.now(),
        type: 'user',
        text: '看範例圖',
        time: getCurrentTime(),
      };

      setMessages((prev) => [...prev, userMessage]);
      onSendMessage('看範例圖');

      setTimeout(() => {
        setMessages((prev) => [...prev, { id: Date.now(), type: 'typing' }]);
      }, 600);

      setTimeout(() => {
        setMessages((prev) => [
          ...prev.filter((m) => m.type !== 'typing'),
          {
            id: Date.now(),
            type: 'bot',
            text: '這是向日葵的範例圖！可以參考花心、花瓣和莖葉的畫法喔 🌻✨',
            image: exampleImg,
            suggestions: ['✅ 好，開始畫！', '🌹 換別種花', '❓ 再問一題'],
            time: getCurrentTime(),
          },
        ]);
      }, 1800);
      return;
    }

    const cleanText = suggestion.replace(/^[🎨📚🎮🌸🚀🐾🏡✅🌹🖼️👍❓]\s*/, '');
    const userMessage: Message = {
      id: Date.now(),
      type: 'user',
      text: cleanText,
      time: getCurrentTime(),
    };

    setMessages((prev) => [...prev, userMessage]);
    onSendMessage(cleanText);

    setTimeout(() => {
      setMessages((prev) => [...prev, { id: Date.now(), type: 'typing' }]);
    }, 600);

    setTimeout(() => {
      const botResponses = [
        '好的！我們繼續學習吧 🌟 有什麼具體想知道的嗎？',
        '太棒了！你學得很快 🎉 讓我們挑戰下一步！',
        '這個問題很好！讓我想想...💭<br />我覺得可以從基礎開始練習喔！',
        '嗯嗯！我懂你的意思 😊 我們一起來完成這個任務！',
        '哇，你今天好厲害！ ⭐ 繼續保持這個精神！',
      ];
      const response = botResponses[Math.floor(Math.random() * botResponses.length)];

      setMessages((prev) => [
        ...prev.filter((m) => m.type !== 'typing'),
        {
          id: Date.now(),
          type: 'bot',
          text: response,
          suggestions: ['👍 好的', '❓ 再問一題'],
          time: getCurrentTime(),
        },
      ]);
    }, 2000);
  };

  const handleVoiceToggle = () => {
    setIsVoiceActive(!isVoiceActive);
    if (!isVoiceActive) {
      setTimeout(() => {
        if (isVoiceActive) {
          setInput('我想學更多關於花的畫法');
          setIsVoiceActive(false);
        }
      }, 2500);
    }
  };

  const getCurrentTime = () => {
    const now = new Date();
    return `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`;
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <section className="flex flex-col px-6 pt-6 pb-0 relative overflow-hidden">
      <style>{`
        .chat-window::-webkit-scrollbar {
          width: 4px;
        }
        .chat-window::-webkit-scrollbar-thumb {
          background: #A8E0D0;
          border-radius: 99px;
        }
        @keyframes msgSlide {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .msg-animate {
          animation: msgSlide 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) both;
        }
        @keyframes typingBounce {
          0%, 60%, 100% {
            transform: translateY(0);
          }
          30% {
            transform: translateY(-7px);
          }
        }
        .typing-dot {
          animation: typingBounce 1.2s ease-in-out infinite;
        }
        .typing-dot:nth-child(2) {
          animation-delay: 0.2s;
        }
        .typing-dot:nth-child(3) {
          animation-delay: 0.4s;
        }
        @keyframes pulseMic {
          0%, 100% {
            box-shadow: 0 0 0 0 rgba(255, 127, 114, 0.4);
          }
          50% {
            box-shadow: 0 0 0 10px rgba(255, 127, 114, 0);
          }
        }
        .pulse-mic {
          animation: pulseMic 1.5s ease-in-out infinite;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes scaleIn {
          from {
            transform: scale(0.9) translateY(20px);
            opacity: 0;
          }
          to {
            transform: scale(1) translateY(0);
            opacity: 1;
          }
        }
        .modal-overlay {
          animation: fadeIn 0.2s ease-out;
        }
        .modal-content {
          animation: scaleIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
      `}</style>

      <div
        ref={chatWindowRef}
        className="chat-window flex-1 bg-white/65 backdrop-blur-xl rounded-[28px] border-[1.5px] border-white/85 shadow-[0_8px_40px_rgba(60,120,140,0.12)] p-6 overflow-y-auto flex flex-col gap-5 mb-[100px]"
      >
        {scratchMode ? (
          <ScratchTeachingView onExit={onExitScratch || (() => {})} />
        ) : (
          <>
            {messages.map((message, index) => (
              <div key={message.id} className={`msg-animate ${message.type === 'user' ? 'flex gap-2.5 items-end flex-row-reverse' : 'flex gap-2.5 items-end'}`} style={{ animationDelay: `${index * 0.2}s` }}>
                {message.type === 'typing' ? (
                  <>
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center text-[20px] flex-shrink-0 bg-gradient-to-br from-[#48A88B] to-[#3A648C] shadow-[0_3px_10px_rgba(58,100,140,0.35)]">
                      🤖
                    </div>
                    <div className="flex items-center gap-[5px] px-[18px] py-[14px] bg-white/92 border-[1.5px] border-[#48A88B]/20 rounded-[20px_20px_20px_6px] w-fit shadow-[0_4px_16px_rgba(60,120,140,0.08)]">
                      <div className="typing-dot w-2 h-2 rounded-full bg-[#48A88B]"></div>
                      <div className="typing-dot w-2 h-2 rounded-full bg-[#3A648C]"></div>
                      <div className="typing-dot w-2 h-2 rounded-full bg-[#F3CC58]"></div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden ${
                      message.type === 'bot'
                        ? 'bg-gradient-to-br from-[#48A88B] to-[#3A648C] shadow-[0_3px_10px_rgba(58,100,140,0.35)]'
                        : 'bg-gradient-to-br from-[#3A648C] to-[#2A4A6C] shadow-[0_3px_10px_rgba(58,100,140,0.3)]'
                    }`}>
                      {message.type === 'bot' ? (
                        <img 
                          src={robotImg} 
                          alt="Na-Bo" 
                          className="w-full h-full object-cover"
                          style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }}
                        />
                      ) : (
                        <span className="text-[20px]">👦</span>
                      )}
                    </div>
                    <div>
                      <DraggableMessage message={message}>
                        <div className={`max-w-full px-[14px] py-[10px] rounded-[20px] text-[14px] font-semibold leading-[1.65] relative ${
                          message.type === 'bot'
                            ? 'bg-white/92 border-[1.5px] border-[#48A88B]/20 rounded-bl-md shadow-[0_4px_16px_rgba(60,120,140,0.08)] text-[#2B3A52]'
                            : 'bg-gradient-to-br from-[#3A648C] to-[#2A4A6C] text-white rounded-br-md shadow-[0_4px_16px_rgba(58,100,140,0.25)]'
                        }`} dangerouslySetInnerHTML={{ __html: message.text || '' }}></div>
                      </DraggableMessage>
                      {message.image && (
                        <DraggableMessage message={message} isImageOnly={true}>
                          <div className="mt-3 max-w-[500px] rounded-[20px] overflow-hidden border-[2px] border-[#48A88B]/30 shadow-[0_8px_24px_rgba(60,120,140,0.12)]">
                            <img
                              src={message.image}
                              alt="範例圖"
                              className="w-full h-auto object-contain"
                            />
                          </div>
                        </DraggableMessage>
                      )}
                      {message.suggestions && (
                        <div className="flex gap-2 flex-wrap pt-3">
                          {message.suggestions.map((suggestion, i) => (
                            <div
                              key={i}
                              onClick={() => handleSuggestionClick(suggestion)}
                              className="px-3.5 py-2 bg-white/85 border-[1.5px] border-[#48A88B]/30 rounded-[20px] text-[12px] font-bold cursor-pointer transition-all text-[#2B3A52] shadow-[0_2px_8px_rgba(60,120,140,0.08)] hover:bg-[#A8E0D0] hover:border-[#48A88B] hover:translate-y-[-2px]"
                            >
                              {suggestion}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="text-[10px] font-bold text-[#7A8BA0] mx-1 mb-1 text-center self-end">
                      {message.time}
                    </div>
                  </>
                )}
              </div>
            ))}
          </>
        )}
      </div>

      {/* Input Bar */}
      <div className="absolute bottom-0 left-6 right-6 h-[88px] flex items-center gap-2.5 bg-white/85 backdrop-blur-md rounded-t-[28px] border-[1.5px] border-white/90 border-b-0 pr-4 shadow-[0_-4px_24px_rgba(60,120,140,0.10)]">
        <div className="relative w-[108px] h-[120px] flex-shrink-0 -mt-10 ml-2 group flex items-end">
          <img src={mascotImg} alt="Na-Bo" className="w-[108px] h-[120px] object-contain pointer-events-none" />
          <button
            onClick={() => setIsAudioActive(!isAudioActive)}
            className={`absolute top-0 -right-2 w-12 h-12 rounded-full border-[2px] border-[#48A88B]/10 bg-white shadow-[0_4px_16px_rgba(60,120,140,0.15)] flex items-center justify-center cursor-pointer transition-all hover:scale-110 active:scale-95 z-10 ${
              !isAudioActive ? 'opacity-50 grayscale' : ''
            }`}
          >
            <img src={audioIcon} alt="Audio" className="w-7 h-7" />
          </button>
        </div>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="輸入新訊息..."
          className="flex-1 bg-transparent border-none outline-none text-[14px] font-semibold text-[#2B3A52] placeholder:text-[#7A8BA0]"
          style={{ fontFamily: 'Noto Sans TC, sans-serif' }}
        />
                <button
          onClick={handleVoiceToggle}
          className={`w-11 h-11 rounded-[14px] border-none cursor-pointer flex items-center justify-center flex-shrink-0 transition-all ${
            isVoiceActive
              ? 'bg-[#FF7F72] pulse-mic'
              : 'bg-[#48A88B]/15 text-[#48A88B] hover:bg-[#A8E0D0]'
          }`}
        >
          {isVoiceActive ? '🔴' : <img src={micIcon} alt="Mic" className="w-8 h-8" />}
        </button>
        <button
          onClick={handleSend}
          className="w-11 h-11 rounded-[14px] border-none cursor-pointer flex items-center justify-center text-[20px] flex-shrink-0 bg-gradient-to-br from-[#3A648C] to-[#2A4A6C] text-white shadow-[0_4px_14px_rgba(58,100,140,0.3)] transition-all hover:translate-y-[-2px] hover:shadow-[0_6px_20px_rgba(58,100,140,0.4)]"
        >
          ➤
        </button>
      </div>
    </section>
  );
}
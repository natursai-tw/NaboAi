import { useState, useRef, useEffect } from 'react';
import { addToCanvas, subscribeCanvasActive, startTouchDrag, commitTouchDrop, cancelTouchDrag, type CanvasAddPayload } from './creativeEditorBridge';
import mascotImg from 'figma:asset/559cfa23c202ae2bafadecf045b5807d0bdfb1e6.png';
import robotImg from 'figma:asset/4ad71c793313beb6be7d12942b6b5e3c0720a62b.png';
import exampleImg from 'figma:asset/b7008577ff8399464e36a154dc2603ec45a4101d.png';
import micIcon from '../../imports/mic.svg';
import audioIcon from '../../imports/audio.svg';
import { ScratchTeachingView } from './ScratchTeachingView';
import { pinyin } from 'pinyin-pro';
import { fromPinyin } from 'zhuyin';

// ─── Preset images for the image picker ─────────────────────────────────────
const PRESET_IMAGES = [
  { id: 'p1', url: 'https://images.unsplash.com/photo-1711656706234-a302c0aa3b95?w=400&q=80', label: '水彩花卉' },
  { id: 'p2', url: 'https://images.unsplash.com/photo-1758685845902-acd5db1b532b?w=400&q=80', label: '幾何圖形' },
  { id: 'p3', url: 'https://images.unsplash.com/photo-1773593783546-054e17f437f4?w=400&q=80', label: '自然景色' },
  { id: 'p4', url: 'https://images.unsplash.com/photo-1633012252204-fa9f5873abf7?w=400&q=80', label: '動物插畫' },
  { id: 'p5', url: exampleImg, label: '向日葵範例' },
];
// ─────────────────────────────────────────────────────────────────────────────

// ── Convert text to zhuyin-annotated HTML ────────────────────────────────────
function textToZhuyin(htmlText: string): string {
  if (!htmlText) return '';
  
  // Process text while preserving HTML tags
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = htmlText;
  
  function processNode(node: Node): void {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent || '';
      if (!text.trim()) return;
      
      // Build ruby HTML
      let rubyHtml = '';
      for (let i = 0; i < text.length; i++) {
        const char = text[i];
        
        // Skip non-Chinese characters
        if (!/[\u4e00-\u9fa5]/.test(char)) {
          rubyHtml += char;
        } else {
          try {
            // Get pinyin for this character first (with number tones)
            const pinyinResult = pinyin(char, { toneType: 'num' });
            console.log(`Character: ${char}, Pinyin: ${pinyinResult}`);
            
            // Convert pinyin to zhuyin
            const zhuyinArray = fromPinyin(pinyinResult, false);
            const zhuyinResult = Array.isArray(zhuyinArray) ? zhuyinArray.join('') : zhuyinArray;
            console.log(`Zhuyin result:`, zhuyinResult);
            
            rubyHtml += `<ruby>${char}<rt>${zhuyinResult}</rt></ruby>`;
          } catch (error) {
            console.error(`Error converting ${char}:`, error);
            rubyHtml += char;
          }
        }
      }
      
      const span = document.createElement('span');
      span.innerHTML = rubyHtml;
      node.parentNode?.replaceChild(span, node);
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      // Recursively process child nodes
      const childNodes = Array.from(node.childNodes);
      childNodes.forEach(child => processNode(child));
    }
  }
  
  processNode(tempDiv);
  return tempDiv.innerHTML;
}
// ─────────────────────────────────────────────────────────────────────────────

// ── Native-drag wrapper (replaces react-dnd useDrag) ─────────────────────────
interface DraggableMessageProps {
  message: Message;
  children: React.ReactNode;
  isImageOnly?: boolean;
  canvasActive?: boolean;
}

function DraggableMessage({ message, children, isImageOnly = false, canvasActive = false }: DraggableMessageProps) {
  if (message.type === 'typing' || (!message.text && !message.image)) {
    return <>{children}</>;
  }

  const ghostRef = useRef<HTMLDivElement | null>(null);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const isDraggingRef = useRef(false);

  // Clean HTML tags from text
  const stripHtml = (html: string): string => {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  const getPayload = (): CanvasAddPayload => ({
    type: isImageOnly ? 'image-block' : (message.type === 'bot' ? 'chat-bot' : 'chat-user'),
    content: isImageOnly ? '' : stripHtml(message.text || ''),
    imageUrl: isImageOnly ? message.image : undefined,
  });

  // ── HTML5 drag (desktop mouse) — always enabled ──
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    const payload = {
      content: isImageOnly ? '' : stripHtml(message.text || ''),
      messageType: isImageOnly ? 'image' : 'text',
      imageUrl: isImageOnly ? message.image : undefined,
    };
    e.dataTransfer.setData('application/nabo-message', JSON.stringify(payload));
    e.dataTransfer.effectAllowed = 'copy';
  };

  // ── Touch drag (tablet / mobile) — always enabled ──
  const createGhost = (x: number, y: number) => {
    const ghost = document.createElement('div');
    const label = isImageOnly ? '🖼️ 圖片' : (message.text?.replace(/<[^>]*>/g, '').slice(0, 28) || '訊息');
    ghost.textContent = label;
    ghost.style.cssText = [
      'position:fixed',
      `left:${x - 80}px`,
      `top:${y - 28}px`,
      'width:160px',
      'max-width:160px',
      'background:rgba(58,100,140,0.92)',
      'color:white',
      'border-radius:12px',
      'padding:8px 12px',
      'font-size:11px',
      'font-weight:700',
      'pointer-events:none',
      'z-index:99999',
      'box-shadow:0 8px 24px rgba(58,100,140,0.4)',
      'opacity:0.92',
      'white-space:nowrap',
      'overflow:hidden',
      'text-overflow:ellipsis',
      'user-select:none',
      'transition:none',
    ].join(';');
    document.body.appendChild(ghost);
    ghostRef.current = ghost;
  };

  const removeGhost = () => {
    if (ghostRef.current) {
      ghostRef.current.remove();
      ghostRef.current = null;
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0];
    touchStartRef.current = { x: t.clientX, y: t.clientY };
    isDraggingRef.current = false;

    const onMove = (ev: TouchEvent) => {
      if (!touchStartRef.current) return;
      const touch = ev.touches[0];
      const dx = touch.clientX - touchStartRef.current.x;
      const dy = touch.clientY - touchStartRef.current.y;

      if (!isDraggingRef.current && Math.sqrt(dx * dx + dy * dy) > 10) {
        isDraggingRef.current = true;
        startTouchDrag(getPayload());
        createGhost(touch.clientX, touch.clientY);
      }
      if (isDraggingRef.current && ghostRef.current) {
        ghostRef.current.style.left = `${touch.clientX - 80}px`;
        ghostRef.current.style.top = `${touch.clientY - 28}px`;
        ev.preventDefault();
      }
    };

    const onEnd = (ev: TouchEvent) => {
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('touchend', onEnd);
      if (isDraggingRef.current) {
        const touch = ev.changedTouches[0];
        commitTouchDrop(touch.clientX, touch.clientY);
      } else {
        cancelTouchDrag();
      }
      removeGhost();
      isDraggingRef.current = false;
      touchStartRef.current = null;
    };

    window.addEventListener('touchmove', onMove, { passive: false });
    window.addEventListener('touchend', onEnd);
  };

  return (
    <div
      draggable={true}
      onDragStart={handleDragStart}
      onTouchStart={handleTouchStart}
      style={{ cursor: 'grab', position: 'relative' }}
      title="拖曳至右側面板"
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
  const [zhuyinEnabledMessages, setZhuyinEnabledMessages] = useState<Set<number>>(new Set());
  const [canvasActive, setCanvasActive] = useState(false);
  const [showImagePicker, setShowImagePicker] = useState(false);
  const chatWindowRef = useRef<HTMLDivElement>(null);
  const hasInitialResponseRef = useRef(false);

  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [messages]);

  // Subscribe to canvas bridge
  useEffect(() => {
    return subscribeCanvasActive(setCanvasActive);
  }, []);

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

  const handleSendImage = (img: { id: string; url: string; label: string }) => {
    setShowImagePicker(false);
    const userMsg: Message = {
      id: Date.now(),
      type: 'user',
      text: `分享了一張圖片：${img.label}`,
      image: img.url,
      time: getCurrentTime(),
    };
    setMessages(prev => [...prev, userMsg]);
    onSendMessage(`圖片：${img.label}`);

    setTimeout(() => {
      setMessages(prev => [...prev, { id: Date.now() + 1, type: 'typing' }]);
    }, 500);
    setTimeout(() => {
      setMessages(prev => [
        ...prev.filter(m => m.type !== 'typing'),
        {
          id: Date.now() + 2,
          type: 'bot',
          text: `哇！這張「${img.label}」真漂亮 🎨 你可以把它拖曳到右側的創作白板使用喔！`,
          suggestions: ['✅ 好！', '🖼️ 再選一張', '❓ 再問一題'],
          time: getCurrentTime(),
        },
      ]);
    }, 1800);
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
        ruby {
          ruby-position: over;
        }
        rt {
          font-size: 0.5em;
          color: #48A88B;
          font-weight: 600;
          line-height: 1;
        }
        .chat-bubble-text {
          letter-spacing: 0.08em;
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
            {/* Canvas active banner */}
            {canvasActive && (
              <div style={{
                background: 'linear-gradient(135deg, rgba(168,85,247,0.10), rgba(124,58,237,0.06))',
                border: '1.5px solid rgba(168,85,247,0.25)',
                borderRadius: 14,
                padding: '7px 12px',
                fontSize: 10,
                color: '#7C3AED',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                flexShrink: 0,
              }}>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><rect x="1" y="1" width="10" height="10" rx="2" stroke="#A855F7" strokeWidth="1.4"/><path d="M4 6h4M6 4v4" stroke="#A855F7" strokeWidth="1.3" strokeLinecap="round"/></svg>
                白板已開啟 — 拖曳任意訊息或圖片到右側白板
              </div>
            )}
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
                      <DraggableMessage message={message} canvasActive={canvasActive}>
                        <div className={`max-w-full px-[14px] py-[10px] rounded-[20px] text-[14px] font-semibold leading-[1.65] relative group ${ 
                          message.type === 'bot'
                            ? 'bg-white/92 border-[1.5px] border-[#48A88B]/20 rounded-bl-md shadow-[0_4px_16px_rgba(60,120,140,0.08)] text-[#2B3A52]'
                            : 'bg-gradient-to-br from-[#3A648C] to-[#2A4A6C] text-white rounded-br-md shadow-[0_4px_16px_rgba(58,100,140,0.25)]'
                        }`}>
                          {/* Zhuyin Toggle Button */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setZhuyinEnabledMessages(prev => {
                                const newSet = new Set(prev);
                                if (newSet.has(message.id)) {
                                  newSet.delete(message.id);
                                } else {
                                  newSet.add(message.id);
                                }
                                return newSet;
                              });
                            }}
                            className={`absolute -top-2 -right-2 w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold transition-all shadow-[0_2px_8px_rgba(60,120,140,0.2)] ${
                              zhuyinEnabledMessages.has(message.id) 
                                ? 'bg-[#48A88B] text-white hover:bg-[#3A8B73]' 
                                : 'bg-white border-[1.5px] border-[#48A88B]/30 text-[#48A88B] hover:bg-[#F0F0F0]'
                            }`}
                            title={zhuyinEnabledMessages.has(message.id) ? '關閉注音' : '開啟注音'}
                          >
                            ㄅ
                          </button>

                          <div className="chat-bubble-text" dangerouslySetInnerHTML={{ __html: zhuyinEnabledMessages.has(message.id) ? textToZhuyin(message.text || '') : message.text || '' }}></div>
                        </div>
                      </DraggableMessage>
                      {message.image && (
                        <DraggableMessage message={message} isImageOnly={true} canvasActive={canvasActive}>
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

      {/* Image Picker Popup */}
      {showImagePicker && (
        <>
          <div
            style={{ position: 'absolute', inset: 0, zIndex: 50 }}
            onClick={() => setShowImagePicker(false)}
          />
          <div style={{
            position: 'absolute',
            bottom: 100,
            left: 24,
            right: 24,
            zIndex: 51,
            background: 'rgba(255,255,255,0.97)',
            backdropFilter: 'blur(16px)',
            borderRadius: 20,
            boxShadow: '0 8px 40px rgba(58,100,140,0.18)',
            border: '1.5px solid rgba(58,100,140,0.12)',
            padding: 14,
          }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#5A7A9A', marginBottom: 10 }}>選擇圖片插入聊天</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
              {PRESET_IMAGES.map(img => (
                <button
                  key={img.id}
                  onClick={() => handleSendImage(img)}
                  style={{
                    border: '1.5px solid rgba(58,100,140,0.12)',
                    borderRadius: 12,
                    overflow: 'hidden',
                    cursor: 'pointer',
                    background: 'transparent',
                    padding: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'all 0.15s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.04)'; e.currentTarget.style.borderColor = '#48A88B'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.borderColor = 'rgba(58,100,140,0.12)'; }}
                >
                  <img src={img.url} alt={img.label} style={{ width: '100%', height: 72, objectFit: 'cover', display: 'block' }} />
                  <div style={{ fontSize: 9, fontWeight: 600, color: '#5A7A9A', padding: '4px 6px', textAlign: 'center' }}>{img.label}</div>
                </button>
              ))}
            </div>
          </div>
        </>
      )}

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
        {/* Image picker button */}
        <button
          onClick={() => setShowImagePicker(v => !v)}
          className="w-11 h-11 rounded-[14px] border-none cursor-pointer flex items-center justify-center flex-shrink-0 transition-all"
          style={{
            background: showImagePicker ? 'rgba(72,168,139,0.18)' : 'rgba(58,100,140,0.08)',
            color: showImagePicker ? '#48A88B' : '#8AACC8',
          }}
          title="插入圖片"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <rect x="2" y="4" width="16" height="12" rx="3" stroke="currentColor" strokeWidth="1.5"/>
            <circle cx="7" cy="8.5" r="1.5" fill="currentColor"/>
            <path d="M2.5 14.5l4-4 3 3 3-3.5 4 4.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
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
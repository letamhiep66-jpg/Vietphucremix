import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { sendChatMessage, ChatMessage } from '../../services/geminiChatService';
import { HERITAGE_LOCATIONS } from '../../data/heritageLocations';
import { 
  MessageSquare, 
  X, 
  Send, 
  Sparkles, 
  MapPin, 
  ExternalLink, 
  Loader2, 
  HelpCircle, 
  Minimize2, 
  Maximize2, 
  RotateCcw, 
  Cpu, 
  ChevronRight, 
  Camera, 
  Compass, 
  Store 
} from 'lucide-react';

export const HeritageAdvisorChatbot: React.FC = () => {
  const { 
    isChatOpen, 
    closeChat, 
    openChatWithContext, 
    chatInitialPrompt, 
    chatCostumeContext,
    navigateToMapLocation 
  } = useApp();

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      role: 'model',
      content: `Kính chào bạn! Tôi là **Trợ Lý Cố Vấn Cổ Phục & Di Sản Việt Nam (Nếp AI Advisor)**.

Tôi sẵn sàng hỗ trợ bạn:
• **Đặc điểm & Điển chế:** Giải đáp cấu trúc cổ lập lĩnh, tay raglan, 5 hạt cúc Ngũ Luân của Áo Dài, Áo Tứ Thân, Áo Ngũ Thân, Áo Tấc, Nhật Bình...
• **Gợi ý phối đồ Remix:** Tư vấn kết hợp cổ phục cùng thời trang đương đại hài hòa cho từng sự kiện.
• **Điểm chụp ảnh di sản (Google Maps):** Gợi ý các danh thắng, hoàng thành, lăng tẩm, phố cổ hợp nhất với trang phục.
• **Định vị tiệm may đo & cho thuê:** Cung cấp địa chỉ chính xác trên Google Maps tại Hà Nội, Huế, Hội An, TP.HCM.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      places: [
        {
          name: 'Hoàng Thành Thăng Long',
          category: 'Điểm Chụp Di Sản',
          address: '19C Hoàng Diệu, Điện Biên, Ba Đình, Hà Nội',
          city: 'Hà Nội',
          googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Ho%C3%A0ng+Th%C3%A0nh+Th%C4%83ng+Long+19C+Ho%C3%A0ng+Di%E1%BB%87u+H%C3%A0+N%E1%BB%99i',
          tip: 'Đoan Môn và Kỳ Đài cổ kính hàng ngàn năm, rất hợp với Áo Tấc và Áo Ngũ Thân.'
        },
        {
          name: 'Đại Nội Huế & Tử Cấm Thành',
          category: 'Điểm Chụp Di Sản',
          address: 'Đường 23 Tháng 8, Phường Thuận Hòa, TP. Huế',
          city: 'Thừa Thiên Huế',
          googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=%C4%90%E1%BA%A1i+N%E1%BB%99i+Hu%E1%BA%BF+23+Th%C3%A1ng+8+Hu%E1%BA%BF',
          tip: 'Trường Lang và Cung Diên Thọ sơn son thếp vàng là bối cảnh vàng cho Áo Nhật Bình.'
        }
      ]
    }
  ]);

  const [inputMessage, setInputMessage] = useState<string>('');
  const [selectedModel, setSelectedModel] = useState<'gemini-3.5-flash' | 'gemini-3.1-flash-lite' | 'gemini-3.1-pro-preview'>('gemini-3.5-flash');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isChatOpen) {
      scrollToBottom();
      setTimeout(() => inputRef.current?.focus(), 200);
    }
  }, [isChatOpen, messages]);

  // Handle auto-injected prompt from other components
  useEffect(() => {
    if (chatInitialPrompt && isChatOpen) {
      handleSendMessage(chatInitialPrompt);
    }
  }, [chatInitialPrompt]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputMessage).trim();
    if (!text || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await sendChatMessage(
        newHistory.map((m) => ({ role: m.role, content: m.content })),
        selectedModel,
        chatCostumeContext
      );

      const modelMsg: ChatMessage = {
        id: `model-${Date.now()}`,
        role: 'model',
        content: response.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        places: response.places,
        sources: response.sources,
        modelUsed: response.modelUsed || selectedModel,
      };

      setMessages((prev) => [...prev, modelMsg]);
    } catch (err) {
      console.error('Chat error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: 'welcome-reset',
        role: 'model',
        content: `Cuộc trò chuyện đã được làm mới. Tôi là Nếp AI, luôn sẵn sàng đồng hành cùng bạn tìm hiểu về cổ phục Việt Nam, gợi ý điểm chụp ảnh và định vị tiệm may/thuê trên Google Maps.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }
    ]);
  };

  const quickPrompts = [
    'Điểm chụp ảnh đẹp nhất cho Áo Tấc & Nhật Bình?',
    'Tìm tiệm thuê hoặc may áo ngũ thân uy tín ở Hà Nội kèm địa chỉ Google Maps?',
    'Tìm tiệm thuê cổ phục đẹp nhất ở Cố đô Huế?',
    'Gợi ý cách phối Áo Dài nữ cùng blazer hiện đại đi tiệc?',
    'Ý nghĩa của 5 cúc khuy và năm thân trong Áo Ngũ Thân nam?'
  ];

  return (
    <>
      {/* Floating Launcher Button (Hidden on mobile <768px; positioned at bottom-6 right-6 on md/lg) */}
      {!isChatOpen && (
        <button
          onClick={() => openChatWithContext()}
          className="hidden md:flex fixed bottom-6 right-6 z-40 items-center gap-2.5 px-4 py-3.5 bg-gradient-to-r from-[#800E13] to-[#9B2226] hover:from-[#640D14] hover:to-[#800E13] text-white rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-white/20 group"
          title="Trò chuyện cùng Trợ lý Cổ Phục & Google Maps"
        >
          <div className="relative">
            <MessageSquare className="w-5 h-5 text-white" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#E9C46A] rounded-full animate-ping" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#E9C46A] rounded-full" />
          </div>
          <span className="text-sm font-semibold tracking-wide">
            Hỏi Trợ Lý Cổ Phục & Bản Đồ
          </span>
          <Sparkles className="w-4 h-4 text-[#E9C46A] animate-pulse" />
        </button>
      )}

      {/* Chat Window Modal / Drawer */}
      {isChatOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-end sm:justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <div 
            className={`flex flex-col bg-[#FFFDF9] rounded-t-3xl sm:rounded-3xl shadow-2xl border border-[#E7DAC8] overflow-hidden transition-all duration-300 ${
              isExpanded 
                ? 'w-full h-full sm:w-[92vw] sm:h-[90vh] sm:max-w-5xl' 
                : 'w-full h-[90vh] sm:w-[500px] sm:h-[650px]'
            }`}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 sm:px-5 py-3.5 bg-gradient-to-r from-[#800E13] to-[#9B2226] text-white shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center border border-white/20">
                  <Compass className="w-5 h-5 text-[#E9C46A]" />
                </div>
                <div>
                  <h3 className="font-heritage text-base sm:text-lg font-bold flex items-center gap-1.5">
                    <span>Nếp AI Advisor</span>
                    <span className="text-[10px] bg-white/20 font-sans px-2 py-0.5 rounded-full font-medium">
                      Di Sản & Maps
                    </span>
                  </h3>
                  <p className="text-[10px] sm:text-[11px] text-white/80">
                    Cố vấn cổ phục, phối đồ & định vị Google Maps
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={handleResetChat}
                  title="Làm mới đoạn hội thoại"
                  className="p-1.5 hover:bg-white/15 rounded-lg text-white/80 hover:text-white transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  title={isExpanded ? 'Thu nhỏ' : 'Mở rộng'}
                  className="p-1.5 hover:bg-white/15 rounded-lg text-white/80 hover:text-white transition-colors hidden sm:block"
                >
                  {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </button>
                <button
                  onClick={closeChat}
                  title="Đóng chat"
                  className="p-1.5 hover:bg-white/15 rounded-lg text-white/80 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Model Selector Bar */}
            <div className="px-4 py-2 bg-[#F6EFE6] border-b border-[#E7DAC8] flex items-center justify-between text-xs text-[#6C584C]">
              <div className="flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-[#800E13]" />
                <span className="font-medium text-[11px]">Mô hình AI:</span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setSelectedModel('gemini-3.5-flash')}
                  className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-colors ${
                    selectedModel === 'gemini-3.5-flash'
                      ? 'bg-[#800E13] text-white'
                      : 'bg-white/70 text-[#6C584C] hover:bg-white'
                  }`}
                  title="gemini-3.5-flash: Tích hợp Google Search & Maps Grounding chuẩn xác"
                >
                  gemini-3.5-flash (Maps)
                </button>
                <button
                  onClick={() => setSelectedModel('gemini-3.1-flash-lite')}
                  className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-colors ${
                    selectedModel === 'gemini-3.1-flash-lite'
                      ? 'bg-[#800E13] text-white'
                      : 'bg-white/70 text-[#6C584C] hover:bg-white'
                  }`}
                  title="gemini-3.1-flash-lite: Phản hồi nhanh chóng"
                >
                  flash-lite (Nhanh)
                </button>
                <button
                  onClick={() => setSelectedModel('gemini-3.1-pro-preview')}
                  className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-colors ${
                    selectedModel === 'gemini-3.1-pro-preview'
                      ? 'bg-[#800E13] text-white'
                      : 'bg-white/70 text-[#6C584C] hover:bg-white'
                  }`}
                  title="gemini-3.1-pro-preview: Lý luận chuyên sâu điển chế phức tạp"
                >
                  pro-preview
                </button>
              </div>
            </div>

            {/* Message Thread (Scrollable) */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div className="flex items-center gap-1.5 mb-1 px-1">
                    <span className="text-[10px] font-medium text-[#8C7A6B]">
                      {msg.role === 'user' ? 'Bạn' : 'Nếp AI'}
                    </span>
                    <span className="text-[9px] text-[#A69888]">{msg.timestamp}</span>
                    {msg.modelUsed && msg.role === 'model' && (
                      <span className="text-[8px] bg-[#EAE0D3] text-[#6C584C] px-1.5 py-0.2 rounded font-mono">
                        {msg.modelUsed}
                      </span>
                    )}
                  </div>

                  {/* Message Bubble */}
                  <div
                    className={`max-w-[88%] sm:max-w-[82%] p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-line shadow-xs ${
                      msg.role === 'user'
                        ? 'bg-[#800E13] text-white rounded-tr-none'
                        : 'bg-white border border-[#E7DAC8] text-[#2C241D] rounded-tl-none'
                    }`}
                  >
                    {msg.content}
                  </div>

                  {/* Location Cards (Google Maps Grounding) */}
                  {msg.places && msg.places.length > 0 && (
                    <div className="mt-2.5 w-full max-w-[92%] sm:max-w-[88%] space-y-2">
                      <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#800E13]">
                        <MapPin className="w-3.5 h-3.5" />
                        <span>Địa Điểm Được Google Maps Bảo Chứng:</span>
                      </div>

                      <div className="grid gap-2">
                        {msg.places.map((place, idx) => {
                          const matchedLoc = HERITAGE_LOCATIONS.find(
                            (l) => l.name.toLowerCase().includes(place.name.toLowerCase()) || place.name.toLowerCase().includes(l.name.toLowerCase())
                          );

                          return (
                            <div
                              key={idx}
                              className="p-3 bg-[#FAF5EE] rounded-xl border border-[#E4D7C5] hover:border-[#800E13] transition-all shadow-xs"
                            >
                              <div className="flex items-start justify-between gap-2">
                                <div>
                                  <span className="inline-block px-2 py-0.5 bg-[#800E13]/10 text-[#800E13] text-[10px] font-bold rounded-md mb-1">
                                    {place.category}
                                  </span>
                                  <h4 className="font-bold text-xs sm:text-sm text-[#2C241D]">
                                    {place.name}
                                  </h4>
                                </div>
                              </div>

                              <p className="mt-1.5 text-[11px] text-[#6C584C] flex items-start gap-1">
                                <MapPin className="w-3 h-3 text-[#9B2226] shrink-0 mt-0.5" />
                                <span>{place.address}</span>
                              </p>

                              {place.tip && (
                                <p className="mt-1.5 text-[11px] text-[#55473D] italic bg-white/70 p-2 rounded-lg border border-[#EDE4D5]">
                                  💡 {place.tip}
                                </p>
                              )}

                              <div className="flex flex-wrap items-center gap-2 mt-2 pt-2 border-t border-[#E8DECF]">
                                {matchedLoc ? (
                                  <button
                                    onClick={() => {
                                      navigateToMapLocation(matchedLoc.id);
                                      closeChat();
                                    }}
                                    className="flex items-center gap-1 px-2.5 py-1 bg-[#800E13] hover:bg-[#9B2226] text-white rounded-lg text-[11px] font-semibold transition-colors shadow-xs"
                                  >
                                    <Compass className="w-3 h-3" />
                                    <span>Định vị trên Bản đồ tương tác</span>
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => {
                                      navigateToMapLocation('loc-hn-hoang-thanh');
                                      closeChat();
                                    }}
                                    className="flex items-center gap-1 px-2.5 py-1 bg-[#800E13] hover:bg-[#9B2226] text-white rounded-lg text-[11px] font-semibold transition-colors shadow-xs"
                                  >
                                    <Compass className="w-3 h-3" />
                                    <span>Xem trên Bản đồ di sản</span>
                                  </button>
                                )}

                                <a
                                  href={place.googleMapsUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-1 px-2.5 py-1 bg-white hover:bg-[#FAF5EE] text-[#6C584C] hover:text-[#800E13] border border-[#D9C9B4] rounded-lg text-[11px] font-medium transition-colors shadow-xs"
                                >
                                  <span>Mở chỉ đường Google Maps</span>
                                  <ExternalLink className="w-3 h-3" />
                                </a>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Sources if present */}
                  {msg.sources && msg.sources.length > 0 && (
                    <div className="mt-1.5 flex flex-wrap gap-1 px-1">
                      {msg.sources.map((src, idx) => (
                        <a
                          key={idx}
                          href={src.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[10px] text-[#800E13] hover:underline"
                        >
                          <span>[{src.title}]</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {isLoading && (
                <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-white border border-[#E7DAC8] max-w-[70%]">
                  <Loader2 className="w-4 h-4 animate-spin text-[#800E13] shrink-0 mt-0.5" />
                  <p className="text-xs text-[#786454]">
                    Nếp AI đang tra cứu Google Search & Maps Grounding...
                  </p>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Prompt Suggestions */}
            <div className="px-4 py-2 bg-[#FAF5EE] border-t border-[#E7DAC8] overflow-x-auto">
              <div className="flex items-center gap-1.5 whitespace-nowrap">
                <span className="text-[10px] font-semibold text-[#8C7A6B] flex items-center gap-1 mr-1">
                  <Sparkles className="w-3 h-3 text-[#800E13]" />
                  Gợi ý:
                </span>
                {quickPrompts.map((p, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(p)}
                    className="px-2.5 py-1 bg-white hover:bg-[#F3EADB] text-[#55473D] text-[11px] rounded-lg border border-[#DFD1BD] transition-colors shrink-0"
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Input Form */}
            <div className="p-3 sm:p-4 bg-white border-t border-[#E7DAC8]">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center gap-2"
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Hỏi về trang phục, điểm chụp di sản hoặc tiệm may/thuê gần bạn..."
                  disabled={isLoading}
                  className="flex-1 px-4 py-3 bg-[#FAF5EE] border border-[#DFD1BD] rounded-2xl text-xs sm:text-sm text-[#2C241D] placeholder-[#9C8B7D] focus:outline-none focus:ring-2 focus:ring-[#800E13]/20 focus:border-[#800E13] transition-all"
                />
                <button
                  type="submit"
                  disabled={isLoading || !inputMessage.trim()}
                  className="p-3 bg-[#800E13] hover:bg-[#9B2226] text-white rounded-2xl disabled:opacity-40 transition-colors shadow-md shadow-[#800E13]/20 shrink-0"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

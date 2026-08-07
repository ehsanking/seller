import React, { useState, useEffect } from 'react';
import { Customer, Order, Product } from '../types';
import { 
  Users, 
  Sparkles, 
  Send, 
  UserCheck, 
  ShoppingBag, 
  DollarSign, 
  TrendingUp, 
  Bot, 
  User, 
  Tag, 
  ArrowRight, 
  CheckCircle2, 
  RotateCw, 
  MessageSquare, 
  Plus, 
  Star,
  Zap,
  Mail,
  Copy,
  Sliders,
  ChevronRight
} from 'lucide-react';

interface CustomerInsightChatViewProps {
  customers: Customer[];
  orders: Order[];
  products: Product[];
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

export const CustomerInsightChatView: React.FC<CustomerInsightChatViewProps> = ({
  customers,
  orders,
  products
}) => {
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>(customers[0]?.id || '');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [inputPrompt, setInputPrompt] = useState<string>('');
  const [isGeneratingPersona, setIsGeneratingPersona] = useState<boolean>(false);
  const [isSendingChat, setIsSendingChat] = useState<boolean>(false);
  
  const [customerPersona, setCustomerPersona] = useState<{
    personaTitle: string;
    archetype: string;
    lifetimeValueRating: string;
    buyingHabits: string[];
    priceSensitivity: string;
    reengagementStrategy: string;
    recommendedProductIds: string[];
  } | null>(null);

  const [copiedText, setCopiedText] = useState<boolean>(false);

  const activeCustomer = customers.find(c => c.id === selectedCustomerId) || customers[0];

  // Get orders belonging to selected customer
  const customerOrders = orders.filter(o => 
    o.customerEmail?.toLowerCase() === activeCustomer?.email?.toLowerCase() ||
    o.id === activeCustomer?.id
  );

  const totalSpent = activeCustomer?.totalSpent || customerOrders.reduce((sum, o) => sum + o.totalAmount, 0);

  // Generate Persona whenever customer changes or manually requested
  const generateCustomerPersona = async () => {
    if (!activeCustomer) return;
    setIsGeneratingPersona(true);
    setChatMessages([]);

    const orderSummary = customerOrders.map(o => 
      `Order #${o.id}: $${o.totalAmount} (${o.items?.map(i => i.productTitle).join(', ') || 'General Items'})`
    ).join(' | ');

    const prompt = `Analyze this e-commerce customer and generate a structured profile persona in JSON:
Customer Name: ${activeCustomer.name}
Email: ${activeCustomer.email}
Segment: Active Buyer
Total Orders: ${activeCustomer.totalOrders || customerOrders.length}
Total Spent: $${totalSpent}
Recent Orders: ${orderSummary || 'None'}
Available Products in Store: ${products.map(p => `${p.id}:${p.title}`).join(', ')}

Return strictly valid JSON with keys:
"personaTitle" (e.g. "Tech Enthusiast Power Buyer"),
"archetype" (short summary),
"lifetimeValueRating" (e.g. "High LTV - Tier 1"),
"buyingHabits" (array of 3 short bullet points),
"priceSensitivity" (e.g. "Low - Values premium quality over discount"),
"reengagementStrategy" (e.g. "Target with VIP preview access and studio accessories"),
"recommendedProductIds" (array of 2 product IDs from available store products)`;

    try {
      const res = await fetch('/api/plugins/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, type: 'general', provider: 'gemini' })
      });

      if (res.ok) {
        const data = await res.json();
        try {
          const cleaned = (data.text || '').replace(/```json/gi, '').replace(/```/g, '').trim();
          const parsed = JSON.parse(cleaned);
          setCustomerPersona({
            personaTitle: parsed.personaTitle || 'High-Value Commercial Buyer',
            archetype: parsed.archetype || 'Frequent purchaser with strong preference for premium peripherals.',
            lifetimeValueRating: parsed.lifetimeValueRating || 'VIP Tier - Top 5% LTV',
            buyingHabits: parsed.buyingHabits || [
              'Purchases during product launches',
              'High average order value ($150+)',
              'Responds to direct email offers'
            ],
            priceSensitivity: parsed.priceSensitivity || 'Low - Prefers quality and fast shipping',
            reengagementStrategy: parsed.reengagementStrategy || 'Send personalized loyalty gift and preview access to new mechanical keyboards.',
            recommendedProductIds: Array.isArray(parsed.recommendedProductIds) && parsed.recommendedProductIds.length > 0 
              ? parsed.recommendedProductIds 
              : products.slice(0, 2).map(p => p.id)
          });
        } catch {
          // Fallback if parsing non-JSON
          setCustomerPersona({
            personaTitle: `${activeCustomer.name}'s AI Persona`,
            archetype: 'Tech-forward buyer seeking reliable workspace accessories.',
            lifetimeValueRating: `$${totalSpent.toFixed(2)} Lifetime Spend`,
            buyingHabits: [
              'Consistent repeat purchaser',
              'Prefers top-rated products with verified reviews',
              'Average response time to promos: <24h'
            ],
            priceSensitivity: 'Balanced - Quality first',
            reengagementStrategy: 'Offer 10% cross-sell coupon on complementary accessories.',
            recommendedProductIds: products.slice(0, 2).map(p => p.id)
          });
        }
      }
    } catch (err) {
      console.error('Failed to generate customer persona', err);
    } finally {
      setIsGeneratingPersona(false);
      
      // Add initial greeting message in chat
      setChatMessages([
        {
          id: `msg-${Date.now()}`,
          sender: 'ai',
          text: `Hello! I have generated the AI Persona profile for **${activeCustomer.name}**. You can ask me anything about their buying habits, how to pitch them cross-sell items, or draft a personalized email.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }
  };

  useEffect(() => {
    generateCustomerPersona();
  }, [selectedCustomerId]);

  const handleSendChatMessage = async () => {
    if (!inputPrompt.trim() || isSendingChat) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: inputPrompt,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages(prev => [...prev, userMsg]);
    setInputPrompt('');
    setIsSendingChat(true);

    try {
      const prompt = `You are Seller Core AI Customer Analyst.
Customer: ${activeCustomer?.name} (${activeCustomer?.email})
Persona: ${customerPersona?.personaTitle || 'Active Buyer'}
Total Spend: $${totalSpent}
Orders Count: ${customerOrders.length}

Store Manager Query: "${userMsg.text}"

Provide a clear, practical, high-converting response or actionable draft for the store manager.`;

      const res = await fetch('/api/plugins/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, type: 'general', provider: 'gemini' })
      });

      if (res.ok) {
        const data = await res.json();
        const aiMsg: ChatMessage = {
          id: `msg-${Date.now() + 1}`,
          sender: 'ai',
          text: data.text || 'I recommend offering this customer priority shipping and a personalized bundle discount.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setChatMessages(prev => [...prev, aiMsg]);
      }
    } catch (err) {
      console.error('Chat error', err);
    } finally {
      setIsSendingChat(false);
    }
  };

  const recommendedProducts = products.filter(p => 
    customerPersona?.recommendedProductIds?.includes(p.id)
  );

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="p-6 bg-gradient-to-r from-slate-900 via-purple-950 to-slate-900 text-white rounded-2xl shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="p-3 bg-purple-500/20 border border-purple-400/30 text-purple-300 rounded-2xl shrink-0">
            <Sparkles className="w-6 h-6 text-purple-300 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-white">AI Customer Insight & Persona Chat</h1>
              <span className="px-2.5 py-0.5 text-xs font-extrabold bg-purple-500/30 text-purple-200 border border-purple-400/30 rounded-full">
                Gemini 3.6 Flash
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              Analyze purchase history, generate buyer personas, and interact with AI to craft personalized cross-sell pitches.
            </p>
          </div>
        </div>

        {/* Customer Selector */}
        <div className="flex items-center gap-2 bg-white/10 p-1.5 rounded-xl border border-white/10">
          <User className="w-4 h-4 text-purple-300 ml-2" />
          <select
            value={selectedCustomerId}
            onChange={(e) => setSelectedCustomerId(e.target.value)}
            className="bg-transparent text-white text-xs font-bold px-2 py-1.5 focus:outline-none cursor-pointer"
          >
            {customers.map(c => (
              <option key={c.id} value={c.id} className="text-slate-900 font-medium">
                {c.name} ({c.email}) - ${c.totalSpent || 0}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Customer Snapshot & AI Persona Card */}
        <div className="lg:col-span-5 space-y-6">
          {/* Customer Profile Snapshot */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 text-white font-extrabold flex items-center justify-center text-sm shadow-xs">
                  {activeCustomer?.name?.charAt(0) || 'C'}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">{activeCustomer?.name}</h3>
                  <p className="text-xs text-slate-500">{activeCustomer?.email}</p>
                </div>
              </div>
              <span className="px-2.5 py-1 text-[11px] font-extrabold bg-indigo-50 text-indigo-700 rounded-lg border border-indigo-100 uppercase">
                {activeCustomer?.segment || 'Active VIP'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="block text-[10px] font-bold text-slate-400 uppercase">Total Lifetime Revenue</span>
                <span className="text-base font-extrabold text-slate-900 font-mono">
                  ${totalSpent.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="block text-[10px] font-bold text-slate-400 uppercase">Orders Completed</span>
                <span className="text-base font-extrabold text-indigo-600 font-mono">
                  {activeCustomer?.totalOrders || customerOrders.length} Orders
                </span>
              </div>
            </div>

            {/* AI Persona Analysis Card */}
            <div className="p-4 bg-gradient-to-br from-purple-50/80 via-white to-indigo-50/80 border border-purple-200 rounded-xl space-y-3 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-600" />
                  <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">AI Persona Profile</span>
                </div>
                <button
                  onClick={generateCustomerPersona}
                  disabled={isGeneratingPersona}
                  className="p-1 rounded-lg hover:bg-purple-100 text-purple-700 transition cursor-pointer"
                  title="Regenerate Persona"
                >
                  <RotateCw className={`w-3.5 h-3.5 ${isGeneratingPersona ? 'animate-spin' : ''}`} />
                </button>
              </div>

              {isGeneratingPersona ? (
                <div className="py-6 flex flex-col items-center justify-center text-center text-xs text-purple-800 gap-2">
                  <RotateCw className="w-5 h-5 animate-spin text-purple-600" />
                  <span>Synthesizing Order History with Gemini AI...</span>
                </div>
              ) : customerPersona ? (
                <div className="space-y-3 text-xs">
                  <div>
                    <h4 className="text-sm font-extrabold text-purple-900">{customerPersona.personaTitle}</h4>
                    <p className="text-slate-600 text-[11px] mt-0.5 leading-relaxed">{customerPersona.archetype}</p>
                  </div>

                  <div className="pt-2 border-t border-purple-100 space-y-1.5">
                    <span className="block font-bold text-slate-700 text-[11px]">Key Buying Habits:</span>
                    <ul className="space-y-1">
                      {customerPersona.buyingHabits.map((habit, idx) => (
                        <li key={idx} className="flex items-center gap-1.5 text-[11px] text-slate-700">
                          <CheckCircle2 className="w-3 h-3 text-purple-600 shrink-0" />
                          <span>{habit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-2 border-t border-purple-100">
                    <span className="block font-bold text-slate-700 text-[11px]">Recommended Re-engagement Strategy:</span>
                    <p className="text-[11px] text-purple-950 bg-white/80 p-2 rounded-lg border border-purple-200 mt-1 font-medium leading-relaxed">
                      {customerPersona.reengagementStrategy}
                    </p>
                  </div>
                </div>
              ) : null}
            </div>
          </div>

          {/* AI Cross-Sell Recommendations */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500" />
              <span>Personalized Cross-Sell Recommendations</span>
            </h3>

            <div className="space-y-2">
              {(recommendedProducts.length > 0 ? recommendedProducts : products.slice(0, 2)).map(prod => (
                <div key={prod.id} className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl flex items-center justify-between gap-3 hover:bg-slate-100/80 transition">
                  <div className="flex items-center gap-2.5">
                    <img 
                      src={prod.image || 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=300&q=80'} 
                      alt={prod.title} 
                      className="w-10 h-10 object-cover rounded-lg border border-slate-200"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 truncate max-w-[150px]">{prod.title}</h4>
                      <p className="text-[11px] text-indigo-600 font-bold font-mono">${prod.price?.toFixed(2)}</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setInputPrompt(`Draft a personalized 1-on-1 cross-sell email to ${activeCustomer.name} pitching the "${prod.title}" with a 10% discount code.`);
                    }}
                    className="px-2.5 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 rounded-lg text-[11px] font-bold transition flex items-center gap-1 cursor-pointer"
                  >
                    <span>Pitch Product</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Interactive AI Customer Analyst Chat */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col h-[650px] overflow-hidden">
          {/* Chat Header */}
          <div className="p-4 border-b border-slate-100 bg-slate-50/80 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-xs">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-900">Seller Core AI Assistant</h3>
                <p className="text-[11px] text-slate-500">Analyzing customer profile & pitch strategy</p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setInputPrompt("What are the top 3 items this customer is most likely to buy next?")}
                className="px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg text-[11px] font-semibold transition cursor-pointer"
              >
                Top Next Products?
              </button>
              <button
                type="button"
                onClick={() => setInputPrompt(`Draft a friendly re-engagement discount email for ${activeCustomer.name}.`)}
                className="px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg text-[11px] font-semibold transition cursor-pointer"
              >
                Draft Re-engagement Email
              </button>
            </div>
          </div>

          {/* Chat Messages Body */}
          <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-slate-50/30">
            {chatMessages.map((msg) => (
              <div
                key={msg.id}
                className={`flex items-start gap-3 ${
                  msg.sender === 'user' ? 'flex-row-reverse' : ''
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-xl font-bold flex items-center justify-center shrink-0 text-xs ${
                    msg.sender === 'user'
                      ? 'bg-slate-900 text-white'
                      : 'bg-purple-600 text-white'
                  }`}
                >
                  {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                <div
                  className={`max-w-[80%] p-4 rounded-2xl text-xs space-y-1.5 ${
                    msg.sender === 'user'
                      ? 'bg-slate-900 text-white rounded-tr-none'
                      : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none shadow-2xs'
                  }`}
                >
                  <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                  <span
                    className={`block text-[10px] ${
                      msg.sender === 'user' ? 'text-slate-400 text-right' : 'text-slate-400'
                    }`}
                  >
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            ))}

            {isSendingChat && (
              <div className="flex items-center gap-2 text-xs text-purple-700 bg-purple-50 p-3 rounded-xl border border-purple-200 w-fit animate-pulse">
                <RotateCw className="w-3.5 h-3.5 animate-spin text-purple-600" />
                <span>Gemini AI is crafting tailored customer advice...</span>
              </div>
            )}
          </div>

          {/* Chat Input Bar */}
          <div className="p-3.5 border-t border-slate-100 bg-white">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendChatMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={inputPrompt}
                onChange={(e) => setInputPrompt(e.target.value)}
                placeholder={`Ask AI about ${activeCustomer?.name}'s buying habits or draft pitches...`}
                className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <button
                type="submit"
                disabled={!inputPrompt.trim() || isSendingChat}
                className="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { Product } from '../types';
import { 
  Share2, 
  Sparkles, 
  RotateCw, 
  Send, 
  Calendar, 
  Twitter, 
  Instagram, 
  Linkedin, 
  CheckCircle2, 
  Copy, 
  Tag, 
  Zap,
  Image as ImageIcon
} from 'lucide-react';

interface AiSocialAutoposterProps {
  products: Product[];
}

interface SocialPost {
  id: string;
  platform: 'twitter' | 'instagram' | 'linkedin';
  productTitle: string;
  caption: string;
  hashtags: string[];
  imageUrl: string;
  scheduledTime: string;
  status: 'draft' | 'scheduled' | 'published';
}

export const AiSocialAutoposter: React.FC<AiSocialAutoposterProps> = ({ products }) => {
  const [selectedProductId, setSelectedProductId] = useState<string>(products[0]?.id || '');
  const [platform, setPlatform] = useState<'twitter' | 'instagram' | 'linkedin'>('twitter');
  const [tone, setTone] = useState<'exciting' | 'professional' | 'minimalist' | 'urgent'>('exciting');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [posts, setPosts] = useState<SocialPost[]>([
    {
      id: 'post-1',
      platform: 'twitter',
      productTitle: products[0]?.title || 'Ergonomic Mechanical Keyboard',
      caption: 'Level up your desk setup with our ultra-responsive mechanical keyboard. Precision engineered for peak productivity and pristine typing acoustics. 🔥',
      hashtags: ['#MechanicalKeyboard', '#DeskSetup', '#TechGadgets', '#Productivity'],
      imageUrl: products[0]?.image || 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=600&q=80',
      scheduledTime: 'Tomorrow at 10:00 AM',
      status: 'scheduled'
    },
    {
      id: 'post-2',
      platform: 'instagram',
      productTitle: products[1]?.title || 'Studio Wireless Audio Headset',
      caption: 'Immersive sound meets minimalist aesthetics. Experience studio-grade acoustic clarity wherever your creative work takes you. ✨',
      hashtags: ['#AudioGear', '#StudioLife', '#Audiophile', '#MinimalistDesign'],
      imageUrl: products[1]?.image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80',
      scheduledTime: 'Friday at 02:30 PM',
      status: 'scheduled'
    }
  ]);

  const activeProduct = products.find(p => p.id === selectedProductId) || products[0];

  const handleGeneratePost = async () => {
    if (!activeProduct) return;
    setIsGenerating(true);

    try {
      const prompt = `Generate engaging e-commerce social media marketing copy for ${platform.toUpperCase()} with a ${tone} tone.
Product: ${activeProduct.title}
Price: $${activeProduct.price}
Description: ${activeProduct.description || 'Premium high-end electronics item.'}

Return strictly valid JSON with keys:
"caption" (engaging post caption under 240 chars),
"hashtags" (array of 4 relevant hashtags string)
"scheduledTime" (e.g. "Tomorrow at 12:00 PM")`;

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

          const newPost: SocialPost = {
            id: `post-${Date.now()}`,
            platform,
            productTitle: activeProduct.title,
            caption: parsed.caption || `Check out the new ${activeProduct.title} available now at an amazing price! 🚀`,
            hashtags: Array.isArray(parsed.hashtags) ? parsed.hashtags : ['#ECommerce', '#Tech', '#Deals', '#ShopNow'],
            imageUrl: activeProduct.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80',
            scheduledTime: parsed.scheduledTime || 'Scheduled for next automated slot',
            status: 'scheduled'
          };

          setPosts(prev => [newPost, ...prev]);
        } catch {
          // Fallback
          const newPost: SocialPost = {
            id: `post-${Date.now()}`,
            platform,
            productTitle: activeProduct.title,
            caption: `Upgrade your daily routine with the ${activeProduct.title}. Limited stock available! ✨`,
            hashtags: ['#ShopNow', '#TechTrends', '#BestSellers', '#NewArrival'],
            imageUrl: activeProduct.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80',
            scheduledTime: 'Tomorrow at 09:00 AM',
            status: 'scheduled'
          };
          setPosts(prev => [newPost, ...prev]);
        }
      }
    } catch (err) {
      console.error('Social autoposter error', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyPost = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-purple-50 text-purple-600 border border-purple-200">
            <Share2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-display font-bold text-sm text-slate-900">AI Social Media Autoposter</h4>
              <span className="px-2 py-0.5 text-[10px] font-extrabold bg-purple-100 text-purple-800 rounded-md">
                Gemini 3.6 Autopilot
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Periodically generates promotional social media captions, hashtags, and visual posts for products to publish across platforms.
            </p>
          </div>
        </div>
      </div>

      {/* Generator Form */}
      <div className="p-5 bg-gradient-to-br from-purple-50/60 via-white to-indigo-50/60 border border-purple-200 rounded-2xl space-y-4">
        <h5 className="text-xs font-bold text-purple-900 uppercase tracking-wider flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-purple-600" />
          <span>Generate New AI Promotional Campaign</span>
        </h5>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Select Product</label>
            <select
              value={selectedProductId}
              onChange={(e) => setSelectedProductId(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-medium text-slate-900"
            >
              {products.map(p => (
                <option key={p.id} value={p.id}>{p.title} (${p.price})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Target Platform</label>
            <div className="grid grid-cols-3 gap-1.5">
              <button
                type="button"
                onClick={() => setPlatform('twitter')}
                className={`py-2 rounded-lg font-bold transition flex items-center justify-center gap-1 cursor-pointer ${
                  platform === 'twitter' ? 'bg-slate-900 text-white shadow-2xs' : 'bg-white border border-slate-200 text-slate-700'
                }`}
              >
                <Twitter className="w-3.5 h-3.5" />
                <span>X / Twitter</span>
              </button>
              <button
                type="button"
                onClick={() => setPlatform('instagram')}
                className={`py-2 rounded-lg font-bold transition flex items-center justify-center gap-1 cursor-pointer ${
                  platform === 'instagram' ? 'bg-pink-600 text-white shadow-2xs' : 'bg-white border border-slate-200 text-slate-700'
                }`}
              >
                <Instagram className="w-3.5 h-3.5" />
                <span>Instagram</span>
              </button>
              <button
                type="button"
                onClick={() => setPlatform('linkedin')}
                className={`py-2 rounded-lg font-bold transition flex items-center justify-center gap-1 cursor-pointer ${
                  platform === 'linkedin' ? 'bg-blue-700 text-white shadow-2xs' : 'bg-white border border-slate-200 text-slate-700'
                }`}
              >
                <Linkedin className="w-3.5 h-3.5" />
                <span>LinkedIn</span>
              </button>
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Content Tone</label>
            <select
              value={tone}
              onChange={(e) => setTone(e.target.value as any)}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-medium text-slate-900 capitalize"
            >
              <option value="exciting">Exciting & Hype 🔥</option>
              <option value="professional">Professional & Clean 💼</option>
              <option value="minimalist">Minimalist Zen ✨</option>
              <option value="urgent">Urgent Flash Sale ⚡</option>
            </select>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="button"
            onClick={handleGeneratePost}
            disabled={isGenerating}
            className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl transition shadow-xs flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <RotateCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
            <span>{isGenerating ? 'Generating AI Post...' : 'Generate & Schedule Post'}</span>
          </button>
        </div>
      </div>

      {/* Scheduled Posts Stream */}
      <div className="space-y-4">
        <h5 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
          <Calendar className="w-3.5 h-3.5 text-indigo-600" />
          <span>Scheduled & Published Autoposter Queue</span>
        </h5>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {posts.map(post => (
            <div key={post.id} className="p-4 bg-slate-50 border border-slate-200/90 rounded-2xl space-y-3 flex flex-col justify-between">
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-800 shadow-2xs">
                      {post.platform === 'twitter' && <Twitter className="w-3.5 h-3.5 text-sky-500" />}
                      {post.platform === 'instagram' && <Instagram className="w-3.5 h-3.5 text-pink-600" />}
                      {post.platform === 'linkedin' && <Linkedin className="w-3.5 h-3.5 text-blue-700" />}
                    </span>
                    <span className="text-xs font-bold text-slate-900 capitalize">{post.platform} Autopost</span>
                  </div>

                  <span className="px-2 py-0.5 text-[10px] font-extrabold bg-indigo-100 text-indigo-800 rounded-md">
                    {post.scheduledTime}
                  </span>
                </div>

                <div className="flex items-start gap-3">
                  <img
                    src={post.imageUrl}
                    alt={post.productTitle}
                    className="w-16 h-16 object-cover rounded-xl border border-slate-200 shrink-0"
                  />
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-slate-900">{post.productTitle}</p>
                    <p className="text-[11px] text-slate-600 leading-relaxed">{post.caption}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 pt-1">
                  {post.hashtags.map((tag, idx) => (
                    <span key={idx} className="px-2 py-0.5 bg-purple-50 text-purple-700 border border-purple-200/80 rounded-md text-[10px] font-mono font-bold">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200/60 flex items-center justify-between">
                <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Ready for API Autopost
                </span>

                <button
                  type="button"
                  onClick={() => handleCopyPost(`${post.caption} ${post.hashtags.join(' ')}`, post.id)}
                  className="px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-lg text-[11px] font-bold transition flex items-center gap-1.5 cursor-pointer"
                >
                  {copiedId === post.id ? (
                    <>
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      <span>Copied Caption!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3 text-slate-400" />
                      <span>Copy Post</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

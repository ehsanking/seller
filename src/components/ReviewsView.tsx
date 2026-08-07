import React, { useState } from 'react';
import { 
  Star, 
  MessageSquare, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Trash2, 
  Search, 
  Filter, 
  Plus, 
  ShieldCheck, 
  Reply, 
  UserCheck, 
  Info,
  Package,
  ThumbsUp
} from 'lucide-react';
import { ProductReview, ReviewStatus, Product } from '../types';

const INITIAL_REVIEWS: ProductReview[] = [
  {
    id: 'rev-101',
    productId: 'p-1',
    productTitle: 'Wireless Noise-Canceling Headphones',
    productImage: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&auto=format&fit=crop&q=80',
    authorName: 'Sarah Jenkins',
    authorEmail: 'sarah.j@example.com',
    rating: 5,
    reviewText: 'Outstanding sound quality and deep noise cancellation! The battery life easily lasts my entire workday.',
    status: 'approved',
    isVerifiedOwner: true,
    adminReply: 'Thank you Sarah! We are thrilled you love the sound quality.',
    createdAt: '2026-08-01T14:20:00Z'
  },
  {
    id: 'rev-102',
    productId: 'p-2',
    productTitle: 'Ergonomic Mechanical Keyboard',
    productImage: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=200&auto=format&fit=crop&q=80',
    authorName: 'David Miller',
    authorEmail: 'david.m@example.com',
    rating: 4,
    reviewText: 'Tactile switches feel crisp and comfortable for typing. Slight delay on initial bluetooth pairing.',
    status: 'approved',
    isVerifiedOwner: true,
    createdAt: '2026-08-03T09:15:00Z'
  },
  {
    id: 'rev-103',
    productId: 'p-1',
    productTitle: 'Wireless Noise-Canceling Headphones',
    productImage: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&auto=format&fit=crop&q=80',
    authorName: 'Alex Thompson',
    authorEmail: 'alex.t@example.com',
    rating: 5,
    reviewText: 'Fast shipping and crisp bass response. Highly recommended!',
    status: 'pending',
    isVerifiedOwner: true,
    createdAt: '2026-08-06T11:45:00Z'
  },
  {
    id: 'rev-104',
    productId: 'p-3',
    productTitle: 'Ultra HD 4K Curved Monitor',
    productImage: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=200&auto=format&fit=crop&q=80',
    authorName: 'CryptoBot Spammer',
    authorEmail: 'promo@spambot.net',
    rating: 1,
    reviewText: 'Visit http://cheap-crypto-deals.xyz for free tokens!',
    status: 'spam',
    isVerifiedOwner: false,
    createdAt: '2026-08-05T02:10:00Z'
  }
];

interface ReviewsViewProps {
  products?: Product[];
}

export const ReviewsView: React.FC<ReviewsViewProps> = ({ products = [] }) => {
  const [reviews, setReviews] = useState<ProductReview[]>(() => {
    const saved = localStorage.getItem('seller_product_reviews');
    return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
  });

  const [activeStatusTab, setActiveStatusTab] = useState<ReviewStatus | 'all'>('all');
  const [ratingFilter, setRatingFilter] = useState<number | 0>(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddReviewModalOpen, setIsAddReviewModalOpen] = useState(false);
  const [replyModalReview, setReplyModalReview] = useState<ProductReview | null>(null);
  const [replyText, setReplyText] = useState('');

  // New review form
  const [newProductId, setNewProductId] = useState(products[0]?.id || '');
  const [newAuthor, setNewAuthor] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newRating, setNewRating] = useState('5');
  const [newText, setNewText] = useState('');

  const saveReviews = (updated: ProductReview[]) => {
    setReviews(updated);
    localStorage.setItem('seller_product_reviews', JSON.stringify(updated));
  };

  const handleUpdateStatus = (reviewId: string, newStatus: ReviewStatus) => {
    const updated = reviews.map(r => r.id === reviewId ? { ...r, status: newStatus } : r);
    saveReviews(updated);
  };

  const handleDeleteReview = (reviewId: string) => {
    const updated = reviews.filter(r => r.id !== reviewId);
    saveReviews(updated);
  };

  const handleSaveReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyModalReview) return;

    const updated = reviews.map(r => 
      r.id === replyModalReview.id ? { ...r, adminReply: replyText.trim() } : r
    );
    saveReviews(updated);
    setReplyModalReview(null);
    setReplyText('');
  };

  const handleCreateReview = (e: React.FormEvent) => {
    e.preventDefault();
    const prod = products.find(p => p.id === newProductId) || {
      id: 'p-custom',
      title: 'Store Product',
      image: ''
    };

    const newRev: ProductReview = {
      id: `rev-${Date.now()}`,
      productId: prod.id,
      productTitle: prod.title,
      productImage: prod.image,
      authorName: newAuthor.trim() || 'Verified Customer',
      authorEmail: newEmail.trim() || 'customer@example.com',
      rating: Number(newRating) || 5,
      reviewText: newText.trim(),
      status: 'approved',
      isVerifiedOwner: true,
      createdAt: new Date().toISOString()
    };

    saveReviews([newRev, ...reviews]);
    setIsAddReviewModalOpen(false);
    setNewAuthor('');
    setNewEmail('');
    setNewText('');
  };

  // Filtered reviews
  const filteredReviews = reviews.filter(r => {
    if (activeStatusTab !== 'all' && r.status !== activeStatusTab) return false;
    if (ratingFilter > 0 && r.rating !== ratingFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchText = r.reviewText.toLowerCase().includes(q);
      const matchAuthor = r.authorName.toLowerCase().includes(q) || r.authorEmail.toLowerCase().includes(q);
      const matchProduct = r.productTitle.toLowerCase().includes(q);
      if (!matchText && !matchAuthor && !matchProduct) return false;
    }
    return true;
  });

  // Calculate metrics
  const approvedReviews = reviews.filter(r => r.status === 'approved');
  const pendingCount = reviews.filter(r => r.status === 'pending').length;
  const avgRating = approvedReviews.length > 0 
    ? (approvedReviews.reduce((sum, r) => sum + r.rating, 0) / approvedReviews.length).toFixed(1)
    : '0.0';

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl border border-indigo-100">
            <Star className="w-6 h-6 fill-indigo-600/20 text-indigo-600" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-display font-bold text-lg text-slate-900">Product Reviews & Ratings</h2>
              <span className="px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-[10px] font-extrabold uppercase border border-indigo-100">
                WooCommerce Equiv
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Moderate customer reviews, approve verified ratings, reply as store admin, and clean spam feedback.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsAddReviewModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer"
          id="btn-add-verified-review"
        >
          <Plus className="w-4 h-4" />
          <span>Add Verified Review</span>
        </button>
      </div>

      {/* Analytics Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider">
            <span>Average Store Rating</span>
            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-display font-black text-2xl text-slate-900">{avgRating}</span>
            <span className="text-xs text-slate-400">/ 5.0 Rating</span>
          </div>
          <p className="text-[10px] text-slate-500">Based on {approvedReviews.length} approved reviews</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider">
            <span>Pending Moderation</span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <span className="font-display font-black text-2xl text-amber-600">{pendingCount}</span>
          <p className="text-[10px] text-slate-500">Reviews awaiting your approval</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider">
            <span>Verified Buyers</span>
            <UserCheck className="w-4 h-4 text-emerald-500" />
          </div>
          <span className="font-display font-black text-2xl text-slate-900">
            {reviews.filter(r => r.isVerifiedOwner).length}
          </span>
          <p className="text-[10px] text-slate-500">Confirmed order purchases</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider">
            <span>Total Feedback</span>
            <MessageSquare className="w-4 h-4 text-indigo-500" />
          </div>
          <span className="font-display font-black text-2xl text-slate-900">{reviews.length}</span>
          <p className="text-[10px] text-slate-500">Reviews across full store catalog</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Status Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs font-bold">
          {(['all', 'approved', 'pending', 'spam', 'trash'] as const).map((tab) => {
            const count = tab === 'all' ? reviews.length : reviews.filter(r => r.status === tab).length;
            const isActive = activeStatusTab === tab;
            return (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveStatusTab(tab)}
                className={`px-3 py-1.5 rounded-xl capitalize transition cursor-pointer ${
                  isActive 
                    ? 'bg-indigo-600 text-white shadow-2xs' 
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {tab} ({count})
              </button>
            );
          })}
        </div>

        {/* Search & Star Rating Filter */}
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={ratingFilter}
            onChange={(e) => setRatingFilter(Number(e.target.value))}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-800"
          >
            <option value={0}>All Ratings (1-5★)</option>
            <option value={5}>5 Stars ★★★★★</option>
            <option value={4}>4 Stars ★★★★☆</option>
            <option value={3}>3 Stars ★★★☆☆</option>
            <option value={2}>2 Stars ★★☆☆☆</option>
            <option value={1}>1 Star ★☆☆☆☆</option>
          </select>

          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search reviews..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>
        </div>

      </div>

      {/* Reviews List */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
        {filteredReviews.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <MessageSquare className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="text-xs font-bold text-slate-700">No reviews matched your filter criteria</p>
            <p className="text-[11px] text-slate-400">Try adjusting your status or star rating filter.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredReviews.map(review => (
              <div key={review.id} className="p-5 hover:bg-slate-50/50 transition space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  
                  {/* Product & Author Header */}
                  <div className="flex items-center gap-3">
                    {review.productImage ? (
                      <img src={review.productImage} alt="" className="w-10 h-10 rounded-lg object-cover border border-slate-200 shrink-0" />
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                        <Package className="w-5 h-5 text-slate-400" />
                      </div>
                    )}
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-slate-900">{review.productTitle}</span>
                        {review.isVerifiedOwner && (
                          <span className="flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[9px] font-extrabold border border-emerald-200">
                            <UserCheck className="w-2.5 h-2.5" /> Verified Buyer
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500">
                        By <span className="font-semibold text-slate-700">{review.authorName}</span> ({review.authorEmail})
                      </p>
                    </div>
                  </div>

                  {/* Rating Stars & Status Badge */}
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map(star => (
                        <Star 
                          key={star} 
                          className={`w-3.5 h-3.5 ${
                            star <= review.rating 
                              ? 'text-amber-400 fill-amber-400' 
                              : 'text-slate-200'
                          }`} 
                        />
                      ))}
                    </div>

                    <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase border ${
                      review.status === 'approved' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                      review.status === 'pending' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                      review.status === 'spam' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                      'bg-slate-100 text-slate-600 border-slate-200'
                    }`}>
                      {review.status}
                    </span>
                  </div>

                </div>

                {/* Review Text Body */}
                <p className="text-xs text-slate-700 leading-relaxed font-sans bg-slate-50/70 p-3 rounded-xl border border-slate-100">
                  "{review.reviewText}"
                </p>

                {/* Admin Reply Box if present */}
                {review.adminReply && (
                  <div className="ml-4 pl-3 border-l-2 border-indigo-500 bg-indigo-50/40 p-2.5 rounded-r-xl text-xs space-y-1">
                    <div className="flex items-center gap-1 font-bold text-indigo-900 text-[11px]">
                      <Reply className="w-3 h-3 text-indigo-600" /> Store Owner Reply:
                    </div>
                    <p className="text-slate-600 text-[11px]">{review.adminReply}</p>
                  </div>
                )}

                {/* Moderation Controls Footer */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-1 text-xs">
                  <span className="text-[10px] text-slate-400">
                    Posted on {new Date(review.createdAt).toLocaleDateString()}
                  </span>

                  <div className="flex items-center gap-2">
                    {review.status !== 'approved' && (
                      <button
                        type="button"
                        onClick={() => handleUpdateStatus(review.id, 'approved')}
                        className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-lg text-[11px] font-bold transition cursor-pointer"
                      >
                        Approve Review
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => {
                        setReplyModalReview(review);
                        setReplyText(review.adminReply || '');
                      }}
                      className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-lg text-[11px] font-bold transition cursor-pointer"
                    >
                      Reply
                    </button>

                    {review.status !== 'spam' && (
                      <button
                        type="button"
                        onClick={() => handleUpdateStatus(review.id, 'spam')}
                        className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg text-[11px] font-bold transition cursor-pointer"
                      >
                        Mark Spam
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => handleDeleteReview(review.id)}
                      className="p-1 text-slate-400 hover:text-rose-600 rounded transition cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal: Add Verified Review */}
      {isAddReviewModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <h3 className="font-display font-bold text-base text-slate-900">Add Verified Review</h3>
            <form onSubmit={handleCreateReview} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Target Product</label>
                <select
                  value={newProductId}
                  onChange={(e) => setNewProductId(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 font-semibold text-slate-800"
                >
                  {products.map(p => (
                    <option key={p.id} value={p.id}>{p.title}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Author Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Emily Roberts"
                    value={newAuthor}
                    onChange={(e) => setNewAuthor(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 font-medium"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Star Rating</label>
                  <select
                    value={newRating}
                    onChange={(e) => setNewRating(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 font-bold text-amber-600"
                  >
                    <option value="5">5 Stars ★★★★★</option>
                    <option value="4">4 Stars ★★★★☆</option>
                    <option value="3">3 Stars ★★★☆☆</option>
                    <option value="2">2 Stars ★★☆☆☆</option>
                    <option value="1">1 Star ★☆☆☆☆</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Author Email</label>
                <input
                  type="email"
                  placeholder="emily@example.com"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Review Content</label>
                <textarea
                  rows={3}
                  placeholder="Enter detailed customer feedback..."
                  value={newText}
                  onChange={(e) => setNewText(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl p-3 font-medium"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddReviewModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl font-bold text-slate-700 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition shadow-xs cursor-pointer"
                >
                  Publish Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Reply as Store Owner */}
      {replyModalReview && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <h3 className="font-display font-bold text-base text-slate-900">Reply to Review</h3>
            <p className="text-xs text-slate-500">Replying to {replyModalReview.authorName}'s review</p>
            <form onSubmit={handleSaveReply} className="space-y-3 text-xs">
              <textarea
                rows={4}
                placeholder="Write an official store owner response..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                className="w-full border border-slate-200 rounded-xl p-3 font-medium focus:ring-2 focus:ring-indigo-500/20"
                required
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setReplyModalReview(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl font-bold text-slate-700 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition shadow-xs cursor-pointer"
                >
                  Save Reply
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

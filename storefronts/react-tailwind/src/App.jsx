import React, { useEffect, useState } from 'react';

export default function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    // Fetch live products from SELLER Headless REST API Core
    fetch('http://localhost:3000/api/products')
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch SELLER API products:', err);
        setLoading(false);
      });
  }, []);

  const addToCart = (product) => {
    setCart(prev => [...prev, product]);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-6">
      {/* Header */}
      <header className="max-w-6xl mx-auto flex items-center justify-between pb-6 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="w-3.5 h-3.5 rounded-full bg-cyan-400" />
          <h1 className="text-xl font-bold tracking-tight">SELLER React Storefront</h1>
        </div>
        <button className="px-4 py-2 rounded-full bg-cyan-600 text-white font-semibold text-sm">
          Cart ({cart.length})
        </button>
      </header>

      {/* Hero */}
      <section className="max-w-6xl mx-auto my-8 p-8 rounded-2xl bg-gradient-to-r from-slate-900 to-cyan-950 border border-slate-800 text-center space-y-3">
        <span className="px-3 py-1 rounded-full text-xs font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
          React 18 + Vite + Tailwind CSS
        </span>
        <h2 className="text-3xl font-extrabold text-white">Connected to SELLER Headless API</h2>
        <p className="text-sm text-slate-300 max-w-xl mx-auto">
          This React application fetches catalog state directly from <code>http://localhost:3000/api/products</code>.
        </p>
      </section>

      {/* Products Grid */}
      <main className="max-w-6xl mx-auto">
        {loading ? (
          <div className="text-center py-12 text-slate-400">Loading catalog from SELLER API...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map(p => (
              <div key={p.id} className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col justify-between space-y-3 hover:border-slate-700 transition">
                <img src={p.image} alt={p.title} className="h-40 w-full object-cover rounded-lg bg-slate-950" />
                <div>
                  <span className="text-xs text-cyan-400 font-semibold uppercase">{p.category}</span>
                  <h3 className="text-base font-bold text-white truncate">{p.title}</h3>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                  <span className="text-lg font-extrabold text-cyan-400">${p.price?.toFixed(2)}</span>
                  <button
                    onClick={() => addToCart(p)}
                    className="px-3.5 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

import React, { useState } from 'react';
import { X, Plus, ShoppingBag, QrCode, Copy, Check, ShieldCheck, AlertCircle } from 'lucide-react';
import { Product, Order } from '../types';

interface AddOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onAddOrder: (order: Partial<Order>) => void;
}

export const AddOrderModal: React.FC<AddOrderModalProps> = ({ isOpen, onClose, products, onAddOrder }) => {
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [selectedProductId, setSelectedProductId] = useState(products[0]?.id || '');
  const [quantity, setQuantity] = useState('1');
  const [paymentMethod, setPaymentMethod] = useState('Credit Card (Manual Entry)');
  const [cryptoCurrency, setCryptoCurrency] = useState('USDT (TRC-20)');
  const [cryptoTxHash, setCryptoTxHash] = useState('');
  const [showQrModal, setShowQrModal] = useState(false);
  const [qrCopied, setQrCopied] = useState(false);

  if (!isOpen) return null;

  const product = products.find(p => p.id === selectedProductId) || products[0];
  const qty = parseInt(quantity) || 1;
  const totalAmount = (product ? product.price : 0) * qty;

  const walletAddresses: Record<string, string> = {
    'USDT (TRC-20)': 'TXYZopQRStuvWXYZ1234567890abcdefGH',
    'BTC': 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
    'ETH': '0x9482A1B982847102938475910283748592019283',
    'TON': 'EQD-0Q...EhsanStoreTONVault9921'
  };

  const currentWallet = walletAddresses[cryptoCurrency] || walletAddresses['USDT (TRC-20)'];
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(`crypto:${currentWallet}?amount=${totalAmount}&currency=${cryptoCurrency}`)}`;


  const validateTxHash = (hash: string, currency: string) => {
    if (!hash.trim()) return { isValid: false, message: 'Enter blockchain transaction hash' };
    const trimmed = hash.trim();
    if (currency === 'ETH') {
      if (!/^0x[0-9a-fA-F]{64}$/.test(trimmed) && !/^0x[0-9a-fA-F]{40}$/.test(trimmed)) {
        return { isValid: false, message: 'Requires standard ETH Hash (66 chars starting with 0x) or Address (42 chars)' };
      }
    } else if (currency === 'USDT (TRC-20)') {
      if (!/^[0-9a-fA-F]{64}$/.test(trimmed) && !/^T[A-Za-z0-9]{33}$/.test(trimmed)) {
        return { isValid: false, message: 'Requires Tron TxID (64 hex characters) or Wallet Address (starts with T)' };
      }
    } else if (currency === 'BTC') {
      if (!/^[0-9a-fA-F]{64}$/.test(trimmed) && !/^(bc1|[13])[a-zA-HJ-NP-Z0-9]{25,59}$/.test(trimmed)) {
        return { isValid: false, message: 'Requires BTC Transaction ID (64 hex chars) or Address' };
      }
    } else if (currency === 'TON') {
      if (trimmed.length < 20) {
        return { isValid: false, message: 'TON transaction ID or address is too short' };
      }
    }
    return { isValid: true, message: `Valid ${currency} format recognized` };
  };

  const detectCryptoType = (hash: string) => {
    const trimmed = hash.trim();
    if (!trimmed) return null;

    // 1. Ethereum / ERC-20 Address or Tx Hash (starts with 0x)
    if (trimmed.startsWith('0x') || /^0x[0-9a-fA-F]{40,64}$/.test(trimmed)) {
      return 'ETH';
    }

    // 2. USDT TRC-20 / Tron Wallet Address or common Tron Tx Hash
    // Tron addresses start with T and are 34 chars
    if (/^T[A-Za-z0-9]{33}$/.test(trimmed) || (trimmed.startsWith('T') && trimmed.length >= 30)) {
      return 'USDT (TRC-20)';
    }

    // 3. Bitcoin Address (starts with bc1, 1, or 3)
    if (/^(bc1|[13])[a-zA-HJ-NP-Z0-9]{25,59}$/.test(trimmed) || trimmed.startsWith('bc1') || /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$/.test(trimmed)) {
      return 'BTC';
    }

    // 4. TON Address (starts with EQ or UQ and is base64)
    if (/^(EQ|UQ)[A-Za-z0-9_-]{46}$/.test(trimmed) || trimmed.startsWith('EQ') || trimmed.startsWith('UQ')) {
      return 'TON';
    }

    // 5. Default 64 hex characters without prefix is usually a Bitcoin or Tron TX hash
    if (/^[0-9a-fA-F]{64}$/.test(trimmed)) {
      // If we already have one of BTC or USDT selected, preserve it, otherwise default to USDT (TRC-20)
      if (cryptoCurrency === 'BTC') return 'BTC';
      return 'USDT (TRC-20)';
    }

    return null;
  };

  const handleTxHashChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setCryptoTxHash(val);
    const detected = detectCryptoType(val);
    if (detected && detected !== cryptoCurrency) {
      setCryptoCurrency(detected);
    }
  };

  const txValidation = validateTxHash(cryptoTxHash, cryptoCurrency);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const product = products.find(p => p.id === selectedProductId) || products[0];
    const qty = parseInt(quantity) || 1;
    const totalAmount = (product ? product.price : 0) * qty;

    onAddOrder({
      customerName,
      customerEmail,
      shippingAddress,
      paymentMethod: paymentMethod === 'Crypto Payment' ? `Crypto (${cryptoCurrency})` : paymentMethod,
      cryptoCurrency: paymentMethod === 'Crypto Payment' ? cryptoCurrency : undefined,
      cryptoTxHash: paymentMethod === 'Crypto Payment' ? cryptoTxHash : undefined,
      items: product ? [{
        productId: product.id,
        productTitle: product.title,
        quantity: qty,
        price: product.price,
      }] : [],
      totalAmount,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="font-display font-bold text-base text-slate-900">Create Manual Store Order</h3>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Customer Name</label>
              <input
                type="text"
                required
                placeholder="Jane Doe"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Email</label>
              <input
                type="email"
                required
                placeholder="jane@example.com"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Select Product</label>
            <select
              value={selectedProductId}
              onChange={(e) => setSelectedProductId(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20"
            >
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title} - ${p.price.toFixed(2)} ({p.stockQuantity} in stock)
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Quantity</label>
              <input
                type="number"
                min="1"
                required
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Payment Method</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20"
              >
                <option value="Credit Card (Manual)">Credit Card</option>
                <option value="PayPal">PayPal</option>
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="Cash / POS">Cash / POS</option>
                <option value="Crypto Payment">Crypto Payment (USDT / BTC / ETH)</option>
              </select>
            </div>
          </div>

          {paymentMethod === 'Crypto Payment' && (
            <div className="p-3.5 bg-purple-50 rounded-xl border border-purple-200 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-purple-900 mb-1">Cryptocurrency</label>
                  <select
                    value={cryptoCurrency}
                    onChange={(e) => setCryptoCurrency(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-purple-300 rounded-lg bg-white text-purple-900"
                  >
                    <option value="USDT (TRC-20)">USDT (TRC-20)</option>
                    <option value="BTC">Bitcoin (BTC)</option>
                    <option value="ETH">Ethereum (ETH)</option>
                    <option value="TON">TON (Telegram)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-purple-900 mb-1">Blockchain TxID / Hash</label>
                  <input
                    type="text"
                    required
                    placeholder={cryptoCurrency === 'ETH' ? '0x... (66 chars)' : 'TxID or hash string'}
                    value={cryptoTxHash}
                    onChange={handleTxHashChange}
                    className={`w-full px-3 py-2 text-xs font-mono border rounded-lg bg-white text-purple-900 transition-colors ${
                      cryptoTxHash ? (txValidation.isValid ? 'border-emerald-500 ring-1 ring-emerald-500/20' : 'border-amber-400 ring-1 ring-amber-400/20') : 'border-purple-300'
                    }`}
                  />
                  {cryptoTxHash && (
                    <div className={`mt-1 flex items-center gap-1 text-[10px] font-medium ${txValidation.isValid ? 'text-emerald-700' : 'text-amber-700'}`}>
                      {txValidation.isValid ? <ShieldCheck className="w-3 h-3 shrink-0" /> : <AlertCircle className="w-3 h-3 shrink-0" />}
                      <span className="truncate">{txValidation.message}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <p className="text-[10px] text-purple-700">
                  Verified automatically via CryptoPay &amp; Web3 Gateway.
                </p>
                <button
                  type="button"
                  onClick={() => setShowQrModal(true)}
                  className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white font-bold text-[11px] rounded-lg shadow-2xs flex items-center gap-1.5 transition"
                >
                  <QrCode className="w-3.5 h-3.5" />
                  Generate Payment QR
                </button>
              </div>
            </div>
          )}

          {/* QR Code Modal Overlay */}
          {showQrModal && (
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl border border-purple-100 text-center space-y-4 animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                    <QrCode className="w-4 h-4 text-purple-600" /> Scan to Pay {cryptoCurrency}
                  </h4>
                  <button
                    type="button"
                    onClick={() => setShowQrModal(false)}
                    className="w-7 h-7 bg-slate-100 hover:bg-slate-200 rounded-full flex items-center justify-center text-slate-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex flex-col items-center justify-center">
                  <div className="bg-white p-2.5 rounded-xl shadow-xs border border-slate-100">
                    <img
                      src={qrCodeUrl}
                      alt="Payment QR Code"
                      className="w-44 h-44 object-contain"
                    />
                  </div>
                  <p className="text-xs font-bold text-slate-800 mt-3">
                    Amount: <span className="text-purple-600">${totalAmount.toFixed(2)} USD</span>
                  </p>
                  <p className="text-[10px] font-mono text-slate-500 mt-1 break-all px-2">
                    {currentWallet}
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(currentWallet);
                      setQrCopied(true);
                      setTimeout(() => setQrCopied(false), 2000);
                    }}
                    className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition"
                  >
                    {qrCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    {qrCopied ? 'Address Copied!' : 'Copy Wallet Address'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowQrModal(false)}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl transition"
                  >
                    Done
                  </button>
                </div>
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Shipping Address</label>
            <textarea
              required
              rows={2}
              placeholder="Full street address, city, state, zip"
              value={shippingAddress}
              onChange={(e) => setShippingAddress(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm"
            >
              Submit Order
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

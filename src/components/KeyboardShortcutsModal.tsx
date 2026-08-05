import React, { useEffect } from 'react';
import hotkeys from 'hotkeys-js';
import { NavigationTab } from '../types';
import { Command, X, Keyboard, ArrowRight, PlusCircle, LayoutDashboard, Package, ShoppingCart, Users, BarChart3, Settings, Webhook } from 'lucide-react';

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tab: NavigationTab) => void;
  onOpenAddProduct: () => void;
  onOpenAddOrder: () => void;
}

export const KeyboardShortcutsModal: React.FC<KeyboardShortcutsModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
  onOpenAddProduct,
  onOpenAddOrder
}) => {
  useEffect(() => {
    // Configure hotkeys
    hotkeys.filter = () => true; // Enable hotkeys inside input fields if needed, or default

    // Navigation Shortcuts
    hotkeys('1,g+d', (e) => { e.preventDefault(); onNavigate('dashboard'); });
    hotkeys('2,g+p', (e) => { e.preventDefault(); onNavigate('products'); });
    hotkeys('3,g+o', (e) => { e.preventDefault(); onNavigate('orders'); });
    hotkeys('4,g+c', (e) => { e.preventDefault(); onNavigate('customers'); });
    hotkeys('5,g+a', (e) => { e.preventDefault(); onNavigate('analytics'); });
    hotkeys('6,g+s', (e) => { e.preventDefault(); onNavigate('settings'); });
    hotkeys('7,g+w', (e) => { e.preventDefault(); onNavigate('webhooks'); });

    // Actions
    hotkeys('alt+p,n+p', (e) => { e.preventDefault(); onOpenAddProduct(); });
    hotkeys('alt+o,n+o', (e) => { e.preventDefault(); onOpenAddOrder(); });

    // Modal toggles
    hotkeys('shift+?,?', (e) => { e.preventDefault(); if (isOpen) onClose(); else hotkeys.trigger('?'); });
    hotkeys('esc', () => { onClose(); });

    return () => {
      hotkeys.unbind('1,g+d');
      hotkeys.unbind('2,g+p');
      hotkeys.unbind('3,g+o');
      hotkeys.unbind('4,g+c');
      hotkeys.unbind('5,g+a');
      hotkeys.unbind('6,g+s');
      hotkeys.unbind('7,g+w');
      hotkeys.unbind('alt+p,n+p');
      hotkeys.unbind('alt+o,n+o');
      hotkeys.unbind('shift+?,?');
      hotkeys.unbind('esc');
    };
  }, [isOpen, onNavigate, onOpenAddProduct, onOpenAddOrder, onClose]);

  if (!isOpen) return null;

  const shortcutGroups = [
    {
      title: 'Navigation Shortcuts',
      shortcuts: [
        { keys: ['1', 'or', 'g d'], label: 'Go to Dashboard', icon: LayoutDashboard },
        { keys: ['2', 'or', 'g p'], label: 'Go to Products Catalog', icon: Package },
        { keys: ['3', 'or', 'g o'], label: 'Go to Orders Fulfillment', icon: ShoppingCart },
        { keys: ['4', 'or', 'g c'], label: 'Go to Customers Hub', icon: Users },
        { keys: ['5', 'or', 'g a'], label: 'Go to Analytics Insights', icon: BarChart3 },
        { keys: ['6', 'or', 'g s'], label: 'Go to Store Settings', icon: Settings },
        { keys: ['7', 'or', 'g w'], label: 'Go to Webhooks Engine', icon: Webhook },
      ]
    },
    {
      title: 'Quick Actions',
      shortcuts: [
        { keys: ['Alt + P', 'or', 'n p'], label: 'Add New Product', icon: PlusCircle },
        { keys: ['Alt + O', 'or', 'n o'], label: 'Create Manual Order', icon: PlusCircle },
        { keys: ['Shift + ?'], label: 'Toggle Keyboard Shortcuts Modal', icon: Keyboard },
        { keys: ['Esc'], label: 'Close Active Drawer / Modal', icon: X }
      ]
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-xl w-full border border-slate-200 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600/30 border border-indigo-400/30 flex items-center justify-center">
              <Keyboard className="w-5 h-5 text-indigo-300" />
            </div>
            <div>
              <h3 className="font-display font-bold text-base">Global Keyboard Shortcuts</h3>
              <p className="text-xs text-slate-400">Boost seller workflow productivity with hotkeys</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {shortcutGroups.map((group, idx) => (
            <div key={idx} className="space-y-3">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-1.5">
                {group.title}
              </h4>
              <div className="grid grid-cols-1 gap-2">
                {group.shortcuts.map((sc, scIdx) => {
                  const Icon = sc.icon;
                  return (
                    <div
                      key={scIdx}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200/60 hover:bg-slate-100/80 transition"
                    >
                      <div className="flex items-center gap-2.5 text-xs font-semibold text-slate-800">
                        <Icon className="w-4 h-4 text-slate-500" />
                        <span>{sc.label}</span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        {sc.keys.map((k, kIdx) => (
                          <React.Fragment key={kIdx}>
                            {k === 'or' ? (
                              <span className="text-[10px] text-slate-400 font-sans">or</span>
                            ) : (
                              <kbd className="px-2 py-1 text-[11px] font-mono font-bold bg-white text-slate-700 rounded-md border border-slate-300 shadow-2xs">
                                {k}
                              </kbd>
                            )}
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-3.5 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span className="flex items-center gap-1.5">
            <Command className="w-3.5 h-3.5 text-indigo-600" /> Press <kbd className="px-1.5 py-0.5 bg-white border rounded text-[10px] font-mono font-bold text-slate-700">?</kbd> anytime to open this helper
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-900 text-white rounded-lg font-bold text-xs hover:bg-slate-800 transition"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};

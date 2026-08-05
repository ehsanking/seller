import React from 'react';
import { Users, Mail, Phone, ShoppingBag, DollarSign, Calendar, Search } from 'lucide-react';
import { Customer } from '../types';

interface CustomersViewProps {
  customers: Customer[];
  searchQuery: string;
}

export const CustomersView: React.FC<CustomersViewProps> = ({ customers, searchQuery }) => {
  const filteredCustomers = customers.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.phone.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-display font-bold text-base text-slate-900">Customer Roster</h3>
            <p className="text-xs text-slate-500">Track buyer lifetime value and order frequency</p>
          </div>
        </div>
        <div className="text-xs font-semibold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg">
          {customers.length} Total Customers
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredCustomers.map((c) => (
          <div key={c.id} className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-2xs hover:shadow-md transition space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-white flex items-center justify-center font-bold text-sm">
                  {c.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{c.name}</h4>
                  <span className="inline-block px-2 py-0.5 text-[10px] font-semibold bg-emerald-50 text-emerald-700 rounded border border-emerald-200">
                    Active Buyer
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-1.5 text-xs text-slate-600 border-t border-b border-slate-100 py-3">
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span>{c.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span>{c.phone}</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center pt-1">
              <div className="bg-slate-50 p-2 rounded-lg">
                <span className="block text-[10px] font-bold text-slate-400 uppercase">Total Orders</span>
                <span className="text-sm font-bold text-slate-900">{c.totalOrders}</span>
              </div>
              <div className="bg-slate-50 p-2 rounded-lg">
                <span className="block text-[10px] font-bold text-slate-400 uppercase">Lifetime Spend</span>
                <span className="text-sm font-bold text-emerald-600">${c.totalSpent.toFixed(2)}</span>
              </div>
              <div className="bg-slate-50 p-2 rounded-lg">
                <span className="block text-[10px] font-bold text-slate-400 uppercase">Last Order</span>
                <span className="text-xs font-semibold text-slate-700">{c.lastOrderDate}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

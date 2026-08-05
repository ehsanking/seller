import React, { useState, useEffect } from 'react';
import { 
  Users, Mail, Phone, ShoppingBag, DollarSign, Calendar, Search, History, 
  MessageSquareText, Kanban, CheckSquare, LifeBuoy, Plus, Tag, Building2, 
  Award, Clock, AlertCircle, CheckCircle2, ArrowRight, Filter, MoreVertical, Send, Check,
  X
} from 'lucide-react';
import { Customer, CrmDeal, CrmTask, CrmTicket, DealStage } from '../types';
import { CustomerActivityLog } from './CustomerActivityLog';

interface CustomersViewProps {
  customers: Customer[];
  searchQuery: string;
}

export const CustomersView: React.FC<CustomersViewProps> = ({ customers: initialCustomers, searchQuery }) => {
  const [activeCrmTab, setActiveCrmTab] = useState<'roster' | 'pipeline' | 'tasks' | 'helpdesk'>('roster');
  
  // Customers state
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [selectedSegment, setSelectedSegment] = useState<string>('all');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isActivityOpen, setIsActivityOpen] = useState(false);

  // Tag Manager State
  const [selectedCustomerForTags, setSelectedCustomerForTags] = useState<Customer | null>(null);
  const [editingTags, setEditingTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [isSavingTags, setIsSavingTags] = useState(false);
  const [tagError, setTagError] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // Calculate unique tags in system
  const allUniqueTags = Array.from(
    new Set(customers.flatMap(c => c.tags || []))
  ).filter(Boolean).sort();

  // CRM Deals state
  const [deals, setDeals] = useState<CrmDeal[]>([]);
  const [isAddDealOpen, setIsAddDealOpen] = useState(false);
  const [newDealTitle, setNewDealTitle] = useState('');
  const [newDealValue, setNewDealValue] = useState('1000');
  const [newDealCustomerId, setNewDealCustomerId] = useState(initialCustomers[0]?.id || '');
  const [newDealStage, setNewDealStage] = useState<DealStage>('lead');

  // CRM Tasks state
  const [tasks, setTasks] = useState<CrmTask[]>([]);
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDueDate, setNewTaskDueDate] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [newTaskCustomerId, setNewTaskCustomerId] = useState(initialCustomers[0]?.id || '');

  // CRM Tickets state
  const [tickets, setTickets] = useState<CrmTicket[]>([]);
  const [isAddTicketOpen, setIsAddTicketOpen] = useState(false);
  const [newTicketSubject, setNewTicketSubject] = useState('');
  const [newTicketCustomerId, setNewTicketCustomerId] = useState(initialCustomers[0]?.id || '');
  const [newTicketPriority, setNewTicketPriority] = useState<'low' | 'medium' | 'high' | 'urgent'>('medium');

  // Fetch CRM data on mount
  useEffect(() => {
    setCustomers(initialCustomers);
  }, [initialCustomers]);

  useEffect(() => {
    fetch('/api/crm/deals')
      .then(r => r.json())
      .then(data => setDeals(data))
      .catch(() => {});

    fetch('/api/crm/tasks')
      .then(r => r.json())
      .then(data => setTasks(data))
      .catch(() => {});

    fetch('/api/crm/tickets')
      .then(r => r.json())
      .then(data => setTickets(data))
      .catch(() => {});
  }, []);

  // Filtered customers
  const filteredCustomers = customers.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.company && c.company.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesSegment = selectedSegment === 'all' || c.segment === selectedSegment;
    const matchesTag = !selectedTag || (c.tags && c.tags.includes(selectedTag));
    
    return matchesSearch && matchesSegment && matchesTag;
  });

  // Deal handlers
  const handleCreateDeal = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/crm/deals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId: newDealCustomerId,
          title: newDealTitle,
          value: Number(newDealValue),
          stage: newDealStage,
          probability: newDealStage === 'won' ? 100 : newDealStage === 'negotiation' ? 80 : 50
        })
      });
      if (res.ok) {
        const created = await res.json();
        setDeals([...deals, created]);
        setIsAddDealOpen(false);
        setNewDealTitle('');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateDealStage = async (dealId: string, stage: DealStage) => {
    try {
      const res = await fetch(`/api/crm/deals/${dealId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stage })
      });
      if (res.ok) {
        const updated = await res.json();
        setDeals(deals.map(d => d.id === dealId ? updated : d));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Task handlers
  const handleToggleTask = async (taskId: string, completed: boolean) => {
    try {
      const res = await fetch(`/api/crm/tasks/${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: !completed })
      });
      if (res.ok) {
        const updated = await res.json();
        setTasks(tasks.map(t => t.id === taskId ? updated : t));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/crm/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId: newTaskCustomerId,
          title: newTaskTitle,
          dueDate: newTaskDueDate || new Date().toISOString().split('T')[0],
          priority: newTaskPriority
        })
      });
      if (res.ok) {
        const created = await res.json();
        setTasks([...tasks, created]);
        setIsAddTaskOpen(false);
        setNewTaskTitle('');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Ticket handlers
  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/crm/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId: newTicketCustomerId,
          subject: newTicketSubject,
          priority: newTicketPriority
        })
      });
      if (res.ok) {
        const created = await res.json();
        setTickets([created, ...tickets]);
        setIsAddTicketOpen(false);
        setNewTicketSubject('');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateTicketStatus = async (ticketId: string, status: 'open' | 'in_progress' | 'resolved' | 'closed') => {
    try {
      const res = await fetch(`/api/crm/tickets/${ticketId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        const updated = await res.json();
        setTickets(tickets.map(t => t.id === ticketId ? updated : t));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Tag management handlers
  const handleAddTag = (tagToAdd: string) => {
    const trimmed = tagToAdd.trim();
    if (!trimmed) return;
    if (trimmed.length > 25) {
      setTagError('Tag cannot be longer than 25 characters');
      return;
    }
    if (editingTags.some(t => t.toLowerCase() === trimmed.toLowerCase())) {
      setTagError('Tag already exists on this customer');
      return;
    }
    setEditingTags([...editingTags, trimmed]);
    setTagInput('');
    setTagError(null);
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setEditingTags(editingTags.filter(t => t !== tagToRemove));
    setTagError(null);
  };

  const handleToggleSuggestedTag = (tag: string) => {
    if (editingTags.includes(tag)) {
      handleRemoveTag(tag);
    } else {
      handleAddTag(tag);
    }
  };

  const handleSaveTags = async () => {
    if (!selectedCustomerForTags) return;
    setIsSavingTags(true);
    setTagError(null);
    try {
      const res = await fetch(`/api/customers/${selectedCustomerForTags.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tags: editingTags })
      });
      if (res.ok) {
        const updated = await res.json();
        setCustomers(customers.map(c => c.id === selectedCustomerForTags.id ? updated : c));
        setSelectedCustomerForTags(null);
      } else {
        setTagError('Failed to update tags on the server');
      }
    } catch (err) {
      console.error(err);
      setTagError('An error occurred while saving tags');
    } finally {
      setIsSavingTags(false);
    }
  };

  // Calculations for CRM Metrics
  const totalPipelineValue = deals.filter(d => d.stage !== 'lost' && d.stage !== 'won').reduce((sum, d) => sum + d.value, 0);
  const wonDealsValue = deals.filter(d => d.stage === 'won').reduce((sum, d) => sum + d.value, 0);
  const openTicketsCount = tickets.filter(t => t.status === 'open' || t.status === 'in_progress').length;
  const pendingTasksCount = tasks.filter(t => !t.completed).length;

  const dealStages: { key: DealStage; label: string; color: string }[] = [
    { key: 'lead', label: 'Lead / Prospect', color: 'bg-slate-100 text-slate-700 border-slate-200' },
    { key: 'qualified', label: 'Qualified', color: 'bg-blue-50 text-blue-700 border-blue-200' },
    { key: 'proposal', label: 'Proposal Sent', color: 'bg-amber-50 text-amber-700 border-amber-200' },
    { key: 'negotiation', label: 'Negotiation', color: 'bg-purple-50 text-purple-700 border-purple-200' },
    { key: 'won', label: 'Won 🎉', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    { key: 'lost', label: 'Lost', color: 'bg-rose-50 text-rose-700 border-rose-200' },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* CRM Header & KPI Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-md">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-display font-bold text-lg text-slate-900">Enterprise CRM Suite</h3>
            <p className="text-xs text-slate-500">Manage customer relationships, sales pipelines, follow-up tasks, and helpdesk tickets</p>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full md:w-auto">
          <div className="bg-slate-50 px-3.5 py-2 rounded-xl border border-slate-100 text-center">
            <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Pipeline</span>
            <span className="text-sm font-bold text-indigo-600">${totalPipelineValue.toLocaleString()}</span>
          </div>
          <div className="bg-slate-50 px-3.5 py-2 rounded-xl border border-slate-100 text-center">
            <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Won Revenue</span>
            <span className="text-sm font-bold text-emerald-600">${wonDealsValue.toLocaleString()}</span>
          </div>
          <div className="bg-slate-50 px-3.5 py-2 rounded-xl border border-slate-100 text-center">
            <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Open Tickets</span>
            <span className="text-sm font-bold text-amber-600">{openTicketsCount}</span>
          </div>
          <div className="bg-slate-50 px-3.5 py-2 rounded-xl border border-slate-100 text-center">
            <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Pending Tasks</span>
            <span className="text-sm font-bold text-rose-600">{pendingTasksCount}</span>
          </div>
        </div>
      </div>

      {/* CRM Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-px overflow-x-auto">
        <button
          onClick={() => setActiveCrmTab('roster')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-t-xl transition border-b-2 cursor-pointer ${
            activeCrmTab === 'roster'
              ? 'border-indigo-600 text-indigo-600 bg-white shadow-2xs'
              : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Customer Directory ({customers.length})</span>
        </button>

        <button
          onClick={() => setActiveCrmTab('pipeline')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-t-xl transition border-b-2 cursor-pointer ${
            activeCrmTab === 'pipeline'
              ? 'border-indigo-600 text-indigo-600 bg-white shadow-2xs'
              : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Kanban className="w-4 h-4" />
          <span>Sales Pipeline ({deals.length})</span>
        </button>

        <button
          onClick={() => setActiveCrmTab('tasks')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-t-xl transition border-b-2 cursor-pointer ${
            activeCrmTab === 'tasks'
              ? 'border-indigo-600 text-indigo-600 bg-white shadow-2xs'
              : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <CheckSquare className="w-4 h-4" />
          <span>Follow-up Tasks ({pendingTasksCount} pending)</span>
        </button>

        <button
          onClick={() => setActiveCrmTab('helpdesk')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-t-xl transition border-b-2 cursor-pointer ${
            activeCrmTab === 'helpdesk'
              ? 'border-indigo-600 text-indigo-600 bg-white shadow-2xs'
              : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <LifeBuoy className="w-4 h-4" />
          <span>Support Helpdesk ({openTicketsCount} open)</span>
        </button>
      </div>

      {/* TAB 1: CUSTOMER DIRECTORY & 360 PROFILES */}
      {activeCrmTab === 'roster' && (
        <div className="space-y-4">
          {/* Segment Filter Chips */}
          <div className="flex items-center justify-between flex-wrap gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200/50 shadow-2xs">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold text-slate-500">Filter Segment:</span>
                {[
                  { key: 'all', label: 'All Customers' },
                  { key: 'vip', label: 'VIP Buyers ⭐' },
                  { key: 'active', label: 'Active 🟢' },
                  { key: 'lead', label: 'Leads 🎯' },
                  { key: 'at_risk', label: 'At Risk ⚠️' }
                ].map(seg => (
                  <button
                    key={seg.key}
                    onClick={() => setSelectedSegment(seg.key)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                      selectedSegment === seg.key
                        ? 'bg-indigo-600 text-white shadow-2xs'
                        : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {seg.label}
                  </button>
                ))}
              </div>

              {allUniqueTags.length > 0 && (
                <div className="flex items-center gap-2 border-r border-slate-200/80 pr-4 pl-2">
                  <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                    <Tag className="w-3.5 h-3.5 text-slate-400" />
                    Tag Filter:
                  </span>
                  <select
                    value={selectedTag || ''}
                    onChange={(e) => setSelectedTag(e.target.value || null)}
                    className="text-xs bg-white border border-slate-200 rounded-lg px-2 py-1 font-bold text-slate-700 outline-none focus:border-indigo-500 cursor-pointer"
                  >
                    <option value="">All Custom Tags ({allUniqueTags.length})</option>
                    {allUniqueTags.map(tag => (
                      <option key={tag} value={tag}>#{tag}</option>
                    ))}
                  </select>
                  {selectedTag && (
                    <button
                      onClick={() => setSelectedTag(null)}
                      className="text-[10px] text-rose-500 hover:underline font-extrabold cursor-pointer"
                    >
                      Clear Filter
                    </button>
                  )}
                </div>
              )}
            </div>

            <div className="text-xs text-slate-500 bg-white px-2.5 py-1.5 rounded-lg border border-slate-200/60 font-medium">
              Showing <span className="font-bold text-slate-800">{filteredCustomers.length}</span> customers
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredCustomers.map((c) => (
              <div key={c.id} className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-md transition space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                      {c.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-slate-900 text-sm">{c.name}</h4>
                        <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full uppercase tracking-wider ${
                          c.segment === 'vip' ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                          c.segment === 'lead' ? 'bg-blue-100 text-blue-800 border border-blue-200' :
                          'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        }`}>
                          {c.segment || 'Active'}
                        </span>
                      </div>
                      {c.company && (
                        <span className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                          <Building2 className="w-3 h-3" />
                          {c.company}
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedCustomer(c);
                      setIsActivityOpen(true);
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200/60 transition shadow-2xs cursor-pointer"
                  >
                    <History className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Customer 360</span>
                  </button>
                </div>

                <div className="space-y-1.5 text-xs text-slate-600 border-t border-b border-slate-100 py-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      <span>{c.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <span>{c.phone}</span>
                    </div>
                  </div>
                  {c.notes && (
                    <p className="text-slate-500 italic text-[11px] bg-slate-50 p-2 rounded-lg mt-1">
                      "{c.notes}"
                    </p>
                  )}
                </div>

                {/* Tags & Lead Score */}
                <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100/60">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {c.tags && c.tags.length > 0 ? (
                      c.tags.map((tag, idx) => (
                        <span key={idx} className="px-2 py-0.5 bg-slate-50 text-indigo-600 rounded-md text-[10px] font-bold border border-indigo-100/80">
                          #{tag}
                        </span>
                      ))
                    ) : (
                      <span className="text-[10px] text-slate-400 italic">No tags</span>
                    )}
                    <button
                      onClick={() => {
                        setSelectedCustomerForTags(c);
                        setEditingTags(c.tags || []);
                        setTagInput('');
                        setTagError(null);
                      }}
                      className="p-1 rounded-md text-slate-400 hover:bg-indigo-50 hover:text-indigo-600 transition cursor-pointer flex items-center gap-0.5"
                      title="Manage Tags"
                    >
                      <Tag className="w-3.5 h-3.5" />
                      <span className="text-[9px] font-bold">Tags</span>
                    </button>
                  </div>
                  <div className="flex items-center gap-1 text-indigo-600 font-bold bg-indigo-50 px-2.5 py-1 rounded-lg shrink-0">
                    <Award className="w-3.5 h-3.5" />
                    <span>Lead Score: {c.leadScore || 75}</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center pt-1 border-t border-slate-100">
                  <div className="bg-slate-50 p-2 rounded-lg">
                    <span className="block text-[10px] font-bold text-slate-400 uppercase">Orders</span>
                    <span className="text-sm font-bold text-slate-900">{c.totalOrders}</span>
                  </div>
                  <div className="bg-slate-50 p-2 rounded-lg">
                    <span className="block text-[10px] font-bold text-slate-400 uppercase">Spend</span>
                    <span className="text-sm font-bold text-emerald-600">${c.totalSpent.toFixed(2)}</span>
                  </div>
                  <div className="bg-slate-50 p-2 rounded-lg">
                    <span className="block text-[10px] font-bold text-slate-400 uppercase">Agent</span>
                    <span className="text-xs font-semibold text-slate-700 truncate">{c.assignedAgent || 'Ehsan'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: SALES PIPELINE (DEALS KANBAN) */}
      {activeCrmTab === 'pipeline' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-display font-bold text-slate-900 text-sm">Sales Pipeline Kanban</h4>
              <p className="text-xs text-slate-500">Drag or update deals across stages to track revenue velocity</p>
            </div>
            <button
              onClick={() => setIsAddDealOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition shadow-sm cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>New Deal</span>
            </button>
          </div>

          {/* Kanban Columns */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 overflow-x-auto pb-4">
            {dealStages.map(stage => {
              const stageDeals = deals.filter(d => d.stage === stage.key);
              const stageTotal = stageDeals.reduce((sum, d) => sum + d.value, 0);

              return (
                <div key={stage.key} className="bg-slate-50/80 rounded-2xl p-3 border border-slate-200 flex flex-col min-w-[220px]">
                  <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-200">
                    <span className={`px-2 py-0.5 rounded-lg text-xs font-bold border ${stage.color}`}>
                      {stage.label}
                    </span>
                    <span className="text-xs font-bold text-slate-700">${stageTotal.toLocaleString()}</span>
                  </div>

                  <div className="space-y-3 flex-1">
                    {stageDeals.map(deal => (
                      <div key={deal.id} className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs space-y-2 hover:shadow-md transition">
                        <h5 className="font-bold text-slate-900 text-xs">{deal.title}</h5>
                        <div className="flex items-center justify-between text-[11px] text-slate-500">
                          <span>{deal.customerName}</span>
                          <span className="font-bold text-emerald-600">${deal.value.toLocaleString()}</span>
                        </div>
                        
                        {/* Stage switcher */}
                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                          <span className="text-[10px] text-slate-400">Move:</span>
                          <select
                            value={deal.stage}
                            onChange={(e) => handleUpdateDealStage(deal.id, e.target.value as DealStage)}
                            className="text-[10px] bg-slate-100 border border-slate-200 rounded px-1.5 py-0.5 font-semibold text-slate-700 focus:outline-hidden cursor-pointer"
                          >
                            <option value="lead">Lead</option>
                            <option value="qualified">Qualified</option>
                            <option value="proposal">Proposal</option>
                            <option value="negotiation">Negotiation</option>
                            <option value="won">Won 🎉</option>
                            <option value="lost">Lost</option>
                          </select>
                        </div>
                      </div>
                    ))}
                    {stageDeals.length === 0 && (
                      <div className="h-24 flex items-center justify-center border border-dashed border-slate-200 rounded-xl text-[11px] text-slate-400 italic">
                        No deals in stage
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: FOLLOW-UP TASKS */}
      {activeCrmTab === 'tasks' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-display font-bold text-slate-900 text-sm">Sales & Success Follow-up Tasks</h4>
              <p className="text-xs text-slate-500">Never miss a client call, email, or SLA renewal</p>
            </div>
            <button
              onClick={() => setIsAddTaskOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition shadow-sm cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Task</span>
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-2xs">
            <div className="divide-y divide-slate-100">
              {tasks.map(task => (
                <div key={task.id} className={`p-4 flex items-center justify-between hover:bg-slate-50/60 transition ${task.completed ? 'bg-slate-50/40 opacity-75' : ''}`}>
                  <div className="flex items-center gap-3.5">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => handleToggleTask(task.id, task.completed)}
                      className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500 cursor-pointer"
                    />
                    <div>
                      <h5 className={`font-bold text-xs text-slate-900 ${task.completed ? 'line-through text-slate-400' : ''}`}>
                        {task.title}
                      </h5>
                      <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-0.5">
                        {task.customerName && <span className="font-semibold text-indigo-600">👤 {task.customerName}</span>}
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-400" />
                          Due: {task.dueDate}
                        </span>
                        <span className={`px-2 py-0.5 text-[9px] font-bold rounded uppercase ${
                          task.priority === 'high' ? 'bg-rose-100 text-rose-800' :
                          task.priority === 'medium' ? 'bg-amber-100 text-amber-800' :
                          'bg-slate-100 text-slate-700'
                        }`}>
                          {task.priority}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="text-xs font-semibold text-slate-600 bg-slate-100 px-3 py-1 rounded-lg">
                    Assigned: {task.assignedTo}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: SUPPORT HELPDESK TICKETS */}
      {activeCrmTab === 'helpdesk' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-display font-bold text-slate-900 text-sm">Customer Support Helpdesk</h4>
              <p className="text-xs text-slate-500">Track and resolve customer inquiries and support tickets</p>
            </div>
            <button
              onClick={() => setIsAddTicketOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition shadow-sm cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Create Ticket</span>
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-2xs">
            <div className="divide-y divide-slate-100">
              {tickets.map(ticket => (
                <div key={ticket.id} className="p-4 flex items-center justify-between hover:bg-slate-50/60 transition">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono text-xs font-bold text-indigo-600">{ticket.id}</span>
                      <h5 className="font-bold text-xs text-slate-900">{ticket.subject}</h5>
                      <span className={`px-2 py-0.5 text-[9px] font-bold rounded uppercase ${
                        ticket.priority === 'urgent' ? 'bg-rose-100 text-rose-800' :
                        ticket.priority === 'high' ? 'bg-amber-100 text-amber-800' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {ticket.priority}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-[11px] text-slate-500">
                      <span className="font-semibold text-slate-700">Customer: {ticket.customerName}</span>
                      <span>Created: {new Date(ticket.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <select
                      value={ticket.status}
                      onChange={(e) => handleUpdateTicketStatus(ticket.id, e.target.value as any)}
                      className={`text-xs font-bold px-3 py-1.5 rounded-xl border cursor-pointer ${
                        ticket.status === 'resolved' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                        ticket.status === 'in_progress' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                        ticket.status === 'closed' ? 'bg-slate-100 text-slate-600 border-slate-200' :
                        'bg-amber-50 text-amber-700 border-amber-200'
                      }`}
                    >
                      <option value="open">Open 🟠</option>
                      <option value="in_progress">In Progress 🔵</option>
                      <option value="resolved">Resolved 🟢</option>
                      <option value="closed">Closed ⚫</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Customer 360 Activity Log Drawer */}
      <CustomerActivityLog
        customer={selectedCustomer}
        isOpen={isActivityOpen}
        onClose={() => setIsActivityOpen(false)}
      />

      {/* MODAL: MANAGE TAGS */}
      {selectedCustomerForTags && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-display font-bold text-base text-slate-900 flex items-center gap-2">
                <Tag className="w-4.5 h-4.5 text-indigo-600" />
                <span>Manage Customer Tags</span>
              </h3>
              <button 
                onClick={() => setSelectedCustomerForTags(null)}
                className="text-slate-400 hover:text-slate-600 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-1">
              <p className="text-sm font-bold text-slate-800">{selectedCustomerForTags.name}</p>
              <p className="text-xs text-slate-500">{selectedCustomerForTags.email} • {selectedCustomerForTags.company || 'No Company'}</p>
            </div>

            {tagError && (
              <div className="bg-rose-50 text-rose-700 text-xs p-2.5 rounded-xl border border-rose-100 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
                <span>{tagError}</span>
              </div>
            )}

            {/* Active Tags */}
            <div className="space-y-2">
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Active Tags ({editingTags.length})</span>
              <div className="min-h-12 p-3 bg-slate-50 rounded-xl border border-slate-200/60 flex flex-wrap gap-1.5 items-center">
                {editingTags.length > 0 ? (
                  editingTags.map((tag) => (
                    <span 
                      key={tag} 
                      className="inline-flex items-center gap-1 pl-1.5 pr-1 py-1 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-bold border border-indigo-100"
                    >
                      <span>#{tag}</span>
                      <button 
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="p-0.5 rounded-md hover:bg-indigo-100 text-indigo-500 hover:text-indigo-800 transition cursor-pointer"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-slate-400 italic">No tags assigned. Type below or select suggestions to add tags.</span>
                )}
              </div>
            </div>

            {/* Add Tag Input */}
            <div className="space-y-2">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Add Custom Tag</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => {
                    setTagInput(e.target.value);
                    if (tagError) setTagError(null);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTag(tagInput);
                    }
                  }}
                  placeholder="Type tag name and press Enter..."
                  className="flex-1 text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-semibold"
                />
                <button
                  type="button"
                  onClick={() => handleAddTag(tagInput)}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition cursor-pointer"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Suggestions / Unique Tags in the System */}
            {allUniqueTags.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Suggested / Other Existing Tags</span>
                <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto pr-1">
                  {allUniqueTags.map((tag) => {
                    const isSelected = editingTags.includes(tag);
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => handleToggleSuggestedTag(tag)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer border ${
                          isSelected 
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-2xs' 
                            : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        #{tag}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setSelectedCustomerForTags(null)}
                className="px-4 py-2 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isSavingTags}
                onClick={handleSaveTags}
                className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition shadow-sm cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
              >
                {isSavingTags ? (
                  <span>Saving...</span>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Save Changes</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: NEW DEAL */}
      {isAddDealOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200 space-y-4">
            <h3 className="font-display font-bold text-base text-slate-900">Add New Sales Deal</h3>
            <form onSubmit={handleCreateDeal} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Deal Title</label>
                <input
                  type="text"
                  required
                  value={newDealTitle}
                  onChange={(e) => setNewDealTitle(e.target.value)}
                  placeholder="e.g. Enterprise License Expansion"
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Customer</label>
                <select
                  value={newDealCustomerId}
                  onChange={(e) => setNewDealCustomerId(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                >
                  {customers.map(c => (
                    <option key={c.id} value={c.id}>{c.name} ({c.company || c.email})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Value ($)</label>
                  <input
                    type="number"
                    required
                    value={newDealValue}
                    onChange={(e) => setNewDealValue(e.target.value)}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Stage</label>
                  <select
                    value={newDealStage}
                    onChange={(e) => setNewDealStage(e.target.value as DealStage)}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="lead">Lead</option>
                    <option value="qualified">Qualified</option>
                    <option value="proposal">Proposal</option>
                    <option value="negotiation">Negotiation</option>
                    <option value="won">Won</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddDealOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition shadow-sm cursor-pointer"
                >
                  Create Deal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: NEW TASK */}
      {isAddTaskOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200 space-y-4">
            <h3 className="font-display font-bold text-base text-slate-900">Create Follow-up Task</h3>
            <form onSubmit={handleCreateTask} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Task Description</label>
                <input
                  type="text"
                  required
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  placeholder="e.g. Call client regarding contract renewal"
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Customer</label>
                <select
                  value={newTaskCustomerId}
                  onChange={(e) => setNewTaskCustomerId(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                >
                  {customers.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Due Date</label>
                  <input
                    type="date"
                    value={newTaskDueDate}
                    onChange={(e) => setNewTaskDueDate(e.target.value)}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Priority</label>
                  <select
                    value={newTaskPriority}
                    onChange={(e) => setNewTaskPriority(e.target.value as any)}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddTaskOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition shadow-sm cursor-pointer"
                >
                  Add Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: NEW TICKET */}
      {isAddTicketOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200 space-y-4">
            <h3 className="font-display font-bold text-base text-slate-900">Create Support Ticket</h3>
            <form onSubmit={handleCreateTicket} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Subject / Issue Summary</label>
                <input
                  type="text"
                  required
                  value={newTicketSubject}
                  onChange={(e) => setNewTicketSubject(e.target.value)}
                  placeholder="e.g. Issue connecting payment webhook"
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Customer</label>
                <select
                  value={newTicketCustomerId}
                  onChange={(e) => setNewTicketCustomerId(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                >
                  {customers.map(c => (
                    <option key={c.id} value={c.id}>{c.name} ({c.email})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Priority</label>
                <select
                  value={newTicketPriority}
                  onChange={(e) => setNewTicketPriority(e.target.value as any)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddTicketOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition shadow-sm cursor-pointer"
                >
                  Create Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

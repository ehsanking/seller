import React, { useState } from 'react';
import { StoreTemplate, Product } from '../types';
import { TemplateCssEditorModal } from './TemplateCssEditorModal';
import { 
  Palette, 
  Upload, 
  CheckCircle2, 
  ExternalLink, 
  Code2, 
  Layers, 
  Sparkles, 
  Trash2, 
  Plus, 
  X, 
  Eye, 
  Globe, 
  Smartphone, 
  Monitor, 
  ShoppingCart, 
  Star, 
  Zap, 
  Github, 
  Terminal,
  Check
} from 'lucide-react';

interface TemplatesViewProps {
  templates: StoreTemplate[];
  products: Product[];
  onActivateTemplate: (id: string) => void;
  onUploadTemplate: (templateData: Partial<StoreTemplate>) => Promise<void>;
  onDeleteTemplate: (id: string) => void;
}

export function TemplatesView({
  templates,
  products,
  onActivateTemplate,
  onUploadTemplate,
  onDeleteTemplate
}: TemplatesViewProps) {
  const [selectedFramework, setSelectedFramework] = useState<string>('all');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [previewTemplate, setPreviewTemplate] = useState<StoreTemplate | null>(null);
  const [cssEditingTemplate, setCssEditingTemplate] = useState<StoreTemplate | null>(null);
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');

  // Upload Form State
  const [uploadForm, setUploadForm] = useState({
    name: '',
    slug: '',
    description: '',
    framework: 'React' as StoreTemplate['framework'],
    author: 'EHSANKiNG',
    version: '1.0.0',
    previewImage: '',
    repoUrl: '',
    demoUrl: '',
    featuresStr: 'Vite HMR, Responsive Layout, REST API Hook'
  });
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredTemplates = templates.filter(tmpl => {
    if (selectedFramework === 'all') return true;
    if (selectedFramework === 'custom') return tmpl.isCustom;
    return tmpl.framework.toLowerCase() === selectedFramework.toLowerCase();
  });

  const activeTemplate = templates.find(t => t.isActive);

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploadError(null);

    if (!uploadForm.name.trim()) {
      setUploadError('Template title is required');
      return;
    }

    const autoSlug = uploadForm.slug.trim() || uploadForm.name.toLowerCase().replace(/[^a-z0-9]/g, '-');

    try {
      setIsSubmitting(true);
      await onUploadTemplate({
        name: uploadForm.name,
        slug: autoSlug,
        description: uploadForm.description || 'Custom developer template for SELLER Headless Engine',
        framework: uploadForm.framework,
        author: uploadForm.author || 'EHSANKiNG',
        version: uploadForm.version || '1.0.0',
        previewImage: uploadForm.previewImage || 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=600&q=80',
        repoUrl: uploadForm.repoUrl,
        demoUrl: uploadForm.demoUrl,
        features: uploadForm.featuresStr.split(',').map(s => s.trim()).filter(Boolean)
      });

      setIsUploadModalOpen(false);
      setUploadForm({
        name: '',
        slug: '',
        description: '',
        framework: 'React',
        author: 'EHSANKiNG',
        version: '1.0.0',
        previewImage: '',
        repoUrl: '',
        demoUrl: '',
        featuresStr: 'Vite HMR, Responsive Layout, REST API Hook'
      });
    } catch (err: any) {
      setUploadError(err.message || 'Failed to upload custom template');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getFrameworkBadgeColor = (fw: string) => {
    switch (fw.toLowerCase()) {
      case 'react':
        return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30';
      case 'vue':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'bootstrap 5':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
      case 'next.js':
        return 'bg-slate-100 text-slate-900 border-slate-300 dark:bg-slate-800 dark:text-slate-100 dark:border-slate-700';
      default:
        return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30';
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Banner / Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 p-8 border border-slate-800 shadow-2xl">
        <div className="absolute right-0 top-0 opacity-10 pointer-events-none transform translate-x-12 -translate-y-6">
          <Palette className="w-96 h-96 text-indigo-400" />
        </div>

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              Decoupled Storefront Engine
            </span>
            <span className="text-xs text-slate-400 font-mono">
              Maintainer: <strong className="text-slate-200">EHSANKiNG</strong>
            </span>
          </div>

          <h1 className="text-3xl font-extrabold text-white tracking-tight sm:text-4xl">
            Storefront Templates & Custom UI Hub
          </h1>

          <p className="text-slate-300 text-sm leading-relaxed">
            Choose from officially supported storefront architectures or upload your custom theme. 
            SELLER Core's RESTful endpoints sync seamlessly with <strong>React, Vue 3, Bootstrap 5, Next.js 14</strong>, and any custom web or mobile frontend.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm transition-all shadow-lg shadow-indigo-600/30 hover:scale-[1.02] active:scale-[0.98]"
            >
              <Upload className="w-4 h-4" />
              Upload Custom Storefront Template
            </button>

            {activeTemplate && (
              <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800/80 border border-slate-700/80 text-slate-200 text-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Active Theme: <strong className="text-white font-semibold">{activeTemplate.name}</strong>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Filter Tabs & Counter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex flex-wrap items-center gap-2">
          {[
            { id: 'all', label: 'All Frameworks' },
            { id: 'react', label: 'React' },
            { id: 'vue', label: 'Vue 3' },
            { id: 'bootstrap 5', label: 'Bootstrap 5' },
            { id: 'next.js', label: 'Next.js' },
            { id: 'custom', label: 'Custom Uploads' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setSelectedFramework(tab.id)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                selectedFramework === tab.id
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-800/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <span className="text-xs text-slate-400">
          Showing <strong className="text-slate-200">{filteredTemplates.length}</strong> storefront templates
        </span>
      </div>

      {/* Template Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {filteredTemplates.map(tmpl => (
          <div
            key={tmpl.id}
            className={`group relative rounded-2xl bg-slate-900 border transition-all duration-300 flex flex-col overflow-hidden ${
              tmpl.isActive
                ? 'border-indigo-500 shadow-xl shadow-indigo-950/40 ring-1 ring-indigo-500/50'
                : 'border-slate-800 hover:border-slate-700 hover:shadow-lg'
            }`}
          >
            {/* Active Ribbon */}
            {tmpl.isActive && (
              <div className="absolute top-3 right-3 z-20 px-3 py-1 rounded-full bg-indigo-600 text-white text-[11px] font-bold shadow-lg flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                ACTIVE STOREFRONT
              </div>
            )}

            {/* Thumbnail Preview Image */}
            <div className="relative h-48 w-full overflow-hidden bg-slate-950">
              <img
                src={tmpl.previewImage}
                alt={tmpl.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-90 group-hover:opacity-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/30 to-transparent" />

              <div className="absolute bottom-3 left-3 flex items-center gap-2">
                <span className={`px-2.5 py-1 rounded-md text-[11px] font-semibold border ${getFrameworkBadgeColor(tmpl.framework)}`}>
                  {tmpl.framework}
                </span>
                <span className="px-2.5 py-1 rounded-md text-[11px] font-mono bg-slate-950/80 text-slate-300 border border-slate-800">
                  v{tmpl.version}
                </span>
              </div>
            </div>

            {/* Card Content */}
            <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-white group-hover:text-indigo-400 transition-colors">
                    {tmpl.name}
                  </h3>
                  {tmpl.isCustom && (
                    <span className="text-[10px] uppercase font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded">
                      Custom Theme
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                  {tmpl.description}
                </p>

                <div className="pt-2 flex flex-wrap gap-1.5">
                  {tmpl.features?.map((feat, idx) => (
                    <span key={idx} className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                      • {feat}
                    </span>
                  ))}
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPreviewTemplate(tmpl)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5 text-indigo-400" />
                    Preview Demo
                  </button>

                  <button
                    onClick={() => setCssEditingTemplate(tmpl)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-950/80 hover:bg-indigo-900 border border-indigo-700/50 text-indigo-300 text-xs font-semibold transition-colors cursor-pointer"
                    title="Live Code Editor for CSS Variables"
                  >
                    <Code2 className="w-3.5 h-3.5" />
                    <span>Edit CSS</span>
                  </button>

                  {tmpl.repoUrl && (
                    <a
                      href={tmpl.repoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800/60 hover:bg-slate-800 text-slate-400 hover:text-slate-200 text-xs transition-colors"
                    >
                      <Github className="w-3.5 h-3.5" />
                      Repo
                    </a>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {tmpl.isCustom && (
                    <button
                      onClick={() => onDeleteTemplate(tmpl.id)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                      title="Delete Custom Template"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}

                  {!tmpl.isActive ? (
                    <button
                      onClick={() => onActivateTemplate(tmpl.id)}
                      className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all shadow-md shadow-indigo-600/20"
                    >
                      Set Active
                    </button>
                  ) : (
                    <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" />
                      In Use
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Upload Custom Template Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                  <Upload className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Upload Custom Storefront Template</h2>
                  <p className="text-xs text-slate-400">Register your custom React, Vue, Bootstrap, or Next.js storefront theme</p>
                </div>
              </div>
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
              {uploadError && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
                  {uploadError}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Template Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Cyberpunk Dark Storefront"
                    value={uploadForm.name}
                    onChange={e => setUploadForm({ ...uploadForm, name: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Framework Stack</label>
                  <select
                    value={uploadForm.framework}
                    onChange={e => setUploadForm({ ...uploadForm, framework: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="React">React 18 + Vite</option>
                    <option value="Vue">Vue 3 + Pinia</option>
                    <option value="Bootstrap 5">Bootstrap 5 HTML</option>
                    <option value="Next.js">Next.js 14 App Router</option>
                    <option value="HTML5">Vanilla JS / HTML5</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="Describe your theme layout, component features, and target store niche..."
                  value={uploadForm.description}
                  onChange={e => setUploadForm({ ...uploadForm, description: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Author / Maintainer</label>
                  <input
                    type="text"
                    placeholder="EHSANKiNG"
                    value={uploadForm.author}
                    onChange={e => setUploadForm({ ...uploadForm, author: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Version</label>
                  <input
                    type="text"
                    placeholder="1.0.0"
                    value={uploadForm.version}
                    onChange={e => setUploadForm({ ...uploadForm, version: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Preview Thumbnail Image URL</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/photo-..."
                  value={uploadForm.previewImage}
                  onChange={e => setUploadForm({ ...uploadForm, previewImage: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">GitHub Repository URL (Optional)</label>
                  <input
                    type="url"
                    placeholder="https://github.com/username/storefront"
                    value={uploadForm.repoUrl}
                    onChange={e => setUploadForm({ ...uploadForm, repoUrl: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Live Demo Link (Optional)</label>
                  <input
                    type="url"
                    placeholder="https://store.example.com"
                    value={uploadForm.demoUrl}
                    onChange={e => setUploadForm({ ...uploadForm, demoUrl: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Key Features (Comma separated)</label>
                <input
                  type="text"
                  placeholder="Fast HMR, Cart Drawer, Tailored CSS, Mobile Responsive"
                  value={uploadForm.featuresStr}
                  onChange={e => setUploadForm({ ...uploadForm, featuresStr: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all shadow-md shadow-indigo-600/30 flex items-center gap-2"
                >
                  {isSubmitting && <span className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />}
                  Register Template
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Live Sandbox Preview Modal */}
      {previewTemplate && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-lg flex flex-col p-4 sm:p-6">
          {/* Modal Top Bar */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <span className={`px-2.5 py-1 rounded text-xs font-bold border ${getFrameworkBadgeColor(previewTemplate.framework)}`}>
                {previewTemplate.framework}
              </span>
              <div>
                <h3 className="text-base font-bold text-white">{previewTemplate.name}</h3>
                <p className="text-xs text-slate-400">Live Sandbox Preview • Connected to SELLER Headless REST API</p>
              </div>
            </div>

            {/* Device Switcher Controls */}
            <div className="flex items-center gap-3">
              <div className="bg-slate-900 border border-slate-800 rounded-lg p-1 flex items-center gap-1">
                <button
                  onClick={() => setPreviewDevice('desktop')}
                  className={`p-1.5 rounded-md text-xs flex items-center gap-1 transition-colors ${
                    previewDevice === 'desktop' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Monitor className="w-3.5 h-3.5" />
                  Desktop
                </button>
                <button
                  onClick={() => setPreviewDevice('mobile')}
                  className={`p-1.5 rounded-md text-xs flex items-center gap-1 transition-colors ${
                    previewDevice === 'mobile' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  Mobile
                </button>
              </div>

              <button
                onClick={() => setPreviewTemplate(null)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Sandbox Canvas */}
          <div className="flex-1 overflow-y-auto py-6 flex justify-center items-start">
            <div
              className={`transition-all duration-300 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden ${
                previewDevice === 'mobile' ? 'w-[380px] min-h-[680px]' : 'w-full max-w-5xl min-h-[600px]'
              }`}
            >
              {/* Simulated Storefront Header */}
              <div className="bg-slate-900 text-white p-4 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-indigo-500" />
                  <span className="font-extrabold text-sm tracking-wider uppercase">
                    SELLER <span className="text-indigo-400">{previewTemplate.framework} Store</span>
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <span className="bg-slate-800 px-2.5 py-1 rounded-full text-slate-300">
                    Cart (3)
                  </span>
                </div>
              </div>

              {/* Simulated Storefront Hero Banner */}
              <div className="p-8 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white text-center space-y-3">
                <span className="text-[10px] font-mono uppercase bg-indigo-500/20 text-indigo-300 px-3 py-1 rounded-full border border-indigo-500/30">
                  Powered by SELLER Core API (Laravel 11)
                </span>
                <h2 className="text-2xl font-bold tracking-tight">Enterprise Headless Shopping Experience</h2>
                <p className="text-xs text-slate-300 max-w-lg mx-auto">
                  This preview fetches live product data directly from <code>/api/products</code>.
                </p>
              </div>

              {/* Live Products Grid */}
              <div className="p-6">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
                  Live Catalog Stream ({products.length} Products)
                </h3>

                <div className={`grid gap-4 ${previewDevice === 'mobile' ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3'}`}>
                  {products.map(p => (
                    <div key={p.id} className="border border-slate-200 dark:border-slate-800 rounded-xl p-3 flex flex-col justify-between space-y-2 bg-slate-50 dark:bg-slate-900/50">
                      <div className="h-28 rounded-lg bg-slate-200 dark:bg-slate-800 overflow-hidden">
                        <img src={p.image} alt={p.title} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <span className="text-[10px] text-indigo-500 font-semibold uppercase">{p.category}</span>
                        <h4 className="text-xs font-bold truncate text-slate-800 dark:text-slate-100">{p.title}</h4>
                      </div>
                      <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-800">
                        <span className="text-sm font-extrabold text-indigo-600 dark:text-indigo-400">${p.price.toFixed(2)}</span>
                        <button className="px-2.5 py-1 rounded bg-indigo-600 text-white text-[10px] font-bold">
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Code-Editor Component for Template CSS Variables */}
      <TemplateCssEditorModal
        isOpen={!!cssEditingTemplate}
        onClose={() => setCssEditingTemplate(null)}
        template={cssEditingTemplate}
        products={products}
        onSaveCss={async (templateId, cssCode) => {
          try {
            const res = await fetch(`/api/templates/${templateId}/css`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ cssCode })
            });
            if (res.ok) {
              const updated = await res.json();
              if (cssEditingTemplate && cssEditingTemplate.id === templateId) {
                setCssEditingTemplate({ ...cssEditingTemplate, cssCode });
              }
            }
          } catch (err) {
            console.error('Failed to save template CSS', err);
          }
        }}
      />
    </div>
  );
}

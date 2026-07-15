"use client";

import React, { useState, useEffect } from 'react';

// [PENTING] 
// Untuk environment pratinjau (preview) ini, kita menggunakan CDN esm.sh agar tidak terjadi error "Could not resolve".
// SAAT DEPLOY KE NETLIFY / LOKAL, hapus baris import esm.sh di bawah ini dan gunakan import standar berikut:
// import { createClient } from '@supabase/supabase-js';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// Konfigurasi Supabase
const SUPABASE_URL = 'https://lfwcyavmwpjfwuiemdjv.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxmd2N5YXZtd3BqZnd1aWVtZGp2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI5NzQ5ODYsImV4cCI6MjA5ODU1MDk4Nn0.nwPI9m16c0OwF0LfkLI3IeJJwf_eSdv-lkhY-TX0-vI';
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default function Home() {
  // State untuk Portfolio
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [portfolios, setPortfolios] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [currentOffset, setCurrentOffset] = useState(0);
  
  // State untuk Tools
  const [tools, setTools] = useState<any[]>([]);
  const [loadingTools, setLoadingTools] = useState(true);

  const [toast, setToast] = useState({ show: false, message: '', type: 'success', title: '' });

  const INITIAL_LIMIT = 6;
  const LOAD_MORE_LIMIT = 3;

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    fetchPortfolios();
    fetchTools();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchPortfolios = async (isLoadMore: boolean = false) => {
    const limit = isLoadMore ? LOAD_MORE_LIMIT : INITIAL_LIMIT;
    if (isLoadMore) setLoadingMore(true); else setLoading(true);

    try {
      const { data, error } = await supabase
        .from('portfolios')
        .select('*')
        .order('created_at', { ascending: false })
        .range(currentOffset, currentOffset + limit - 1);

      if (error) throw error;

      const safeData = data || [];

      if (isLoadMore) setPortfolios(prev => [...prev, ...safeData]);
      else setPortfolios(safeData);

      setCurrentOffset(prev => prev + safeData.length);

      if (safeData.length < limit) {
        setHasMore(false);
        if (isLoadMore && safeData.length === 0) showToast('Semua karya sudah ditampilkan.', 'info', 'Portfolio Info');
      }
    } catch (error) {
      console.error('Data fetch error:', error);
      if (isLoadMore) showToast('Gagal memuat data tambahan.', 'error', 'Error');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const fetchTools = async () => {
    setLoadingTools(true);
    try {
      const { data, error } = await supabase
        .from('tools')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTools(data || []);
    } catch (error) {
      console.error('Tools fetch error:', error);
    } finally {
      setLoadingTools(false);
    }
  };

  const showToast = (message: string, type: string = 'success', customTitle: string | null = null) => {
    let title = customTitle || (type === 'success' ? 'Success' : type === 'error' ? 'Error' : 'Information');
    setToast({ show: true, message, type, title });
    setTimeout(() => setToast(prev => ({ ...prev, show: false })), 4000);
  };

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const handleSmoothScroll = (e: React.MouseEvent, targetId: string) => {
    e.preventDefault();
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      const headerOffset = 80; 
      const elementPosition = targetElement.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;
      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="antialiased selection:bg-[#B58D55] selection:text-white bg-slate-50 text-[#2C2E33] min-h-screen flex flex-col font-sans">
      
      {/* HEADER */}
      <header className={`fixed w-full top-0 z-50 transition-all duration-300 border-b border-gray-200 ${isScrolled ? 'bg-white/95 shadow-md' : 'bg-white/80 backdrop-blur-md'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Header Logo + Text Soebar Design */}
            <div className="flex-shrink-0 flex items-center gap-3 cursor-pointer group" onClick={(e) => handleSmoothScroll(e, 'home')}>
              <img 
                src="https://i.ibb.co.com/DqrJXZ3/logo.webp" 
                alt="Soebar Design Logo" 
                className="h-10 w-auto object-contain transition-transform group-hover:scale-105" 
              />
              <span className="font-extrabold text-xl tracking-tight">
                <span className="text-[#2C2E33]">Soebar</span>
                <span className="text-[#B58D55] ml-1">Design</span>
              </span>
            </div>
            
            <nav className="hidden md:flex space-x-8">
              <a href="#home" onClick={(e) => handleSmoothScroll(e, 'home')} className="text-slate-600 hover:text-[#B58D55] font-medium transition-colors">Home</a>
              <a href="#portfolio" onClick={(e) => handleSmoothScroll(e, 'portfolio')} className="text-slate-600 hover:text-[#B58D55] font-medium transition-colors">Portfolio</a>
              <a href="#about" onClick={(e) => handleSmoothScroll(e, 'about')} className="text-slate-600 hover:text-[#B58D55] font-medium transition-colors">About</a>
            </nav>

            <div className="md:hidden flex items-center">
              <button className="text-[#2C2E33] hover:text-[#B58D55] focus:outline-none" onClick={toggleMobileMenu}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
              </button>
            </div>
          </div>
        </div>
        
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-gray-200 absolute w-full shadow-lg">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <a href="#home" onClick={(e) => handleSmoothScroll(e, 'home')} className="block px-3 py-2 text-base font-medium text-slate-600 hover:text-[#B58D55] hover:bg-slate-50 rounded-md">Home</a>
              <a href="#portfolio" onClick={(e) => handleSmoothScroll(e, 'portfolio')} className="block px-3 py-2 text-base font-medium text-slate-600 hover:text-[#B58D55] hover:bg-slate-50 rounded-md">Portfolio</a>
              <a href="#about" onClick={(e) => handleSmoothScroll(e, 'about')} className="block px-3 py-2 text-base font-medium text-slate-600 hover:text-[#B58D55] hover:bg-slate-50 rounded-md">About</a>
            </div>
          </div>
        )}
      </header>

      {/* HERO SECTION */}
      <section id="home" className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-slate-50 flex-grow">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full overflow-hidden -z-10 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-[#2C2E33] rounded-full mix-blend-multiply filter blur-[128px] opacity-[0.03]"></div>
          <div className="absolute top-[20%] right-[-10%] w-96 h-96 bg-[#B58D55] rounded-full mix-blend-multiply filter blur-[128px] opacity-[0.08]"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 text-[#2C2E33]">
            Visualize Ideas with <br className="hidden md:block" />
            <span className="text-[#B58D55]">Motion & Typography</span>
          </h1>
          <p className="mt-4 max-w-2xl text-lg md:text-xl text-slate-500 mx-auto mb-10">
            Explore premium motion design and typography works. Download 4K resolution videos or HTML project files for your creative needs.
          </p>
          <div className="flex justify-center gap-4">
            <a href="#portfolio" onClick={(e) => handleSmoothScroll(e, 'portfolio')} className="px-8 py-3 rounded-full bg-[#B58D55] text-white font-medium hover:shadow-lg hover:bg-[#9a7746] transition-all transform hover:-translate-y-1 cursor-pointer">
              Explore Works
            </a>
            <a href="#about" onClick={(e) => handleSmoothScroll(e, 'about')} className="px-8 py-3 rounded-full bg-white border border-gray-300 text-[#2C2E33] font-medium hover:border-[#B58D55] hover:text-[#B58D55] transition-all shadow-sm cursor-pointer">
              Contact Me
            </a>
          </div>
        </div>
      </section>

      {/* PORTFOLIO SECTION */}
      <section id="portfolio" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#2C2E33]">Latest <span className="text-[#B58D55]">Collection</span></h2>
            <div className="w-24 h-1 bg-[#B58D55] mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading ? (
              <div className="col-span-full text-center py-16">
                <p className="text-slate-500 font-medium animate-pulse">Connecting to Supabase...</p>
              </div>
            ) : portfolios.length === 0 ? (
              <div className="col-span-full text-center py-10 text-slate-500">No works uploaded in the database yet.</div>
            ) : (
              portfolios.map((item) => {
                const detailLink = `/portfolio/${item.slug || encodeURIComponent(item.title)}`;
                
                return (
                  <div key={item.id} className="bg-white rounded-2xl overflow-hidden border border-gray-200 hover:border-[#B58D55]/50 hover:shadow-xl transition-all duration-300 group flex flex-col h-full shadow-sm">
                    <a href={detailLink} className="relative h-56 bg-slate-100 overflow-hidden cursor-pointer video-thumbnail block">
                      <img src={item.thumbnail_url || ''} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-black/30 transition-all duration-300">
                        <div className="w-16 h-16 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-sm border border-white/40 group-hover:bg-[#B58D55]/90 group-hover:border-[#B58D55] transition-all">
                           <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                        </div>
                      </div>
                      <span className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm px-3 py-1 text-xs font-semibold rounded-full text-[#B58D55] border border-[#B58D55]/20 shadow-sm">
                        {item.category || 'Uncategorized'}
                      </span>
                    </a>
                    
                    <div className="p-6 flex flex-col flex-grow">
                      <a href={detailLink} className="block group">
                        <h3 className="text-xl font-bold mb-2 text-[#2C2E33] group-hover:text-[#B58D55] transition-colors line-clamp-1">{item.title}</h3>
                      </a>
                      <p className="text-slate-500 text-sm mb-6 flex-grow line-clamp-2" title={item.description || ''}>
                        {item.description || 'No description available.'}
                      </p>
                      
                      <div className="space-y-3 mt-auto">
                        <a href={detailLink} className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-[#2C2E33] hover:bg-[#1f2024] text-white rounded-lg text-sm font-medium transition-colors shadow-sm">
                          Click here to download assets
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
          
          {!loading && hasMore && (
            <div className="mt-12 text-center">
              <button 
                onClick={() => fetchPortfolios(true)} 
                disabled={loadingMore}
                className={`px-6 py-3 rounded-full border border-gray-300 hover:border-[#B58D55] hover:text-[#B58D55] hover:bg-slate-50 text-slate-500 bg-white shadow-sm transition-colors font-medium ${loadingMore ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {loadingMore ? 'Loading...' : 'Load More Works ↓'}
              </button>
            </div>
          )}
        </div>
      </section>

      {/* TOOLS BANNER SECTION */}
      <section className="bg-[#2C2E33] py-16 relative overflow-hidden">
        {/* Dekorasi Background */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-[#B58D55] opacity-10 blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 rounded-full bg-white opacity-5 blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-4 text-white">Tools & <span className="text-[#B58D55]">Resources</span></h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-sm md:text-base">
              Kumpulan software dan sumber daya kreatif yang biasa saya gunakan dalam proses desain dan pengembangan.
            </p>
          </div>

          {loadingTools ? (
            <div className="text-center text-gray-400 animate-pulse">Memuat data tools...</div>
          ) : tools.length === 0 ? (
            <div className="text-center text-gray-500 italic">Belum ada tools yang ditambahkan.</div>
          ) : (
            <div className="flex flex-wrap justify-center gap-4 md:gap-6">
              {tools.map((tool) => (
                <a 
                  key={tool.id} 
                  href={tool.download_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-[#1f2024] border border-gray-700 hover:border-[#B58D55] rounded-xl p-4 flex items-center gap-4 w-full md:w-[320px] transition-all duration-300 group hover:-translate-y-1 shadow-lg"
                >
                  <div className="w-12 h-12 rounded-lg bg-gray-800 flex items-center justify-center flex-shrink-0 text-[#B58D55] group-hover:bg-[#B58D55] group-hover:text-white transition-colors overflow-hidden">
                    {tool.icon_url ? (
                      <img src={tool.icon_url} alt={tool.name} className="w-full h-full object-cover" />
                    ) : (
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                    )}
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-sm group-hover:text-[#B58D55] transition-colors">{tool.name}</h3>
                    {tool.description && (
                      <p className="text-gray-400 text-xs mt-1 line-clamp-1">{tool.description}</p>
                    )}
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* FOOTER */}
      <footer id="about" className="bg-white border-t border-gray-200 pt-16 pb-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
            <div>
              {/* Logo Footer agar sejajar dengan Teks "Soebar Design" */}
              <div className="flex items-center gap-3 mb-4">
                <img 
                  src="https://i.ibb.co.com/DqrJXZ3/logo.webp" 
                  alt="Soebar Design Logo" 
                  className="h-10 w-auto object-contain" 
                />
                <span className="font-extrabold text-xl tracking-tight">
                  <span className="text-[#2C2E33]">Soebar</span>
                  <span className="text-[#B58D55] ml-1">Design</span>
                </span>
              </div>
              <p className="text-slate-500 text-sm leading-relaxed">
                Portfolio and creative resource platform. Providing high-quality templates, motion graphic videos, and typography for your project needs.
              </p>
            </div>
            <div>
              <h4 className="text-[#2C2E33] font-semibold mb-4 text-lg">Quick Links</h4>
              <ul className="space-y-2">
                <li><a href="#home" onClick={(e) => handleSmoothScroll(e, 'home')} className="text-slate-500 hover:text-[#B58D55] transition-colors text-sm font-medium cursor-pointer">Home</a></li>
                <li><a href="#portfolio" onClick={(e) => handleSmoothScroll(e, 'portfolio')} className="text-slate-500 hover:text-[#B58D55] transition-colors text-sm font-medium cursor-pointer">Video Collection</a></li>
                <li><button onClick={() => showToast('Design templates are free to use for personal and commercial purposes.', 'info', 'License & Usage')} className="text-slate-500 hover:text-[#B58D55] transition-colors text-sm font-medium">License & Usage</button></li>
                <li><button onClick={() => showToast('Click the download button on the detail page to save files.', 'info', 'Help')} className="text-slate-500 hover:text-[#B58D55] transition-colors text-sm font-medium">How to Download</button></li>
              </ul>
            </div>
            <div>
              <h4 className="text-[#2C2E33] font-semibold mb-4 text-lg">Contact Me</h4>
              <p className="text-slate-500 text-sm mb-4">Have questions or need a custom design?</p>
              <div className="flex space-x-4">
                <a href="mailto:hello@soebardesign.com" className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:text-white hover:bg-[#B58D55] transition-all shadow-sm">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" /></svg>
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-200 pt-8 text-center">
            <p className="text-slate-400 text-sm">&copy; {new Date().getFullYear()} Soebar Design. Made with creative enthusiasm.</p>
          </div>
        </div>
      </footer>

      {/* TOAST NOTIFICATION COMPONENT */}
      <div 
        className={`fixed bottom-5 right-5 text-[#2C2E33] px-6 py-4 rounded-lg shadow-2xl flex items-center gap-3 transform transition-all duration-300 z-[100] border bg-white ${toast.show ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'} ${toast.type === 'success' ? 'border-[#B58D55] border-l-4' : toast.type === 'error' ? 'border-red-400 border-l-4' : 'border-blue-400 border-l-4'}`}
      >
        <div>
          <h4 className="font-bold text-sm text-[#2C2E33]">{toast.title}</h4>
          <p className="text-xs text-slate-500 mt-1">{toast.message}</p>
        </div>
      </div>
    </div>
  );
}
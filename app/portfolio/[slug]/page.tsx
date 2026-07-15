"use client";

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';

// Konfigurasi Supabase
const SUPABASE_URL = 'https://lfwcyavmwpjfwuiemdjv.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxmd2N5YXZtd3BqZnd1aWVtZGp2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI5NzQ5ODYsImV4cCI6MjA5ODU1MDk4Nn0.nwPI9m16c0OwF0LfkLI3IeJJwf_eSdv-lkhY-TX0-vI';
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default function PortfolioDetail() {
  const params = useParams();
  
  // Memastikan slug bertipe string tunggal sebelum di-decode
  const rawSlug = params?.slug;
  const slugString = Array.isArray(rawSlug) ? rawSlug[0] : rawSlug;
  const slugOrTitleParam = slugString ? decodeURIComponent(slugString) : null;

  // Menambahkan tipe <any> agar tidak memicu error tipe implisit
  const [item, setItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success', title: '' });

  useEffect(() => {
    if (!slugOrTitleParam) {
      setLoading(false);
      setError(true);
      return;
    }

    const fetchDetail = async () => {
      try {
        let { data, error } = await supabase
          .from('portfolios')
          .select('*')
          .eq('slug', slugOrTitleParam)
          .single();

        if (error || !data) {
           const response = await supabase
            .from('portfolios')
            .select('*')
            .eq('title', slugOrTitleParam)
            .single();
            
           data = response.data;
           if (response.error || !data) throw new Error("Data not found");
        }

        setItem(data);
        document.title = `${data.title} | Soebar Design`;
      } catch (err) {
        console.error('Fetch detail error:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [slugOrTitleParam]);

  // Menambahkan type annotations pada parameter fungsi
  const showToast = (message: string, type: string = 'success', customTitle: string | null = null) => {
    const title = customTitle || (type === 'success' ? 'Berhasil' : 'Informasi');
    setToast({ show: true, message, type, title });
    setTimeout(() => setToast(prev => ({ ...prev, show: false })), 3000);
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href)
      .then(() => showToast('Link berhasil disalin ke clipboard.', 'success', 'Link Tersalin!'))
      .catch(() => showToast('Gagal menyalin link.', 'error', 'Error'));
  };

  const handleDownload = () => {
    if (!item?.source_url) {
      showToast('URL file sumber tidak tersedia di database.', 'error', 'File Hilang');
      return;
    }

    setShowDownloadModal(true);
    setDownloadProgress(0);

    const interval = setInterval(() => {
      setDownloadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 25;
      });
    }, 400);

    setTimeout(() => {
      const link = document.createElement('a');
      link.href = item.source_url;
      link.setAttribute('download', ''); 
      link.target = '_self'; 
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setTimeout(() => setShowDownloadModal(false), 1500);
    }, 2000);
  };

  const renderMedia = () => {
    if (!item) return null;
    const thumbnailUrl = item.thumbnail_url || 'https://placehold.co/1280x720/1e293b/ffffff?text=No+Preview';
    const videoData = item.video_url;

    if (videoData) {
      if (videoData.toLowerCase().endsWith('.mp4')) {
        return (
          <video 
            src={videoData} 
            poster={thumbnailUrl}
            className="w-full h-full object-cover border-0 rounded-2xl outline-none bg-black" 
            controls 
            playsInline
          >
            Browser Anda tidak mendukung tag video.
          </video>
        );
      } else if (videoData.includes('<iframe')) {
        return <div dangerouslySetInnerHTML={{ __html: videoData }} className="w-full h-full [&>iframe]:w-full [&>iframe]:h-full [&>iframe]:rounded-2xl border-0 flex items-center justify-center bg-black" />;
      } else {
        return <iframe src={videoData} className="w-full h-full object-cover border-0 rounded-2xl bg-black" allowFullScreen allow="accelerometer; autoPlay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"></iframe>;
      }
    }

    return <img src={thumbnailUrl} alt="Thumbnail" className="w-full h-full object-cover rounded-2xl" />;
  };

  return (
    <div className="antialiased bg-slate-50 text-[#2C2E33] flex flex-col min-h-screen font-sans">
      
      <header className="fixed w-full top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <a href="/" className="flex-shrink-0 flex items-center cursor-pointer">
              <img 
                src="https://i.ibb.co.com/DqrJXZ3/logo.webp" 
                alt="Soebar Design Logo" 
                className="h-10 w-auto object-contain" 
              />
            </a>
            <nav className="hidden md:flex space-x-8">
              <a href="/" className="text-slate-500 hover:text-[#B58D55] font-medium transition-colors">Home</a>
            </nav>
          </div>
        </div>
      </header>

      <main className="flex-grow pt-32 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        
        <nav className="flex mb-8 text-sm text-slate-500 font-medium">
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            <li className="inline-flex items-center">
              <a href="/" className="hover:text-[#B58D55] transition-colors">Home</a>
            </li>
            <li>
              <div className="flex items-center">
                <span className="mx-2 text-gray-400">/</span>
                <span className="text-[#2C2E33] font-semibold">{loading ? 'Loading...' : error ? 'Error' : item?.title}</span>
              </div>
            </li>
          </ol>
        </nav>

        {loading && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-8 space-y-6">
              <div className="w-full aspect-video rounded-2xl bg-slate-200 animate-pulse"></div>
              <div className="h-10 w-3/4 rounded-lg bg-slate-200 animate-pulse"></div>
              <div className="space-y-3">
                <div className="h-4 w-full rounded bg-slate-200 animate-pulse"></div>
                <div className="h-4 w-5/6 rounded bg-slate-200 animate-pulse"></div>
              </div>
            </div>
            <div className="lg:col-span-4">
              <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-6">
                <div className="h-14 w-full rounded-xl bg-slate-200 animate-pulse"></div>
              </div>
            </div>
          </div>
        )}

        {!loading && error && (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-200 shadow-sm">
            <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            </div>
            <h2 className="text-2xl font-bold text-[#2C2E33] mb-2">Item Not Found</h2>
            <p className="text-slate-500 mb-6 max-w-md mx-auto">The project you are looking for might have been removed, had its name changed, or is temporarily unavailable.</p>
            <a href="/" className="inline-flex items-center px-6 py-3 bg-[#2C2E33] hover:bg-[#1f2024] text-white font-medium rounded-full transition-colors">
              Back to Home
            </a>
          </div>
        )}

        {!loading && !error && item && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-8">
              <div className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden shadow-xl border border-gray-200 group mb-8">
                {renderMedia()}
              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-[#2C2E33] mb-4 leading-tight">{item.title}</h1>
              <div className="prose prose-slate max-w-none">
                <h3 className="text-xl font-semibold text-[#2C2E33] mb-3">Project Description</h3>
                <p className="text-slate-600 leading-relaxed whitespace-pre-line text-lg">
                  {item.description || 'No description available for this project.'}
                </p>
              </div>
            </div>

            <div className="lg:col-span-4 relative">
              <div className="sticky top-28 bg-white border border-gray-200 rounded-3xl p-6 shadow-lg shadow-slate-200/50">
                
                <button onClick={handleDownload} className="w-full relative group overflow-hidden rounded-xl p-[1px] bg-gradient-to-r from-[#B58D55] to-[#9a7746]">
                  <div className="relative bg-white group-hover:bg-transparent px-6 py-4 rounded-xl flex items-center justify-center gap-3 transition-colors duration-300">
                    <svg className="w-6 h-6 text-[#B58D55] group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                    <span className="font-bold text-[#2C2E33] group-hover:text-white transition-colors">Download Source File</span>
                  </div>
                </button>

                <p className="text-xs text-center text-slate-500 mt-3 mb-6">
                  <span className="text-green-500 mr-1">🛡️</span> Secure download via Soebar Design Server
                </p>
                
                <hr className="border-gray-100 mb-6" />

                <h4 className="font-bold text-[#2C2E33] mb-4 uppercase tracking-wider text-sm">Project Details</h4>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <div className="w-8 h-8 rounded-full bg-[#B58D55]/10 flex items-center justify-center text-[#B58D55] mr-3 flex-shrink-0">📁</div>
                    <div>
                      <p className="text-xs text-slate-500">Category</p>
                      <p className="font-medium text-[#2C2E33]">{item.category || 'Uncategorized'}</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="w-8 h-8 rounded-full bg-[#B58D55]/10 flex items-center justify-center text-[#B58D55] mr-3 flex-shrink-0">📄</div>
                    <div>
                      <p className="text-xs text-slate-500">File Format</p>
                      <p className="font-medium text-[#2C2E33]">.HTML, .ZIP</p>
                    </div>
                  </li>
                </ul>

                <hr className="border-gray-100 my-6" />

                <button onClick={copyLink} className="w-full flex items-center justify-center gap-2 py-3 border-2 border-gray-100 hover:border-[#B58D55]/30 bg-gray-50 hover:bg-[#B58D55]/5 rounded-xl text-[#2C2E33] font-medium transition-all">
                   Copy Page Link
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="bg-white border-t border-gray-200 py-8 mt-auto text-center">
        <p className="text-slate-400 text-sm">&copy; 2026 Soebar Design. All rights reserved.</p>
      </footer>

      {/* MODAL POPUP DOWNLOAD */}
      {showDownloadModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm transition-opacity">
          <div className="bg-white rounded-2xl p-8 max-w-sm w-full mx-4 shadow-2xl transform scale-100 transition-transform">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#B58D55]/20 text-[#B58D55] rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
              </div>
              <h3 className="text-xl font-bold text-[#2C2E33] mb-2">Mempersiapkan Unduhan</h3>
              <p className="text-sm text-slate-500 mb-6">File Anda sedang diproses. Silakan tunggu sebentar...</p>
              
              <div className="w-full bg-gray-100 rounded-full h-2.5 mb-2 overflow-hidden">
                <div className="bg-[#B58D55] h-2.5 rounded-full transition-all duration-300 ease-out" style={{ width: `${downloadProgress}%` }}></div>
              </div>
              <p className="text-xs font-semibold text-[#B58D55]">{downloadProgress}%</p>
            </div>
          </div>
        </div>
      )}

      {/* TOAST NOTIFICATION */}
      <div className={`fixed bottom-5 right-5 text-slate-800 px-6 py-4 rounded-lg shadow-2xl flex items-center gap-3 transform transition-all duration-300 z-[100] border bg-white ${toast.show ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'} ${toast.type === 'success' ? 'border-[#B58D55] border-l-4' : 'border-red-400 border-l-4'}`}>
        <div>
          <h4 className="font-bold text-sm text-[#2C2E33]">{toast.title}</h4>
          <p className="text-xs text-slate-500 mt-1">{toast.message}</p>
        </div>
      </div>
    </div>
  );
}
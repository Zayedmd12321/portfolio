'use client';

import React, { useState, useEffect, useRef, KeyboardEvent } from 'react';
import { 
  ChevronLeft, ChevronRight, RotateCw, Lock, 
  Plus, Sidebar, Star, Search, X, Home, Trash2, Loader2, AlertTriangle, ExternalLink
} from 'lucide-react';
import contactDetails from '@/data/contactDetails'; 

// --- Types ---
type Tab = {
  id: string;
  url: string;           
  displayUrl: string;    
  title: string;
  isLoading: boolean;
  history: string[];     
  historyIndex: number;  
  warningDismissed?: boolean;
};

type BookmarkItem = {
  id: string;
  name: string;
  url: string;
  color: string;
};

// --- Helpers ---
const isValidUrl = (string: string) => {
  try {
    new URL(string.startsWith('http') ? string : `https://${string}`);
    return string.includes('.'); 
  } catch (_) {
    return false;
  }
};

const generateId = () => Math.random().toString(36).substr(2, 9);

// Default Bookmarks
const INITIAL_BOOKMARKS: BookmarkItem[] = [
  { id: '1', name: 'GitHub', url: contactDetails.github || 'https://github.com', color: 'bg-gray-800' },
  { id: '2', name: 'LinkedIn', url: contactDetails.linkedin || 'https://linkedin.com', color: 'bg-[#0077B5]' },
  { id: '3', name: 'Instagram', url: contactDetails.instagram || 'https://instagram.com', color: 'bg-pink-600' },
  { id: '4', name: 'Google', url: 'https://google.com', color: 'bg-blue-500' },
  { id: '5', name: 'Portfolio', url: 'https://zayedghanchi.com', color: 'bg-green-600' },
];

// --- EXTRACTED COMPONENT (Fixed: Defined outside main component) ---
const BookmarkCard = ({ data, onClick }: { data: BookmarkItem; onClick: () => void }) => (
  <div 
    onClick={onClick}
    className="flex flex-col items-center gap-2 group cursor-pointer transition-transform hover:scale-105 active:scale-95"
  >
    <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-xl flex items-center justify-center text-white text-2xl shadow-md ${data.color} overflow-hidden`}>
      <span className="font-bold">{data.name.slice(0,2).toUpperCase()}</span>
    </div>
    <span className="text-xs text-gray-500 font-medium group-hover:text-blue-500 text-center max-w-20 truncate">
      {data.name}
    </span>
  </div>
);

export default function SafariApp() {
  // --- State ---
  const [tabs, setTabs] = useState<Tab[]>([{
    id: 'init-tab',
    url: '',
    displayUrl: '',
    title: 'New Tab',
    isLoading: false,
    history: [''],
    historyIndex: 0,
    warningDismissed: false
  }]);
  
  const [activeTabId, setActiveTabId] = useState<string>('init-tab');
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>(INITIAL_BOOKMARKS);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const activeTab = tabs.find(t => t.id === activeTabId) || tabs[0];
  const iframeRefs = useRef<{ [key: string]: HTMLIFrameElement | null }>({});

  // --- Listen for messages from the Proxy ---
  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
        if (!e.data) return;

        if (e.data.type === 'LOAD_START') {
            updateTab(activeTabId, { isLoading: true });
        }

        if (e.data.type === 'URL_CHANGED') {
            updateTab(activeTabId, { 
                displayUrl: e.data.url, 
                url: e.data.url,
                warningDismissed: false 
            });
        }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [activeTabId]); 


  // --- Actions ---

  const createTab = (initialUrl: string = '') => {
    const newTab: Tab = {
      id: generateId(),
      url: initialUrl,
      displayUrl: initialUrl,
      title: initialUrl ? 'Loading...' : 'New Tab',
      isLoading: !!initialUrl,
      history: [initialUrl],
      historyIndex: 0,
      warningDismissed: false
    };
    setTabs(prev => [...prev, newTab]);
    setActiveTabId(newTab.id);
  };

  const closeTab = (e: React.MouseEvent, tabId: string) => {
    e.stopPropagation(); 
    if (tabs.length === 1) {
      updateTab(tabId, { url: '', displayUrl: '', title: 'New Tab', history: [''], historyIndex: 0 });
      return;
    }
    const newTabs = tabs.filter(t => t.id !== tabId);
    setTabs(newTabs);
    if (activeTabId === tabId) {
      setActiveTabId(newTabs[newTabs.length - 1].id);
    }
  };

  const updateTab = (id: string, updates: Partial<Tab>) => {
    setTabs(prev => prev.map(tab => tab.id === id ? { ...tab, ...updates } : tab));
  };

  // --- Bookmark Logic ---

  const toggleBookmark = () => {
    if (!activeTab.url) return;

    const exists = bookmarks.find(b => b.url === activeTab.url);
    if (exists) {
      setBookmarks(prev => prev.filter(b => b.url !== activeTab.url));
    } else {
      const newBookmark: BookmarkItem = {
        id: generateId(),
        name: activeTab.title || activeTab.displayUrl || 'Site',
        url: activeTab.url,
        color: `bg-${['red','blue','green','yellow','purple'][Math.floor(Math.random()*5)]}-500` // Random color
      };
      setBookmarks(prev => [...prev, newBookmark]);
    }
  };

  const isCurrentTabBookmarked = bookmarks.some(b => b.url === activeTab.url);

  // --- Navigation Logic ---

  const navigate = (input: string, tabId: string = activeTabId) => {
    let target = input.trim();
    if (!target) return;

    if (!isValidUrl(target)) {
      target = `https://www.google.com/search?q=${encodeURIComponent(target)}`;
    } else {
      if (!target.startsWith('http://') && !target.startsWith('https://')) {
        target = 'https://' + target;
      }
    }

    const currentTab = tabs.find(t => t.id === tabId);
    if (!currentTab) return;

    const newHistory = currentTab.history.slice(0, currentTab.historyIndex + 1);
    newHistory.push(target);

    updateTab(tabId, {
      url: target,
      displayUrl: target.includes('google.com/search') ? input : target,
      title: target,
      isLoading: true,
      history: newHistory,
      historyIndex: newHistory.length - 1,
      warningDismissed: false
    });
  };

  // --- SMART CLICK HANDLER ---
  const handleBookmarkClick = (url: string) => {
      // Logic: 
      // 1. If we are on the Home Screen (empty url), use the CURRENT tab.
      // 2. If we are already browsing a site, open a NEW tab.
      if (!activeTab.url) {
          navigate(url);
      } else {
          createTab(url);
      }
      
      if (window.innerWidth < 768) {
          setIsSidebarOpen(false);
      }
  };

  const goBack = () => {
    if (activeTab.historyIndex > 0) {
      const newIndex = activeTab.historyIndex - 1;
      const prevUrl = activeTab.history[newIndex];
      updateTab(activeTabId, {
        url: prevUrl,
        displayUrl: prevUrl,
        historyIndex: newIndex,
        isLoading: !!prevUrl
      });
    }
  };

  const goForward = () => {
    if (activeTab.historyIndex < activeTab.history.length - 1) {
      const newIndex = activeTab.historyIndex + 1;
      const nextUrl = activeTab.history[newIndex];
      updateTab(activeTabId, {
        url: nextUrl,
        displayUrl: nextUrl,
        historyIndex: newIndex,
        isLoading: true
      });
    }
  };

  const goHome = () => {
     updateTab(activeTabId, {
       url: '',
       displayUrl: '',
       title: 'New Tab',
       isLoading: false,
       history: [...activeTab.history.slice(0, activeTab.historyIndex + 1), ''],
       historyIndex: activeTab.historyIndex + 1
     });
  };

  const handleRefresh = () => {
    updateTab(activeTabId, { isLoading: true });
    const ref = iframeRefs.current[activeTabId];
    if (ref) {
      ref.src = ref.src; 
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      navigate(activeTab.displayUrl);
    }
  };

  return (
    <div className="flex w-full h-full bg-[#DFDFE1] font-sans overflow-hidden rounded-xl border border-gray-400 shadow-2xl relative">
      
      {/* --- Sidebar (Collapsible) --- */}
      <div className={`
          absolute left-0 top-0 bottom-0 bg-[#F0F0F2] border-r border-gray-300 z-30 transition-all duration-300 ease-in-out flex flex-col
          ${isSidebarOpen ? 'w-64 translate-x-0' : 'w-64 -translate-x-full'}
      `}>
         <div className="h-12 flex items-center justify-between px-4 border-b border-gray-300">
            <span className="font-semibold text-gray-600">Bookmarks</span>
            <button onClick={() => setIsSidebarOpen(false)} className="text-gray-400 hover:text-black cursor-pointer">
              <Sidebar size={18} />
            </button>
         </div>
         <div className="flex-1 overflow-y-auto p-2">
            {bookmarks.map(b => (
              <div 
                key={b.id} 
                className="group flex items-center gap-3 p-2 hover:bg-white rounded-lg cursor-pointer transition-colors" 
                onClick={() => handleBookmarkClick(b.url)}
              >
                 <div className={`w-6 h-6 rounded flex items-center justify-center text-[10px] text-white ${b.color}`}>
                    {b.name.slice(0,1).toUpperCase()}
                 </div>
                 <span className="text-sm text-gray-700 truncate flex-1">{b.name}</span>
                 <button 
                    onClick={(e) => { e.stopPropagation(); setBookmarks(prev => prev.filter(i => i.id !== b.id)) }}
                    className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 cursor-pointer"
                  >
                    <Trash2 size={14} />
                 </button>
              </div>
            ))}
         </div>
      </div>


      {/* --- Main Content --- */}
      <div className={`flex flex-col flex-1 h-full transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}>
        
        {/* --- Toolbar --- */}
        <div className="bg-[#F6F6F6] pb-2 border-b border-gray-300 z-20">
          
          {/* Tab Bar */}
          <div className="flex items-end px-2 pt-2 gap-1 overflow-x-auto scrollbar-hide mb-2">
            {tabs.map(tab => (
              <div 
                key={tab.id}
                onClick={() => setActiveTabId(tab.id)}
                className={`
                  group relative flex items-center justify-between min-w-30 max-w-50 h-8 px-3 rounded-t-lg text-xs font-medium cursor-pointer select-none transition-all
                  ${activeTabId === tab.id 
                    ? 'bg-white text-black shadow-sm z-10' 
                    : 'bg-[#DFDFE1] text-gray-500 hover:bg-[#EBEBEC]'}
                `}
              >
                <span className="truncate flex-1 mr-2">{tab.title || 'New Tab'}</span>
                <button 
                  onClick={(e) => closeTab(e, tab.id)}
                  className={`p-0.5 rounded-full hover:bg-gray-200 ${activeTabId === tab.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
                >
                  <X size={10} />
                </button>
              </div>
            ))}
            <button onClick={() => createTab('')} className="p-1 ml-1 hover:bg-gray-300 rounded-md text-gray-500 cursor-pointer">
              <Plus size={16} />
            </button>
          </div>

          {/* Controls & Address Bar */}
          <div className="flex items-center px-4 gap-4">
            <div className="flex items-center gap-6 text-gray-500">
              <button 
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className={`transition-colors cursor-pointer ${isSidebarOpen ? 'text-blue-500' : 'hover:text-black'}`} 
                title="Sidebar"
              >
                <Sidebar size={18} strokeWidth={2} />
              </button>
              
              <div className="flex gap-4">
                <button 
                  className={`transition-colors ${activeTab.historyIndex > 0 ? 'hover:text-black text-gray-600 cursor-pointer' : 'text-gray-300 cursor-default'}`} 
                  onClick={goBack}
                  disabled={activeTab.historyIndex <= 0}
                >
                  <ChevronLeft size={20} strokeWidth={2} />
                </button>
                <button 
                  className={`transition-colors ${activeTab.historyIndex < activeTab.history.length - 1 ? 'hover:text-black text-gray-600 cursor-pointer' : 'text-gray-300 cursor-default'}`} 
                  onClick={goForward}
                  disabled={activeTab.historyIndex >= activeTab.history.length - 1}
                >
                  <ChevronRight size={20} strokeWidth={2} />
                </button>
              </div>
            </div>

            {/* Center Address Bar */}
            <div className="flex-1 flex justify-center px-2 sm:px-4">
              <div className="w-full max-w-2xl h-9 bg-[#E3E3E5] hover:bg-[#DEDEDF] focus-within:bg-white rounded-lg flex items-center px-3 text-sm border border-transparent focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-200 transition-all relative group shadow-inner overflow-hidden">
                
                {activeTab.url ? (
                  <Lock size={12} className="text-gray-500 mr-2 shrink-0" />
                ) : (
                  <Search size={12} className="text-gray-500 mr-2 shrink-0" />
                )}
                
                <input 
                  className="bg-transparent border-none outline-none w-full text-center group-focus-within:text-left text-black placeholder-gray-500 text-xs sm:text-sm z-10"
                  value={activeTab.displayUrl}
                  onChange={(e) => updateTab(activeTabId, { displayUrl: e.target.value })}
                  onKeyDown={handleKeyDown}
                  onFocus={(e) => e.target.select()}
                  placeholder="Search or enter website name"
                  spellCheck={false}
                />

                <button onClick={handleRefresh} className="ml-2 text-gray-500 hover:text-black transition-colors z-10 cursor-pointer">
                  <RotateCw size={12} className={activeTab.isLoading ? "animate-spin" : ""} />
                </button>

                 {/* Blue Progress Bar */}
                 {activeTab.isLoading && (
                   <div className="absolute bottom-0 left-0 h-0.5 bg-blue-500 animate-[loading_2s_ease-in-out_infinite] w-full opacity-80 z-0" />
                 )}
              </div>
            </div>

            {/* Right Controls */}
            <div className="flex items-center gap-4 text-gray-500">
               <button 
                 onClick={toggleBookmark}
                 className={`hover:text-black transition-colors ${isCurrentTabBookmarked ? 'text-yellow-500 fill-yellow-500' : ''}`} 
                 title="Add to Favorites"
                 disabled={!activeTab.url}
               >
                 <Star size={18} className={isCurrentTabBookmarked ? "fill-yellow-500" : ""} />
               </button>

               <button onClick={goHome} className="hover:text-black transition-colors cursor-pointer" title="Home">
                 <Home size={18} />
               </button>
            </div>
          </div>
        </div>

        {/* --- Browser Content Area --- */}
        <div className="flex-1 relative w-full h-full bg-white overflow-hidden">
          
          {tabs.map(tab => (
            <div 
              key={tab.id} 
              className={`w-full h-full absolute top-0 left-0 flex flex-col ${activeTabId === tab.id ? 'visible z-10' : 'invisible z-0'}`}
            >
              {tab.url ? (
                <div className="relative w-full h-full flex flex-col">
                    
                    {/* Warning Banner */}
                    {!tab.warningDismissed && (
                      <div className="w-full bg-yellow-50 border-b border-yellow-200 px-4 py-2 flex items-center justify-between text-xs sm:text-sm z-20 shrink-0">
                          <div className="flex items-center gap-2 text-yellow-800">
                              <AlertTriangle size={16} />
                              <span>
                                  <strong>Scraping Preview:</strong> Some content may not load correctly.
                              </span>
                          </div>
                          <div className="flex items-center gap-4">
                              <button 
                                  onClick={() => window.open(tab.url, '_blank')}
                                  className="flex items-center gap-1 text-yellow-700 hover:text-black underline underline-offset-2 font-medium"
                              >
                                  Go to original <ExternalLink size={12} />
                              </button>
                              <button 
                                  onClick={() => updateTab(tab.id, { warningDismissed: true })}
                                  className="text-yellow-600 hover:text-yellow-900"
                              >
                                  <X size={16} />
                              </button>
                          </div>
                      </div>
                    )}

                    {/* Centered Loading Overlay */}
                    {tab.isLoading && (
                        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-white/90 backdrop-blur-sm transition-opacity duration-300">
                             <div className="bg-white p-4 rounded-2xl shadow-xl flex flex-col items-center gap-3 border border-gray-100">
                                <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                                <span className="text-sm font-medium text-gray-500 animate-pulse">Loading Content...</span>
                             </div>
                        </div>
                    )}

                    <iframe
                        ref={el => { iframeRefs.current[tab.id] = el; }}
                        src={`/api/proxy?url=${encodeURIComponent(tab.url)}`}
                        onLoad={() => updateTab(tab.id, { isLoading: false, title: tab.displayUrl })}
                        className="w-full flex-1 border-none block bg-white"
                        sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-modals"
                        title={`Content-${tab.id}`}
                    />
                </div>
              ) : (
                /* --- Favorites / Start Page --- */
                <div className="w-full h-full flex flex-col items-center pt-20 animate-in fade-in duration-300 bg-[#FBFBFD] overflow-y-auto">
                   <div className="mb-12 text-center select-none">
                      <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-linear-to-br from-gray-400 to-gray-200 mb-2">Favorites</h1>
                      <p className="text-gray-400 text-sm">Top Sites</p>
                   </div>
                   
                   {/* FIXED: Passed the smart handler here */}
                   <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 sm:gap-12 p-4">
                      {bookmarks.map(bookmark => (
                        <BookmarkCard 
                          key={bookmark.id} 
                          data={bookmark} 
                          onClick={() => handleBookmarkClick(bookmark.url)}
                        />
                      ))}
                   </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
'use client';
import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Search, ListMusic, Mic2, Radio, Home, Grid, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

// --- Types ---
interface Song {
  id: number;
  title: string;
  artist: string;
  album: string;
  cover: string;
  url: string; // The preview MP3 url from Apple
  duration: number; // in milliseconds
}

// --- Default Playlist (Lo-Fi for coding) ---
const DEFAULT_PLAYLIST: Song[] = [
  {
    id: 1,
    title: 'Code Lo-Fi',
    artist: 'Chill Beats',
    album: 'Coding Mode',
    cover: 'https://images.unsplash.com/photo-1516280440614-6697288d5d38?q=80&w=1000&auto=format&fit=crop',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', // Placeholder
    duration: 0
  },
];

export default function MusicApp() {
  const [playlist, setPlaylist] = useState<Song[]>([]);
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [progress, setProgress] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initial Load: Fetch top songs or use default
  useEffect(() => {
    searchMusic('lofi hip hop'); // Default "Home" screen content
  }, []);

  // --- THE MAGIC: Search Apple Music API ---
  const searchMusic = async (query: string) => {
    if (!query) return;
    setIsSearching(true);
    try {
      // Free iTunes API - No Key Required
      const res = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(query)}&media=music&limit=24`);
      const data = await res.json();

      const newSongs: Song[] = data.results
        .filter((item: any) => item.previewUrl) // Only keep songs with previews
        .map((item: any) => ({
          id: item.trackId,
          title: item.trackName,
          artist: item.artistName,
          album: item.collectionName,
          // Get higher res image (600x600) instead of default 100x100
          cover: item.artworkUrl100.replace('100x100bb', '600x600bb'),
          url: item.previewUrl,
          duration: item.trackTimeMillis
        }));

      setPlaylist(newSongs);
      if (newSongs.length > 0 && !currentSong) {
          // Optional: Don't auto-play, just set the first one as ready
          setCurrentSong(newSongs[0]);
      }
    } catch (error) {
      console.error("Failed to fetch music", error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    searchMusic(searchQuery);
  };

  // --- Audio Logic ---
  useEffect(() => {
    if (currentSong) {
      if (audioRef.current) {
        audioRef.current.src = currentSong.url;
        audioRef.current.volume = volume;
        if (isPlaying) audioRef.current.play().catch(e => console.log("Autoplay blocked", e));
      } else {
        audioRef.current = new Audio(currentSong.url);
        audioRef.current.volume = volume;
      }

      audioRef.current.ontimeupdate = () => {
        if (audioRef.current) {
             const duration = audioRef.current.duration || 30; // Previews are usually 30s
             setProgress((audioRef.current.currentTime / duration) * 100);
        }
      };

      audioRef.current.onended = handleNext;
    }
  }, [currentSong]);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) audioRef.current.play();
      else audioRef.current.pause();
    }
  }, [isPlaying]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  const handleNext = () => {
    if (!currentSong) return;
    const currentIndex = playlist.findIndex(s => s.id === currentSong.id);
    const nextIndex = (currentIndex + 1) % playlist.length;
    setCurrentSong(playlist[nextIndex]);
    setIsPlaying(true);
  };

  const handlePrev = () => {
    if (!currentSong) return;
    const currentIndex = playlist.findIndex(s => s.id === currentSong.id);
    const prevIndex = currentIndex === 0 ? playlist.length - 1 : currentIndex - 1;
    setCurrentSong(playlist[prevIndex]);
    setIsPlaying(true);
  };

  return (
    <div className="flex h-full bg-[#1e1e1e] text-white/90 font-sans select-none overflow-hidden">
      
      {/* --- Sidebar --- */}
      <div className="w-56 bg-[#262626]/50 border-r border-white/10 flex flex-col pt-8 pb-4 backdrop-blur-xl shrink-0 hidden md:flex">
        <form onSubmit={handleSearch} className="px-4 mb-6">
          <div className="relative group">
            <Search className="absolute left-2.5 top-1.5 text-white/30 w-4 h-4 group-focus-within:text-red-400 transition-colors" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Apple Music" 
              className="w-full bg-black/20 border border-white/10 rounded-lg py-1.5 pl-9 text-sm text-white focus:outline-none focus:ring-1 focus:ring-red-500/50 transition-all placeholder:text-white/20"
            />
          </div>
        </form>

        <div className="space-y-1 px-2">
          <SidebarItem icon={Home} label="Listen Now" onClick={() => searchMusic('top hits')} active />
          <SidebarItem icon={Grid} label="Browse" onClick={() => searchMusic('coding lo-fi')} />
          <SidebarItem icon={Radio} label="Radio" onClick={() => searchMusic('radio')} />
        </div>

        <div className="mt-6 px-4 text-xs font-semibold text-white/40 uppercase tracking-wider mb-2">Library</div>
        <div className="space-y-1 px-2">
          <SidebarItem icon={ListMusic} label="Recent" onClick={() => searchMusic('2024 hits')} />
          <SidebarItem icon={Mic2} label="Artists" onClick={() => searchMusic('weekend')} />
        </div>
      </div>

      {/* --- Main Content --- */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#1e1e1e] relative">
        
        {/* Controls Bar */}
        <div className="h-16 border-b border-white/10 flex items-center justify-between px-6 bg-[#262626]/80 backdrop-blur-md z-20">
           <div className="flex items-center gap-5 text-white/80">
              <button onClick={handlePrev} className="hover:text-white transition active:scale-95 cursor-pointer"><SkipBack size={20} fill="currentColor" /></button>
              <button onClick={() => setIsPlaying(!isPlaying)} className="hover:scale-105 transition active:scale-95 bg-white text-black rounded-full p-1 cursor-pointer">
                 {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className="ml-1" />}
              </button>
              <button onClick={handleNext} className="hover:text-white transition active:scale-95 cursor-pointer"><SkipForward size={20} fill="currentColor" /></button>
           </div>

           {/* Now Playing Info (Centered) */}
           <div className="flex flex-col items-center max-w-[40%]">
             {currentSong && (
               <div className="bg-white/5 border border-white/5 px-6 py-1.5 rounded-lg flex items-center gap-3">
                  <img src={currentSong.cover} className="w-8 h-8 rounded shadow-sm" alt="art" />
                  <div className="flex flex-col overflow-hidden">
                    <span className="text-xs font-semibold truncate max-w-[150px]">{currentSong.title}</span>
                    <span className="text-[10px] text-white/50 truncate max-w-[150px]">{currentSong.artist}</span>
                  </div>
               </div>
             )}
           </div>

           {/* Volume */}
           <div className="flex items-center gap-2 w-28 group">
              <Volume2 size={16} className="text-white/50 group-hover:text-white transition-colors" />
              <input 
                type="range" 
                min="0" 
                max="1" 
                step="0.01" 
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-white hover:bg-white/30"
              />
           </div>
        </div>

        {/* Scrollable Grid */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 macos-scrollbar bg-gradient-to-b from-[#262626] to-[#1e1e1e]">
          {isSearching ? (
             <div className="flex h-full items-center justify-center">
                <Loader2 className="w-10 h-10 text-red-500 animate-spin" />
             </div>
          ) : (
            <>
              <h1 className="text-3xl font-bold mb-6 tracking-tight flex items-center gap-2">
                {searchQuery ? `Results for "${searchQuery}"` : 'Top Picks'}
              </h1>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 pb-12">
                {playlist.map((song) => (
                  <div 
                    key={song.id} 
                    onClick={() => { setCurrentSong(song); setIsPlaying(true); }}
                    className="group cursor-pointer p-4 rounded-xl hover:bg-white/5 transition duration-200 border border-transparent hover:border-white/5"
                  >
                    <div className="aspect-square rounded-lg overflow-hidden shadow-lg mb-4 relative">
                      <img 
                        src={song.cover} 
                        alt={song.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500" 
                      />
                      {/* Hover Overlay */}
                      <div className={`absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-[2px] transition-opacity duration-200 ${currentSong?.id === song.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                           {currentSong?.id === song.id && isPlaying ? (
                             <Pause className="w-10 h-10 text-white fill-current" />
                           ) : (
                             <Play className="w-10 h-10 text-white fill-current" />
                           )}
                      </div>
                    </div>
                    <h3 className={`font-semibold text-sm truncate ${currentSong?.id === song.id ? 'text-red-400' : 'text-white'}`}>{song.title}</h3>
                    <p className="text-xs text-white/50 truncate hover:text-white/70 transition-colors">{song.artist}</p>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Progress Bar (Attached to bottom) */}
        <div 
          className="h-1.5 bg-black w-full cursor-pointer relative group" 
          onClick={(e) => {
            if (audioRef.current) {
              const rect = e.currentTarget.getBoundingClientRect();
              const percent = (e.clientX - rect.left) / rect.width;
              audioRef.current.currentTime = percent * audioRef.current.duration;
              setProgress(percent * 100);
            }
          }}
        >
           <div className="h-full bg-white/10 w-full absolute top-0 left-0" />
           <motion.div 
             className="h-full bg-red-500 relative" 
             style={{ width: `${progress}%` }}
             layoutId="progressbar"
           >
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 shadow-lg transform scale-150 transition-all" />
           </motion.div>
        </div>
      </div>
    </div>
  );
}

const SidebarItem = ({ icon: Icon, label, active = false, onClick }: any) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-colors text-left ${active ? 'bg-red-500/20 text-red-400 font-medium' : 'text-white/70 hover:bg-white/5 hover:text-white'}`}
  >
    <Icon size={18} />
    <span className="text-sm">{label}</span>
  </button>
);
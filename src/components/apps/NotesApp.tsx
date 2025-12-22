import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, Trash2, SquarePen, AlertCircle, X, Briefcase, Mail, Github, Linkedin, 
  Plus, Pencil, Save, PanelLeft, MapPin
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Note, initialNotes } from '@/data/notes.data';
import { profileData, skills, experiences } from '@/data/portfolio.data';

export default function NotesApp() {
  const [notes, setNotes] = useState<Note[]>(initialNotes);
  const [activeNoteId, setActiveNoteId] = useState<string | null>('about');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const createNote = () => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: 'New Note',
      date: new Date().toLocaleDateString(),
      preview: 'No additional text',
      isPortfolio: false,
      body: ''
    };
    setNotes([newNote, ...notes]);
    setActiveNoteId(newNote.id);
    setIsEditing(true);
    if (!isSidebarOpen) setIsSidebarOpen(true);
  };

  const deleteNoteById = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (id === 'about') {
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
      return;
    }
    const newNotes = notes.filter(n => n.id !== id);
    setNotes(newNotes);
    if (activeNoteId === id) {
       setActiveNoteId(newNotes.length > 0 ? newNotes[0].id : null);
    }
  };

  const deleteActiveNote = () => {
    if (activeNoteId) {
      deleteNoteById({ stopPropagation: () => {} } as React.MouseEvent, activeNoteId);
    }
  };

  const updateNoteContent = (field: 'title' | 'body', value: string) => {
    setNotes(notes.map(note => {
      if (note.id === activeNoteId) {
        const updates: Partial<Note> = { [field]: value };
        if (field === 'body') {
           updates.preview = value.slice(0, 50).replace(/\n/g, ' ') || 'No additional text';
        }
        return { ...note, ...updates };
      }
      return note;
    }));
  };

  const filteredNotes = notes.filter(note => 
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.preview.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeNote = notes.find(n => n.id === activeNoteId);

  return (
    <div className="flex w-full h-full bg-[#1e1e1e] text-white/90 font-[-apple-system,BlinkMacSystemFont,'Inter',sans-serif] overflow-hidden">
      
      {/* Permission Alert */}
      {showAlert && (
        <div className="absolute top-16 right-8 z-50 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="bg-[#2c2c2c] border border-red-500/50 text-white px-4 py-3 rounded-lg shadow-2xl flex items-center gap-3 w-80 backdrop-blur-md bg-opacity-95">
             <div className="bg-red-500/20 p-2 rounded-full text-red-400"><AlertCircle size={20} /></div>
             <div>
               <h4 className="font-bold text-sm text-red-400">Action Denied</h4>
               <p className="text-xs text-gray-300">The "About Me" profile cannot be deleted.</p>
             </div>
             <button onClick={() => setShowAlert(false)} className="ml-auto text-gray-500 hover:text-white cursor-pointer"><X size={14} /></button>
          </div>
        </div>
      )}

      {/* --- SIDEBAR (Collapsible) --- */}
      <AnimatePresence initial={false}>
        {isSidebarOpen && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 260, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.25, 1, 0.5, 1] }}
            className="bg-[#2d2d2d]/95 backdrop-blur-xl border-r border-black/50 shrink-0 h-full flex flex-col overflow-hidden whitespace-nowrap"
          >
            <div className="w-65">
                {/* Sidebar Header */}
                <div className="h-14 flex items-center gap-2 px-4 shrink-0 pt-2 pb-2">
                  <div className="relative w-full group">
                    <Search size={14} className="absolute left-2.5 top-1.5 text-gray-500 group-focus-within:text-white/70 transition-colors" />
                    <input 
                      type="text" placeholder="Search" value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-[#1c1c1c] rounded-md py-1 pl-8 pr-3 text-[13px] text-gray-200 focus:outline-none focus:ring-1 focus:ring-[#dcae48]/50 placeholder:text-gray-500 border border-white/5 shadow-inner transition-all"
                    />
                  </div>
                  <button onClick={createNote} className="p-1.5 text-gray-400 hover:text-[#dcae48] hover:bg-white/5 rounded-md transition-all cursor-pointer" title="Create New Note">
                    <Plus size={18} />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto px-2 space-y-0.5 macos-scrollbar min-h-0 h-[calc(100vh-60px)]">
                  <div className="text-[10px] font-bold text-gray-500/60 px-3 mb-1 mt-2 tracking-wider">ICLOUD</div>
                  {filteredNotes.map((note) => (
                    <div 
                      key={note.id} onClick={() => setActiveNoteId(note.id)}
                      className={`
                        group relative px-4 py-3 mx-1 rounded-md cursor-pointer transition-all duration-100 select-none
                        ${activeNoteId === note.id ? 'bg-[#dcae48] text-white' : 'hover:bg-white/5 text-gray-300'}
                      `}
                    >
                      <div className="flex justify-between items-baseline mb-0.5">
                        <span className={`text-[14px] font-bold truncate ${activeNoteId === note.id ? 'text-black/90' : 'text-gray-100 group-hover:text-white'}`}>{note.title}</span>
                        <span className={`text-[12px] ${activeNoteId === note.id ? 'text-black/70' : 'text-gray-500 group-hover:text-gray-400'}`}>{note.date}</span>
                      </div>
                      <div className={`text-[13px] truncate leading-tight ${activeNoteId === note.id ? 'text-black/80 font-medium' : 'text-gray-500 group-hover:text-gray-400'}`}>{note.preview}</div>
                      
                      <button 
                        onClick={(e) => deleteNoteById(e, note.id)}
                        className={`absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer ${activeNoteId === note.id ? 'text-black/60 hover:text-red-600 hover:bg-black/10' : 'text-gray-500 hover:text-red-400 hover:bg-[#1e1e1e]'}`}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- MAIN CONTENT --- */}
      <div className="flex-1 bg-[#1c1c1c] flex flex-col h-full min-h-0 relative overflow-hidden">
        
        {/* Toolbar */}
        <div className="h-14 flex items-center justify-between px-6 shrink-0 bg-[#1c1c1c] border-b border-white/5 z-20">
           <div className="flex gap-4 items-center">
              <button 
                onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
                className={`p-2 rounded-md transition-colors ${isSidebarOpen ? 'text-[#dcae48]' : 'text-gray-500 hover:text-white'}`}
                title="Toggle Sidebar"
              >
                <PanelLeft size={20} strokeWidth={1.5} />
              </button>

              <button onClick={deleteActiveNote} className={`p-2 rounded-md transition-colors ${activeNoteId === 'about' ? 'text-gray-700 cursor-not-allowed' : 'text-gray-500 hover:bg-white/5 hover:text-red-400 cursor-pointer'}`}>
                <Trash2 size={18} strokeWidth={1.5} />
              </button>
           </div>
           
           <span className="text-xs text-gray-500 font-medium">{activeNote?.date}</span>
           
           <div className="flex gap-4">
               {!activeNote?.isPortfolio && activeNote && (
                 <button 
                   onClick={() => setIsEditing(!isEditing)}
                   className={`p-2 rounded-md transition-colors ${isEditing ? 'text-[#dcae48] bg-[#dcae48]/10' : 'text-gray-500 hover:text-white'}`}
                   title={isEditing ? "Save & View" : "Edit Note"}
                 >
                   {isEditing ? <Save size={18} /> : <Pencil size={18} />}
                 </button>
               )}
               <button onClick={createNote} className="p-2 text-[#dcae48] hover:text-[#fdd875] hover:bg-[#dcae48]/10 rounded-md transition-colors cursor-pointer"><SquarePen size={20} strokeWidth={1.5} /></button>
           </div>
        </div>

        {/* Content View */}
        <div className={`flex-1 w-full relative ${activeNote?.isPortfolio ? 'overflow-hidden' : 'overflow-y-auto macos-scrollbar'}`}>
           {!activeNote ? (
               <div className="flex h-full items-center justify-center text-gray-600">No Note Selected</div>
           ) : activeNote.isPortfolio ? (
             <PortfolioSplitView />
           ) : (
             <div className="max-w-4xl mx-auto px-8 py-8 h-full flex flex-col">
               {isEditing ? (
                 <div className="flex flex-col h-full gap-4 animate-in fade-in duration-200">
                    <input 
                      type="text" value={activeNote.title} onChange={(e) => updateNoteContent('title', e.target.value)}
                      className="text-3xl font-bold bg-transparent text-white border-b border-white/10 pb-2 focus:outline-none focus:border-[#dcae48]" placeholder="Note Title"
                    />
                    <textarea 
                      value={activeNote.body} onChange={(e) => updateNoteContent('body', e.target.value)} 
                      placeholder="Start typing your note..." className="flex-1 w-full bg-transparent text-gray-200 text-lg resize-none focus:outline-none leading-relaxed font-light placeholder:text-gray-700" autoFocus
                    />
                 </div>
               ) : (
                 <div className="space-y-6 animate-in fade-in duration-200">
                    <h1 className="text-3xl font-bold text-white border-b border-white/5 pb-4">{activeNote.title}</h1>
                    <div className="text-gray-300 text-lg leading-relaxed whitespace-pre-wrap font-light">
                      {activeNote.body || <span className="text-gray-600 italic">No content. Click the pencil icon to edit.</span>}
                    </div>
                 </div>
               )}
             </div>
           )}
        </div>
      </div>
    </div>
  );
}

// --- PORTFOLIO COMPONENTS ---

function PortfolioSplitView() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setWidth(entry.contentRect.width);
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // 1. Large Screens (> 1200px): 3-Column Layout
  if (width > 1200) {
    return (
      <div ref={containerRef} className="flex w-full h-full divide-x divide-white/5 bg-[#1c1c1c]">
        {/* Profile: 28% */}
        <div className="w-[31%] min-w-75 shrink-0 h-full overflow-y-auto macos-scrollbar p-8 bg-[#1e1e1e]/30">
           <ProfileSection centered={true} />
        </div>
        {/* Experience: Flexible Middle */}
        <div className="flex-1 min-w-[320px] h-full overflow-y-auto macos-scrollbar pb-8 pr-8 pl-8">
           <ExperienceSection />
        </div>
        {/* Tech: 38% */}
        <div className="w-[38%] min-w-105 shrink-0 h-full overflow-y-auto macos-scrollbar pl-6 pr-6 bg-[#1e1e1e]/30">
           <TechSection columns={2} />
        </div>
      </div>
    );
  } 
  
  // 2. Medium Screens (700px - 1200px): 2-Column Layout
  else if (width > 700) {
    return (
      <div ref={containerRef} className="flex w-full h-full divide-x divide-white/5 bg-[#1c1c1c]">
        <div className="w-[42%] min-w-95 shrink-0 h-full pb-8 pr-8 pl-8 flex flex-col justify-center text-center bg-[#1e1e1e]/30 overflow-y-auto macos-scrollbar">
           <ProfileSection centered={true} />
        </div>
        
        {/* Right side takes remaining space */}
        <div className="flex-1 h-full overflow-y-auto macos-scrollbar pb-8 pr-8 pl-8">
           <div className="max-w-3xl mx-auto">
             <ExperienceSection />
             {/* Force 2 columns for tech since we have more vertical space here */}
             <TechSection columns={2} />
           </div>
        </div>
      </div>
    );
  }

  // 3. Small Screens (< 700px): Single Column Scroll
  return (
    <div ref={containerRef} className="w-full h-full overflow-y-auto macos-scrollbar pb-8 pr-8 pl-8 bg-[#1c1c1c]">
       <div className="max-w-xl mx-auto">
          <ProfileSection centered={true} />
          <ExperienceSection />
          <TechSection columns={1} />
       </div>
    </div>
  );
}

function ProfileSection({ centered }: { centered?: boolean }) {
  return (
    <div className={`space-y-6 ${centered ? 'flex flex-col items-center text-center' : ''} animate-in fade-in slide-in-from-bottom-4 duration-700 pt-8`}>
      <div className="relative group w-40 h-40">
          <div className="absolute inset-0 rounded-full bg-linear-to-tr from-[#dcae48] to-purple-500 blur-lg opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
          <img src="/me.jpg" alt="Profile" className="relative w-full h-full rounded-full object-cover border-2 border-white/10 shadow-2xl z-10" />
      </div>
      
      <div className="space-y-2">
          <h1 className="text-3xl font-bold text-white tracking-tight">{profileData.name}</h1>
          <p className="text-base text-[#dcae48] font-medium tracking-wide">{profileData.role}</p>
          <div className="flex items-center gap-1.5 justify-center text-sm text-gray-400">
            <MapPin size={14} className="text-gray-500" />
            <span>{profileData.location}</span>
          </div>
      </div>

      <div className="flex items-center gap-2 text-[12px] font-medium text-gray-300 bg-white/5 py-1.5 px-4 rounded-full border border-white/5 w-fit shadow-sm">
        {/* Static, classy emerald glow instead of frantic ping */}
        <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
        {profileData.status}
      </div>

      <div className="flex items-center gap-4 pt-2">
        <SocialBtn icon={<Mail size={16} />} href={`mailto:${profileData.contact.email}`} />
        <SocialBtn icon={<Github size={16} />} href={profileData.contact.github} />
        <SocialBtn icon={<Linkedin size={16} />} href={profileData.contact.linkedin} />
      </div>

      <div className="pt-6 border-t border-white/5 w-full">
        <p className="text-sm text-gray-400 leading-relaxed font-light">
          {profileData.bio}
          <br/>Specialized in <span className="text-gray-200 font-medium">{profileData.specialization}</span>.
        </p>
      </div>
    </div>
  );
}

function ExperienceSection() {
  return (
    <div className="animate-in slide-in-from-right-4 duration-700 delay-100">
      {/* Header: Sticky & Solid Background to prevent bleed-through */}
      <div className="flex items-center gap-3 mb-8 border-b border-white/5 pt-8 pb-2 sticky top-0 bg-[#1c1c1c] z-30">
        <Briefcase className="text-[#dcae48]" size={20} />
        <h2 className="text-lg font-bold text-white tracking-tight">Experience</h2>
      </div>

      {/* Timeline Container */}
      <div className="relative ml-3 space-y-0">
        
        {/* The Vertical Line (Gradient fade at bottom) */}
        <div className="absolute left-0 top-2 bottom-0 w-px bg-linear-to-b from-white/20 via-white/10 to-transparent" />

        {experiences.map((exp, idx) => (
          <div key={idx} className="relative pl-8 pb-12 group">
            
            {/* Timeline Dot (Glows on hover) */}
            <div className={`
              absolute -left-1 top-2.5 w-2.25 h-2.25 rounded-full border-2 border-[#1c1c1c] z-10 transition-all duration-300
              ${exp.status === 'Present' ? 'bg-[#dcae48] shadow-[0_0_8px_rgba(220,174,72,0.6)]' : 'bg-gray-600 group-hover:bg-[#dcae48]'}
            `} />

            {/* Experience Card */}
            <div className="relative rounded-xl border border-white/5 bg-[#252525]/50 p-5 transition-all duration-300 hover:bg-[#252525] hover:border-[#dcae48]/30 hover:shadow-lg hover:-translate-y-0.5">
              
              {/* Card Header: Handles resizing via flex-wrap */}
              <div className="flex flex-wrap justify-between items-start gap-2 mb-3">
                <div className="flex flex-col">
                  <h3 className="text-[16px] font-bold text-white leading-tight group-hover:text-[#dcae48] transition-colors">
                    {exp.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[13px] text-gray-400 font-medium">{exp.company}</span>
                  </div>
                </div>

                {/* Date & Badge */}
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[11px] text-gray-500 font-mono bg-black/20 px-2 py-0.5 rounded border border-white/5 whitespace-nowrap">
                    {exp.status}
                  </span>
                  {/* Clean static dot for Present status instead of ping */}
                  {exp.status === 'Present' && (
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.5)]" title="Current Role"></div>
                  )}
                </div>
              </div>

              {/* Description */}
              <p className="text-[13px] text-gray-300 leading-relaxed font-light mb-4 border-l-2 border-white/5 pl-3 group-hover:border-[#dcae48]/50 transition-colors">
                {exp.description}
              </p>

              {/* Tech Stack Pills */}
              <div className="flex gap-2 flex-wrap">
                {exp.technologies.map((tech, techIdx) => (
                  <span 
                    key={techIdx} 
                    className="text-[10px] text-gray-400 bg-white/5 px-2.5 py-1 rounded-sm border border-transparent hover:border-white/10 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TechSection({ columns }: { columns?: number }) {
  const gridClass = columns 
    ? `grid-cols-1 ${columns === 2 ? 'lg:grid-cols-2' : ''}` 
    : 'grid-cols-1 lg:grid-cols-2';

  return (
    <div className="animate-in slide-in-from-right-4 duration-700 delay-200">
       <div className="flex items-center gap-3 mb-6 border-b pt-8 border-white/5 pb-2 sticky top-0 bg-[#1c1c1c] z-30">
          <span className="text-[#dcae48] font-bold text-xl">#</span>
          <h2 className="text-lg font-bold text-white tracking-tight">Technologies</h2>
       </div>
       <div className={`grid ${gridClass} gap-4`}> 
          {skills.map((skill) => <TechCard key={skill.name} {...skill} />)}
       </div>
    </div>
  );
}

function TechCard({ name, desc, file }: any) {
  return (
    <div className="flex items-center gap-4 p-4 rounded-xl bg-[#252525] border border-white/5 hover:border-white/10 hover:bg-[#2a2a2a] transition-all duration-200 group cursor-default">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border border-white/5 bg-[#1e1e1e]`}>
         <img src={`/skills/${file}`} alt={name} className="w-7 h-7 object-contain opacity-90 group-hover:opacity-100 transition-opacity" onError={(e) => e.currentTarget.style.display='none'} />
      </div>
      
      <div className="min-w-0 flex flex-col justify-center">
        <div className="text-[15px] font-bold text-gray-100 leading-tight mb-0.5 group-hover:text-white transition-colors">{name}</div>
        <div className="text-[12px] text-gray-500 font-medium truncate group-hover:text-gray-400 transition-colors">{desc}</div>
      </div>
    </div>
  );
}

function SocialBtn({ icon, href }: { icon: any, href: string }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="p-2 bg-[#252525] rounded-lg text-gray-400 hover:text-white hover:bg-[#dcae48] transition-all duration-300 shadow-sm border border-white/5 hover:border-transparent">
      {icon}
    </a>
  );
}
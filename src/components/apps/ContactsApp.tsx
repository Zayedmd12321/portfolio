'use client';
import React, { useState } from 'react';
import { 
  Phone, Mail, MessageSquare, Search, 
  CheckCircle2, User, Layers, Zap, ThumbsUp, Clock
} from 'lucide-react';
import { CONTACTS } from '@/data/contacts.data';
import { Category, Contact } from '@/types/contacts.types';
import SidebarItem from '@/components/ui/contacts/ContactSidebarItem';
import ActionButton from '@/components/ui/contacts/ContactActionButton';
import InfoBox from '@/components/ui/contacts/ContactInfoBox';

export default function ContactsApp() {
  const [selectedContactId, setSelectedContactId] = useState<string>(CONTACTS[0].id);
  const [activeCategory, setActiveCategory] = useState<Category>('all');
  const [search, setSearch] = useState('');

  // Filter Logic (Category + Search)
  const filteredContacts = CONTACTS.filter(c => {
    const matchesSearch = (c.firstName + ' ' + c.lastName).toLowerCase().includes(search.toLowerCase()) ||
                          c.company.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === 'all' || c.type === activeCategory;
    
    return matchesSearch && matchesCategory;
  });

  const selectedContact = CONTACTS.find(c => c.id === selectedContactId) || CONTACTS[0];

  return (
    <div className="flex h-full w-full bg-white dark:bg-[#1e1e1e] text-black dark:text-white font-sans overflow-hidden rounded-b-xl">
      
      {/* --- SIDEBAR --- */}
      <div className="w-50 bg-[#f2f2f7]/80 dark:bg-[#252525]/80 border-r border-black/5 dark:border-white/5 pt-8 pb-4 flex flex-col gap-0.5 backdrop-blur-xl transition-colors duration-300">
        
        <div className="px-4 text-[11px] font-bold text-gray-400/80 mb-2 tracking-wider">ASSESSMENT</div>
        <SidebarItem 
          label="All Criteria" 
          icon={Layers}
          count={CONTACTS.length} 
          active={activeCategory === 'all'} 
          onClick={() => setActiveCategory('all')} 
        />
        
        <div className="px-4 text-[11px] font-bold text-gray-400/80 mt-6 mb-2 tracking-wider">CATEGORIES</div>
        <SidebarItem 
          label="Action Items" 
          icon={User}
          count={CONTACTS.filter(c => c.type === 'action').length} 
          active={activeCategory === 'action'} 
          onClick={() => setActiveCategory('action')} 
        />
        <SidebarItem 
          label="Hard Skills" 
          icon={Zap}
          count={CONTACTS.filter(c => c.type === 'skill').length} 
          active={activeCategory === 'skill'} 
          onClick={() => setActiveCategory('skill')} 
        />
        <SidebarItem 
          label="Soft Skills" 
          icon={ThumbsUp}
          count={CONTACTS.filter(c => c.type === 'soft').length} 
          active={activeCategory === 'soft'} 
          onClick={() => setActiveCategory('soft')} 
        />
        <SidebarItem 
          label="Logistics" 
          icon={Clock}
          count={CONTACTS.filter(c => c.type === 'logistics').length} 
          active={activeCategory === 'logistics'} 
          onClick={() => setActiveCategory('logistics')} 
        />
      </div>

      {/* --- CONTACT LIST --- */}
      <div className="w-70 bg-white dark:bg-[#1e1e1e] border-r border-black/5 dark:border-white/5 flex flex-col transition-colors duration-300">
        {/* Search Bar */}
        <div className="h-13 border-b border-black/5 dark:border-white/5 flex items-center px-4 shrink-0">
           <div className="bg-gray-100 dark:bg-[#2a2a2a] rounded-lg flex items-center w-full px-2.5 py-1.5 transition-colors">
              <Search size={14} className="text-gray-400" />
              <input 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search"
                className="bg-transparent border-none outline-none text-[13px] ml-2 w-full text-black dark:text-white placeholder-gray-400"
              />
           </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto">
           {filteredContacts.length === 0 ? (
             <div className="p-8 text-center text-gray-400 text-xs">No results found</div>
           ) : (
             filteredContacts.map(contact => (
               <button
                 key={contact.id}
                 onClick={() => setSelectedContactId(contact.id)}
                 className={`w-full text-left px-4 py-3 flex items-center gap-3 border-b border-black/5 dark:border-white/5 transition-all duration-200
                   ${selectedContactId === contact.id 
                      ? 'bg-[#007AFF] text-white' 
                      : 'hover:bg-gray-50 dark:hover:bg-[#2a2a2a]'
                   }`}
               >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white shadow-sm ${contact.color}`}>
                     <contact.avatar size={24} />
                  </div>
                  
                  <div className="overflow-hidden flex-1">
                     <div className={`text-[13px] font-semibold truncate ${selectedContactId === contact.id ? 'text-white' : 'text-black dark:text-white'}`}>
                        {contact.firstName} {contact.lastName}
                     </div>
                     <div className={`text-[11px] truncate mt-0.5 ${selectedContactId === contact.id ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'}`}>
                        {contact.company}
                     </div>
                  </div>
               </button>
             ))
           )}
        </div>
      </div>

      {/* --- DETAILS VIEW --- */}
      <div className="flex-1 bg-white dark:bg-[#1e1e1e] flex flex-col overflow-y-auto transition-colors duration-300">
         {/* Cover / Header Area */}
         <div className="px-12 py-10 flex flex-col items-center border-b border-black/5 dark:border-white/5">
            <div className={`w-28 h-28 rounded-full flex items-center justify-center text-white shadow-xl mb-6 ${selectedContact.color}`}>
               <selectedContact.avatar size={48} />
            </div>
            
            <h1 className="text-2xl font-bold text-black dark:text-white text-center tracking-tight">
               {selectedContact.firstName} {selectedContact.lastName}
            </h1>
            
            <div className="mt-2 px-3 py-1 bg-gray-100 dark:bg-[#2a2a2a] rounded-full text-xs font-medium text-gray-500 dark:text-gray-400 border border-black/5 dark:border-white/5">
               {selectedContact.role}
            </div>

            <div className="flex gap-4 mt-8">
               <ActionButton icon={MessageSquare} label="Message" />
               <ActionButton icon={Phone} label="Call" />
               <ActionButton icon={Mail} label="Email" />
            </div>
         </div>

         {/* Details List */}
         <div className="p-8 max-w-2xl mx-auto w-full space-y-6">
            <div className="grid grid-cols-2 gap-4">
                {selectedContact.location && (
                   <InfoBox label="Status" value={selectedContact.location} />
                )}
                {selectedContact.email && (
                   <InfoBox label="Contact" value={selectedContact.email} />
                )}
            </div>
            
            {/* The "Note" Card */}
            <div className="bg-gray-50/80 dark:bg-[#252525]/50 p-6 rounded-2xl border border-black/5 dark:border-white/5 relative group">
               <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Evaluation Note</span>
               </div>
               <p className="text-[15px] text-gray-700 dark:text-gray-200 leading-relaxed font-light">
                  "{selectedContact.note}"
               </p>
               {selectedContact.type !== 'action' && (
                   <div className="absolute top-6 right-6 text-green-500 dark:text-green-400 opacity-20">
                      <CheckCircle2 size={32} />
                   </div>
               )}
            </div>
         </div>
      </div>
    </div>
  );
}
'use client';
import React, { useState } from 'react';
import { Send, Paperclip, PenSquare, Inbox, CheckCircle2, Github, Linkedin, Mail, User, Star } from 'lucide-react';
import { useNotification } from '@/context/NotificationContext';

type Section = 'compose' | 'testimonials' | 'success';

interface MailAppProps {
  initialSection?: 'compose' | 'testimonials';
}

export default function MailApp({ initialSection = 'compose' }: MailAppProps) {
  const { showNotification } = useNotification();
  const [activeSection, setActiveSection] = useState<Section>(initialSection);
  const [sending, setSending] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({ from: '', subject: '', message: '' });

  const handleSend = async () => {
    if (!formData.from || !formData.message) {
      showNotification('Error', 'Please fill in all fields.', 'error');
      return;
    }
    setSending(true);
    // Simulate API
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    showNotification('Sent', 'Message received!', 'success');
    setSending(false);
    setActiveSection('success'); // Switch to success screen
    setFormData({ from: '', subject: '', message: '' });
  };

  return (
    <div className="flex h-full w-full bg-[#1e1e1e] text-white font-sans overflow-hidden rounded-b-xl">
      
      {/* --- SIDEBAR --- */}
      <div className="w-64 bg-[#262626]/80 backdrop-blur-xl border-r border-white/10 flex flex-col pt-5 pb-4">
        <div className="px-4 mb-4">
           <button 
             onClick={() => setActiveSection('compose')}
             className="w-full flex items-center justify-center gap-2 bg-[#007AFF] hover:bg-[#0062cc] transition-colors py-1.5 rounded-md shadow-sm active:scale-[0.98] cursor-pointer"
           >
             <PenSquare size={14} className="text-white" />
             <span className="text-[13px] font-medium text-white">New Message</span>
           </button>
        </div>

        <div className="flex-1 overflow-y-auto px-2 space-y-0.5">
           <div className="px-3 py-1 text-[11px] font-semibold text-white/30 uppercase tracking-wider mb-1">Menu</div>
           
           <SidebarItem 
             icon={PenSquare} 
             label="Compose" 
             isActive={activeSection === 'compose' || activeSection === 'success'} 
             onClick={() => setActiveSection('compose')} 
           />
           
           <SidebarItem 
             icon={Inbox} 
             label="Testimonials" 
             count={0} 
             isActive={activeSection === 'testimonials'} 
             onClick={() => setActiveSection('testimonials')} 
           />
        </div>
      </div>

      {/* --- MAIN CONTENT AREA --- */}
      <div className="flex-1 flex flex-col bg-[#1e1e1e] relative">
        
        {/* VIEW 1: COMPOSE FORM */}
        {activeSection === 'compose' && (
          <>
             {/* Toolbar */}
             <div className="h-12 border-b border-white/5 flex items-center justify-between px-6 shrink-0 bg-[#2C2C2C]/30">
                <span className="text-xs font-medium text-white/40">Draft</span>
                <button 
                  onClick={handleSend}
                  disabled={sending}
                  className="flex items-center gap-2 text-[#007AFF] hover:text-[#409cff] disabled:opacity-50 transition-colors cursor-pointer"
                >
                   <Send size={15} />
                   <span className="text-sm font-medium">{sending ? 'Sending...' : 'Send'}</span>
                </button>
             </div>

             {/* Form */}
             <div className="flex flex-col h-full">
                <div className="flex items-center px-6 py-3 border-b border-white/5">
                   <span className="w-16 text-[13px] text-white/40 text-right mr-4">To:</span>
                   <div className="bg-[#007AFF]/20 text-[#007AFF] px-2 py-0.5 rounded text-[13px] font-medium border border-[#007AFF]/30">
                      Md Zayed Ghanchi
                   </div>
                </div>
                <div className="flex items-center px-6 py-3 border-b border-white/5">
                   <span className="w-16 text-[13px] text-white/40 text-right mr-4">From:</span>
                   <input 
                      className="flex-1 bg-transparent border-none outline-none text-[14px] text-white placeholder-white/20"
                      placeholder="your@email.com"
                      value={formData.from}
                      onChange={(e) => setFormData({...formData, from: e.target.value})}
                   />
                </div>
                <div className="flex items-center px-6 py-3 border-b border-white/5">
                   <span className="w-16 text-[13px] text-white/40 text-right mr-4">Subject:</span>
                   <input 
                      className="flex-1 bg-transparent border-none outline-none text-[14px] font-medium text-white placeholder-white/20"
                      placeholder="Project Inquiry"
                      value={formData.subject}
                      onChange={(e) => setFormData({...formData, subject: e.target.value})}
                   />
                </div>
                <textarea 
                   className="flex-1 p-6 bg-transparent border-none outline-none text-[15px] leading-relaxed text-white/90 placeholder-white/20 resize-none font-light"
                   placeholder="Hi Zayed, I saw your portfolio and..."
                   value={formData.message}
                   onChange={(e) => setFormData({...formData, message: e.target.value})}
                />
             </div>
          </>
        )}

        {/* VIEW 2: SUCCESS / CONTACT DETAILS */}
        {activeSection === 'success' && (
           <div className="flex flex-col items-center justify-center h-full p-8 text-center animate-in fade-in zoom-in duration-300">
              <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mb-6 border border-green-500/20 shadow-[0_0_30px_rgba(34,197,94,0.2)]">
                 <CheckCircle2 size={32} className="text-green-500" />
              </div>
              <h2 className="text-2xl font-semibold text-white mb-2">Message Sent!</h2>
              <p className="text-white/60 max-w-sm mb-10 text-sm leading-relaxed">
                 Thanks for reaching out. I usually respond within 24 hours. While you wait, let's connect on other platforms:
              </p>

              <div className="grid grid-cols-2 gap-4 w-full max-w-md">
                 <ContactCard icon={Mail} label="Email" value="zayed@example.com" />
                 <ContactCard icon={Linkedin} label="LinkedIn" value="/in/zayedghanchi" href="#" />
                 <ContactCard icon={Github} label="GitHub" value="@zayedghanchi" href="#" />
                 <ContactCard icon={User} label="Resume" value="View PDF" href="#" />
              </div>

              <button 
                onClick={() => setActiveSection('compose')}
                className="mt-12 text-sm text-white/40 hover:text-white transition-colors"
              >
                 Send another message
              </button>
           </div>
        )}

        {/* VIEW 3: TESTIMONIALS */}
        {activeSection === 'testimonials' && (
           <div className="flex flex-col h-full">
              <div className="h-12 border-b border-white/5 flex items-center px-6 shrink-0 bg-[#2C2C2C]/30">
                 <span className="text-xs font-bold text-white uppercase tracking-wider">Inbox (0)</span>
              </div>
              {/* <div className="flex-1 overflow-y-auto p-4 space-y-3">
                 <TestimonialCard 
                    name="Sarah Jenkins" 
                    role="Product Manager @ TechFlow" 
                    subject="Exceptional Frontend Work"
                    body="Zayed transformed our messy Figma designs into a pixel-perfect React application. His attention to detail on the animations was exactly what we needed."
                    date="Yesterday"
                 />
                 <TestimonialCard 
                    name="David Chen" 
                    role="CTO @ StartupX" 
                    subject="Great Backend Optimization"
                    body="Hired Zayed to fix some API latency issues in our FastAPI backend. He not only fixed them but reduced load times by 40%. Highly recommended."
                    date="Last Week"
                 />
                 <TestimonialCard 
                    name="Emily Ross" 
                    role="Founder @ Designify" 
                    subject="A True Professional"
                    body="It's rare to find a developer who cares about UX as much as the code. Zayed suggested improvements to our user flow that increased conversion by 15%."
                    date="2 Weeks Ago"
                 />
              </div> */}
           </div>
        )}
      </div>
    </div>
  );
}

// --- SUB COMPONENTS ---

function SidebarItem({ icon: Icon, label, count, isActive, onClick }: any) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2 rounded-md transition-all group cursor-pointer ${
         isActive ? 'bg-[#007AFF] text-white shadow-sm' : 'hover:bg-white/5 text-white/70 hover:text-white'
      }`}
    >
       <Icon size={16} className={isActive ? 'text-white' : 'text-white/50 group-hover:text-white'} />
       <span className="text-[13px] font-medium flex-1 text-left">{label}</span>
       {count && (
          <span className={`text-[11px] px-1.5 rounded-full ${isActive ? 'text-white/80 bg-black/10' : 'text-white/40'}`}>
             {count}
          </span>
       )}
    </button>
  );
}

function ContactCard({ icon: Icon, label, value, href }: any) {
   return (
      <a href={href} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all group cursor-pointer">
         <div className="w-10 h-10 rounded-lg bg-black/20 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Icon size={18} className="text-white/70 group-hover:text-white" />
         </div>
         <div className="text-left">
            <div className="text-[10px] text-white/40 uppercase tracking-wider font-semibold">{label}</div>
            <div className="text-sm text-white font-medium">{value}</div>
         </div>
      </a>
   )
}

function TestimonialCard({ name, role, subject, body, date }: any) {
   return (
      <div className="bg-[#2a2a2a]/40 border border-white/5 p-4 rounded-xl hover:bg-[#2a2a2a]/60 transition-colors cursor-default group">
         <div className="flex justify-between items-start mb-1">
            <div className="flex items-center gap-2">
               <div className="w-2 h-2 rounded-full bg-blue-500" />
               <span className="font-semibold text-sm text-white">{name}</span>
               <span className="text-xs text-white/40">• {role}</span>
            </div>
            <span className="text-xs text-white/30">{date}</span>
         </div>
         <div className="text-sm font-medium text-white/90 mb-1">{subject}</div>
         <p className="text-xs text-white/60 leading-relaxed line-clamp-2 group-hover:line-clamp-none transition-all">
            {body}
         </p>
         <div className="mt-3 flex gap-1">
            {[1,2,3,4,5].map(i => <Star key={i} size={10} className="text-yellow-500 fill-yellow-500" />)}
         </div>
      </div>
   )
}
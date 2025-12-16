'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Command, CheckCircle, AlertCircle } from 'lucide-react';
import { useNotification } from '@/context/NotificationContext';

export default function Notification() {
  const { isVisible, notification } = useNotification();

  // Don't render if no notification or not visible
  if (!notification || !isVisible) return null;

  // Dynamic styling based on notification type
  const getTypeStyles = () => {
    switch (notification.type) {
      case 'success':
        return {
          gradient: 'from-emerald-600 to-green-500',
          shadow: 'rgba(16,185,129,0.3)',
          icon: CheckCircle,
          label: 'Success'
        };
      case 'error':
        return {
          gradient: 'from-red-600 to-orange-500',
          shadow: 'rgba(239,68,68,0.3)',
          icon: AlertCircle,
          label: 'Error'
        };
      default: // 'system'
        return {
          gradient: 'from-blue-600 to-cyan-500',
          shadow: 'rgba(59,130,246,0.3)',
          icon: Sparkles,
          label: 'System'
        };
    }
  };

  const typeStyles = getTypeStyles();
  const Icon = typeStyles.icon;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, x: 20, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
          exit={{ opacity: 0, x: 20, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
          className="absolute top-12 right-5 w-88 z-99999 pointer-events-none select-none"
        >
          {/* Notification Card */}
          <div className="relative overflow-hidden rounded-2xl bg-[#2a2a2a]/60 backdrop-blur-3xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)] p-4 flex gap-4">
            
            {/* Ambient Glow Background */}
            <div className="absolute top-0 left-0 w-full h-full bg-linear-to-br from-white/5 to-transparent pointer-events-none" />

            {/* Icon Container */}
            <div className="relative z-10 shrink-0">
               <motion.div 
                 animate={{ 
                   boxShadow: [
                     `0 0 0px ${typeStyles.shadow.replace('0.3', '0')}`, 
                     `0 0 15px ${typeStyles.shadow}`, 
                     `0 0 0px ${typeStyles.shadow.replace('0.3', '0')}`
                   ] 
                 }}
                 transition={{ duration: 3, repeat: Infinity }}
                 className={`w-12 h-12 rounded-xl bg-linear-to-br ${typeStyles.gradient} flex items-center justify-center shadow-lg border border-white/10`}
               >
                 <Icon className="text-white w-6 h-6 drop-shadow-md" />
               </motion.div>
            </div>

            {/* Text Content */}
            <div className="flex flex-col justify-center z-10 flex-1 min-w-0">
              <div className="flex items-center gap-1.5 mb-0.5 opacity-60">
                <Command size={10} className="text-white" />
                <span className="text-[10px] uppercase tracking-wider font-bold text-white">
                  {typeStyles.label}
                </span>
              </div>
              
              <h4 className="text-white text-[15px] font-semibold leading-tight mb-1">
                {notification.title}
              </h4>
              
              <p className="text-white/70 text-[13px] leading-snug font-light">
                {notification.message}
              </p>
            </div>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
import React, { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { backdropVariants, modalVariants, springTransition } from '../../utils/motion';

const Modal = ({ isOpen, onClose, title, children }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        /* ── Backdrop ──────────────────────────────────────────────── */
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-md"
          variants={backdropVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          onClick={onClose}
        >
          {/* ── Modal panel ──────────────────────────────────────────── */}
          <motion.div
            className="flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-[26px] border border-white/10 bg-[#131313]/98 shadow-[0_30px_80px_rgba(0,0,0,0.55),0_0_0_1px_rgba(229,9,20,0.06)]"
            variants={modalVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
            style={{ willChange: 'transform, opacity' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 p-6">
              <h2 className="text-lg font-semibold text-white">{title}</h2>
              <motion.button
                onClick={onClose}
                className="rounded-xl p-2 -mr-2 text-muted-foreground transition-colors hover:bg-white/5 hover:text-white"
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                transition={springTransition}
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-6">
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Modal;

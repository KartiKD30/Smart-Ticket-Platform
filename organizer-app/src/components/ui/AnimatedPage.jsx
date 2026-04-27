import React from 'react';
import { motion } from 'framer-motion';
import { springTransition } from '../../utils/motion';

export const AnimatedPage = ({ children, className = 'space-y-8' }) => (
  <motion.div
    className={className}
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -8 }}
    transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
  >
    {children}
  </motion.div>
);

export const AnimatedSection = ({ children, className = '' }) => (
  <motion.section
    className={className}
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={springTransition}
  >
    {children}
  </motion.section>
);

export default AnimatedPage;

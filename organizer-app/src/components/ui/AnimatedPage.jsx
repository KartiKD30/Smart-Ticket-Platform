import React from 'react';
import { motion } from 'framer-motion';
import { pageShellVariants, sectionVariants, springTransition } from '../../utils/motion';

/* ─── PageWrapper / AnimatedPage ─────────────────────────────────────────────
   Wraps page content with a fade + slide-up on mount and exit.
   Usage: <AnimatedPage> ... </AnimatedPage>
*/
export const AnimatedPage = ({ children, className = 'space-y-8' }) => (
  <motion.div
    className={className}
    variants={pageShellVariants}
    initial="initial"
    animate="animate"
    exit="exit"
  >
    {children}
  </motion.div>
);

/* ─── AnimatedSection ────────────────────────────────────────────────────────
   A section that fades + slides up. Works as a child of AnimatedPage stagger.
*/
export const AnimatedSection = ({ children, className = '' }) => (
  <motion.section
    className={className}
    variants={sectionVariants}
  >
    {children}
  </motion.section>
);

/* ─── AnimatedCard ───────────────────────────────────────────────────────────
   Reusable card with stagger, hover lift + red glow, scale-in on mount.
   Usage: <AnimatedCard className="p-6"> ... </AnimatedCard>
*/
export const AnimatedCard = ({ children, className = '', onClick, style }) => (
  <motion.div
    className={className}
    style={style}
    onClick={onClick}
    variants={{
      initial: { opacity: 0, y: 20, scale: 0.97 },
      animate: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { duration: 0.38, ease: [0.22, 1, 0.36, 1] },
      },
    }}
    whileHover={{
      y: -5,
      boxShadow: '0 28px 60px rgba(229,9,20,0.13), 0 10px 26px rgba(0,0,0,0.38)',
      transition: { duration: 0.22, ease: 'easeOut' },
    }}
  >
    {children}
  </motion.div>
);

/* ─── AnimatedButton ─────────────────────────────────────────────────────────
   Micro-interaction button with hover scale, tap shrink, and glow transition.
   Usage: <AnimatedButton onClick={fn} className="..."> Label </AnimatedButton>
*/
export const AnimatedButton = ({
  children,
  onClick,
  className = '',
  disabled = false,
  type = 'button',
  style,
}) => (
  <motion.button
    type={type}
    onClick={onClick}
    disabled={disabled}
    className={className}
    style={style}
    whileHover={disabled ? {} : { scale: 1.055, transition: { duration: 0.18, ease: 'easeOut' } }}
    whileTap={disabled ? {} : { scale: 0.96, transition: { duration: 0.1 } }}
    transition={springTransition}
  >
    {children}
  </motion.button>
);

/* ─── AnimatedTableRow ───────────────────────────────────────────────────────
   Table row that fades + slides in from below with stagger support.
*/
export const AnimatedTableRow = ({ children, className = '' }) => (
  <motion.tr
    className={className}
    variants={{
      initial: { opacity: 0, y: 10 },
      animate: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.26, ease: [0.22, 1, 0.36, 1] },
      },
    }}
  >
    {children}
  </motion.tr>
);

/* ─── SkeletonCard ────────────────────────────────────────────────────────────
   Shimmer skeleton placeholder for loading states.
   Usage: <SkeletonCard lines={3} />
*/
export const SkeletonCard = ({ lines = 2, className = '' }) => (
  <div className={`panel-card space-y-3 ${className}`}>
    <div className="skeleton h-4 w-2/5 rounded-lg" />
    {Array.from({ length: lines }).map((_, i) => (
      <div
        key={i}
        className="skeleton rounded-lg"
        style={{
          height: i === 0 ? '2.5rem' : '0.85rem',
          width: i === 0 ? '65%' : `${80 - i * 12}%`,
        }}
      />
    ))}
  </div>
);

/* ─── SkeletonRow ────────────────────────────────────────────────────────────
   Table row skeleton for table loading states.
*/
export const SkeletonRow = ({ cols = 4 }) => (
  <tr>
    {Array.from({ length: cols }).map((_, i) => (
      <td key={i} className="px-6 py-4">
        <div className="skeleton h-3.5 rounded" style={{ width: `${60 + (i % 3) * 15}%` }} />
      </td>
    ))}
  </tr>
);

export default AnimatedPage;

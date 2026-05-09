// ─── Transitions ─────────────────────────────────────────────────────────────

export const springTransition = {
  type: 'spring',
  stiffness: 160,
  damping: 24,
  mass: 0.85,
};

export const smoothTransition = {
  duration: 0.38,
  ease: [0.22, 1, 0.36, 1],
};

export const fastTransition = {
  duration: 0.22,
  ease: [0.22, 1, 0.36, 1],
};

// ─── Page Shell ───────────────────────────────────────────────────────────────

export const pageShellVariants = {
  initial: { opacity: 0, y: 14 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.38,
      ease: [0.22, 1, 0.36, 1],
      when: 'beforeChildren',
      staggerChildren: 0.065,
    },
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: {
      duration: 0.22,
      ease: [0.4, 0, 1, 1],
    },
  },
};

// ─── Section ──────────────────────────────────────────────────────────────────

export const sectionVariants = {
  initial: { opacity: 0, y: 18 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

// ─── List / Stagger Container ────────────────────────────────────────────────

export const listVariants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.065,
      delayChildren: 0.04,
    },
  },
};

// ─── Card ─────────────────────────────────────────────────────────────────────

export const cardVariants = {
  initial: { opacity: 0, y: 20, scale: 0.97 },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.38,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

// ─── Table Row ────────────────────────────────────────────────────────────────

export const tableRowVariants = {
  initial: { opacity: 0, y: 10 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.26,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

// ─── Fade Up ──────────────────────────────────────────────────────────────────

export const fadeUpVariants = {
  initial: { opacity: 0, y: 22 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1],
    },
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: { duration: 0.2, ease: [0.4, 0, 1, 1] },
  },
};

// ─── Modal ────────────────────────────────────────────────────────────────────

export const backdropVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.22 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

export const modalVariants = {
  initial: { opacity: 0, scale: 0.94, y: 28 },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: springTransition,
  },
  exit: {
    opacity: 0,
    scale: 0.96,
    y: 14,
    transition: { duration: 0.2, ease: [0.4, 0, 1, 1] },
  },
};

// ─── Sidebar Item ────────────────────────────────────────────────────────────

export const sidebarItemVariants = {
  initial: { opacity: 0, x: -14 },
  animate: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.32,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

// ─── Hover helpers (inline use) ───────────────────────────────────────────────

export const hoverCard = {
  y: -5,
  boxShadow: '0 28px 60px rgba(229,9,20,0.14), 0 12px 28px rgba(0,0,0,0.38)',
  transition: springTransition,
};

export const hoverButton = {
  scale: 1.055,
  transition: { duration: 0.18, ease: 'easeOut' },
};

export const tapButton = {
  scale: 0.96,
  transition: { duration: 0.1 },
};

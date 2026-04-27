import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, CheckCircle2, ShieldAlert } from 'lucide-react';
import AnimatedPage, { AnimatedSection } from '../components/ui/AnimatedPage';
import { listVariants, tableRowVariants } from '../utils/motion';

const ResaleMonitoring = () => {
  const [resaleListings] = useState([
    { id: 1, event: 'Neon Nights Music Fest', originalPrice: 150, resalePrice: 180, cap: 195, status: 'listed' },
    { id: 2, event: 'Neon Nights Music Fest', originalPrice: 150, resalePrice: 200, cap: 195, status: 'flagged' },
    { id: 3, event: 'Tech Innovators Summit', originalPrice: 100, resalePrice: 120, cap: 130, status: 'sold' },
    { id: 4, event: 'Tech Innovators Summit', originalPrice: 300, resalePrice: 350, cap: 390, status: 'listed' },
  ]);

  return (
    <AnimatedPage>
      <AnimatedSection className="flex items-end justify-between gap-4">
        <div>
          <div className="eyebrow-chip border-amber-500/20 bg-amber-500/10 text-amber-300">
            <ShieldAlert className="h-4 w-4" />
            Policy Guard
          </div>
          <h2 className="mt-4 text-3xl font-bold tracking-tight">Resale Monitoring</h2>
          <p className="text-muted-foreground mt-1">Track secondary market sales and enforce price caps with a cleaner review table.</p>
        </div>
      </AnimatedSection>

      <AnimatedSection className="glass-table">
        <table className="w-full text-sm text-left">
          <thead className="bg-white/5 text-xs font-semibold uppercase text-muted-foreground">
            <tr>
              <th className="px-6 py-4">Event</th>
              <th className="px-6 py-4">Original Price</th>
              <th className="px-6 py-4">Resale Price</th>
              <th className="px-6 py-4">Max Cap</th>
              <th className="px-6 py-4">Compliance</th>
              <th className="px-6 py-4 text-right">Listing Status</th>
            </tr>
          </thead>
          <motion.tbody className="divide-y divide-border" variants={listVariants} initial="initial" animate="animate">
            {resaleListings.map((item) => {
              const isCompliant = item.resalePrice <= item.cap;
              return (
                <motion.tr key={item.id} className="transition-colors hover:bg-muted/50" variants={tableRowVariants}>
                  <td className="px-6 py-4 font-medium">{item.event}</td>
                  <td className="px-6 py-4 text-muted-foreground">Rs {item.originalPrice}</td>
                  <td className="px-6 py-4 font-medium">Rs {item.resalePrice}</td>
                  <td className="px-6 py-4 text-muted-foreground">Rs {item.cap}</td>
                  <td className="px-6 py-4">
                    {isCompliant ? (
                      <span className="flex items-center gap-1.5 font-medium text-green-500">
                        <CheckCircle2 className="w-4 h-4" /> Compliant
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 font-medium text-destructive">
                        <AlertCircle className="w-4 h-4" /> Flagged
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span
                      className={`rounded-full border px-3 py-1 text-xs font-medium ${
                        item.status === 'listed'
                          ? 'border-blue-500/20 bg-blue-500/10 text-blue-500'
                          : item.status === 'flagged'
                            ? 'border-destructive/20 bg-destructive/10 text-destructive'
                            : 'border-green-500/20 bg-green-500/10 text-green-500'
                      }`}
                    >
                      {item.status.toUpperCase()}
                    </span>
                  </td>
                </motion.tr>
              );
            })}
          </motion.tbody>
        </table>
      </AnimatedSection>

      <AnimatedSection className="flex gap-3 rounded-[24px] border border-destructive/20 bg-destructive/10 p-4 text-destructive">
        <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0" />
        <div>
          <h4 className="text-sm font-semibold">Resale policy violation detected</h4>
          <p className="mt-1 text-sm opacity-90">One listing for Neon Nights Music Fest has exceeded the 130% price cap and has been automatically flagged for review.</p>
        </div>
      </AnimatedSection>
    </AnimatedPage>
  );
};

export default ResaleMonitoring;

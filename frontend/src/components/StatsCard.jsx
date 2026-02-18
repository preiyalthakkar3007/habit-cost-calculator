import React from 'react';
import { motion } from 'framer-motion';

const StatsCard = ({ title, value, subtitle, icon, color }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05 }}
      className="bg-dark-card border border-dark-border rounded-xl p-6 relative overflow-hidden"
    >
      {/* Gradient background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-10`} />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-2">
          <p className="text-gray-400 text-sm">{title}</p>
          <span className="text-2xl">{icon}</span>
        </div>
        
        <p className={`text-3xl font-bold mb-1 bg-gradient-to-r ${color} bg-clip-text text-transparent`}>
          {value}
        </p>
        
        {subtitle && (
          <p className="text-xs text-gray-500">{subtitle}</p>
        )}
      </div>
    </motion.div>
  );
};

export default StatsCard;
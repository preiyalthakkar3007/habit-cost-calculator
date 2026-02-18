import React, { useState } from 'react';
import { motion } from 'framer-motion';

const AddHabitForm = ({ onAdd, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    cost: '',
    frequency: 'daily'
  });
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.cost) {
      alert('Please fill in all fields');
      return;
    }
    
    onAdd({
      name: formData.name,
      cost: parseFloat(formData.cost),
      frequency: formData.frequency
    });
    
    setFormData({ name: '', cost: '', frequency: 'daily' });
  };
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="bg-dark-card border border-dark-border rounded-2xl p-8 max-w-md w-full mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold text-white mb-6">Add New Habit</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-2">Habit Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Daily Coffee"
              className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-neon-blue transition-colors"
            />
          </div>
          
          <div>
            <label className="block text-sm text-gray-400 mb-2">Cost per Occurrence</label>
            <input
              type="number"
              step="0.01"
              value={formData.cost}
              onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
              placeholder="0.00"
              className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-neon-blue transition-colors"
            />
          </div>
          
          <div>
            <label className="block text-sm text-gray-400 mb-2">Frequency</label>
            <select
              value={formData.frequency}
              onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
              className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-neon-blue transition-colors"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>
          
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-dark-bg border border-dark-border text-gray-400 rounded-lg hover:bg-dark-border transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-gradient-to-r from-neon-pink to-neon-purple text-white rounded-lg hover:opacity-90 transition-opacity font-semibold"
            >
              Add Habit
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default AddHabitForm;
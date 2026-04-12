import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getWage, saveWage, getGoals, addGoal, deleteGoal } from '../storage';

const Settings = () => {
  const [wage, setWage] = useState('');
  const [goals, setGoals] = useState([]);
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [newGoal, setNewGoal] = useState({ name: '', target_amount: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setWage(getWage().toString());
    setGoals(getGoals());
  }, []);

  const handleSaveWage = (e) => {
    e.preventDefault();
    setSaving(true);
    saveWage(parseFloat(wage) || 0);
    setSaving(false);
    alert('Wage saved successfully!');
  };

  const handleAddGoal = (e) => {
    e.preventDefault();

    if (!newGoal.name || !newGoal.target_amount) {
      alert('Please fill in all fields');
      return;
    }

    addGoal({
      name:          newGoal.name,
      target_amount: parseFloat(newGoal.target_amount),
    });

    setNewGoal({ name: '', target_amount: '' });
    setShowAddGoal(false);
    setGoals(getGoals());
  };

  const handleDeleteGoal = (goalId) => {
    if (!window.confirm('Are you sure you want to delete this goal?')) return;
    deleteGoal(goalId);
    setGoals(getGoals());
  };

  return (
    <div className="min-h-screen bg-dark-bg">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
          <p className="text-gray-400 mb-8">Customize your habit tracking experience</p>

          {/* Hourly Wage */}
          <div className="bg-dark-card border border-dark-border rounded-2xl p-8 mb-8">
            <form onSubmit={handleSaveWage}>
              <div className="mb-6">
                <label className="block text-lg font-semibold text-white mb-3">
                  Hourly Wage
                </label>
                <p className="text-sm text-gray-400 mb-4">
                  Set your hourly wage to calculate how many hours of work each habit costs you.
                  Enter 0 if you don't earn an hourly wage.
                </p>

                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl">
                    $
                  </span>
                  <input
                    type="number"
                    step="0.01"
                    value={wage}
                    onChange={(e) => setWage(e.target.value)}
                    placeholder="0.00"
                    className="w-full bg-dark-bg border border-dark-border rounded-lg pl-10 pr-4 py-4 text-white text-xl placeholder-gray-500 focus:outline-none focus:border-neon-blue transition-colors"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                    per hour
                  </span>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={saving}
                className="w-full px-6 py-4 bg-gradient-to-r from-neon-pink to-neon-purple text-white rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Wage'}
              </motion.button>
            </form>
          </div>

          {/* Savings Goals */}
          <div className="bg-dark-card border border-dark-border rounded-2xl p-8 mb-8">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-lg font-semibold text-white">Savings Goals</h2>
                <p className="text-sm text-gray-400 mt-1">
                  Add things you're saving for to see how your habits affect your goals
                </p>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowAddGoal(!showAddGoal)}
                className="px-4 py-2 bg-neon-blue text-white rounded-lg text-sm font-semibold"
              >
                + Add Goal
              </motion.button>
            </div>

            {/* Add Goal Form */}
            <AnimatePresence>
              {showAddGoal && (
                <motion.form
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  onSubmit={handleAddGoal}
                  className="mb-6 pb-6 border-b border-dark-border"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <input
                      type="text"
                      value={newGoal.name}
                      onChange={(e) => setNewGoal({ ...newGoal, name: e.target.value })}
                      placeholder="Goal name (e.g., New Laptop)"
                      className="bg-dark-bg border border-dark-border rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-neon-blue transition-colors"
                    />
                    <input
                      type="number"
                      step="0.01"
                      value={newGoal.target_amount}
                      onChange={(e) => setNewGoal({ ...newGoal, target_amount: e.target.value })}
                      placeholder="Target amount ($)"
                      className="bg-dark-bg border border-dark-border rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-neon-blue transition-colors"
                    />
                  </div>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setShowAddGoal(false);
                        setNewGoal({ name: '', target_amount: '' });
                      }}
                      className="px-4 py-2 bg-dark-bg border border-dark-border text-gray-400 rounded-lg hover:bg-dark-border transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-neon-blue text-white rounded-lg hover:opacity-90 transition-opacity"
                    >
                      Add Goal
                    </button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>

            {/* Goals List */}
            {goals.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                No goals yet. Add one to see how your habits impact your savings!
              </p>
            ) : (
              <div className="space-y-3">
                {goals.map((goal) => (
                  <motion.div
                    key={goal.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex justify-between items-center bg-dark-bg rounded-lg p-4"
                  >
                    <div>
                      <p className="text-white font-semibold">{goal.name}</p>
                      <p className="text-sm text-gray-400">
                        Target: ${goal.target_amount.toFixed(2)}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDeleteGoal(goal.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      🗑️
                    </button>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Tips */}
          <div className="bg-dark-card border border-dark-border rounded-2xl p-8">
            <h3 className="text-lg font-semibold text-white mb-3">💡 Tips</h3>
            <ul className="space-y-3 text-gray-400">
              <li className="flex items-start gap-3">
                <span className="text-neon-blue mt-1">•</span>
                <span>Click on any habit card to see detailed breakdown and charts</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-neon-purple mt-1">•</span>
                <span>Add goals you're actually saving for to make habit costs more meaningful</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-neon-pink mt-1">•</span>
                <span>Set your wage to $0 if you're a student or don't have regular income</span>
              </li>
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Settings;

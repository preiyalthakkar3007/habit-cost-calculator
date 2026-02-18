import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import HabitCard from '../components/HabitCard';
import StatsCard from '../components/StatsCard';
import AddHabitForm from '../components/AddHabitForm';

const API_URL = process.env.REACT_APP_API_URL ? `${process.env.REACT_APP_API_URL}/api` : 'http://localhost:5000/api';

const Dashboard = () => {
  const [habits, setHabits] = useState([]);
  const [stats, setStats] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchData();
  }, []);
  
  const fetchData = async () => {
    try {
      const [habitsRes, statsRes] = await Promise.all([
        axios.get(`${API_URL}/habits`),
        axios.get(`${API_URL}/stats`)
      ]);
      
      setHabits(habitsRes.data);
      setStats(statsRes.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };
  
  const handleAddHabit = async (habitData) => {
    try {
      await axios.post(`${API_URL}/habits`, habitData);
      fetchData();
      setShowAddForm(false);
    } catch (error) {
      console.error('Error adding habit:', error);
      alert('Failed to add habit');
    }
  };
  
  const handleDeleteHabit = async (id) => {
    if (!window.confirm('Are you sure you want to delete this habit?')) return;
    
    try {
      await axios.delete(`${API_URL}/habits/${id}`);
      fetchData();
    } catch (error) {
      console.error('Error deleting habit:', error);
      alert('Failed to delete habit');
    }
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-2xl text-gray-400">Loading...</div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-dark-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        {stats && stats.total_habits > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatsCard
              title="Total Habits"
              value={stats.total_habits}
              icon="📊"
              color="from-neon-blue to-neon-purple"
            />
            <StatsCard
              title="Monthly Cost"
              value={`$${(stats.total_yearly_cost / 12).toFixed(0)}`}
              subtitle="All habits combined"
              icon="💳"
              color="from-neon-purple to-neon-pink"
            />
            <StatsCard
              title="Yearly Cost"
              value={`$${stats.total_yearly_cost.toFixed(0)}`}
              subtitle="Total annual spending"
              icon="💰"
              color="from-neon-pink to-red-500"
            />
            {stats.total_time_cost_hours > 0 && (
              <StatsCard
                title="Time Cost"
                value={`${stats.total_time_cost_hours.toFixed(0)}h`}
                subtitle="Hours of work per year"
                icon="⏰"
                color="from-neon-blue to-neon-purple"
              />
            )}
          </div>
        )}
        
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">Your Habits</h2>
            <p className="text-gray-400">Track the true cost of your daily routines</p>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAddForm(true)}
            className="px-6 py-3 bg-gradient-to-r from-neon-pink to-neon-purple text-white rounded-lg font-semibold hover:opacity-90 transition-opacity"
          >
            + Add Habit
          </motion.button>
        </div>
        
        {/* Habits Grid */}
        {habits.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-6xl mb-4">💸</p>
            <h3 className="text-2xl font-bold text-white mb-2">No habits yet</h3>
            <p className="text-gray-400 mb-6">Start tracking your habits to see their true cost</p>
            <button
              onClick={() => setShowAddForm(true)}
              className="px-6 py-3 bg-gradient-to-r from-neon-pink to-neon-purple text-white rounded-lg font-semibold hover:opacity-90 transition-opacity"
            >
              Add Your First Habit
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {habits.map((habit) => (
                <HabitCard
                  key={habit.id}
                  habit={habit}
                  onDelete={handleDeleteHabit}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
      
      {/* Add Habit Modal */}
      <AnimatePresence>
        {showAddForm && (
          <AddHabitForm
            onAdd={handleAddHabit}
            onClose={() => setShowAddForm(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;
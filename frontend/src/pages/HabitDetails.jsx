import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getHabits } from '../storage';

const HabitDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [habit, setHabit] = useState(null);

  useEffect(() => {
    const habits = getHabits();
    const found = habits.find(h => h.id === parseInt(id));
    setHabit(found || null);
  }, [id]);

  if (!habit) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-dark-bg">
        <p className="text-2xl text-gray-400 mb-4">Habit not found</p>
        <button
          onClick={() => navigate('/')}
          className="px-6 py-3 bg-neon-blue text-white rounded-lg"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  const chartData = [
    { period: 'Weekly',  cost: habit.breakdown.weekly },
    { period: 'Monthly', cost: habit.breakdown.monthly },
    { period: 'Yearly',  cost: habit.breakdown.yearly },
  ];

  return (
    <div className="min-h-screen bg-dark-bg">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/')}
          className="text-gray-400 hover:text-white mb-6 flex items-center gap-2"
        >
          ← Back to Dashboard
        </button>

        {/* Habit Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-dark-card border border-dark-border rounded-2xl p-8 mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-2">{habit.name}</h1>
          <p className="text-xl text-gray-400">
            ${habit.cost.toFixed(2)} per {habit.frequency}
          </p>
        </motion.div>

        {/* Cost Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-dark-card border border-dark-border rounded-2xl p-8 mb-8"
        >
          <h2 className="text-2xl font-bold text-white mb-6">Cost Breakdown</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <CostItem label="Weekly"  amount={habit.breakdown.weekly}  color="text-neon-blue" />
            <CostItem label="Monthly" amount={habit.breakdown.monthly} color="text-neon-purple" />
            <CostItem label="Yearly"  amount={habit.breakdown.yearly}  color="text-neon-pink" />
          </div>

          {/* Chart */}
          <div className="h-64 mt-8">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2a3e" />
                <XAxis dataKey="period" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1a1a2e',
                    border: '1px solid #2a2a3e',
                    borderRadius: '8px',
                  }}
                  formatter={(value) => `$${value.toFixed(2)}`}
                />
                <Bar dataKey="cost" fill="url(#colorGradient)" radius={[8, 8, 0, 0]} />
                <defs>
                  <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%"   stopColor="#ff006e" />
                    <stop offset="100%" stopColor="#b388ff" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Time Cost */}
        {habit.time_cost_hours > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-dark-card border border-dark-border rounded-2xl p-8 mb-8"
          >
            <h2 className="text-2xl font-bold text-white mb-4">Time Cost</h2>
            <p className="text-gray-400 mb-4">To afford this habit, you need to work:</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-dark-bg rounded-lg p-4">
                <p className="text-sm text-gray-500 mb-1">Per Year</p>
                <p className="text-2xl font-bold text-neon-blue">
                  {habit.time_cost_hours.toFixed(0)} hours
                </p>
              </div>
              <div className="bg-dark-bg rounded-lg p-4">
                <p className="text-sm text-gray-500 mb-1">Per Month</p>
                <p className="text-2xl font-bold text-neon-purple">
                  {(habit.time_cost_hours / 12).toFixed(1)} hours
                </p>
              </div>
              <div className="bg-dark-bg rounded-lg p-4">
                <p className="text-sm text-gray-500 mb-1">Per Week</p>
                <p className="text-2xl font-bold text-neon-pink">
                  {(habit.time_cost_hours / 52).toFixed(1)} hours
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Opportunity Cost / Goal Impact */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-neon-pink/10 to-neon-purple/10 border border-neon-pink/30 rounded-2xl p-8"
        >
          {habit.goal_impact ? (
            <>
              <h2 className="text-2xl font-bold text-white mb-4">🎯 Impact on Your Goal</h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Your Goal</p>
                  <p className="text-2xl font-bold text-neon-blue">{habit.goal_impact.goal_name}</p>
                  <p className="text-gray-400">Target: ${habit.goal_impact.target_amount.toFixed(2)}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-dark-card rounded-lg p-4">
                    <p className="text-sm text-gray-500 mb-1">This habit costs</p>
                    <p className="text-3xl font-bold text-orange-400">
                      {habit.goal_impact.percentage.toFixed(0)}%
                    </p>
                    <p className="text-xs text-gray-400 mt-1">of your goal over 10 years</p>
                  </div>

                  <div className="bg-dark-card rounded-lg p-4">
                    <p className="text-sm text-gray-500 mb-1">Time to goal if you quit</p>
                    <p className="text-3xl font-bold text-neon-green">
                      {habit.goal_impact.months_to_goal.toFixed(1)}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">months</p>
                  </div>
                </div>

                <p className="text-sm text-gray-300 leading-relaxed mt-4">
                  {habit.goal_impact.percentage >= 100
                    ? `If you stop this habit today, you could save enough for ${habit.goal_impact.goal_name} in just ${habit.goal_impact.months_to_goal.toFixed(1)} months!`
                    : `Over 10 years, this habit will consume ${habit.goal_impact.percentage.toFixed(0)}% of what you need for ${habit.goal_impact.goal_name}.`
                  }
                </p>
              </div>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-white mb-4">💡 Instead, You Could Buy</h2>
              <p className="text-xl text-gray-300">{habit.opportunity_cost}</p>
              <p className="text-sm text-gray-500 mt-2">
                (Based on 10-year cost of ${habit.breakdown['10_years'].toFixed(2)})
              </p>
              <p className="text-sm text-gray-400 mt-4">
                💡 Tip: Add a savings goal in Settings to see personalized impact!
              </p>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
};

const CostItem = ({ label, amount, color }) => (
  <div className="bg-dark-bg rounded-lg p-4 text-center">
    <p className="text-sm text-gray-500 mb-2">{label}</p>
    <p className={`text-3xl font-bold ${color}`}>${amount.toFixed(2)}</p>
  </div>
);

export default HabitDetails;

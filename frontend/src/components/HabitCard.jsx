import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const HabitCard = ({ habit, onDelete }) => {
  const navigate = useNavigate();
  
  const handleClick = () => {
    navigate(`/habit/${habit.id}`);
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ scale: 1.02, y: -5 }}
      className="bg-dark-card border border-dark-border rounded-xl p-6 cursor-pointer relative overflow-hidden group"
      onClick={handleClick}
    >
      {/* Gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-neon-pink/10 to-neon-purple/10 opacity-0 group-hover:opacity-100 transition-opacity" />
      
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-bold text-white mb-1">{habit.name}</h3>
            <p className="text-gray-400 text-sm">
              ${habit.cost.toFixed(2)} per {habit.frequency}
            </p>
          </div>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(habit.id);
            }}
            className="text-gray-400 hover:text-red-500 transition-colors"
          >
            🗑️
          </button>
        </div>
        
        <div className="space-y-3">
          <div className="grid grid-cols-3 gap-3 text-center">
            <div>
              <p className="text-xs text-gray-500 mb-1">Weekly</p>
              <p className="text-lg font-bold text-neon-blue">
                ${habit.breakdown.weekly.toFixed(0)}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Monthly</p>
              <p className="text-lg font-bold text-neon-purple">
                ${habit.breakdown.monthly.toFixed(0)}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Yearly</p>
              <p className="text-lg font-bold text-neon-pink">
                ${habit.breakdown.yearly.toFixed(0)}
              </p>
            </div>
          </div>
          
          <div className="bg-dark-bg rounded-lg p-3">
            {habit.goal_impact ? (
              <>
                <p className="text-xs text-gray-500 mb-1">
                  💡 Impact on your goal: <span className="font-semibold text-white">{habit.goal_impact.goal_name}</span>
                </p>
                {habit.goal_impact.percentage >= 100 ? (
                  <p className="text-sm font-semibold text-neon-green">
                    You could afford this in {habit.goal_impact.months_to_goal.toFixed(1)} months if you quit this habit!
                  </p>
                ) : (
                  <p className="text-sm font-semibold text-orange-400">
                    This habit costs {habit.goal_impact.percentage.toFixed(0)}% of your goal
                  </p>
                )}
              </>
            ) : (
              <>
                <p className="text-xs text-gray-500 mb-1">💡 Instead you could buy:</p>
                <p className="text-sm font-semibold text-neon-green">
                  {habit.opportunity_cost}
                </p>
              </>
            )}
          </div>
        </div>
        
        {habit.time_cost_hours > 0 && (
          <div className="mt-4 pt-4 border-t border-dark-border">
            <div className="flex items-center gap-2 group relative">
              <p className="text-sm text-gray-400">
                ⏰ <span className="text-neon-blue">{habit.time_cost_hours.toFixed(0)} hours</span> of work per year
              </p>
              <span className="text-xs text-gray-500 cursor-help">ℹ️</span>
              
              {/* Tooltip */}
              <div className="absolute bottom-full left-0 mb-2 hidden group-hover:block z-10 w-64">
                <div className="bg-dark-bg border border-dark-border rounded-lg p-3 text-xs text-gray-300 shadow-xl">
                  Based on your hourly wage, this is how many hours you'd need to work to afford this habit each year.
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default HabitCard;
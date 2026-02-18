import React from 'react';
import { motion } from 'framer-motion';

const Help = () => {
  return (
    <div className="min-h-screen bg-dark-bg">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-bold text-white mb-2">Help & About</h1>
          <p className="text-gray-400 mb-8">Understanding your habit costs</p>
          
          {/* What is this app */}
          <Section title="What is Habit Cost Calculator?">
            <p className="text-gray-300 leading-relaxed">
              Habit Cost Calculator helps you visualize the true financial impact of your daily habits over time. 
              That $6 daily coffee might not seem like much, but over 10 years it adds up to over $21,000! 
              This app shows you the bigger picture so you can make informed decisions about your spending.
            </p>
          </Section>
          
          {/* How it works */}
          <Section title="How It Works">
            <div className="space-y-4">
              <Step number="1" title="Add Your Habits">
                Track any recurring expense - coffee, subscriptions, takeout, cigarettes, etc. 
                Specify how much it costs and how often you do it.
              </Step>
              
              <Step number="2" title="See the Breakdown">
                View costs broken down by week, month, year, 5 years, and 10 years. 
                The long-term numbers can be eye-opening!
              </Step>
              
              <Step number="3" title="Understand Time Cost">
                If you set your hourly wage in Settings, we'll show you how many hours of work 
                each habit costs you per year. This helps you think about habits in terms of your time, 
                not just money.
              </Step>
            </div>
          </Section>
          
          {/* Understanding metrics */}
          <Section title="Understanding the Metrics">
            <MetricExplanation
              icon="💰"
              title="Cost Breakdown"
              description="Shows how much you spend on this habit over different time periods. We calculate yearly cost based on your frequency, then multiply for longer periods."
            />
            
            <MetricExplanation
              icon="⏰"
              title="Time Cost (Hours of Work)"
              description="If you've set an hourly wage in Settings, this shows how many hours you need to work to afford this habit each year. For example: if you earn $20/hour and spend $2,000/year on something, that's 100 hours of work. Set wage to $0 if you don't earn hourly."
            />
            
            <MetricExplanation
              icon="🎯"
              title="Opportunity Cost"
              description="Shows what you could buy instead with the money spent over 10 years. It's a way to reframe the cost - would you rather have daily coffee or a down payment on a house?"
            />
          </Section>
          
          {/* Tips */}
          <Section title="Tips for Using This App">
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-start gap-3">
                <span className="text-neon-pink mt-1">•</span>
                <span>Be honest about frequency - if you get coffee 5 days a week, that's "daily" not "weekly"</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-neon-purple mt-1">•</span>
                <span>Don't judge yourself - this tool is for awareness, not guilt. Some habits are worth it!</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-neon-blue mt-1">•</span>
                <span>Click on any habit card to see detailed charts and breakdowns</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-neon-green mt-1">•</span>
                <span>Set your hourly wage in Settings to enable time cost calculations</span>
              </li>
            </ul>
          </Section>
          
          {/* Example */}
          <Section title="Example Calculation">
            <div className="bg-dark-card border border-dark-border rounded-xl p-6">
              <h4 className="text-lg font-semibold text-white mb-4">Daily $6 Coffee</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Weekly</p>
                  <p className="text-neon-blue font-semibold">$42.00</p>
                </div>
                <div>
                  <p className="text-gray-500">Monthly</p>
                  <p className="text-neon-blue font-semibold">$182.50</p>
                </div>
                <div>
                  <p className="text-gray-500">Yearly</p>
                  <p className="text-neon-pink font-semibold">$2,190.00</p>
                </div>
                <div>
                  <p className="text-gray-500">10 Years</p>
                  <p className="text-red-400 font-semibold">$21,900.00</p>
                </div>
              </div>
              <p className="text-gray-400 text-sm mt-4">
                At $25/hour wage, that's <span className="text-neon-purple font-semibold">87.6 hours</span> of work per year 
                just for coffee!
              </p>
            </div>
          </Section>
          
          {/* Privacy */}
          <Section title="Privacy & Data">
            <p className="text-gray-300 leading-relaxed">
              All your data is stored locally in your browser. We don't collect, store, or share any of your 
              information. Your habits and financial details stay completely private on your device.
            </p>
          </Section>
        </motion.div>
      </div>
    </div>
  );
};

const Section = ({ title, children }) => (
  <div className="mb-10">
    <h2 className="text-2xl font-bold text-white mb-4">{title}</h2>
    {children}
  </div>
);

const Step = ({ number, title, children }) => (
  <div className="flex gap-4">
    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-neon-pink to-neon-purple flex items-center justify-center text-white font-bold">
      {number}
    </div>
    <div>
      <h4 className="text-white font-semibold mb-1">{title}</h4>
      <p className="text-gray-400 text-sm">{children}</p>
    </div>
  </div>
);

const MetricExplanation = ({ icon, title, description }) => (
  <div className="mb-6 pb-6 border-b border-dark-border last:border-0">
    <div className="flex items-start gap-3">
      <span className="text-2xl">{icon}</span>
      <div>
        <h4 className="text-white font-semibold mb-2">{title}</h4>
        <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
      </div>
    </div>
  </div>
);

export default Help;
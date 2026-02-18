# 💸 Habit Cost Calculator

A web application that reveals the true financial impact of your daily habits by calculating costs over time and showing how they affect your personal savings goals.

![Habit Cost Calculator](https://img.shields.io/badge/React-18.x-blue) ![Flask](https://img.shields.io/badge/Flask-3.x-green) ![Python](https://img.shields.io/badge/Python-3.8+-yellow)

## 🎯 The Problem

We often underestimate how small daily expenses add up over time. A $6 coffee doesn't *feel* expensive, but over a year it's $2,190 — and over a decade, it's enough for a down payment on a car. This app makes those hidden costs visible and personal.

## ✨ Features

### 📊 Smart Cost Breakdown
- Track any recurring expense (coffee, subscriptions, takeout, etc.)
- View costs broken down by **week**, **month**, and **year**
- See long-term impact with visual charts

### 🎯 Personalized Savings Goals
- Set your own savings goals (laptop, vacation, car, etc.)
- See how each habit impacts your ability to reach those goals
- Get motivating insights like *"You could afford this in 8.3 months if you quit this habit!"*

### ⏰ Time Cost Calculator
- Set your hourly wage to see habits in terms of **work hours**
- Understand that $100/month habit = 60 hours of work per year
- Optional feature — set wage to $0 if not applicable

### 🌙 Modern UI/UX
- Beautiful dark mode interface with neon accents
- Smooth animations powered by Framer Motion
- Fully responsive design
- Interactive data visualizations with Recharts

## 🛠️ Tech Stack

**Frontend:**
- React 18 with React Router
- Tailwind CSS for styling
- Framer Motion for animations
- Recharts for data visualization
- Axios for API calls

**Backend:**
- Flask (Python)
- SQLite database
- RESTful API architecture

## 🚀 Getting Started

### Prerequisites
- Python 3.8+
- Node.js 14+
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/preiyalthakkar3007/habit-cost-calculator.git
cd habit-cost-calculator
```

2. **Set up the backend**
```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install flask flask-cors
```

3. **Set up the frontend**
```bash
cd frontend
npm install
```

4. **Run the application**

**Terminal 1 - Backend:**
```bash
# From project root, with venv activated
python app.py
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```

The app will open at `http://localhost:3000`

## 📖 How to Use

1. **Set Your Hourly Wage** (Settings)
   - Navigate to Settings
   - Enter your hourly wage (or $0 if not applicable)
   - This enables time-cost calculations

2. **Add Savings Goals** (Settings)
   - Click "Add Goal" in Settings
   - Enter what you're saving for and the target amount
   - Examples: "New Laptop - $1200", "Vacation to Japan - $3000"

3. **Track Your Habits** (Dashboard)
   - Click "+ Add Habit"
   - Enter the habit name, cost, and frequency
   - Example: "Daily Coffee" - $6 - daily

4. **View Insights**
   - See cost breakdowns on the dashboard
   - Click any habit card for detailed analysis with charts
   - Check the Help page for tips and explanations

## 💡 Key Insights

The app provides three types of cost awareness:

1. **Monetary Cost**: How much you're actually spending
2. **Time Cost**: How many hours of work it takes to afford it
3. **Opportunity Cost**: What you're giving up to maintain this habit

## 🎨 Screenshots

*Add screenshots here once deployed*

## 🔮 Future Enhancements

- [ ] Export habit reports as PDF
- [ ] Add budget limits and alerts
- [ ] Mobile app (React Native)
- [ ] Social sharing of savings achievements
- [ ] Integration with banking APIs for automatic tracking
- [ ] Gamification with streaks and achievements

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

## 📝 License

This project is open source and available under the MIT License.

## 👤 Author

**Preiyal Thakkar**
- GitHub: [@preiyalthakkar3007](https://github.com/preiyalthakkar3007)

---

*Built with the goal of helping people make informed financial decisions through better awareness of their spending habits.*
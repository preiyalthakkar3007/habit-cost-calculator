// storage.js — all data lives in localStorage; no backend required

const KEYS = {
  HABITS: 'hcc_habits',
  WAGE:   'hcc_wage',
  GOALS:  'hcc_goals',
};

// ── Calculation logic (ported from calculator.py) ──────────────────────────

const FREQUENCY_MULTIPLIERS = {
  daily:   365,
  weekly:  52,
  monthly: 12,
  yearly:  1,
};

function calculateYearlyCost(cost, frequency) {
  return cost * (FREQUENCY_MULTIPLIERS[frequency] ?? 1);
}

function calculateBreakdown(cost, frequency) {
  const yearly = calculateYearlyCost(cost, frequency);
  return {
    weekly:    yearly / 52,
    monthly:   yearly / 12,
    yearly,
    '5_years': yearly * 5,
    '10_years': yearly * 10,
  };
}

function calculateTimeCost(yearlyCost, hourlyWage) {
  if (!hourlyWage || hourlyWage <= 0) return 0;
  return yearlyCost / hourlyWage;
}

function calculateGoalImpact(yearlyCost, goals) {
  if (!goals || goals.length === 0) return null;

  const tenYearCost = yearlyCost * 10;
  let closest = null;
  let minDiff = Infinity;

  for (const goal of goals) {
    const diff = Math.abs(goal.target_amount - tenYearCost);
    if (diff < minDiff) {
      minDiff = diff;
      closest = goal;
    }
  }

  if (!closest) return null;

  const percentage    = (tenYearCost / closest.target_amount) * 100;
  const monthsToGoal  = yearlyCost > 0 ? (closest.target_amount / yearlyCost) * 12 : 0;

  return {
    goal_name:      closest.name,
    target_amount:  closest.target_amount,
    percentage,
    months_to_goal: monthsToGoal,
    ten_year_cost:  tenYearCost,
  };
}

function suggestOpportunityCost(cost10Years) {
  if (cost10Years >= 50000) return 'Down payment on a house';
  if (cost10Years >= 30000) return 'Brand new car';
  if (cost10Years >= 15000) return 'Year of college tuition';
  if (cost10Years >= 5000)  return 'High-end laptop + phone';
  if (cost10Years >= 2000)  return 'Gaming console + games';
  if (cost10Years >= 1000)  return 'Nice vacation';
  return 'Several nice dinners';
}

// ── localStorage helpers ───────────────────────────────────────────────────

function load(key, defaultValue) {
  try {
    const raw = localStorage.getItem(key);
    return raw !== null ? JSON.parse(raw) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function persist(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

// ── Wage ──────────────────────────────────────────────────────────────────

export function getWage() {
  return load(KEYS.WAGE, 0);
}

export function saveWage(wage) {
  persist(KEYS.WAGE, parseFloat(wage) || 0);
}

// ── Goals ─────────────────────────────────────────────────────────────────

export function getGoals() {
  return load(KEYS.GOALS, []);
}

export function addGoal({ name, target_amount }) {
  const goals = getGoals();
  const newGoal = {
    id:            Date.now(),
    name,
    target_amount: parseFloat(target_amount),
    created_at:    new Date().toISOString(),
  };
  persist(KEYS.GOALS, [...goals, newGoal]);
  return newGoal;
}

export function deleteGoal(id) {
  persist(KEYS.GOALS, getGoals().filter(g => g.id !== id));
}

// ── Habits ────────────────────────────────────────────────────────────────

function enrichHabit(habit, wage, goals) {
  const breakdown       = calculateBreakdown(habit.cost, habit.frequency);
  const timeCostHours   = calculateTimeCost(breakdown.yearly, wage);
  const goalImpact      = calculateGoalImpact(breakdown.yearly, goals);
  const opportunityCost = suggestOpportunityCost(breakdown['10_years']);

  return { ...habit, breakdown, time_cost_hours: timeCostHours, opportunity_cost: opportunityCost, goal_impact: goalImpact };
}

export function getHabits() {
  const raw   = load(KEYS.HABITS, []);
  const wage  = getWage();
  const goals = getGoals();
  return raw.map(h => enrichHabit(h, wage, goals));
}

export function addHabit({ name, cost, frequency }) {
  const raw      = load(KEYS.HABITS, []);
  const newHabit = {
    id:         Date.now(),
    name,
    cost:       parseFloat(cost),
    frequency,
    created_at: new Date().toISOString(),
  };
  persist(KEYS.HABITS, [...raw, newHabit]);
  return newHabit;
}

export function deleteHabit(id) {
  persist(KEYS.HABITS, load(KEYS.HABITS, []).filter(h => h.id !== id));
}

// ── Stats ─────────────────────────────────────────────────────────────────

export function getStats() {
  const habits           = getHabits();
  const totalYearlyCost  = habits.reduce((sum, h) => sum + h.breakdown.yearly, 0);
  const totalTimeCost    = habits.reduce((sum, h) => sum + h.time_cost_hours, 0);

  return {
    total_habits:          habits.length,
    total_yearly_cost:     totalYearlyCost,
    total_time_cost_hours: totalTimeCost,
    total_10_year_cost:    totalYearlyCost * 10,
  };
}

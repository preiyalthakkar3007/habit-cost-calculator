from typing import Dict, List, Tuple, Optional

class HabitCostCalculator:
    FREQUENCY_MULTIPLIERS = {
        'daily': 365,
        'weekly': 52,
        'monthly': 12,
        'yearly': 1
    }
    
    def __init__(self, hourly_wage: float):
        self.hourly_wage = hourly_wage
    
    def calculate_yearly_cost(self, cost: float, frequency: str) -> float:
        multiplier = self.FREQUENCY_MULTIPLIERS.get(frequency.lower(), 1)
        return cost * multiplier
    
    def calculate_breakdown(self, cost: float, frequency: str) -> Dict[str, float]:
        yearly = self.calculate_yearly_cost(cost, frequency)
        
        return {
            'weekly': yearly / 52,
            'monthly': yearly / 12,
            'yearly': yearly,
            '5_years': yearly * 5,
            '10_years': yearly * 10
        }
    
    def calculate_time_cost(self, yearly_cost: float) -> float:
        if self.hourly_wage <= 0:
            return 0
        return yearly_cost / self.hourly_wage
    
    def calculate_goal_impact(self, yearly_cost: float, goals: List[Tuple]) -> Optional[Dict]:
        """
        Calculate how this habit impacts user's savings goals.
        Returns the most relevant goal comparison.
        """
        if not goals:
            return None
        
        ten_year_cost = yearly_cost * 10
        
        # Find the closest goal to the 10-year cost
        closest_goal = None
        min_diff = float('inf')
        
        for goal_id, goal_name, target_amount in goals:
            diff = abs(target_amount - ten_year_cost)
            if diff < min_diff:
                min_diff = diff
                closest_goal = (goal_id, goal_name, target_amount)
        
        if closest_goal:
            goal_id, goal_name, target_amount = closest_goal
            percentage = (ten_year_cost / target_amount) * 100
            months_to_goal = (target_amount / yearly_cost) * 12 if yearly_cost > 0 else 0
            
            return {
                'goal_name': goal_name,
                'target_amount': target_amount,
                'percentage': percentage,
                'months_to_goal': months_to_goal,
                'ten_year_cost': ten_year_cost
            }
        
        return None
    
    def suggest_opportunity_cost(self, cost_10_years: float) -> str:
        """Fallback generic suggestions if no goals are set"""
        if cost_10_years >= 50000:
            return "Down payment on a house"
        elif cost_10_years >= 30000:
            return "Brand new car"
        elif cost_10_years >= 15000:
            return "Year of college tuition"
        elif cost_10_years >= 5000:
            return "High-end laptop + phone"
        elif cost_10_years >= 2000:
            return "Gaming console + games"
        elif cost_10_years >= 1000:
            return "Nice vacation"
        else:
            return "Several nice dinners"
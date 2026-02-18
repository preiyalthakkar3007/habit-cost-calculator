from flask import Flask, request, jsonify
from flask_cors import CORS
from database import HabitDatabase
from calculator import HabitCostCalculator

app = Flask(__name__)
CORS(app)

db = HabitDatabase()

@app.route('/api/habits', methods=['GET'])
def get_habits():
    habits = db.get_all_habits()
    goals = db.get_all_goals()
    wage = db.get_hourly_wage() or 0
    calculator = HabitCostCalculator(wage)
    
    result = []
    for habit_id, name, cost, frequency in habits:
        breakdown = calculator.calculate_breakdown(cost, frequency)
        time_cost = calculator.calculate_time_cost(breakdown['yearly'])
        
        # Calculate goal impact
        goal_impact = calculator.calculate_goal_impact(breakdown['yearly'], goals)
        
        # Fallback to generic opportunity cost if no goals
        if goal_impact:
            opportunity = f"{goal_impact['goal_name']} (${goal_impact['target_amount']:.0f})"
        else:
            opportunity = calculator.suggest_opportunity_cost(breakdown['10_years'])
        
        result.append({
            'id': habit_id,
            'name': name,
            'cost': cost,
            'frequency': frequency,
            'breakdown': breakdown,
            'time_cost_hours': time_cost,
            'opportunity_cost': opportunity,
            'goal_impact': goal_impact
        })
    
    return jsonify(result)

@app.route('/api/habits', methods=['POST'])
def add_habit():
    data = request.json
    habit_id = db.add_habit(data['name'], data['cost'], data['frequency'])
    return jsonify({'id': habit_id, 'message': 'Habit added successfully'})

@app.route('/api/habits/<int:habit_id>', methods=['DELETE'])
def delete_habit(habit_id):
    success = db.delete_habit(habit_id)
    if success:
        return jsonify({'message': 'Habit deleted successfully'})
    return jsonify({'error': 'Habit not found'}), 404

@app.route('/api/settings/wage', methods=['GET'])
def get_wage():
    wage = db.get_hourly_wage()
    return jsonify({'wage': wage if wage is not None else 0})

@app.route('/api/settings/wage', methods=['POST'])
def set_wage():
    data = request.json
    db.set_hourly_wage(data['wage'])
    return jsonify({'message': 'Wage updated successfully'})

@app.route('/api/stats', methods=['GET'])
def get_stats():
    habits = db.get_all_habits()
    wage = db.get_hourly_wage() or 0
    calculator = HabitCostCalculator(wage)
    
    total_yearly = 0
    total_time = 0
    
    for _, _, cost, frequency in habits:
        breakdown = calculator.calculate_breakdown(cost, frequency)
        total_yearly += breakdown['yearly']
        total_time += calculator.calculate_time_cost(breakdown['yearly'])
    
    return jsonify({
        'total_habits': len(habits),
        'total_yearly_cost': total_yearly,
        'total_time_cost_hours': total_time,
        'total_10_year_cost': total_yearly * 10
    })

@app.route('/api/goals', methods=['GET'])
def get_goals():
    goals = db.get_all_goals()
    result = []
    for goal_id, name, target_amount in goals:
        result.append({
            'id': goal_id,
            'name': name,
            'target_amount': target_amount
        })
    return jsonify(result)

@app.route('/api/goals', methods=['POST'])
def add_goal():
    data = request.json
    goal_id = db.add_goal(data['name'], data['target_amount'])
    return jsonify({'id': goal_id, 'message': 'Goal added successfully'})

@app.route('/api/goals/<int:goal_id>', methods=['DELETE'])
def delete_goal(goal_id):
    success = db.delete_goal(goal_id)
    if success:
        return jsonify({'message': 'Goal deleted successfully'})
    return jsonify({'error': 'Goal not found'}), 404

if __name__ == '__main__':
    import os
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)
import sqlite3
from typing import List, Tuple, Optional

class HabitDatabase:
    def __init__(self, db_name='habits.db'):
        self.db_name = db_name
        self.init_database()
    
    def init_database(self):
        conn = sqlite3.connect(self.db_name)
        cursor = conn.cursor()
        
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS habits (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                cost REAL NOT NULL,
                frequency TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS settings (
                key TEXT PRIMARY KEY,
                value REAL NOT NULL
            )
        ''')
        
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS goals (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                target_amount REAL NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        conn.commit()
        conn.close()
    
    def add_habit(self, name: str, cost: float, frequency: str) -> int:
        conn = sqlite3.connect(self.db_name)
        cursor = conn.cursor()
        
        cursor.execute(
            'INSERT INTO habits (name, cost, frequency) VALUES (?, ?, ?)',
            (name, cost, frequency)
        )
        
        habit_id = cursor.lastrowid
        conn.commit()
        conn.close()
        return habit_id
    
    def get_all_habits(self) -> List[Tuple]:
        conn = sqlite3.connect(self.db_name)
        cursor = conn.cursor()
        
        cursor.execute('SELECT id, name, cost, frequency FROM habits')
        habits = cursor.fetchall()
        
        conn.close()
        return habits
    
    def delete_habit(self, habit_id: int) -> bool:
        conn = sqlite3.connect(self.db_name)
        cursor = conn.cursor()
        
        cursor.execute('DELETE FROM habits WHERE id = ?', (habit_id,))
        deleted = cursor.rowcount > 0
        
        conn.commit()
        conn.close()
        return deleted
    
    def set_hourly_wage(self, wage: float):
        conn = sqlite3.connect(self.db_name)
        cursor = conn.cursor()
        
        cursor.execute(
            'INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)',
            ('hourly_wage', wage)
        )
        
        conn.commit()
        conn.close()
    
    def get_hourly_wage(self) -> Optional[float]:
        conn = sqlite3.connect(self.db_name)
        cursor = conn.cursor()
        
        cursor.execute('SELECT value FROM settings WHERE key = ?', ('hourly_wage',))
        result = cursor.fetchone()
        
        conn.close()
        return result[0] if result else None
    
    def add_goal(self, name: str, target_amount: float) -> int:
        conn = sqlite3.connect(self.db_name)
        cursor = conn.cursor()
        
        cursor.execute(
            'INSERT INTO goals (name, target_amount) VALUES (?, ?)',
            (name, target_amount)
        )
        
        goal_id = cursor.lastrowid
        conn.commit()
        conn.close()
        return goal_id
    
    def get_all_goals(self) -> List[Tuple]:
        conn = sqlite3.connect(self.db_name)
        cursor = conn.cursor()
        
        cursor.execute('SELECT id, name, target_amount FROM goals')
        goals = cursor.fetchall()
        
        conn.close()
        return goals
    
    def delete_goal(self, goal_id: int) -> bool:
        conn = sqlite3.connect(self.db_name)
        cursor = conn.cursor()
        
        cursor.execute('DELETE FROM goals WHERE id = ?', (goal_id,))
        deleted = cursor.rowcount > 0
        
        conn.commit()
        conn.close()
        return deleted
from rich.console import Console
from rich.table import Table
from rich.prompt import Prompt, Confirm
from rich.panel import Panel
from database import HabitDatabase
from calculator import HabitCostCalculator

console = Console()

def display_header():
    console.print(Panel.fit(
        "[bold cyan]💸 Habit Cost Calculator[/bold cyan]\n"
        "[dim]See the TRUE cost of your daily habits[/dim]",
        border_style="cyan"
    ))

def setup_hourly_wage(db):
    wage = db.get_hourly_wage()
    if wage is None:
        console.print("\n[yellow]First time setup![/yellow]")
        while True:
            wage_input = Prompt.ask("Enter your hourly wage (for time-cost calculations)")
            try:
                wage = float(wage_input)
                if wage > 0:
                    db.set_hourly_wage(wage)
                    console.print(f"[green]✓ Hourly wage set to ${wage:.2f}[/green]\n")
                    break
                else:
                    console.print("[red]Please enter a positive number[/red]")
            except ValueError:
                console.print("[red]Please enter a valid number[/red]")
    return wage

def add_habit_interactive(db):
    console.print("\n[bold]Add a new habit:[/bold]")
    
    name = Prompt.ask("Habit name")
    
    while True:
        cost_input = Prompt.ask("Cost per occurrence ($)")
        try:
            cost = float(cost_input)
            if cost > 0:
                break
            console.print("[red]Please enter a positive number[/red]")
        except ValueError:
            console.print("[red]Please enter a valid number[/red]")
    
    frequency = Prompt.ask(
        "Frequency",
        choices=["daily", "weekly", "monthly", "yearly"],
        default="daily"
    )
    
    db.add_habit(name, cost, frequency)
    console.print(f"[green]✓ Added habit: {name}[/green]\n")

def display_habits(db, calculator):
    habits = db.get_all_habits()
    
    if not habits:
        console.print("\n[yellow]No habits tracked yet. Add one to get started![/yellow]\n")
        return
    
    table = Table(title="\n💰 Your Habit Costs", border_style="cyan")
    table.add_column("ID", style="dim")
    table.add_column("Habit", style="cyan")
    table.add_column("Cost", justify="right")
    table.add_column("Weekly", justify="right", style="yellow")
    table.add_column("Monthly", justify="right", style="yellow")
    table.add_column("Yearly", justify="right", style="red")
    table.add_column("5 Years", justify="right", style="red bold")
    table.add_column("10 Years", justify="right", style="red bold")
    table.add_column("Hours of Work/Year", justify="right", style="magenta")
    
    total_yearly = 0
    
    for habit_id, name, cost, frequency in habits:
        breakdown = calculator.calculate_breakdown(cost, frequency)
        time_cost = calculator.calculate_time_cost(breakdown['yearly'])
        total_yearly += breakdown['yearly']
        
        table.add_row(
            str(habit_id),
            name,
            f"${cost:.2f}/{frequency}",
            f"${breakdown['weekly']:.2f}",
            f"${breakdown['monthly']:.2f}",
            f"${breakdown['yearly']:.2f}",
            f"${breakdown['5_years']:.2f}",
            f"${breakdown['10_years']:.2f}",
            f"{time_cost:.0f}h"
        )
    
    console.print(table)
    console.print(f"\n[bold yellow]Total yearly cost: ${total_yearly:.2f}[/bold yellow]")
    console.print(f"[bold magenta]That's {calculator.calculate_time_cost(total_yearly):.0f} hours of work per year[/bold magenta]\n")

def show_habit_details(db, calculator):
    habit_id = Prompt.ask("\nEnter habit ID to see details")
    
    try:
        habit_id = int(habit_id)
        habits = db.get_all_habits()
        habit = next((h for h in habits if h[0] == habit_id), None)
        
        if not habit:
            console.print("[red]Habit not found[/red]")
            return
        
        _, name, cost, frequency = habit
        breakdown = calculator.calculate_breakdown(cost, frequency)
        time_cost = calculator.calculate_time_cost(breakdown['yearly'])
        opportunity = calculator.suggest_opportunity_cost(breakdown['10_years'])
        
        panel_content = f"""
[bold cyan]{name}[/bold cyan]
[dim]${cost:.2f} per {frequency}[/dim]

[yellow]Cost Breakdown:[/yellow]
  Weekly:    ${breakdown['weekly']:.2f}
  Monthly:   ${breakdown['monthly']:.2f}
  Yearly:    ${breakdown['yearly']:.2f}
  5 Years:   ${breakdown['5_years']:.2f}
  10 Years:  ${breakdown['10_years']:.2f}

[magenta]Time Cost:[/magenta]
  {time_cost:.0f} hours of work per year
  {time_cost/52:.1f} hours per week

[red]Opportunity Cost (10 years):[/red]
  Instead of this habit, you could buy: {opportunity}
        """
        
        console.print(Panel(panel_content, border_style="cyan"))
        
    except ValueError:
        console.print("[red]Please enter a valid number[/red]")

def delete_habit_interactive(db):
    habit_id = Prompt.ask("\nEnter habit ID to delete")
    
    try:
        habit_id = int(habit_id)
        if db.delete_habit(habit_id):
            console.print(f"[green]✓ Deleted habit #{habit_id}[/green]\n")
        else:
            console.print("[red]Habit not found[/red]")
    except ValueError:
        console.print("[red]Please enter a valid number[/red]")

def update_wage_interactive(db):
    current_wage = db.get_hourly_wage()
    console.print(f"\n[dim]Current hourly wage: ${current_wage:.2f}[/dim]")
    
    while True:
        wage_input = Prompt.ask("Enter new hourly wage")
        try:
            wage = float(wage_input)
            if wage > 0:
                db.set_hourly_wage(wage)
                console.print(f"[green]✓ Hourly wage updated to ${wage:.2f}[/green]\n")
                return wage
            else:
                console.print("[red]Please enter a positive number[/red]")
        except ValueError:
            console.print("[red]Please enter a valid number[/red]")

def main():
    db = HabitDatabase()
    
    display_header()
    wage = setup_hourly_wage(db)
    calculator = HabitCostCalculator(wage)
    
    while True:
        console.print("\n[bold]Options:[/bold]")
        console.print("1. View all habits")
        console.print("2. Add new habit")
        console.print("3. View habit details")
        console.print("4. Delete habit")
        console.print("5. Update hourly wage")
        console.print("6. Exit")
        
        choice = Prompt.ask("\nChoose an option", choices=["1", "2", "3", "4", "5", "6"])
        
        if choice == "1":
            display_habits(db, calculator)
        elif choice == "2":
            add_habit_interactive(db)
        elif choice == "3":
            show_habit_details(db, calculator)
        elif choice == "4":
            delete_habit_interactive(db)
        elif choice == "5":
            wage = update_wage_interactive(db)
            calculator = HabitCostCalculator(wage)
        elif choice == "6":
            console.print("\n[cyan]Thanks for using Habit Cost Calculator! 💸[/cyan]\n")
            break

if __name__ == "__main__":
    main()
from datetime import datetime, date
from typing import Union
from ..models import FineCalculationResult

FINE_RATE_PER_DAY = 5.0

def parse_date(date_input: Union[str, date, datetime]) -> date:
    if isinstance(date_input, datetime):
        return date_input.date()
    if isinstance(date_input, date):
        return date_input
    return datetime.fromisoformat(date_input.split("T")[0]).date()

def calculate_fine(due_date_input: Union[str, date], return_date_input: Union[str, date]) -> FineCalculationResult:
    """
    Computes strict $5/day fine penalty:
    Fine = $5 × (ReturnDate - DueDate) if ReturnDate > DueDate, else $0.
    """
    due_date = parse_date(due_date_input)
    return_date = parse_date(return_date_input)

    diff_days = (return_date - due_date).days
    days_overdue = max(0, diff_days)
    fine_amount = days_overdue * FINE_RATE_PER_DAY

    return FineCalculationResult(
        daysOverdue=days_overdue,
        fineAmount=float(fine_amount),
        formula=f"${FINE_RATE_PER_DAY:.2f} × {days_overdue} days = ${fine_amount:.2f}"
    )

def is_reminder_due(current_date_input: Union[str, date], due_date_input: Union[str, date], threshold_days: int = 2) -> bool:
    """
    Flags borrow records due within `threshold_days` or currently overdue.
    """
    current_date = parse_date(current_date_input)
    due_date = parse_date(due_date_input)
    days_remaining = (due_date - current_date).days
    return days_remaining <= threshold_days

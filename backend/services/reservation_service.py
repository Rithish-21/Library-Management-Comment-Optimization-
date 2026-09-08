import time
from typing import List, Optional, Tuple
from ..models import Reservation

def create_reservation(
    reservations: List[Reservation],
    student_name: str,
    student_id: str,
    book_title: str
) -> Reservation:
    """
    FIFO Reservation Queue:
    Calculates queue position based on active waiting reservations for this title.
    """
    existing_waiting = [r for r in reservations if r.bookTitle == book_title and r.status == "waiting"]
    queue_pos = len(existing_waiting) + 1

    new_res = Reservation(
        id=f"res-{int(time.time() * 1000)}",
        bookTitle=book_title,
        memberName=student_name,
        memberId=student_id,
        reservationDate=time.strftime("%Y-%m-%d"),
        queuePosition=queue_pos,
        status="waiting"
    )
    reservations.append(new_res)
    return new_res

def rebalance_queue(reservations: List[Reservation], book_title: str) -> List[Reservation]:
    """
    Maintains FIFO integrity by rebalancing queue positions 1..N.
    """
    waiting = [r for r in reservations if r.bookTitle == book_title and r.status == "waiting"]
    for idx, r in enumerate(waiting):
        r.queuePosition = idx + 1
    return waiting

def pop_next_reservation(reservations: List[Reservation], book_title: str) -> Optional[Reservation]:
    """
    Pops the head of the FIFO queue (#1) when an out-of-stock book is returned.
    """
    waiting = [r for r in reservations if r.bookTitle == book_title and r.status == "waiting"]
    if not waiting:
        return None
    
    first = waiting[0]
    first.status = "fulfilled"
    rebalance_queue(reservations, book_title)
    return first

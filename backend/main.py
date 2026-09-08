import time
from typing import Optional, List, Dict
from fastapi import FastAPI, HTTPException, Query, status
from fastapi.middleware.cors import CORSMiddleware

from .models import (
    Book,
    BorrowRecord,
    Reservation,
    IssueRequest,
    ReturnRequest,
    ReservationRequest,
    AddBookRequest,
    SearchBenchmarkResult,
    FineCalculationResult,
    BackupSnapshot
)
from .data import db
from .services.search_service import benchmark_search
from .services.fine_service import calculate_fine
from .services.inventory_service import issue_from_inventory, replenish_inventory, check_duplicate_book
from .services.reservation_service import create_reservation, pop_next_reservation
from .services.recommendation_service import get_most_popular, get_category_recommendations
from .services.backup_service import create_snapshot, restore_snapshot

app = FastAPI(
    title="Smart LMS Python API",
    description="Intelligent Library Management System backend powered by Python, FastAPI, and Pydantic.",
    version="1.0.0"
)

# Enable CORS for Vite frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {
        "system": "Smart Library Management System (Python Backend)",
        "status": "online",
        "docs": "/docs",
        "algorithms": [
            "O(log n) Binary Search",
            "Strict $5/Day Fine Engine",
            "Atomic Inventory Guardrails",
            "FIFO Priority Queue",
            "Popularity Leaderboard",
            "State Snapshots"
        ]
    }

# 1. Catalog & Inventory
@app.get("/api/books", response_model=List[Book])
def get_books():
    return db.books

@app.get("/api/inventory", response_model=Dict[str, int])
def get_inventory():
    return db.inventory

@app.get("/api/borrows", response_model=List[BorrowRecord])
def get_borrows():
    return db.borrow_records

@app.get("/api/reservations", response_model=List[Reservation])
def get_reservations():
    return db.reservations

# 2. Fast Binary Search Benchmark (Feature 1)
@app.get("/api/search", response_model=SearchBenchmarkResult)
def search_books(
    q: str = Query(..., description="Book title to search"),
    algo: str = Query("binary", pattern="^(binary|linear)$")
):
    return benchmark_search(db.books, q, algo)

# 3. Issue Book with Stock Guardrail (Feature 2 & 4)
@app.post("/api/issue", response_model=BorrowRecord)
def issue_book(req: IssueRequest):
    # Check physical stock guardrail
    success, remaining_stock, error_msg = issue_from_inventory(db.inventory, req.bookTitle)
    if not success:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=error_msg)

    # Calculate default due date (14 days from today)
    issue_date = time.strftime("%Y-%m-%d")
    due_date = req.dueDate or time.strftime("%Y-%m-%d", time.localtime(time.time() + 14 * 86400))

    record = BorrowRecord(
        id=f"rec-{int(time.time() * 1000)}",
        bookTitle=req.bookTitle,
        memberName=req.studentName,
        memberId=req.studentId,
        issueDate=issue_date,
        dueDate=due_date,
        status="active"
    )
    db.borrow_records.insert(0, record)
    db.borrow_counts[req.bookTitle] = db.borrow_counts.get(req.bookTitle, 0) + 1

    return record

# 4. Return Book & Fine Calculation (Feature 3 & 6)
@app.post("/api/return")
def return_book(req: ReturnRequest):
    record = next((r for r in db.borrow_records if r.id == req.recordId), None)
    if not record:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Borrow record not found")

    return_date = req.returnDate or time.strftime("%Y-%m-%d")
    fine_res = calculate_fine(record.dueDate, return_date)

    record.returnDate = return_date
    record.fineAmount = fine_res.fineAmount
    record.status = "returned"

    # Replenish stock
    replenish_inventory(db.inventory, record.bookTitle)

    # Check if FIFO reservation exists for this title
    fulfilled_reservation = pop_next_reservation(db.reservations, record.bookTitle)

    return {
        "message": f"'{record.bookTitle}' returned successfully",
        "fine": fine_res,
        "record": record,
        "fulfilledReservation": fulfilled_reservation
    }

# 5. Fine Calculation Preview
@app.get("/api/fine/calculate", response_model=FineCalculationResult)
def preview_fine(
    due_date: str = Query(..., description="Due date (YYYY-MM-DD)"),
    return_date: str = Query(..., description="Return date (YYYY-MM-DD)")
):
    return calculate_fine(due_date, return_date)

# 6. FIFO Priority Queue Reservation (Feature 5 & 14)
@app.post("/api/reserve", response_model=Reservation)
def reserve_book(req: ReservationRequest):
    return create_reservation(db.reservations, req.studentName, req.studentId, req.bookTitle)

# 7. Recommendations & Trending (Feature 8 & 11)
@app.get("/api/recommendations/popular")
def get_popular(limit: int = 5):
    return get_most_popular(db.borrow_counts, db.books, limit)

@app.get("/api/recommendations/related/{book_id}", response_model=List[Book])
def get_related(book_id: str, limit: int = 3):
    return get_category_recommendations(db.books, book_id, limit)

# 8. Add Book with Deduplication Check (Feature 7)
@app.post("/api/books", response_model=Book)
def add_book(req: AddBookRequest):
    dup_error = check_duplicate_book(db.books, req.title, req.isbn)
    if dup_error:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=dup_error)

    new_book = Book(
        id=str(len(db.books) + 1),
        title=req.title,
        author=req.author,
        isbn=req.isbn,
        shelf=req.shelf,
        category=req.category,
        totalCopies=req.initialCopies,
        description=req.description,
        status="Available"
    )
    db.books.append(new_book)
    db.inventory[new_book.title] = req.initialCopies
    db.borrow_counts[new_book.title] = 0

    return new_book

# 9. In-Memory Snapshots & Recovery (Feature 15)
@app.get("/api/backup/snapshot", response_model=BackupSnapshot)
def generate_snapshot(name: Optional[str] = None):
    return create_snapshot(db, name)

@app.post("/api/backup/restore")
def restore_from_snapshot(snapshot: BackupSnapshot):
    restore_snapshot(db, snapshot)
    return {"message": f"Successfully restored snapshot '{snapshot.name}'", "timestamp": snapshot.timestamp}

@app.post("/api/reset")
def reset_database():
    db.reset()
    return {"message": "Database reset to factory initial state"}

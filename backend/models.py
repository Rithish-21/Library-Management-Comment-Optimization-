from typing import List, Optional, Dict, Literal
from pydantic import BaseModel, Field

BookStatus = Literal["Available", "Issued", "Reserved", "Lost"]
BookCategory = Literal["Programming", "Cloud & DevOps", "Systems", "AI & ML"]
UserRole = Literal["student", "librarian"]
BorrowStatus = Literal["active", "returned", "overdue"]
ReservationStatus = Literal["waiting", "fulfilled", "cancelled"]

class Book(BaseModel):
    id: str
    title: str
    author: str
    isbn: str
    shelf: str
    category: str
    status: BookStatus = "Available"
    description: str = ""
    totalCopies: int = 1

class User(BaseModel):
    id: str
    name: str
    email: str
    role: UserRole
    activeBorrowCount: int = 0
    maxLimit: int = 5

class BorrowRecord(BaseModel):
    id: str
    bookTitle: str
    memberName: str
    memberId: str
    issueDate: str
    dueDate: str
    returnDate: Optional[str] = None
    fineAmount: float = 0.0
    status: BorrowStatus = "active"

class Reservation(BaseModel):
    id: str
    bookTitle: str
    memberName: str
    memberId: str
    reservationDate: str
    queuePosition: int = 1
    status: ReservationStatus = "waiting"

class IssueRequest(BaseModel):
    studentId: str
    studentName: str
    bookTitle: str
    dueDate: Optional[str] = None

class ReturnRequest(BaseModel):
    recordId: str
    returnDate: Optional[str] = None

class ReservationRequest(BaseModel):
    studentName: str
    studentId: str
    bookTitle: str

class AddBookRequest(BaseModel):
    title: str
    author: str
    isbn: str
    shelf: str
    category: str
    initialCopies: int = 1
    description: str = ""

class SearchBenchmarkResult(BaseModel):
    query: str
    algorithm: str
    found: bool
    book: Optional[Book] = None
    timeMs: float
    stepsCount: int

class FineCalculationResult(BaseModel):
    daysOverdue: int
    fineAmount: float
    formula: str

class BackupSnapshot(BaseModel):
    id: str
    timestamp: str
    name: str
    books: List[Book]
    inventory: Dict[str, int]
    borrowRecords: List[BorrowRecord]
    reservations: List[Reservation]
    borrowCounts: Dict[str, int]

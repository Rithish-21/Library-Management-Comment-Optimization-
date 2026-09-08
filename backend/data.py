import copy
from typing import List, Dict
from .models import Book, BorrowRecord, Reservation, User

INITIAL_BOOKS = [
    {
        "id": "1",
        "title": "Android Development",
        "author": "Dawn Griffiths",
        "category": "Mobile",
        "shelf": "C2",
        "status": "Available",
        "isbn": "978-1491956625",
        "description": "A brain-friendly guide to building native Android applications using Kotlin and Jetpack.",
        "totalCopies": 4
    },
    {
        "id": "2",
        "title": "Cloud Computing",
        "author": "Thomas Erl",
        "category": "Cloud & DevOps",
        "shelf": "D1",
        "status": "Available",
        "isbn": "978-0133387520",
        "description": "Concepts, technology and architecture of distributed cloud systems and microservices.",
        "totalCopies": 5
    },
    {
        "id": "3",
        "title": "Data Science",
        "author": "Joel Grus",
        "category": "Data Science",
        "shelf": "C1",
        "status": "Available",
        "isbn": "978-1492041139",
        "description": "Principles of data science from scratch using Python, linear algebra, and machine learning.",
        "totalCopies": 3
    },
    {
        "id": "4",
        "title": "Data Structures & Algorithms",
        "author": "Robert Lafore",
        "category": "Computer Science",
        "shelf": "A3",
        "status": "Available",
        "isbn": "978-0672324536",
        "description": "Classic foundations of algorithmic problem solving, trees, graphs, and optimization.",
        "totalCopies": 6
    },
    {
        "id": "5",
        "title": "Database",
        "author": "Abraham Silberschatz",
        "category": "Systems",
        "shelf": "B2",
        "status": "Available",
        "isbn": "978-0078022159",
        "description": "Fundamental concepts of relational database management, SQL, normalization, and ACID properties.",
        "totalCopies": 4
    },
    {
        "id": "6",
        "title": "Docker & Kubernetes",
        "author": "Nigel Poulton",
        "category": "Cloud & DevOps",
        "shelf": "D2",
        "status": "Available",
        "isbn": "978-1916585003",
        "description": "Master containerization, container orchestration, and production DevOps workflows.",
        "totalCopies": 5
    },
    {
        "id": "7",
        "title": "Java",
        "author": "Joshua Bloch",
        "category": "Programming",
        "shelf": "A2",
        "status": "Available",
        "isbn": "978-0134685991",
        "description": "Best practices for the Java programming platform covering concurrency, generics, and lambdas.",
        "totalCopies": 5
    },
    {
        "id": "8",
        "title": "Machine Learning",
        "author": "Aurélien Géron",
        "category": "AI & ML",
        "shelf": "C3",
        "status": "Available",
        "isbn": "978-1492032649",
        "description": "Hands-on machine learning with Scikit-Learn, Keras, and TensorFlow for deep neural networks.",
        "totalCopies": 4
    },
    {
        "id": "9",
        "title": "Microservices",
        "author": "Sam Newman",
        "category": "Systems",
        "shelf": "B1",
        "status": "Available",
        "isbn": "978-1492034025",
        "description": "Building fine-grained, decoupled microservice systems with resilient communication patterns.",
        "totalCopies": 3
    },
    {
        "id": "10",
        "title": "Python",
        "author": "Eric Matthes",
        "category": "Programming",
        "shelf": "A1",
        "status": "Available",
        "isbn": "978-1593279288",
        "description": "A fast-paced, thorough introduction to programming with Python from fundamentals to web applications.",
        "totalCopies": 8
    }
]

INITIAL_INVENTORY = {
    "Android Development": 3,
    "Cloud Computing": 4,
    "Data Science": 2,
    "Data Structures & Algorithms": 5,
    "Database": 3,
    "Docker & Kubernetes": 4,
    "Java": 4,
    "Machine Learning": 3,
    "Microservices": 2,
    "Python": 6
}

INITIAL_BORROW_COUNTS = {
    "Python": 34,
    "Data Structures & Algorithms": 28,
    "Docker & Kubernetes": 22,
    "Java": 19,
    "Machine Learning": 16,
    "Database": 14,
    "Cloud Computing": 11,
    "Android Development": 9,
    "Microservices": 8,
    "Data Science": 7
}

INITIAL_BORROW_RECORDS = [
    {
        "id": "rec-101",
        "bookTitle": "Python",
        "memberName": "Rahul",
        "memberId": "101",
        "issueDate": "2026-03-01",
        "dueDate": "2026-03-15",
        "returnDate": None,
        "fineAmount": 0.0,
        "status": "active"
    },
    {
        "id": "rec-102",
        "bookTitle": "Java",
        "memberName": "Priya",
        "memberId": "102",
        "issueDate": "2026-02-15",
        "dueDate": "2026-03-01",
        "returnDate": None,
        "fineAmount": 35.0,
        "status": "overdue"
    }
]

INITIAL_RESERVATIONS = [
    {
        "id": "res-1",
        "bookTitle": "Machine Learning",
        "memberName": "Amit",
        "memberId": "103",
        "reservationDate": "2026-03-05",
        "queuePosition": 1,
        "status": "waiting"
    }
]

class LibraryDatabase:
    """In-memory thread-safe state container for Python backend."""
    def __init__(self):
        self.reset()

    def reset(self):
        self.books: List[Book] = [Book(**b) for b in INITIAL_BOOKS]
        self.inventory: Dict[str, int] = copy.deepcopy(INITIAL_INVENTORY)
        self.borrow_counts: Dict[str, int] = copy.deepcopy(INITIAL_BORROW_COUNTS)
        self.borrow_records: List[BorrowRecord] = [BorrowRecord(**r) for r in INITIAL_BORROW_RECORDS]
        self.reservations: List[Reservation] = [Reservation(**r) for r in INITIAL_RESERVATIONS]

db = LibraryDatabase()

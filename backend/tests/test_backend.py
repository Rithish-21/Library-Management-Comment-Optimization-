import pytest
from fastapi.testclient import TestClient

from backend.main import app
from backend.data import db
from backend.models import Book
from backend.services.search_service import binary_search, linear_search
from backend.services.fine_service import calculate_fine, is_reminder_due
from backend.services.inventory_service import issue_from_inventory, replenish_inventory, check_duplicate_book
from backend.services.reservation_service import create_reservation, pop_next_reservation
from backend.services.recommendation_service import get_most_popular

client = TestClient(app)

@pytest.fixture(autouse=True)
def reset_db():
    db.reset()

# -------------------------------------------------------------
# 1. ALGORITHM TESTS
# -------------------------------------------------------------

def test_binary_search_finds_title():
    book, steps = binary_search(db.books, "Python")
    assert book is not None
    assert book.title == "Python"
    assert steps <= 5

def test_binary_search_not_found():
    book, steps = binary_search(db.books, "NonExistentBookXYZ")
    assert book is None

def test_linear_search_finds_title():
    book, steps = linear_search(db.books, "Python")
    assert book is not None
    assert book.title == "Python"
    assert steps > 0

def test_fine_calculation_zero_for_ontime():
    res = calculate_fine("2026-03-15", "2026-03-10")
    assert res.daysOverdue == 0
    assert res.fineAmount == 0.0

def test_fine_calculation_strict_formula():
    res = calculate_fine("2026-03-01", "2026-03-08")
    assert res.daysOverdue == 7
    assert res.fineAmount == 35.0  # 7 days * $5.00

def test_reminder_due_detector():
    # Due in 1 day -> reminder needed
    assert is_reminder_due("2026-03-14", "2026-03-15", threshold_days=2) is True
    # Due in 5 days -> reminder not needed
    assert is_reminder_due("2026-03-10", "2026-03-15", threshold_days=2) is False

def test_inventory_guardrail():
    inventory = {"Python": 1}
    success, rem, err = issue_from_inventory(inventory, "Python")
    assert success is True
    assert rem == 0
    assert err is None

    # Second issue should fail due to zero stock
    success, rem, err = issue_from_inventory(inventory, "Python")
    assert success is False
    assert "Out of stock" in err

def test_deduplication_guardrail():
    # Duplicate title
    err = check_duplicate_book(db.books, "Python", "978-9999999999")
    assert err is not None
    assert "Duplicate title" in err

    # Duplicate ISBN
    err = check_duplicate_book(db.books, "Unique New Title", "978-1593279288")
    assert err is not None
    assert "Duplicate ISBN" in err

    # Unique book passes
    err = check_duplicate_book(db.books, "Unique New Title", "978-0000000001")
    assert err is None

def test_fifo_reservation_queue():
    reservations = []
    r1 = create_reservation(reservations, "Alice", "U1", "Python")
    r2 = create_reservation(reservations, "Bob", "U2", "Python")
    assert r1.queuePosition == 1
    assert r2.queuePosition == 2

    popped = pop_next_reservation(reservations, "Python")
    assert popped.id == r1.id
    assert popped.status == "fulfilled"
    assert r2.queuePosition == 1

def test_popularity_ranking():
    popular = get_most_popular(db.borrow_counts, db.books, limit=3)
    assert len(popular) == 3
    assert popular[0]["isTrending"] is True
    assert popular[0]["borrowCount"] >= popular[1]["borrowCount"]

# -------------------------------------------------------------
# 2. FASTAPI ENDPOINT INTEGRATION TESTS
# -------------------------------------------------------------

def test_api_root():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json()["status"] == "online"

def test_api_get_books():
    response = client.get("/api/books")
    assert response.status_code == 200
    assert len(response.json()) >= 10

def test_api_search_endpoint():
    response = client.get("/api/search?q=Python&algo=binary")
    assert response.status_code == 200
    data = response.json()
    assert data["found"] is True
    assert data["book"]["title"] == "Python"
    assert data["stepsCount"] <= 5

def test_api_issue_and_return_cycle():
    # Issue book
    issue_resp = client.post("/api/issue", json={
        "studentId": "101",
        "studentName": "Rahul",
        "bookTitle": "Python",
        "dueDate": "2026-03-01"
    })
    assert issue_resp.status_code == 200
    rec = issue_resp.json()
    assert rec["bookTitle"] == "Python"

    # Return book late (5 days late -> $25 fine)
    return_resp = client.post("/api/return", json={
        "recordId": rec["id"],
        "returnDate": "2026-03-06"
    })
    assert return_resp.status_code == 200
    ret_data = return_resp.json()
    assert ret_data["fine"]["fineAmount"] == 25.0
    assert ret_data["record"]["status"] == "returned"

def test_api_reserve_endpoint():
    response = client.post("/api/reserve", json={
        "studentId": "105",
        "studentName": "Kiran",
        "bookTitle": "Database"
    })
    assert response.status_code == 200
    data = response.json()
    assert data["memberName"] == "Kiran"
    assert data["status"] == "waiting"

def test_api_add_book_deduplication():
    # Try adding existing book
    resp = client.post("/api/books", json={
        "title": "Python",
        "author": "Someone Else",
        "isbn": "978-1111111111",
        "shelf": "Z1",
        "category": "Programming",
        "initialCopies": 2
    })
    assert resp.status_code == 409

def test_api_backup_snapshot_and_restore():
    snap_resp = client.get("/api/backup/snapshot?name=TestSnapshot")
    assert snap_resp.status_code == 200
    snapshot = snap_resp.json()
    assert snapshot["name"] == "TestSnapshot"

    # Mutate db
    client.post("/api/issue", json={
        "studentId": "999",
        "studentName": "Ghost",
        "bookTitle": "Python"
    })

    # Restore
    restore_resp = client.post("/api/backup/restore", json=snapshot)
    assert restore_resp.status_code == 200

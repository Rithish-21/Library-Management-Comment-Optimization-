import copy
import json
import time
from typing import Optional
from ..models import BackupSnapshot
from ..data import LibraryDatabase

def create_snapshot(db: LibraryDatabase, name: Optional[str] = None) -> BackupSnapshot:
    """
    Creates an immutable point-in-time snapshot of the database state.
    """
    timestamp = time.strftime("%Y-%m-%dT%H:%M:%SZ")
    snap_id = f"snap-{int(time.time() * 1000)}"
    snap_name = name or f"Python Backup Snapshot ({time.strftime('%H:%M:%S')})"

    return BackupSnapshot(
        id=snap_id,
        timestamp=timestamp,
        name=snap_name,
        books=copy.deepcopy(db.books),
        inventory=copy.deepcopy(db.inventory),
        borrowRecords=copy.deepcopy(db.borrow_records),
        reservations=copy.deepcopy(db.reservations),
        borrowCounts=copy.deepcopy(db.borrow_counts)
    )

def restore_snapshot(db: LibraryDatabase, snapshot: BackupSnapshot) -> bool:
    """
    Restores the database state from a verified snapshot.
    """
    db.books = copy.deepcopy(snapshot.books)
    db.inventory = copy.deepcopy(snapshot.inventory)
    db.borrow_records = copy.deepcopy(snapshot.borrowRecords)
    db.reservations = copy.deepcopy(snapshot.reservations)
    db.borrow_counts = copy.deepcopy(snapshot.borrowCounts)
    return True

def export_to_json(snapshot: BackupSnapshot) -> str:
    return snapshot.model_dump_json(indent=2)

def import_from_json(json_str: str) -> Optional[BackupSnapshot]:
    try:
        data = json.loads(json_str)
        return BackupSnapshot(**data)
    except Exception:
        return None

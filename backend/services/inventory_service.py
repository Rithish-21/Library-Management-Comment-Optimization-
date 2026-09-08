from typing import Dict, List, Tuple, Optional
from ..models import Book

def issue_from_inventory(inventory: Dict[str, int], title: str) -> Tuple[bool, int, Optional[str]]:
    """
    Atomic inventory guardrail:
    Decrements physical stock only if stock > 0.
    """
    current_stock = inventory.get(title, 0)
    if current_stock <= 0:
        return False, 0, f"Out of stock! '{title}' has 0 available physical copies."
    
    inventory[title] = current_stock - 1
    return True, inventory[title], None

def replenish_inventory(inventory: Dict[str, int], title: str) -> int:
    """
    Replenishes physical inventory upon book return.
    """
    inventory[title] = inventory.get(title, 0) + 1
    return inventory[title]

def check_duplicate_book(books: List[Book], title: str, isbn: str) -> Optional[str]:
    """
    Deduplication guardrail on ingestion:
    Rejects books with identical title (case-insensitive) or matching ISBN.
    """
    norm_title = title.strip().lower()
    norm_isbn = isbn.strip().replace("-", "").lower()

    for b in books:
        if b.title.strip().lower() == norm_title:
            return f"Duplicate title detected! '{b.title}' already exists on Shelf {b.shelf}."
        if b.isbn.strip().replace("-", "").lower() == norm_isbn:
            return f"Duplicate ISBN detected! ISBN '{isbn}' is already registered to '{b.title}'."

    return None

from typing import List, Dict, Any
from ..models import Book

def get_most_popular(borrow_counts: Dict[str, int], books: List[Book], limit: int = 5) -> List[Dict[str, Any]]:
    """
    Computes Popularity Leaderboard:
    Sorts borrow counts descending to highlight most demanded titles.
    """
    book_map = {b.title: b for b in books}
    sorted_items = sorted(borrow_counts.items(), key=lambda item: item[1], reverse=True)

    results = []
    for rank, (title, count) in enumerate(sorted_items[:limit], start=1):
        book = book_map.get(title)
        results.append({
            "rank": rank,
            "title": title,
            "borrowCount": count,
            "isTrending": rank == 1,
            "book": book
        })
    return results

def get_category_recommendations(books: List[Book], current_book_id: str, limit: int = 3) -> List[Book]:
    """
    Category affinity recommendation:
    Returns titles sharing the same category.
    """
    current = next((b for b in books if b.id == current_book_id), None)
    if not current:
        return []

    same_category = [b for b in books if b.category == current.category and b.id != current_book_id]
    return same_category[:limit]

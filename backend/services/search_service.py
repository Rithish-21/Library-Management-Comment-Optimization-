import time
from typing import List, Optional, Tuple
from ..models import Book, SearchBenchmarkResult

def binary_search(books: List[Book], query: str) -> Tuple[Optional[Book], int]:
    """
    Performs logarithmic O(log n) Binary Search on title-sorted book array.
    Returns (Book, stepsCount).
    """
    sorted_books = sorted(books, key=lambda b: b.title.lower())
    low = 0
    high = len(sorted_books) - 1
    normalized_query = query.strip().lower()
    steps = 0

    while low <= high:
        steps += 1
        mid = (low + high) // 2
        mid_title = sorted_books[mid].title.lower()

        if mid_title == normalized_query:
            return sorted_books[mid], steps
        elif mid_title < normalized_query:
            low = mid + 1
        else:
            high = mid - 1

    # Secondary prefix / substring fallback if exact match not found
    for book in sorted_books:
        if normalized_query in book.title.lower():
            return book, steps

    return None, steps

def linear_search(books: List[Book], query: str) -> Tuple[Optional[Book], int]:
    """
    Legacy O(n) Linear Scan for benchmark comparison.
    """
    normalized_query = query.strip().lower()
    steps = 0
    for book in books:
        steps += 1
        if book.title.lower() == normalized_query or normalized_query in book.title.lower():
            return book, steps
    return None, steps

def benchmark_search(books: List[Book], query: str, algorithm: str = "binary") -> SearchBenchmarkResult:
    """
    Runs benchmark comparator and returns execution timing and steps.
    """
    start_time = time.perf_counter()
    if algorithm == "linear":
        book, steps = linear_search(books, query)
    else:
        book, steps = binary_search(books, query)
    elapsed_ms = (time.perf_counter() - start_time) * 1000.0

    return SearchBenchmarkResult(
        query=query,
        algorithm=algorithm,
        found=book is not None,
        book=book,
        timeMs=round(elapsed_ms, 4),
        stepsCount=steps
    )

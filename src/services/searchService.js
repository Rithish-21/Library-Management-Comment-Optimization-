/**
 * Binary Search: O(log n) search on a title-sorted catalog.
 * Strict implementation conforming to TRD Section 4.1.
 */
export function binarySearch(sortedBooks, target) {
    let low = 0;
    let high = sortedBooks.length - 1;
    const normalizedTarget = target.trim().toLowerCase();
    while (low <= high) {
        const mid = Math.floor((low + high) / 2);
        const midTitle = sortedBooks[mid].title.trim().toLowerCase();
        if (midTitle === normalizedTarget) {
            return sortedBooks[mid];
        }
        else if (midTitle < normalizedTarget) {
            low = mid + 1;
        }
        else {
            high = mid - 1;
        }
    }
    return null; // Not Found
}
/**
 * Detailed step-by-step Binary Search for visualizer and educational inspection.
 */
export function binarySearchWithSteps(sortedBooks, target) {
    let low = 0;
    let high = sortedBooks.length - 1;
    const steps = [];
    let stepIndex = 1;
    const normalizedTarget = target.trim().toLowerCase();
    while (low <= high) {
        const mid = Math.floor((low + high) / 2);
        const midTitle = sortedBooks[mid].title;
        const midTitleNorm = midTitle.trim().toLowerCase();
        if (midTitleNorm === normalizedTarget) {
            steps.push({
                step: stepIndex,
                low,
                high,
                mid,
                midTitle,
                target,
                comparison: 'match',
            });
            return { book: sortedBooks[mid], steps };
        }
        else if (midTitleNorm < normalizedTarget) {
            steps.push({
                step: stepIndex,
                low,
                high,
                mid,
                midTitle,
                target,
                comparison: 'right',
            });
            low = mid + 1;
        }
        else {
            steps.push({
                step: stepIndex,
                low,
                high,
                mid,
                midTitle,
                target,
                comparison: 'left',
            });
            high = mid - 1;
        }
        stepIndex++;
    }
    return { book: null, steps };
}
/**
 * Linear Search: O(n) scan for performance comparison.
 */
export function linearSearchWithSteps(books, target) {
    const normalizedTarget = target.trim().toLowerCase();
    let stepsCount = 0;
    for (let i = 0; i < books.length; i++) {
        stepsCount++;
        if (books[i].title.trim().toLowerCase() === normalizedTarget) {
            return { book: books[i], stepsCount };
        }
    }
    return { book: null, stepsCount };
}
/**
 * Sort catalog ascending by title (required invariant for binary search).
 */
export function getSortedCatalog(books) {
    return [...books].sort((a, b) => a.title.localeCompare(b.title, undefined, { sensitivity: 'base' }));
}
/**
 * Benchmarks Binary vs Linear search execution.
 */
export function benchmarkSearch(books, target, algorithm) {
    const sorted = getSortedCatalog(books);
    const start = performance.now();
    if (algorithm === 'binary') {
        const { book, steps } = binarySearchWithSteps(sorted, target);
        const end = performance.now();
        return {
            algorithm: 'binary',
            found: book !== null,
            book,
            executionTimeMs: Math.max(0.001, Number((end - start).toFixed(4))),
            stepsCount: steps.length,
            steps,
        };
    }
    else {
        const { book, stepsCount } = linearSearchWithSteps(books, target);
        const end = performance.now();
        return {
            algorithm: 'linear',
            found: book !== null,
            book,
            executionTimeMs: Math.max(0.001, Number((end - start).toFixed(4))),
            stepsCount,
        };
    }
}

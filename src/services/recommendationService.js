/**
 * Returns title of the single most popular book.
 * Conforms to TRD Section 4.5.
 */
export function mostPopular(borrowCount) {
    const entries = Object.entries(borrowCount);
    if (entries.length === 0)
        return '';
    return entries.sort((a, b) => b[1] - a[1])[0][0];
}
/**
 * Returns ranked list of books sorted by borrow count descending.
 */
export function getPopularityLeaderboard(borrowCount, books) {
    return Object.entries(borrowCount)
        .sort((a, b) => b[1] - a[1])
        .map(([title, count], index) => {
        const book = books.find((b) => b.title.toLowerCase() === title.toLowerCase());
        return {
            title,
            count,
            book,
            rank: index + 1,
        };
    });
}
/**
 * Recommends related books based on direct mapping or shared category.
 */
export function getRelatedBooks(targetBookTitle, allBooks, recommendationMap) {
    const targetBook = allBooks.find((b) => b.title.toLowerCase() === targetBookTitle.toLowerCase());
    const directTitles = recommendationMap[targetBookTitle] || [];
    const directMatches = allBooks.filter((b) => directTitles.some((t) => t.toLowerCase() === b.title.toLowerCase()));
    if (directMatches.length >= 2) {
        return directMatches.slice(0, 4);
    }
    // Fallback / augmentation via category affinity
    const categoryMatches = targetBook
        ? allBooks.filter((b) => b.category === targetBook.category &&
            b.title.toLowerCase() !== targetBookTitle.toLowerCase() &&
            !directMatches.some((dm) => dm.id === b.id))
        : [];
    return [...directMatches, ...categoryMatches].slice(0, 4);
}

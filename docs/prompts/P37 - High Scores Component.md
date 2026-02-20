### Prompt 5.4: High Scores Component

```
Create high scores display with Angular Material table.

Requirements:
1. Create high-scores.component.ts in /src/app/features/menu with:
   - mat-table displaying rank, name, score, level, date
   - mat-paginator for pagination (10 per page)
   - mat-sort for sortable columns
   - Load scores from backend API
   - Highlight current player's score if present
2. Format date with Angular date pipe
3. Format score with number pipes (comma separators)
4. Responsive table design

TDD Approach:
- Create high-scores.component.spec.ts:
  * Component loads scores from API on init
  * Table displays all column headers
  * Scores sorted by rank (score descending)
  * Pagination shows 10 scores per page
  * Pagination controls work correctly
  * Date formatted as readable string
  * Score formatted with commas
  * Empty state shown when no scores
- Mock HttpClient with test data
- Implement component with Material table
- Verify sorting and pagination

Deliverable: High scores table with pagination
```

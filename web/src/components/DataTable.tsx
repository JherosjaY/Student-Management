import type { ReactElement, ReactNode } from 'react';
import { Spinner } from './Spinner';
import { EmptyState } from './EmptyState';
import './DataTable.css';
 
export interface DataTableColumn<T> {
  key: string;
  header: ReactNode;
  render: (item: T) => ReactNode;
  sortable?: boolean;
  // Override what gets sent to the server when this column header is clicked.
  // Defaults to `key`.
  sortKey?: string;
  // CSS width — pass '100px', '20%', 'minmax(...)', whatever.
  width?: string;
  // Right-align numerics, etc.
  align?: 'left' | 'right' | 'center';
}
 
interface DataTableProps<T> {
  columns: readonly DataTableColumn<T>[];
  data: readonly T[];
  isLoading?: boolean;
  isError?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyAction?: ReactNode;
  // Server-driven sort. The header click hands the column key back to the parent.
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  onSort?: (key: string) => void;
  getRowKey: (item: T) => string;
  onRowClick?: (item: T) => void;
}
 
const SortIcon = ({ direction }: { direction: 'asc' | 'desc' | null }): ReactElement => {
  if (direction === null) {
    return (
      <svg
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        style={{ opacity: 0.4 }}
      >
        <path d="M8 9l4-4 4 4" />
        <path d="M16 15l-4 4-4-4" />
      </svg>
    );
  }
  return direction === 'asc' ? (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M8 9l4-4 4 4" />
    </svg>
  ) : (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M16 15l-4 4-4-4" />
    </svg>
  );
};
 
export const DataTable = <T,>({
  columns,
  data,
  isLoading = false,
  isError = false,
  emptyTitle = 'No data',
  emptyDescription,
  emptyAction,
  sortBy,
  sortOrder,
  onSort,
  getRowKey,
  onRowClick,
}: DataTableProps<T>): ReactElement => {
  if (isLoading) {
    return (
      <div className="data-table__state">
        <Spinner label="Loading data" />
      </div>
    );
  }
 
  if (isError) {
    return (
      <div className="data-table__state">
        <EmptyState title="Couldn't load data" description="Try refreshing the page." />
      </div>
    );
  }
 
  if (data.length === 0) {
    return (
      <div className="data-table__state">
        <EmptyState
          title={emptyTitle}
          {...(emptyDescription !== undefined && { description: emptyDescription })}
          {...(emptyAction !== undefined && { action: emptyAction })}
        />
      </div>
    );
  }
 
  return (
    <div className="data-table-wrapper">
      <table className="data-table">
        <thead>
          <tr>
            {columns.map((col) => {
              const colSortKey = col.sortKey ?? col.key;
              const isSorted = col.sortable === true && sortBy === colSortKey;
              const direction = isSorted ? (sortOrder ?? null) : null;
              return (
                <th
                  key={col.key}
                  scope="col"
                  className={`data-table__th data-table__th--${col.align ?? 'left'}`}
                  style={col.width !== undefined ? { width: col.width } : undefined}
                  aria-sort={
                    isSorted
                      ? sortOrder === 'asc'
                        ? 'ascending'
                        : 'descending'
                      : col.sortable === true
                        ? 'none'
                        : undefined
                  }
                >
                  {col.sortable === true && onSort !== undefined ? (
                    <button
                      type="button"
                      className="data-table__sort-button"
                      onClick={() => {
                        onSort(colSortKey);
                      }}
                    >
                      <span>{col.header}</span>
                      <SortIcon direction={direction} />
                    </button>
                  ) : (
                    col.header
                  )}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr
              key={getRowKey(item)}
              className={onRowClick !== undefined ? 'data-table__row data-table__row--clickable' : 'data-table__row'}
              onClick={
                onRowClick !== undefined
                  ? () => {
                      onRowClick(item);
                    }
                  : undefined
              }
            >
              {columns.map((col) => (
                <td
                  key={col.key}
                  className={`data-table__td data-table__td--${col.align ?? 'left'}`}
                >
                  {col.render(item)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

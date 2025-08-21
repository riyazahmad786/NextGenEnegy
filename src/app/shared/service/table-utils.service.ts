import { Injectable } from '@angular/core';

export interface TableColumn {
  key: string;
  label: string;
  sortable?: boolean;
  hidden?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class TableUtilsService {
  /**
   * Format column labels (camelCase & snake_case to words)
   */
  formatLabel(key: string): string {
    return key
      .replace(/([A-Z])/g, ' $1') // Convert camelCase to words
      .replace(/_/g, ' ') // Convert snake_case to words
      .replace(/\b\w/g, (char) => char.toUpperCase()); // Capitalize first letter
  }

  /**
   * Generate table columns dynamically
   */
  generateTableColumns(
    keys: string[],
    sortableKeys: string[] = [],
    hiddenKeys: string[] = []
  ): TableColumn[] {
    return keys.map((key) => ({
      key,
      label: this.formatLabel(key),
      sortable: sortableKeys.includes(key), // Only specified keys are sortable
      hidden: hiddenKeys.includes(key), // Hide specific fields
    }));
  }

  /**
   * Filter table data based on selected columns
   */
  filterTableData(data: any[], columns: TableColumn[]): any[] {
    return data.map((item) =>
      columns.reduce((acc: Record<string, any>, col) => {
        if (col.key in item) {
          acc[col.key] = item[col.key];
        }
        return acc;
      }, {})
    );
  }
}

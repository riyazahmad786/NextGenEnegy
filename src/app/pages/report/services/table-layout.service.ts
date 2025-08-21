import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TableLayoutService {
  calculateMaxColumnsPerSplit(totalColumns: number): number {
    return totalColumns > 14 ? Math.ceil(totalColumns / 2) : 14;
  }

  splitColumnsAndRows(
    columns: string[],
    rows: string[],
    maxColumnsPerSplit: number
  ): { columns: string[][]; rows: string[][] } {
    const splitColumns: string[][] = [];
    const splitRows: string[][] = [];

    const numSplits = Math.ceil(columns.length / maxColumnsPerSplit);
    for (let i = 0; i < numSplits; i++) {
      const start = i * maxColumnsPerSplit;
      const end = start + maxColumnsPerSplit;
      splitColumns.push(columns.slice(start, end));
      splitRows.push(rows.slice(start, end));
    }
    return { columns: splitColumns, rows: splitRows };
  }
}

import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output,
  signal,
  SimpleChanges,
} from '@angular/core';

import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-iz-data-table',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './iz-data-table.component.html',
  styleUrl: './iz-data-table.component.css',
})
export class IzDataTableComponent<T extends Record<string, any>> {
  @Input() columns: {
    key: string;
    label: string;
    sortable?: boolean;
    hidden: boolean;
  }[] = [];
  @Input() data: T[] = []; // ✅ Now T is ensured to be an object
  @Input() actions?: { label: string; icon: string; action: string }[];
  @Input() pageSize: number = 5;
  @Input() showSearch: boolean = true;

  @Output() actionClick = new EventEmitter<{ action: string; row: T }>();
  constructor(private readonly cdr: ChangeDetectorRef) {}
  searchText = signal('');
  currentPage = signal(1);
  sortedColumn: string | null = null;
  sortDirection: 'asc' | 'desc' = 'asc';

  filteredData = signal<T[]>([]);

  ngOnInit(): void {
    if (this.data.length > 0) {
      this.filteredData.set([...this.data]); // ✅ Initialize filteredData on load
    }
  }

  // ngOnChanges(changes: SimpleChanges): void {
  //   if (changes['data'] && this.data.length > 0) {
  //     this.filteredData.set([...this.data]); // ✅ Update filteredData when data changes
  //     this.cdr.detectChanges(); // ✅ Ensure UI updates
  //   }
  // }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] && this.data.length > 0) {
      this.filteredData.set([...this.data]); // ✅ Update filteredData when data changes
      this.cdr.detectChanges(); // ✅ Ensure UI updates
    } else if (changes['data'] && this.data.length === 0) {
      this.filteredData.set([]); // Clear filtered data if no data
      this.currentPage.set(1); // Reset to first page
      this.cdr.detectChanges(); // Ensure UI updates
    }
  }
  // Sorting function
  sortData(column: string) {
    if (this.sortedColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortedColumn = column;
      this.sortDirection = 'asc';
    }
    const sortedData = [...this.filteredData()].sort((a: any, b: any) => {
      let valueA = a[column] ?? '';
      let valueB = b[column] ?? '';

      if (typeof valueA === 'string') valueA = valueA.toLowerCase();
      if (typeof valueB === 'string') valueB = valueB.toLowerCase();

      if (valueA < valueB) return this.sortDirection === 'asc' ? -1 : 1;
      if (valueA > valueB) return this.sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
    this.filteredData.set(sortedData);
  }

  updateSearchText(value: string) {
    this.searchText.set(value); // ✅ Properly update signal
    this.filterData(); // ✅ Call filter function after updating search text
  }
  // Search filter function
  // filterData() {
  //   const filtered = this.data.filter((row) =>
  //     Object.values(row).some((value) =>
  //       value
  //         ?.toString()
  //         .toLowerCase()
  //         .includes(this.searchText()?.toLowerCase() || '')
  //     )
  //   );
  //   // this.currentPage.set(1);
  //   this.filteredData.set([...filtered]); // ✅ Use set() to update signal
  //   this.cdr.detectChanges();
  // }

  //    Swati Changes
  filterData() {
    const filtered = this.data.filter((row) =>
      Object.values(row).some((value) =>
        value
          ?.toString()
          .toLowerCase()
          .includes(this.searchText()?.toLowerCase() || '')
      )
    );

    this.filteredData.set([...filtered]); // ✅ Use set() to update signal

    // Reset to first page if no data is available
    if (this.filteredData().length === 0) {
      this.currentPage.set(1);
    }

    this.cdr.detectChanges();
  }

  // Handle action button clicks
  onActionClick(action: string, row: T) {
    this.actionClick.emit({ action, row });
  }

  // Pagination Helpers
  get totalPages(): number {
    return Math.ceil(this.filteredData().length / this.pageSize);
  }

  get paginatedData(): T[] {
    const start = (this.currentPage() - 1) * this.pageSize;
    return this.filteredData().slice(start, start + this.pageSize);
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage.set(page);
    }
  }

  get totalRecords(): number {
    return this.filteredData().length; // ✅ Ensure `filteredData()` is reactive
  }
}

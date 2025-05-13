import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CommonModule, DatePipe } from '@angular/common';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-export-button',
  standalone: true,
  imports: [ButtonModule, CommonModule],
  templateUrl: './export-button.component.html',
  styleUrl: './export-button.component.css',
})
export class ExportButtonComponent {
  @Input() rangeDates: Date[] | undefined;
  @Input() fileName: string = 'exported_data';
  @Input() headers: string[] = [];
  @Input() rowMapper!: (item: any) => string[]; // Maps object to CSV row
  @Input() fetchDataFn!: (fromDate?: string, toDate?: string) => Promise<any[]>; // Generic data fetch function

  @Output() onExportComplete = new EventEmitter<void>();

  loading = false;
  private datePipe = new DatePipe('en-US');

  constructor(private messageService: MessageService) {}

  async handleExport(): Promise<void> {
    this.loading = true;

    try {
      let fromDate: string | undefined;
      let toDate: string | undefined;

      if (this.rangeDates && this.rangeDates.length === 2) {
        // Convert to local date range
        const start = new Date(this.rangeDates[0]);
        start.setHours(0, 0, 0, 0);

        const end = new Date(this.rangeDates[1]);
        end.setHours(23, 59, 59, 999);

        // Convert to ISO strings (UTC)
        fromDate = start.toISOString();
        toDate = end.toISOString();
      }

      const data = await this.fetchDataFn(fromDate, toDate);
      this.generateCSV(data);
      this.onExportComplete.emit();
    } catch (error) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to export data',
        life: 3000,
      });
    } finally {
      this.loading = false;
    }
  }

  private generateCSV(data: any[]): void {
    const csvRows = data.map((item) =>
      this.rowMapper(item)
        .map((field) => `"${field}"`)
        .join(',')
    );
    const csvContent = [this.headers.join(','), ...csvRows].join('\n');

    // Fix: Use proper encoding for Chinese characters
    const blob = new Blob(['\uFEFF' + csvContent], {
      type: 'text/csv;charset=utf-8;',
    });

    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    // Generate filename with exact requested format

    if (this.rangeDates && this.rangeDates.length >= 1) {
      const formatDate = (date: Date) =>
        this.datePipe.transform(date, 'yyyyMMdd');

      const startDate = formatDate(this.rangeDates[0]);
      this.fileName += `_${startDate}`;

      if (this.rangeDates.length === 2) {
        const endDate = formatDate(this.rangeDates[1]);
        this.fileName += `-${endDate}`;
      }
    }

    this.fileName += '.csv';

    link.setAttribute('href', url);
    link.setAttribute('download', this.fileName);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

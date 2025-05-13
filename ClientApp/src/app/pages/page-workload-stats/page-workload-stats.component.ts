import { CardModule } from "primeng/card";
import { StatisticsService } from "../../core/services/statistics/statistics.service";
import {
  DescriptionChart,
  ProductChart,
  TransactionChart,
  UserChart,
} from "../../core/models/chart-models";
import { CommonModule, DatePipe, isPlatformBrowser } from "@angular/common";
import { ButtonModule } from "primeng/button";
import { DatePickerModule } from "primeng/datepicker";
import { FormsModule } from "@angular/forms";
import { TooltipModule } from "primeng/tooltip";
import { TableModule } from "primeng/table";
import {
  ChangeDetectorRef,
  Component,
  inject,
  OnInit,
  PLATFORM_ID,
} from "@angular/core";
import { ChartModule } from "primeng/chart";
import { PanelModule } from "primeng/panel";
import { ScrollPanelModule } from "primeng/scrollpanel";
import * as XLSX from "xlsx";
import { SidenavService } from "../../core/services/_sidenav/sidenav.service";
import { Subscription } from "rxjs";

@Component({
  selector: "app-page-workload-stats",
  standalone: true,
  imports: [
    CardModule,
    CommonModule,
    ButtonModule,
    DatePickerModule,
    FormsModule,
    TableModule,
    DatePipe,
    TooltipModule,
    ChartModule,
    PanelModule,
    ScrollPanelModule,
  ],
  templateUrl: "./page-workload-stats.component.html",
  styleUrl: "./page-workload-stats.component.css",
})
export class PageWorkloadStatsComponent implements OnInit {
  statisticsService = inject(StatisticsService);
  rangeDates: Date[] | undefined;
  private readonly datePipe = new DatePipe("en-US");
  platformId = inject(PLATFORM_ID);
  cd = inject(ChangeDetectorRef);

  sideNavService = inject(SidenavService);
  private itemClickedSubscription!: Subscription;

  ngOnInit(): void {
    this.initAllData();
    this.subscribeToSideNav();
  }

  ngOnDestroy() {
    // Unsubscribe to avoid memory leaks
    if (this.itemClickedSubscription) {
      this.itemClickedSubscription.unsubscribe();
    }
  }

  subscribeToSideNav() {
    this.itemClickedSubscription = this.sideNavService.itemClicked$.subscribe(
      () => {
        this.rangeDates = [];
        this.initAllData(); // Re-fetch data when the sidenav item is clicked
      }
    );
  }

  initAllData() {
    let fromDate: string | undefined;
    let toDate: string | undefined;

    if (this.rangeDates && this.rangeDates.length === 2) {
      fromDate =
        this.datePipe.transform(this.rangeDates[0], "yyyy-MM-dd") ?? undefined;
      toDate =
        this.datePipe.transform(this.rangeDates[1], "yyyy-MM-dd") ?? undefined;
    }

    this.statisticsService.getUser(fromDate, toDate).subscribe((data) => {
      this.userData = data;
      this.initUserChart();
    });

    this.statisticsService.getProduct(fromDate, toDate).subscribe((data) => {
      this.productData = data;
      this.initProductChart();
    });

    this.statisticsService
      .getDescription(fromDate, toDate)
      .subscribe((data) => {
        this.descriptionData = data;
        this.initDescriptionChart();
      });

    this.statisticsService
      .getTransaction(fromDate, toDate)
      .subscribe((data) => {
        this.transactionData = data;
        this.initTransactionChart();
      });
  }

  //#region "Transaction Chart"
  transactionData: TransactionChart[] = [];
  trnxChartdata: any;
  trnxChartoptions: any;

  initTransactionChart() {
    if (isPlatformBrowser(this.platformId)) {
      const documentStyle = getComputedStyle(document.documentElement);
      const textColor = documentStyle.getPropertyValue("--p-text-color");
      const textColorSecondary = documentStyle.getPropertyValue(
        "--p-text-muted-color"
      );
      const surfaceBorder = documentStyle.getPropertyValue(
        "--p-content-border-color"
      );

      const now = new Date();
      const year = now.getFullYear();
      const month = now.getMonth(); // 0-based index (0 = January)

      // Generate all days for the month (1 - 31)
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      const allDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);

      // Initialize counts per day
      const totalEmailCountPerDay: { [day: number]: number } = {};
      const totalPhoneCountPerDay: { [day: number]: number } = {};
      allDays.forEach((day) => {
        totalEmailCountPerDay[day] = 0;
        totalPhoneCountPerDay[day] = 0;
      });

      // Populate with actual transaction data
      this.transactionData.forEach((transaction) => {
        const transactionDate = new Date(transaction.transactionDate);
        const day = transactionDate.getDate(); // Extract day (1-31)

        totalEmailCountPerDay[day] = transaction.emailCount || 0;
        totalPhoneCountPerDay[day] = transaction.phoneCount || 0;
      });

      this.trnxChartdata = {
        labels: allDays.map((day) => day.toString()), // Convert numbers to string labels
        datasets: [
          {
            label: "Total Email Transactions",
            data: allDays.map((day) => totalEmailCountPerDay[day]), // Map email count per day
            fill: false,
            borderColor: documentStyle.getPropertyValue("--p-blue-500"),
            tension: 0.4,
          },
          {
            label: "Total Phone Transactions",
            data: allDays.map((day) => totalPhoneCountPerDay[day]), // Map phone count per day
            fill: false,
            borderColor: documentStyle.getPropertyValue("--p-green-500"),
            tension: 0.4,
          },
        ],
      };

      this.trnxChartoptions = {
        maintainAspectRatio: false,
        aspectRatio: 1.2,
        plugins: {
          legend: {
            labels: {
              color: textColor,
            },
          },
        },
        scales: {
          x: {
            ticks: {
              color: textColorSecondary,
            },
            grid: {
              color: surfaceBorder,
              drawBorder: false,
            },
          },
          y: {
            ticks: {
              color: textColorSecondary,
            },
            grid: {
              color: surfaceBorder,
              drawBorder: false,
            },
          },
        },
      };

      this.cd.markForCheck();
    }
  }
  //#endregion

  //#region "Product Chart"
  productData: ProductChart[] = [];
  prodChartdata: any;
  prodChartoptions: any;

  initProductChart() {
    if (isPlatformBrowser(this.platformId)) {
      const documentStyle = getComputedStyle(document.documentElement);
      const textColor = documentStyle.getPropertyValue("--text-color");

      // Calculate total transactions across all products
      const totalTransactionsAll = this.productData.reduce(
        (sum, product) => sum + product.totalTransactions,
        0
      );

      // Extract product names and their transaction percentages
      const labels = this.productData.map((product) => product.productName);
      const data = this.productData.map((product) =>
        totalTransactionsAll > 0
          ? ((product.totalTransactions / totalTransactionsAll) * 100).toFixed(
              2
            ) // Convert to percentage
          : 0
      );

      this.prodChartdata = {
        labels: labels, // Product names as labels
        datasets: [
          {
            data: data, // Percentage values
            backgroundColor: [
              documentStyle.getPropertyValue("--p-cyan-500"),
              documentStyle.getPropertyValue("--p-orange-500"),
              documentStyle.getPropertyValue("--p-gray-500"),
              documentStyle.getPropertyValue("--p-green-500"),
            ],
            hoverBackgroundColor: [
              documentStyle.getPropertyValue("--p-cyan-400"),
              documentStyle.getPropertyValue("--p-orange-400"),
              documentStyle.getPropertyValue("--p-gray-400"),
              documentStyle.getPropertyValue("--p-green-400"),
            ],
          },
        ],
      };

      this.prodChartoptions = {
        plugins: {
          legend: {
            display: false, // Hide legend at the top
          },
          // tooltip: {
          //   callbacks: {
          //     label: (tooltipItem: any) => {
          //       return `${tooltipItem.label}: ${tooltipItem.raw}%`;
          //     },
          //   },
          // },
          datalabels: {
            color: textColor,
            formatter: (value: any) => `${value}%`,
          },
        },
        responsive: true,
        maintainAspectRatio: false, // Allows resizing
        aspectRatio: 1.2, // Controls chart dimensions
      };

      this.cd.markForCheck();
    }
  }
  //#endregion

  //#region "Description Chart"
  descriptionData: DescriptionChart[] = [];
  descChartdata: any;
  descChartoptions: any;

  initDescriptionChart() {
    if (isPlatformBrowser(this.platformId)) {
      const documentStyle = getComputedStyle(document.documentElement);
      const textColor = documentStyle.getPropertyValue("--text-color");

      // Calculate total transactions across all products
      const totalTransactionsAll = this.descriptionData.reduce(
        (sum, desc) => sum + desc.totalTransactions,
        0
      );

      // Extract product names and their transaction percentages
      const labels = this.descriptionData.map((desc) => desc.descriptionName);
      const data = this.descriptionData.map((desc) =>
        totalTransactionsAll > 0
          ? ((desc.totalTransactions / totalTransactionsAll) * 100).toFixed(2) // Convert to percentage
          : 0
      );

      this.descChartdata = {
        labels: labels, // Product names as labels
        datasets: [
          {
            data: data, // Percentage values
            backgroundColor: [
              documentStyle.getPropertyValue("--p-cyan-500"),
              documentStyle.getPropertyValue("--p-orange-500"),
              documentStyle.getPropertyValue("--p-gray-500"),
              documentStyle.getPropertyValue("--p-green-500"),
            ],
            hoverBackgroundColor: [
              documentStyle.getPropertyValue("--p-cyan-400"),
              documentStyle.getPropertyValue("--p-orange-400"),
              documentStyle.getPropertyValue("--p-gray-400"),
              documentStyle.getPropertyValue("--p-green-400"),
            ],
          },
        ],
      };

      this.descChartoptions = {
        plugins: {
          legend: {
            display: false, // Hide legend at the top
          },
          // tooltip: {
          //   callbacks: {
          //     label: (tooltipItem: any) => {
          //       return `${tooltipItem.label}: ${tooltipItem.raw}%`;
          //     },
          //   },
          // },
          datalabels: {
            color: textColor,
            formatter: (value: any) => `${value}%`,
          },
        },
        responsive: true,
        maintainAspectRatio: false, // Allows resizing
        aspectRatio: 1.2, // Controls chart dimensions
      };

      this.cd.markForCheck();
    }
  }

  //#endregion

  //#region "User Chart"
  userData: UserChart[] = [];
  userChartdata: any;
  userChartoptions: any;

  initUserChart() {
    if (isPlatformBrowser(this.platformId)) {
      const documentStyle = getComputedStyle(document.documentElement);
      const textColor = documentStyle.getPropertyValue("--p-text-color");
      const textColorSecondary = documentStyle.getPropertyValue(
        "--p-text-muted-color"
      );
      const surfaceBorder = documentStyle.getPropertyValue(
        "--p-content-border-color"
      );

      // Extract user names (Y-Axis)
      const labels = this.userData.map((user) => user.user);

      // Extract email and phone counts (X-Axis values)
      const emailData = this.userData.map((user) => user.emailCount);
      const phoneData = this.userData.map((user) => user.phoneCount);

      this.userChartdata = {
        labels: labels, // Y-Axis: User Names
        datasets: [
          {
            label: "Email Transactions",
            backgroundColor: documentStyle.getPropertyValue("--p-cyan-500"),
            borderColor: documentStyle.getPropertyValue("--p-cyan-500"),
            data: emailData, // X-Axis: Email Counts
          },
          {
            label: "Phone Transactions",
            backgroundColor: documentStyle.getPropertyValue("--p-orange-500"),
            borderColor: documentStyle.getPropertyValue("--p-orange-500"),
            data: phoneData, // X-Axis: Phone Counts
          },
        ],
      };

      this.userChartoptions = {
        indexAxis: "y", // Horizontal Bar Chart
        maintainAspectRatio: false,
        aspectRatio: 1.2,
        plugins: {
          legend: {
            labels: {
              color: textColor,
            },
          },
        },
        scales: {
          x: {
            ticks: {
              color: textColorSecondary,
              font: {
                weight: 500,
              },
            },
            grid: {
              color: surfaceBorder,
              drawBorder: false,
            },
          },
          y: {
            ticks: {
              color: textColorSecondary,
            },
            grid: {
              color: surfaceBorder,
              drawBorder: false,
            },
          },
        },
      };

      this.cd.markForCheck();
    }
  }

  //#endregion

  exportData(
    dataType: string[] = ["transaction", "product", "description", "user"]
  ) {
    const exportData: { sheetName: string; data: any[] }[] = [];

    if (dataType.includes("transaction") && this.transactionData?.length) {
      exportData.push({
        sheetName: "Transactions",
        data: this.formatData(this.transactionData),
      });
    }
    if (dataType.includes("product") && this.productData?.length) {
      exportData.push({
        sheetName: "Products",
        data: this.formatData(this.productData),
      });
    }
    if (dataType.includes("description") && this.descriptionData?.length) {
      exportData.push({
        sheetName: "Descriptions",
        data: this.formatData(this.descriptionData),
      });
    }
    if (dataType.includes("user") && this.userData?.length) {
      exportData.push({
        sheetName: "Users",
        data: this.formatData(this.userData),
      });
    }

    if (exportData.length === 0) {
      console.warn("No data available to export.");
      return;
    }

    // Determine filename based on selected data types
    const fileName =
      exportData.length === 4
        ? "AllData.xlsx"
        : exportData.map(({ sheetName }) => sheetName).join("_") + ".xlsx";

    const workbook = XLSX.utils.book_new();
    exportData.forEach(({ sheetName, data }) => {
      const worksheet = XLSX.utils.json_to_sheet(data);
      XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
    });

    XLSX.writeFile(workbook, fileName);
  }

  // Processes data by:
  // 1. Removing `totalEmailCount` and `totalPhoneCount` columns.
  // 2. Summing up `emailCount`, `phoneCount`, and `totalTransactions` at the bottom.
  private formatData(data: any[]): any[] {
    let totalEmailCount = 0;
    let totalPhoneCount = 0;
    let totalTransactions = 0;

    // Remove `totalEmailCount` and `totalPhoneCount`, sum the other fields
    const filteredData = data.map(
      ({ totalEmailCount: _, totalPhoneCount: __, ...row }) => {
        totalEmailCount += row.emailCount || 0;
        totalPhoneCount += row.phoneCount || 0;
        totalTransactions += row.totalTransactions || 0;
        return row;
      }
    );

    // Get correct column names
    const keys = Object.keys(filteredData[0] || {});
    const firstColumn = keys[0];
    const secondColumn = keys[1];
    const thirdColumn = keys[2];
    const fourthColumn = keys[3];

    // Append total row at the bottom
    const totalRow: any = {};
    totalRow[firstColumn] = "Total"; // First column shows "Total"
    totalRow[secondColumn] = totalEmailCount; // Sum of emailCount
    totalRow[thirdColumn] = totalPhoneCount; // Sum of phoneCount
    totalRow[fourthColumn] = totalTransactions; // Sum of totalTransactions

    filteredData.push(totalRow);

    return filteredData;
  }
}

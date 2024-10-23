import { formatDate } from '@angular/common';

export class DateUtil {
  static formatDate(date: Date | string): string {
    return formatDate(date, 'yyyy-MM-dd', 'en-US');
  }

  static getYesterday(date: Date | string): Date {
    const today = new Date(date);

    return new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1);
  }

  static getTomorrow(date: Date | string): Date {
    const today = new Date(date);

    return new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
  }

  static isDatePassed(date: Date, targetDate: Date): boolean {
    date = new Date(date);
    date.setHours(0, 0, 0, 0);

    targetDate = new Date(targetDate);
    targetDate.setHours(0, 0, 0, 0);

    return date > targetDate;
  }
}

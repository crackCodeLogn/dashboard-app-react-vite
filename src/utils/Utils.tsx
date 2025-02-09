import currency from "currency.js";

export class Utils {
  static yValueFormat(value: number): string {
    return value.toFixed(2);
  }

  /* input in yyyyMMdd number format, output in 'yyyy-MM-dd' string format */
  static getDateInString(date: number): string {
    const dateStr = date.toString();
    const year = dateStr.substring(0, 4);
    const month = dateStr.substring(4, 6);
    const day = dateStr.substring(6, 8);
    return `${year}-${month}-${day}`;
  }

  static formatDollar(value: number | undefined): string {
    if (!value) value = 0.0;
    return currency(value).format();
  }
}
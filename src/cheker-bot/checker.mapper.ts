import { Report, ReportItem, Status } from './cupis.repository';
import prettyNum from 'pretty-num';

class CheckerMapper {
  mapStatus(status: Status): string {
    switch (status) {
      case Status.basic: {
        return 'Базовый';
      }
      case Status.full: {
        return 'Индентифицированный';
      }
      case Status.unverified: {
        return 'Не идентифицированный';
      }
    }
  }

  makeWinLossPivot(items: ReportItem[]): string {
    let reportMessage = '';

    const losses: string[] = [];
    const wins: string[] = [];
    for (const item of items) {
      if (item.total < 0) {
        losses.push(
          `├ ${item.bkName}: ${prettyNum(item.total, { thousandsSeparator: ' ' })}`,
        );
      } else {
        wins.push(
          `├ ${item.bkName}: ${prettyNum(item.total, { thousandsSeparator: ' ' })}`,
        );
      }
    }

    if (losses.length) {
      reportMessage += '\n\n➖ Проигрыш:';
      for (const loss of losses) {
        reportMessage += `\n${loss}`;
      }
    }

    if (wins.length) {
      reportMessage += '\n\n➕ Выигрыш:';
      for (const win of wins) {
        reportMessage += `\n${win}`;
      }
    }

    return reportMessage;
  }

  getReportMessage(report: Report): string {
    if (!report.itemsAllTime.length) {
      return 'Не найдено операций';
    }

    let reportMessage = 'Расчет (За все время):';
    reportMessage += this.makeWinLossPivot(report.itemsAllTime);
    if (report.itemsLastThreeMonths.length) {
      reportMessage += '\n\nРасчет (За последние три месяца):';
      reportMessage += this.makeWinLossPivot(report.itemsLastThreeMonths);
    }
    reportMessage += `\n\nОбработано ${report.recordsCount} записей`;
    reportMessage += `\nСтатус кошелька 1cupis - ${this.mapStatus(report.accountStatus)}`;

    return reportMessage;
  }
}

export const checkerMapper = new CheckerMapper();

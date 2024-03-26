import { Report, Status } from './cupis.repository';
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

  getReportMessage(report: Report): string {
    if (!report.itemsAllTime.length) {
      return 'Не найдено операций';
    }

    let reportMessage = `Выполнено с помощью телеграм-бота @CupisCountBot\n${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}\n`;

    for (const item of report.itemsAllTime) {
      if (item.bkName === 'Кошелек ЦУПИС') {
        continue;
      }

      reportMessage += '...............................\n'
      reportMessage += `${item.bkName}\n`
      reportMessage += `Пополнения: ${prettyNum(-item.deposits, { thousandsSeparator: ' ' })}\n`
      reportMessage += `Выводы: ${prettyNum(item.withdraws, { thousandsSeparator: ' ' })}\n`
      reportMessage += `${item.total < 0 ? `Проигрыш: ${prettyNum(-item.total, { thousandsSeparator: ' ' })}\n` : `Выигрыш: ${prettyNum(-item.total, { thousandsSeparator: ' ' })}\n`}`

      const lastThreeMonths = report.itemsLastThreeMonths.find((i) => i.bkName === item.bkName);
      if (lastThreeMonths) {
        reportMessage += `    Активность за последние 3 мес.:\n`
        reportMessage += `    Пополнения: ${prettyNum(-lastThreeMonths.deposits, { thousandsSeparator: ' ' })}\n`
        reportMessage += `    Выводы: ${prettyNum(lastThreeMonths.withdraws, { thousandsSeparator: ' ' })}\n`
        reportMessage += `    ${lastThreeMonths.total < 0 ? `Проигрыш: ${prettyNum(-lastThreeMonths.total, { thousandsSeparator: ' ' })}\n` : `Выигрыш: ${prettyNum(lastThreeMonths.total, { thousandsSeparator: ' ' })}\n`}`
      }
    }

    return reportMessage;
  }
}

export const checkerMapper = new CheckerMapper();

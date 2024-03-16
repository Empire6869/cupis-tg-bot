import { Injectable } from '@nestjs/common';

export enum Status {
  full = 'full',
  basic = 'basic',
  unverified = 'unverified',
}

export enum BkName {
  pari = 'pari',
  winline = 'winline',
  betboom = 'betboom',
}

export interface Report {
  recordsCount: number;
  itemsAllTime: ReportItem[];
  itemsLastThreeMonths: ReportItem[];
  accountStatus: Status;
}

export interface ReportItem {
  bkName: BkName;
  total: number;
}

@Injectable()
export class CupisRepository {
  async getReport(username: string, password: string): Promise<Report> {
    username;
    password;

    return {
      recordsCount: 2000,
      accountStatus: Status.full,
      itemsAllTime: [
        {
          bkName: BkName.betboom,
          total: 100_000,
        },
        {
          bkName: BkName.pari,
          total: -300_000,
        },
        {
          bkName: BkName.winline,
          total: 823_234,
        },
      ],
      itemsLastThreeMonths: [
        {
          bkName: BkName.betboom,
          total: 10_000,
        },
        {
          bkName: BkName.pari,
          total: -100_000,
        },
        {
          bkName: BkName.winline,
          total: 223_234,
        },
      ],
    };
  }
}

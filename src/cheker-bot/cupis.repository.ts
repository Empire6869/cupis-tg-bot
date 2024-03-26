import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export enum Status {
  full = 'full',
  basic = 'basic',
  unverified = 'unverified',
}

export interface Report {
  recordsCount: number;
  itemsAllTime: ReportItem[];
  itemsLastThreeMonths: ReportItem[];
  accountStatus: Status;
}

export interface ReportItem {
  bkName: string;
  total: number;
  deposits: number;
  withdraws: number;
}

@Injectable()
export class CupisRepository {
  constructor(private readonly httpService: HttpService, private configService: ConfigService) {}
  
  async getReport(username: string, password: string): Promise<Report> {
    const response = await this.httpService.axiosRef.post<Report>(`http://${this.configService.get('CUPIS_COUNTER_HOST')}:${this.configService.get('CUPIS_COUNTER_PORT')}/calculate-report`, {
      username,
      password
    });

    return response.data
  }
}

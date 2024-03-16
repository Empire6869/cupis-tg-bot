import { Module } from '@nestjs/common';
import { CheckerBotModule } from './cheker-bot/checker-bot.module';

@Module({
  imports: [CheckerBotModule],
})
export class AppModule {}

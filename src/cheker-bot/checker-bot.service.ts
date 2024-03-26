import { Update, Ctx, Start, Hears } from 'nestjs-telegraf';
import { Context, Scenes } from 'telegraf';
import {
  CHECK_SCENE_NAME,
  checkerKeyboardMessage,
  helpKeyboardMessage,
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

  @Hears(helpKeyboardMessage)
  async help(@Ctx() ctx: Context) {
    await ctx.sendMessage(helpMessage);
  }

  @Hears(checkerKeyboardMessage)
  async check(@Ctx() ctx: Scenes.SceneContext) {
    await ctx.scene.enter(CHECK_SCENE_NAME);
  }
}

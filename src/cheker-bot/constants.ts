import { Markup } from 'telegraf';

export const CHECK_SCENE_NAME = 'check_scene';
export const CHECK_CB = 'check';
export const HELP_CB = 'help';
export const MENU_CB = 'menu';
export const menuMessage = '⚙️ Выберите пункт меню';
export const menuKeyboard = Markup.inlineKeyboard(
  [
    Markup.button.callback('Воспользоваться чекером', CHECK_CB),
    Markup.button.callback('Помощь', HELP_CB),
  ],
  {
    columns: 1,
  },
);
export const helpMessage = 'Здесь будет поддержка';
export const helpKeyboard = Markup.inlineKeyboard(
  [Markup.button.callback('Вернуться в меню', MENU_CB)],
  {
    columns: 1,
  },
);
export const checkMessage =
  'Введите логин и пароль. логин:пароль (+79219552327:qwerty123)';

import { Markup } from 'telegraf';

export const CHECK_SCENE_NAME = 'check_scene';
export const CHECK_CB = 'check';
export const HELP_CB = 'help';
export const MENU_CB = 'menu';
export const menuMessage = `👋 Добро пожаловать в бота для подсчета оборота в букмейкерсих конторах.\n\n⚙️ Выберите пункт меню`;
export const checkerKeyboardMessage = '💵 Воспользоваться чекером';
export const helpKeyboardMessage = '🔱 Помощь';
export const menuKeyboard = Markup.keyboard(
  [
    Markup.button.callback(checkerKeyboardMessage, CHECK_CB),
    Markup.button.callback(helpKeyboardMessage, HELP_CB),
  ],
  {
    columns: 2,
  },
).resize();
export const helpMessage = '⚠️ При возникновении проблем с ботом обращайтесь к @unknown';
export const helpKeyboard = Markup.inlineKeyboard(
  [Markup.button.callback('Вернуться в меню', MENU_CB)],
  {
    columns: 1,
  },
);
export const checkMessage =
  'Введите логин и пароль. \n\n‼️ Важно:\n\n  1. Формат ввода: номер телефона:пароль.\n        Пример: +79219552327:qwerty123\n  2. Номер телефона начинается с +7 или 8\n  3. Пароль не короче 8 символов';

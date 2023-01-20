import { StartCommandArgs } from "../types/commands.types"
import { Telegram } from "telegraf"
import { logs } from "../utils/logs"

class StartCommand {
  private getStartMessage(startCommandArgs: StartCommandArgs): string {
    const userFirstName = startCommandArgs.from.first_name

    return `Привет ${userFirstName}!\nЯ умею отправлять афишу кино и театров города Кемерово\n` +
    `У меня существует единственная команда - <b>"/get дата"</b>, где <b>"дата"</b> это дата в формате дд.мм.гггг\n` +
    `Пример использования: <b>/get 06.02.2023</b>`
  }

  public handle(startCommandArgs: StartCommandArgs, methods: Telegram): void {
    const startMessage = this.getStartMessage(startCommandArgs)
    const chatId = startCommandArgs.chat.id

    methods.sendMessage(chatId, startMessage, {"parse_mode": "HTML"})
    logs.write(`${startCommandArgs.from.first_name} just started in ${chatId} chat!`)
  }
}

export const startCommand = new StartCommand()
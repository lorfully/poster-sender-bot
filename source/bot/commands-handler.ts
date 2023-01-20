import { Telegram } from "telegraf"
import { BotCommand } from "telegraf/typings/core/types/typegram"
import { GetCommandArgs, StartCommandArgs } from "../types/commands.types"
import { getCommand } from "./get-command"
import { startCommand } from "./start-command"

class CommandsHandler {
  public handleStartCommand(startCommandArgs: StartCommandArgs, methods: Telegram): void {
    startCommand.handle(startCommandArgs, methods)
  }

  public handleGetCommand(getCommandArgs: GetCommandArgs, methods: Telegram): void {
    getCommand.handle(getCommandArgs, methods)
  }

  public getBotCommands(): BotCommand[] {
    return [
      { "command": "start", "description": "Запускает бота." },
      { "command": "get", "description": "Присылает афишу по дате." }
    ]
  }
}

export const commandsHandler = new CommandsHandler()
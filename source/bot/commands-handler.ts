import { Telegram } from "telegraf"
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
}

export const commandsHandler = new CommandsHandler()
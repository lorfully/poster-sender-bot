import { Telegraf, Telegram } from "telegraf"
import { GetCommandArgs, StartCommandArgs } from "../types/commands.types"
import { logs } from "../utils/logs"
import { commandsHandler } from "./commands-handler"

export class TelegramBot {
  public me: Telegraf
  public methods: Telegram

  constructor(token: string) {
    this.me = new Telegraf(token)
    this.methods = this.me.telegram
  }

  private listenStartCommand(): void {
    this.me.command("start", async context => {
      const startCommandArgs: StartCommandArgs = context
      
      commandsHandler.handleStartCommand(startCommandArgs, this.methods)
    })
  }

  private listenGetCommand(): void {
    this.me.command("get", async context => {
      const getCommandArgs: GetCommandArgs = context
      
      commandsHandler.handleGetCommand(getCommandArgs, this.methods)
    })
  }

  public launch(): void {
    this.listenStartCommand()
    this.listenGetCommand()

    this.me.launch().catch((exception) => logs.write("Some error occured:\n" + exception))
    logs.write("Posters sender bot has started!")
  }
}
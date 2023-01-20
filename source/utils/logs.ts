import { fileSystem } from "./filesystem"

class Logs {
  public readonly logsPath = "./data/logs"

  constructor() {
    fileSystem.createPath(this.logsPath)
  }

  private getCurrentLogsPath(): string {
    const currentDate = new Date().toDateString() 
    return this.logsPath + "/" + currentDate + ".txt"
  }

  private convertMsgToLog(logMsg: string): string {
    const currentTimeString = new Date().toLocaleTimeString()
    return `[${currentTimeString}] ${logMsg}`
  }

  public write(logMsg: string, silence?: boolean): void {
    const path = this.getCurrentLogsPath()
    const log = this.convertMsgToLog(logMsg)

    fileSystem.appendToFile(path, log + "\n")
    if (!silence) console.log(log)
  }
}

export const logs = new Logs()
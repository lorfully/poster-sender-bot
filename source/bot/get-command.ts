import { GetCommandArgs, GetDate } from "../types/commands.types"
import { Telegram } from "telegraf"
import { dateHelper } from "../utils/date-helper"
import { kosmosParser } from "../parser/kosmos-parser"
import { PosterInfo } from "../types/posters.types"
import { MediaGroup } from "telegraf/typings/telegram-types"
import { InputMediaPhoto } from "typegram"
import { logs } from "../utils/logs"

class GetCommand {
  private async getKosmosPostersInfo(date: GetDate): Promise<PosterInfo[]> {
    const kosmosPostersInfo = await kosmosParser.getPostersInfo(date)
    return kosmosPostersInfo
  }

  private getCommandText(kosmosPostersInfo: PosterInfo[], date: GetDate): string {
    let result = "Мне ничего не удалось найти!\nПроверьте правильность запроса."

    if (kosmosPostersInfo.length > 0) {
      result = `Вот что мне удалось найти на *${date.day}.${date.month}.${date.year}* в кинотеатре "Космос":\n`

      kosmosPostersInfo.forEach(posterInfo => {
        result += posterInfo.posterText
      })
    }

    return result
  }

  private getMediaGroupFromPostersInfo(kosmosPostersInfo: PosterInfo[], date: GetDate): MediaGroup {
    let tempMediaGroup = []
    const firstCaption = this.getCommandText(kosmosPostersInfo, date)

    for (let i = 0; i < kosmosPostersInfo.length; i++) {
      const kosmosPosterInfo = kosmosPostersInfo[i]
      const kosmosPosterData = kosmosPosterInfo.posterData
      
      let photo: InputMediaPhoto = {"type": "photo", "media": kosmosPosterData.imageUrl}

      if (i === 0) {
        photo.caption = firstCaption
        photo.parse_mode = "Markdown"
      }

      tempMediaGroup.push(photo) 
    }

    return tempMediaGroup
  }

  public async handle(getCommandArgs: GetCommandArgs, methods: Telegram): Promise<void> {
    const commandText = getCommandArgs.message.text
    const date = dateHelper.getDateFromText(commandText)

    const kosmosPostersInfo = await this.getKosmosPostersInfo(date)

    const getMessage = this.getCommandText(kosmosPostersInfo, date)
    const getMediaGroup = this.getMediaGroupFromPostersInfo(kosmosPostersInfo, date)
    const chatId = getCommandArgs.chat.id

    if (kosmosPostersInfo.length > 0) {
      methods.sendMediaGroup(chatId, getMediaGroup)
    } else {
      methods.sendMessage(chatId, getMessage, {"parse_mode": "Markdown"})
    }

    logs.write(`Sending posters by ${date.day}.${date.month}.${date.year} in ${chatId} chat.`)
  }
}

export const getCommand = new GetCommand()
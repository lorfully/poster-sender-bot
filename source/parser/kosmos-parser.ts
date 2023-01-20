import { PosterInfo, PosterData } from "../types/posters.types"
import { Parser } from "./parser"
import { load } from "cheerio"
import { GetDate } from "../types/commands.types"

class KosmosParser {
  private async getPostersData(date: GetDate): Promise<PosterData[]> {
    let PosterData: PosterData[] = []

    if (date.day.length === 1) date.day = "0" + date.day
    if (date.month.length === 1) date.month = "0" + date.month
    if (date.year.length === 2) date.year = "20" + date.year

    const kosmosUrl = "kosmoskino42.ru"
    const kosmosParser = new Parser(`${kosmosUrl}/?date=${date.year}/${date.month}/${date.day}`)
    const posters = await kosmosParser.getElementsByClassName("event")
    
    posters.each((index, rawPoster) => {
      const poster = load(rawPoster)
      const posterHtml = poster.html()

      const rawPosterTimes = kosmosParser.getChildsTextByClassName("show-time", posterHtml)
      const filteredPosterTimes = rawPosterTimes.filter((value, index) => {
        return rawPosterTimes.indexOf(value) == index;
      })

      const rawPosterCosts = kosmosParser.getChildsTextByClassName("price", posterHtml)
      const onlyPosterCosts = rawPosterCosts.join(";").replace(/[^\d;]/g, "").split(";")
      const filteredPosterCosts = onlyPosterCosts.filter((value, index) => {
        return onlyPosterCosts.indexOf(value) == index;
      })

      const posterTitle = kosmosParser.getChildsTextByClassName("event-name", posterHtml)[0]
      const posterUrl = kosmosUrl + kosmosParser.getElementAttr(posterHtml, "event-name", "href")
      const posterTimes = filteredPosterTimes.join(" | ")
      const posterCosts = filteredPosterCosts.join(" | ") + " рублей"
      const posterHallName = kosmosParser.getChildsTextByClassName("hall-name", posterHtml)[0]
      const posterImageUrl = kosmosParser.getElementAttr(posterHtml, "lazy-img", "src")
        .replace(":blur(2)", "").replace("22x32", "540x800")

      const posterData: PosterData = {
        title: posterTitle,
        url: posterUrl,
        time: posterTimes,
        cost: posterCosts,
        hallName: posterHallName,
        imageUrl: posterImageUrl
      }

      PosterData.push(posterData)
    })

    return PosterData
  }

  private getPosterText(posterData: PosterData): string {
    const {title, url, time, cost, hallName} = posterData

    return `\n*Название*: [${title}](${url})\n` +
    `*Время сеансов*: ${time}\n` + `*Стоимость сеансов*: ${cost}\n` +
    `*Название зала*: ${hallName}\n`
  }

  public async getPostersInfo(date: GetDate): Promise<PosterInfo[]> {
    const result: PosterInfo[] = []
    const postersData = await this.getPostersData(date)

    for (let i = 0; i < postersData.length; i++) {
      const posterData = postersData[i]
      const posterText = this.getPosterText(posterData)
      result.push({ posterText, posterData })
    }
    
    return result
  }
}

export const kosmosParser = new KosmosParser()
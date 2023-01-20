import axios, { AxiosResponse } from "axios"
import { load } from "cheerio"
import { logs } from "../utils/logs"

const rawCheerIo = load("")("")
type CheerIo = typeof rawCheerIo

export class Parser {
  public url: string
  public response: AxiosResponse<any, any> | undefined

  constructor(url: string) {
    this.url = this.addHttpProtocolToUrl(url)
  }

  public getElementAttr(elementHtml: string, className: string, attr: string): string {
    if (className[0] !== ".") className = "." + className
    
    const $ = load(elementHtml)
    const elementSrc = $(elementHtml).find(className).attr(attr)

    return elementSrc || ""
  }

  public getChildsByClassName(className: string, parentHmtl: string): CheerIo {
    if (className[0] !== ".") className = "." + className
    
    const $ = load(parentHmtl)
    
    return $(className)
  }

  public getChildsTextByClassName(className: string, parentHtml: string): string[] {
    let elementsText: string[] = []

    const classElements = this.getChildsByClassName(className, parentHtml)
    classElements.each((index, element) => {
      elementsText.push(load(element).text())
    })

    return elementsText
  }

  public async getHtmlString(): Promise<string> {
    try {
      if (!this.response) this.response = await axios(this.url)
      return this.response ? this.response.data : ""
    } catch(error) {
      logs.write("Error while parsing:\n" + error)
    }
    
    return ""
  }

  public async getElementsByClassName(className: string): Promise<CheerIo> {
    if (className[0] !== ".") className = "." + className
    
    const htmlString = await this.getHtmlString()
    const $ = load(htmlString)
    
    return $(className)
  }

  public async getElementsTextByClassName(className: string): Promise<string[]> {
    let elementsText: string[] = []

    const classElements = await this.getElementsByClassName(className)
    classElements.each((index, element) => {
      elementsText.push(load(element).text())
    })

    return elementsText
  }

  private addHttpProtocolToUrl(url: string): string {
    if (!["http://", "https://"].includes(url)) url = "https://" + url
    return url
  }
}
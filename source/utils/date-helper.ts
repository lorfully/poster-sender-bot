import { GetDate } from "../types/commands.types"

class DateHelper {
  public getDateFromText(text: string): GetDate {
    let result: GetDate = {day: "", month: "", year: ""}

    const dateRegEx = /^(0?[1-9]|[12][0-9]|3[01])[\.](0?[1-9]|1[012])[\.]\d{4}$/
    const dateString = text.split(" ").filter(v => v.match(dateRegEx))[0]

    if (typeof dateString === "string") {
      const [day, month, year] = dateString.split(".")
      result = {day, month, year}
    }

    return result
  }
}

export const dateHelper = new DateHelper()
import { TelegramBot } from "./bot/bot"

function main() {
  const telegramBot = new TelegramBot("5859072065:AAEf56tnCDkRDoaAEdgRggz4n1dAuIScNXY")
  
  telegramBot.launch()
}

main()
export interface StartCommandArgs {
  from: { first_name: string },
  chat: { id: number }
}

export interface GetCommandArgs {
  chat: { id: number },
  message: { text: string }
}

export interface GetDate {
  day: string,
  month: string,
  year: string
}
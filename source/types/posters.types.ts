export interface PosterData {
  title: string,
  url: string,
  imageUrl: string
  time?: string, // get all time and do time range: 12:00-22:00
  cost?: string // get all costs and do cost range: 250-700
  hallName?: string,
}

export interface PosterInfo {
  posterText: string,
  posterData: PosterData
}
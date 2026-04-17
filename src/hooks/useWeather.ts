import { useState, useEffect } from 'react'
import { weatherFromCode } from '../utils/weatherEmoji'
import type { WeatherInfo } from '../utils/weatherEmoji'

export interface DayWeather extends WeatherInfo {
  tempMin: number
  tempMax: number
}

// São Miguel coordinates
const LAT = 37.746
const LNG = -25.593

function toF(c: number): number {
  return Math.round(c * 9 / 5 + 32)
}

export function useWeather(): DayWeather[] {
  const [weather, setWeather] = useState<DayWeather[]>([])

  useEffect(() => {
    const url =
      `https://api.open-meteo.com/v1/forecast` +
      `?latitude=${LAT}&longitude=${LNG}` +
      `&daily=weathercode,temperature_2m_max,temperature_2m_min` +
      `&timezone=Atlantic%2FAzores` +
      `&forecast_days=8`

    fetch(url)
      .then(r => r.json())
      .then(data => {
        const codes: number[] = data.daily.weathercode
        const maxTemps: number[] = data.daily.temperature_2m_max
        const minTemps: number[] = data.daily.temperature_2m_min
        setWeather(codes.map((code, i) => ({
          ...weatherFromCode(code),
          tempMin: toF(Math.round(minTemps[i])),
          tempMax: toF(Math.round(maxTemps[i])),
        })))
      })
      .catch(err => console.warn('Weather fetch failed:', err))
  }, [])

  return weather
}

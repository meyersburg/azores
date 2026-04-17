import { useState, useEffect } from 'react'
import { weatherFromCode } from '../utils/weatherEmoji'
import type { WeatherInfo } from '../utils/weatherEmoji'

export interface DayWeather extends WeatherInfo {
  tempMax: number
}

// São Miguel coordinates
const LAT = 37.746
const LNG = -25.593

export function useWeather(): DayWeather[] {
  const [weather, setWeather] = useState<DayWeather[]>([])

  useEffect(() => {
    const url =
      `https://api.open-meteo.com/v1/forecast` +
      `?latitude=${LAT}&longitude=${LNG}` +
      `&daily=weathercode,temperature_2m_max` +
      `&timezone=Atlantic%2FAzores` +
      `&forecast_days=8`

    fetch(url)
      .then(r => r.json())
      .then(data => {
        const codes: number[] = data.daily.weathercode
        const temps: number[] = data.daily.temperature_2m_max
        setWeather(codes.map((code, i) => ({
          ...weatherFromCode(code),
          tempMax: Math.round(temps[i]),
        })))
      })
      .catch(err => console.warn('Weather fetch failed:', err))
  }, [])

  return weather
}

// WMO Weather Code → emoji + label
// https://open-meteo.com/en/docs#weathervariables

export interface WeatherInfo {
  emoji: string
  label: string
}

export function weatherFromCode(code: number): WeatherInfo {
  if (code === 0)              return { emoji: '☀️',  label: 'Clear' }
  if (code === 1)              return { emoji: '🌤️',  label: 'Mostly clear' }
  if (code === 2)              return { emoji: '⛅',  label: 'Partly cloudy' }
  if (code === 3)              return { emoji: '☁️',  label: 'Overcast' }
  if (code <= 48)              return { emoji: '🌫️',  label: 'Foggy' }
  if (code <= 55)              return { emoji: '🌦️',  label: 'Drizzle' }
  if (code <= 67)              return { emoji: '🌧️',  label: 'Rain' }
  if (code <= 77)              return { emoji: '❄️',  label: 'Snow' }
  if (code <= 82)              return { emoji: '🌨️',  label: 'Showers' }
  if (code <= 99)              return { emoji: '⛈️',  label: 'Thunderstorm' }
  return { emoji: '🌡️', label: 'Unknown' }
}

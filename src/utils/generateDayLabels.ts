import type { Itinerary } from '../hooks/useItinerary'
import { DAY_NAMES } from '../hooks/useItinerary'
import type { Poi } from '../types'

export async function generateDayLabels(
  itinerary: Itinerary,
  pois: Poi[],
  apiKey: string
): Promise<Record<number, string>> {
  const poiMap = Object.fromEntries(pois.map(p => [p.id, p]))

  const dayLines: string[] = []
  itinerary.forEach((dayPoiIds, i) => {
    if (dayPoiIds.length === 0) return
    const names = dayPoiIds.map(id => poiMap[id]?.name ?? id).join(', ')
    dayLines.push(`Day ${i} (${DAY_NAMES[i]}): ${names}`)
  })

  if (dayLines.length === 0) return {}

  const prompt = `You are helping label days of a trip to São Miguel island in the Azores, Portugal.

For each day below, provide a very short label (1-3 words max) that captures the geographic area or theme. Focus on place names when possible (e.g. "Furnas", "Sete Cidades", "Ponta Delgada", "North Coast", "Tea Country"). Be concise and evocative.

${dayLines.join('\n')}

Reply with ONLY a valid JSON object mapping day index (as a string key) to label string.
Example: {"0": "Sete Cidades", "1": "Furnas", "2": "Ponta Delgada"}
No other text, no markdown, no explanation.`

  // Debug: list available models
  const modelsRes = await fetch('https://api.anthropic.com/v1/models', {
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
  })
  const modelsData = await modelsRes.json() as { data?: Array<{ id: string }> }
  const available = modelsData.data?.map(m => m.id) ?? []
  console.log('Available models:', available)
  if (available.length === 0) {
    throw new Error(`No models available. Models response: ${JSON.stringify(modelsData)}`)
  }
  // Pick the cheapest available model
  const preferred = ['claude-3-haiku-20240307', 'claude-3-5-haiku-20241022', 'claude-3-5-sonnet-20241022']
  const model = preferred.find(m => available.includes(m)) ?? available[available.length - 1]
  console.log('Using model:', model)

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model,
      max_tokens: 256,
      messages: [{ role: 'user', content: prompt }],
    }),
  })

  if (!response.ok) {
    const body = await response.text()
    throw new Error(`Anthropic API error: ${response.status} — ${body}`)
  }

  const data = await response.json() as {
    content: Array<{ type: string; text: string }>
  }
  const text = data.content?.[0]?.text?.trim() ?? '{}'

  const raw = JSON.parse(text) as Record<string, string>
  const result: Record<number, string> = {}
  for (const [k, v] of Object.entries(raw)) {
    result[parseInt(k)] = v
  }
  return result
}

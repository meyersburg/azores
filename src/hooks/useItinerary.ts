import { useState, useEffect } from 'react'
import { ref, onValue, set, remove } from 'firebase/database'
import { db } from '../firebase'

export const DAY_NAMES = ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
export const NUM_DAYS = 8

// itinerary[dayIndex] = array of poiIds
export type Itinerary = string[][]

export function useItinerary() {
  const [itinerary, setItinerary] = useState<Itinerary>(
    Array.from({ length: NUM_DAYS }, () => [])
  )

  useEffect(() => {
    const itinRef = ref(db, 'itinerary')
    const unsubscribe = onValue(itinRef, (snap) => {
      const data = snap.val() as Record<string, Record<string, string>> | null
      const result: Itinerary = Array.from({ length: NUM_DAYS }, () => [])
      if (data) {
        for (let d = 0; d < NUM_DAYS; d++) {
          const day = data[d]
          if (day) result[d] = Object.values(day)
        }
      }
      setItinerary(result)
    }, (err) => {
      console.warn('Itinerary Firebase error:', err.message)
    })
    return () => unsubscribe()
  }, [])

  const addToDay = async (dayIndex: number, poiId: string) => {
    const current = itinerary[dayIndex]
    if (current.includes(poiId)) return
    const next = [...current, poiId]
    await set(ref(db, `itinerary/${dayIndex}`),
      Object.fromEntries(next.map((id, i) => [i, id]))
    )
  }

  const removeFromDay = async (dayIndex: number, poiId: string) => {
    const next = itinerary[dayIndex].filter(id => id !== poiId)
    if (next.length === 0) {
      await remove(ref(db, `itinerary/${dayIndex}`))
    } else {
      await set(ref(db, `itinerary/${dayIndex}`),
        Object.fromEntries(next.map((id, i) => [i, id]))
      )
    }
  }

  // Which days (if any) does a POI appear in?
  const daysForPoi = (poiId: string): number[] =>
    itinerary.reduce<number[]>((acc, day, i) => {
      if (day.includes(poiId)) acc.push(i)
      return acc
    }, [])

  return { itinerary, addToDay, removeFromDay, daysForPoi }
}

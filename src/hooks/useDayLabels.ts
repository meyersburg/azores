import { useState, useEffect } from 'react'
import { ref, onValue, set } from 'firebase/database'
import { db } from '../firebase'

export type DayLabels = Record<number, string>

export function useDayLabels() {
  const [labels, setLabels] = useState<DayLabels>({})

  useEffect(() => {
    const labelsRef = ref(db, 'dayLabels')
    const unsubscribe = onValue(labelsRef, (snap) => {
      const data = snap.val() as Record<string, string> | null
      if (data) {
        const result: DayLabels = {}
        for (const [k, v] of Object.entries(data)) {
          result[parseInt(k)] = v
        }
        setLabels(result)
      } else {
        setLabels({})
      }
    }, (err) => {
      console.warn('DayLabels Firebase error:', err.message)
    })
    return () => unsubscribe()
  }, [])

  const saveLabels = async (newLabels: DayLabels) => {
    await set(ref(db, 'dayLabels'), newLabels)
  }

  return { labels, saveLabels }
}

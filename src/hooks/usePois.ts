import { useState, useEffect, useRef } from 'react'
import { ref, onValue, set, remove, get } from 'firebase/database'
import { db } from '../firebase'
import type { Poi } from '../types'

export function usePois() {
  const [pois, setPois] = useState<Poi[]>([])
  const [loading, setLoading] = useState(true)
  const seeded = useRef(false)

  useEffect(() => {
    const poisRef = ref(db, 'pois')

    const init = async () => {
      const snapshot = await get(poisRef)
      if (!snapshot.exists() && !seeded.current) {
        seeded.current = true
        try {
          const res = await fetch(`${import.meta.env.BASE_URL}pois.json`)
          const seed: Poi[] = await res.json()
          const updates: Record<string, Poi> = {}
          for (const poi of seed) updates[poi.id] = poi
          await set(poisRef, updates)
        } catch (e) {
          console.error('Failed to seed POIs', e)
        }
      }

      const unsubscribe = onValue(poisRef, (snap) => {
        const data = snap.val() as Record<string, Poi> | null
        setPois(data ? Object.values(data) : [])
        setLoading(false)
      })

      return unsubscribe
    }

    let cleanup: (() => void) | undefined
    init().then(unsub => { cleanup = unsub })
    return () => cleanup?.()
  }, [])

  const savePoi = (poi: Poi) => set(ref(db, `pois/${poi.id}`), poi)
  const deletePoi = (id: string) => remove(ref(db, `pois/${id}`))

  return { pois, loading, savePoi, deletePoi }
}

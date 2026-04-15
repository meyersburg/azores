import { useState, useEffect } from 'react'
import { ref, onValue, set, remove } from 'firebase/database'
import { db } from '../firebase'
import type { Poi } from '../types'

async function loadFromJson(): Promise<Poi[]> {
  const res = await fetch(`${import.meta.env.BASE_URL}pois.json`)
  return res.json()
}

export function usePois() {
  const [pois, setPois] = useState<Poi[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const poisRef = ref(db, 'pois')

    // onValue error callback handles permission_denied gracefully
    const unsubscribe = onValue(
      poisRef,
      async (snap) => {
        const data = snap.val() as Record<string, Poi> | null
        if (data) {
          setPois(Object.values(data))
          setLoading(false)
        } else {
          // Firebase empty — try seeding from pois.json
          try {
            const seed = await loadFromJson()
            const updates: Record<string, Poi> = {}
            for (const poi of seed) updates[poi.id] = poi
            await set(poisRef, updates)
            // onValue will fire again with the seeded data
          } catch {
            const fallback = await loadFromJson()
            setPois(fallback)
            setLoading(false)
          }
        }
      },
      (error) => {
        // Firebase rules not yet updated — fall back to static JSON
        console.warn('Firebase read error, falling back to pois.json:', error.message)
        loadFromJson()
          .then(setPois)
          .catch(() => setPois([]))
          .finally(() => setLoading(false))
      }
    )

    return () => unsubscribe()
  }, [])

  const savePoi = async (poi: Poi) => {
    try {
      await set(ref(db, `pois/${poi.id}`), poi)
    } catch (e) {
      alert('Could not save — check Firebase rules allow writes to /pois')
    }
  }

  const deletePoi = async (id: string) => {
    try {
      await remove(ref(db, `pois/${id}`))
    } catch (e) {
      alert('Could not delete — check Firebase rules allow writes to /pois')
    }
  }

  return { pois, loading, savePoi, deletePoi }
}

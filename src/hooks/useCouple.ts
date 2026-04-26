"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import type { Couple, User } from "@/types"

export function useCouple() {
  const [couple, setCouple] = useState<Couple | null>(null)
  const [partner, setPartner] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const supabase = createClient()

    async function fetchCouple() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setIsLoading(false)
        return
      }

      const { data, error } = await supabase
        .from("couples")
        .select("*")
        .or(`user_a_id.eq.${user.id},user_b_id.eq.${user.id}`)
        .single()

      if (error) {
        setError(error.message)
        setIsLoading(false)
        return
      }

      if (!data) {
        setIsLoading(false)
        return
      }

      setCouple(data)

      const partnerId = data.user_a_id === user.id ? data.user_b_id : data.user_a_id
      if (partnerId) {
        const { data: partnerData } = await supabase
          .from("users")
          .select("*")
          .eq("id", partnerId)
          .single()
        setPartner(partnerData)
      }

      setIsLoading(false)
    }

    fetchCouple()
  }, [])

  return { couple, partner, isLoading, error }
}

import { useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

interface UseRealtimeOptions {
  channel: string
  table: string
  filter?: string
  event?: 'INSERT' | 'UPDATE' | 'DELETE' | '*'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onData: (payload: any) => void
  enabled?: boolean
}

export function useRealtime({
  channel,
  table,
  filter,
  event = '*',
  onData,
  enabled = true,
}: UseRealtimeOptions) {
  useEffect(() => {
    if (!enabled) return

    const supabase = createClient()

    const ch = supabase
      .channel(channel)
      .on(
        'postgres_changes' as never,
        { event, schema: 'public', table, filter },
        onData
      )
      .subscribe()

    return () => {
      void supabase.removeChannel(ch)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [channel, table, filter, event, enabled])
}

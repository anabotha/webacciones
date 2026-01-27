'use client'
import React, { createContext, useState, useCallback, ReactNode } from 'react'
import { useFetch } from '../hooks/useFetch'

// Tipos
export interface TradingDay {
  id: number
  monto_maximo_ars: number | null
  monto_maximo_usd: number | null
}

export interface TradingDayState {
  tradingDay: TradingDay | null
  isLoading: boolean
  error: Error | null
}

export interface TradingDayActions {
  updateAvailableAmount: (ars: number, usd: number) => Promise<void>
  refetch: () => Promise<void>
}

export interface TradingDayContextValue {
  state: TradingDayState
  actions: TradingDayActions
}

// Contexto
const TradingDayContext = createContext<TradingDayContextValue | null>(null)

export function useTradingDayContext() {
  const context = React.use(TradingDayContext)
  if (!context) {
    throw new Error('useTradingDayContext must be used within TradingDayProvider')
  }
  return context
}

// Provider
interface TradingDayProviderProps {
  children: ReactNode
}

export function TradingDayProvider({ children }: TradingDayProviderProps) {
  const { data, loading, error, refetch } = useFetch<TradingDay>('/api/trading-day')
  const [isUpdating, setIsUpdating] = useState(false)

  const actions: TradingDayActions = {
    updateAvailableAmount: useCallback(
      async (ars: number, usd: number) => {
        setIsUpdating(true)
        try {
          const response = await fetch('/api/trading-day', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              monto_maximo_ars: ars,
              monto_maximo_usd: usd,
            }),
          })

          if (!response.ok) {
            throw new Error('Error updating available amount')
          }

          // Refetch the data after update
          await refetch()
        } finally {
          setIsUpdating(false)
        }
      },
      [refetch]
    ),
    refetch,
  }

  const state: TradingDayState = {
    tradingDay: data,
    isLoading: loading || isUpdating,
    error,
  }

  return (
    <TradingDayContext.Provider value={{ state, actions }}>
      {children}
    </TradingDayContext.Provider>
  )
}

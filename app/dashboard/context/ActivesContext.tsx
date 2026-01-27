'use client'
import React, { createContext, useState, useCallback, ReactNode } from 'react'
import { useFetch } from '../hooks/useFetch'

// Tipos
export interface ActiveType {
  operacion: string
  activo: string
  tipo_activo: string
  costo_promedio?: number
  cantidad_total?: number
  precio?: number
  montoBruto?: number
  mercado?: string
  moneda?: string
  updated_at?: Date
}

export interface ActivesState {
  actives: ActiveType[]
  isLoading: boolean
  error: Error | null
}

export interface ActivesActions {
  createActive: (active: Partial<ActiveType>) => Promise<void>
  refetch: () => Promise<void>
}

export interface ActivesContextValue {
  state: ActivesState
  actions: ActivesActions
}

// Contexto
const ActivesContext = createContext<ActivesContextValue | null>(null)

export function useActivesContext() {
  const context = React.use(ActivesContext)
  if (!context) {
    throw new Error('useActivesContext must be used within ActivesProvider')
  }
  return context
}

// Provider
interface ActivesProviderProps {
  children: ReactNode
  endpoint?: string
}

export function ActivesProvider({ children, endpoint = '/api/actives' }: ActivesProviderProps) {
  const { data, loading, error, refetch } = useFetch<ActiveType[]>(endpoint)
  const [isCreating, setIsCreating] = useState(false)

  const actions: ActivesActions = {
    createActive: useCallback(
      async (active: Partial<ActiveType>) => {
        setIsCreating(true)
        try {
          const response = await fetch('/api/new-actives', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(active),
          })

          if (!response.ok) {
            throw new Error('Error creating active')
          }

          // Refetch the data after creation
          await refetch()
        } finally {
          setIsCreating(false)
        }
      },
      [refetch]
    ),
    refetch,
  }

  const state: ActivesState = {
    actives: data || [],
    isLoading: loading || isCreating,
    error,
  }

  return (
    <ActivesContext.Provider value={{ state, actions }}>
      {children}
    </ActivesContext.Provider>
  )
}

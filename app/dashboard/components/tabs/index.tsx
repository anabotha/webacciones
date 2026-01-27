'use client'
import React, { createContext, useState, useCallback, useRef, ReactNode } from 'react'

// Tipos genéricos compartidos
export interface TabsState {
  activeTab: string
}

export interface TabsActions {
  setActiveTab: (tab: string) => void
}

export interface TabsContextValue {
  state: TabsState
  actions: TabsActions
}

// Crear contexto
const TabsContext = createContext<TabsContextValue | null>(null)

export function useTabsContext() {
  const context = React.use(TabsContext)
  if (!context) {
    throw new Error('useTabsContext must be used within TabsProvider')
  }
  return context
}

// Provider
interface TabsProviderProps {
  initialTab?: string
  children: ReactNode
}

export function TabsProvider({ initialTab = 'tab-1', children }: TabsProviderProps) {
  const [state, setState] = useState<TabsState>({ activeTab: initialTab })

  const actions: TabsActions = {
    setActiveTab: useCallback((tab: string) => {
      setState(prev => ({ ...prev, activeTab: tab }))
    }, []),
  }

  return (
    <TabsContext.Provider value={{ state, actions }}>
      {children}
    </TabsContext.Provider>
  )
}

// Compound Components
interface TabsFrameProps {
  children: ReactNode
  className?: string
}

export function TabsFrame({ children, className }: TabsFrameProps) {
  return <div className={className}>{children}</div>
}

interface TabsListProps {
  children: ReactNode
  className?: string
}

export function TabsList({ children, className }: TabsListProps) {
  return (
    <div className={`flex space-x-2 bg-gray-100 p-1 rounded-lg ${className || ''}`}>
      {children}
    </div>
  )
}

interface TabsTriggerProps {
  value: string
  children: ReactNode
  className?: string
}

export function TabsTrigger({ value, children, className }: TabsTriggerProps) {
  const { state, actions } = useTabsContext()
  const isSelected = state.activeTab === value

  return (
    <button
      className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
        isSelected ? 'bg-white shadow text-black' : 'text-gray-500 hover:text-gray-700'
      } ${className || ''}`}
      onClick={() => actions.setActiveTab(value)}
      role="tab"
      aria-selected={isSelected}
      aria-controls={`panel-${value}`}
    >
      {children}
    </button>
  )
}

interface TabsContentProps {
  value: string
  children: ReactNode
}

export function TabsContent({ value, children }: TabsContentProps) {
  const { state } = useTabsContext()
  
  if (state.activeTab !== value) return null
  
  return (
    <div id={`panel-${value}`} role="tabpanel" aria-labelledby={`trigger-${value}`}>
      {children}
    </div>
  )
}

// Exportar como compound component
export const Tabs = {
  Provider: TabsProvider,
  Frame: TabsFrame,
  List: TabsList,
  Trigger: TabsTrigger,
  Content: TabsContent,
}

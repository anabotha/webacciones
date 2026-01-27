# 🚀 Guía Rápida - Patrones del Proyecto

## ¿Por qué estos cambios?

Seguimos **React Composition Patterns** para código más limpio, escalable y mantenible.

---

## 📦 Cómo Consumir Estado

### Opción 1: Usar un Context Existente

```tsx
'use client'
import { useActivesContext } from '@/app/dashboard/context/ActivesContext'

export function MyComponent() {
  const { state, actions } = useActivesContext()
  
  return (
    <div>
      {state.isLoading ? 'Cargando...' : (
        <div>
          {state.actives.map(active => (
            <div key={active.activo}>{active.activo}</div>
          ))}
        </div>
      )}
      <button onClick={() => actions.refetch()}>
        Refrescar
      </button>
    </div>
  )
}
```

### Opción 2: Usar el Hook Genérico `useFetch`

```tsx
import { useFetch } from '@/app/dashboard/hooks/useFetch'

export function MyComponent() {
  const { data, loading, error, refetch } = useFetch('/api/algo')
  
  if (loading) return <div>Cargando...</div>
  if (error) return <div>Error: {error.message}</div>
  
  return <div>{JSON.stringify(data)}</div>
}
```

---

## 🎨 Cómo Crear Componentes Correctamente

### ✅ Componente Presentacional (Puro)

```tsx
// components/MiDisplay.tsx
interface MiDisplayProps {
  items: string[]
  onAction?: () => void
}

export function MiDisplay({ items, onAction }: MiDisplayProps) {
  // NO hay hooks, NO hay context, NO hay state
  // Solo renderiza props
  return (
    <div>
      {items.map(item => <div key={item}>{item}</div>)}
      {onAction && <button onClick={onAction}>Acción</button>}
    </div>
  )
}
```

### ✅ Componente Smart (Contenedor)

```tsx
// components/tabs/MiTab.tsx
'use client'
import { useState } from 'react'
import { useActivesContext } from '@/app/dashboard/context/ActivesContext'
import { MiDisplay } from '../MiDisplay'

export function MiTab() {
  // Aquí SÍ usamos hooks y context
  const { state, actions } = useActivesContext()
  const [filter, setFilter] = useState('')
  
  const filtered = state.actives.filter(a => 
    a.activo.includes(filter)
  )
  
  return (
    <div>
      <input
        value={filter}
        onChange={e => setFilter(e.target.value)}
        placeholder="Filtrar..."
      />
      <MiDisplay items={filtered} onAction={() => actions.refetch()} />
    </div>
  )
}
```

### ❌ NO hacer esto

```tsx
// ❌ Componente que mezcla presentación con lógica
export function BadComponent() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  
  useEffect(() => {
    // fetch aquí
  }, [])
  
  return (
    <div className="flex">
      {items.map(item => <div>{item}</div>)}
    </div>
  )
}
```

---

## 🔄 Cómo Actualizar Estado

### Desde un Tab

```tsx
// components/tabs/OperacionesTab.tsx
'use client'
import { useActivesContext } from '@/app/dashboard/context/ActivesContext'

export function OperacionesTab() {
  const { state, actions } = useActivesContext()
  
  const handleSave = async () => {
    try {
      await actions.createActive({
        activo: 'AAPL',
        precio: 150,
        // ...
      })
      alert('Guardado!')
    } catch (error) {
      alert('Error: ' + error.message)
    }
  }
  
  return (
    <button onClick={handleSave} disabled={state.isLoading}>
      {state.isLoading ? 'Guardando...' : 'Guardar'}
    </button>
  )
}
```

---

## 📋 Cómo Crear un Nuevo Context

```tsx
// context/MiNuevoContext.tsx
'use client'
import React, { createContext, useState, useCallback } from 'react'

// 1. Definir interfaces
interface MiState {
  datos: string[]
  isLoading: boolean
  error: Error | null
}

interface MiActions {
  cargarDatos: () => Promise<void>
  agregarDato: (dato: string) => void
}

interface MiContextValue {
  state: MiState
  actions: MiActions
}

// 2. Crear contexto
const MiContext = createContext<MiContextValue | null>(null)

// 3. Hook para usar el contexto
export function useMiContext() {
  const context = React.use(MiContext)
  if (!context) {
    throw new Error('useMiContext must be used within MiProvider')
  }
  return context
}

// 4. Provider
interface MiProviderProps {
  children: React.ReactNode
}

export function MiProvider({ children }: MiProviderProps) {
  const [state, setState] = useState<MiState>({
    datos: [],
    isLoading: false,
    error: null,
  })

  const actions: MiActions = {
    cargarDatos: useCallback(async () => {
      setState(prev => ({ ...prev, isLoading: true }))
      try {
        const res = await fetch('/api/datos')
        const datos = await res.json()
        setState(prev => ({
          ...prev,
          datos,
          isLoading: false,
          error: null,
        }))
      } catch (error) {
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: error instanceof Error ? error : new Error(String(error)),
        }))
      }
    }, []),
    
    agregarDato: useCallback((dato: string) => {
      setState(prev => ({
        ...prev,
        datos: [...prev.datos, dato],
      }))
    }, []),
  }

  return (
    <MiContext.Provider value={{ state, actions }}>
      {children}
    </MiContext.Provider>
  )
}
```

---

## 📐 Patrón: Cuando Usar Qué

```
¿Necesitas compartir estado entre componentes hermanos?
├─ SÍ, entre muchos → Crear un Context + Provider
├─ SÍ, entre 1-2 → Props lifting
└─ NO → useState en el componente

¿Necesitas reutilizar lógica de fetch?
├─ SÍ → Crear un hook custom (useFetch)
└─ NO → Usar fetch directamente en el componente

¿Necesitas diferentes variantes del mismo componente?
├─ SÍ → Crear componentes explícitos
│       (OperacionesTab, ActivosTab, etc)
└─ NO → Un componente flexible

¿Es un componente sin estado, solo renderiza props?
├─ SÍ → Presentational component (como ActiveTable)
└─ NO → Smart component que usa hooks/context
```

---

## 🧪 Ejemplo: Agregar Nuevo Tab

### Paso 1: Crear el Tab si necesita un nuevo context

```tsx
// context/NuevoTabContext.tsx
export function NuevoTabProvider({ children }) { ... }
export function useNuevoTabContext() { ... }
```

### Paso 2: Crear el componente Tab

```tsx
// components/tabs/NuevoTab.tsx
'use client'
import { useNuevoTabContext } from '@/app/dashboard/context/NuevoTabContext'

export function NuevoTab() {
  const { state, actions } = useNuevoTabContext()
  return (...)
}
```

### Paso 3: Registrarlo en GeneralTabList

```tsx
// components/GeneralTabList.tsx
export function GeneralTabList() {
  return (
    <div className="space-y-6">
      <Tabs.List className="w-full">
        <Tabs.Trigger value="operaciones">Operaciones</Tabs.Trigger>
        <Tabs.Trigger value="activos">Activos</Tabs.Trigger>
        <Tabs.Trigger value="disponible">Disponible</Tabs.Trigger>
        <Tabs.Trigger value="nuevo">Nuevo Tab</Tabs.Trigger>
      </Tabs.List>

      {/* ... contenidos existentes ... */}
      
      <Tabs.Content value="nuevo">
        <NuevoTab />
      </Tabs.Content>
    </div>
  )
}
```

### Paso 4: Si necesita un nuevo provider, agregarlo a DashboardProvider

```tsx
// context/DashboardProvider.tsx
<TradingDayProvider>
  <ActivesProvider>
    <NuevoTabProvider>
      <Tabs.Provider initialTab="operaciones">
        {children}
      </Tabs.Provider>
    </NuevoTabProvider>
  </ActivesProvider>
</TradingDayProvider>
```

---

## 🎯 Checklist de Calidad

Antes de hacer un PR, verifica:

- [ ] Los componentes presentacionales no tienen `useContext`
- [ ] Los hooks de contexto solo se usan en componentes que los necesitan
- [ ] No hay `useState` para estado que debería estar en un Provider
- [ ] No hay prop drilling (props pasadas a través de múltiples capas)
- [ ] Los componentes tienen una única responsabilidad
- [ ] Las interfaces de contexto están bien documentadas
- [ ] Los errores se manejan apropiadamente
- [ ] Los estados de carga (isLoading) se muestran al usuario

---

## 🔗 Enlaces Útiles

- [Refactoring Notes](./REFACTORING_NOTES.md) - Cambios detallados
- [Architecture](./ARCHITECTURE.md) - Diagrama de la arquitectura
- [AGENTS.md](./.agent/skills/vercel-composition-patterns/AGENTS.md) - Patrones de composición
- [React Context API](https://react.dev/reference/react/useContext)
- [React Hooks](https://react.dev/reference/react/hooks)


## Arquitectura del Dashboard Refactorizado

```
┌─────────────────────────────────────────────────────────────────────┐
│                        DASHBOARD (page.jsx)                         │
│                                                                     │
│  ┌───────────────────────────────────────────────────────────────┐ │
│  │                   DashboardProvider                           │ │
│  │  (Composite provider que levanta todo el estado global)       │ │
│  │                                                               │ │
│  │  ┌─────────────────────────────────────────────────────────┐ │ │
│  │  │           TradingDayProvider                            │ │ │
│  │  │                                                         │ │ │
│  │  │  State:                                                │ │ │
│  │  │  - tradingDay: { id, monto_maximo_ars, ... }          │ │ │
│  │  │  - isLoading, error                                   │ │ │
│  │  │                                                         │ │ │
│  │  │  Actions:                                              │ │ │
│  │  │  - updateAvailableAmount()                             │ │ │
│  │  │  - refetch()                                           │ │ │
│  │  └─────────────────────────────────────────────────────────┘ │ │
│  │                                                               │ │
│  │  ┌─────────────────────────────────────────────────────────┐ │ │
│  │  │          ActivesProvider                                │ │ │
│  │  │                                                         │ │ │
│  │  │  State:                                                │ │ │
│  │  │  - actives: ActiveType[]                              │ │ │
│  │  │  - isLoading, error                                   │ │ │
│  │  │                                                         │ │ │
│  │  │  Actions:                                              │ │ │
│  │  │  - createActive()                                      │ │ │
│  │  │  - refetch()                                           │ │ │
│  │  └─────────────────────────────────────────────────────────┘ │ │
│  │                                                               │ │
│  │  ┌─────────────────────────────────────────────────────────┐ │ │
│  │  │           Tabs.Provider                                 │ │ │
│  │  │                                                         │ │ │
│  │  │  State:                                                │ │ │
│  │  │  - activeTab: string                                   │ │ │
│  │  │                                                         │ │ │
│  │  │  Actions:                                              │ │ │
│  │  │  - setActiveTab()                                      │ │ │
│  │  └─────────────────────────────────────────────────────────┘ │ │
│  │                                                               │ │
│  │  ┌───────────────────┬─────────────────┬───────────────────┐ │ │
│  │  │   GeneralHeader   │ GeneralTabList  │  Tabs.Content     │ │ │
│  │  ├───────────────────┴─────────────────┴───────────────────┤ │ │
│  │  │                                                         │ │ │
│  │  │  ┌──────────────────────────────────────────────────┐ │ │ │
│  │  │  │        Tabs.List                                │ │ │ │
│  │  │  │  ┌──────────┐ ┌──────────┐ ┌──────────┐        │ │ │ │
│  │  │  │  │Trigger 1 │ │Trigger 2 │ │Trigger 3 │        │ │ │ │
│  │  │  │  └──────────┘ └──────────┘ └──────────┘        │ │ │ │
│  │  │  └──────────────────────────────────────────────────┘ │ │ │
│  │  │                                                         │ │ │
│  │  │  ┌──────────────────────────────────────────────────┐ │ │ │
│  │  │  │        Active Tab Content                        │ │ │ │
│  │  │  └──────────────────────────────────────────────────┘ │ │ │
│  │  │                                                         │ │ │
│  │  └─────────────────────────────────────────────────────────┘ │ │
│  └───────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Flujo de Datos por Tab

### OperacionesTab (Crear operaciones)
```
OperacionesTab (usa TradingDayContext + ActivesContext)
│
├─ useActivesContext()
│  └─ State: { actives, isLoading, error }
│  └─ Actions: { createActive(), refetch() }
│
├─ useTradingDayContext()
│  └─ State: { tradingDay, isLoading, error }
│  └─ Actions: { updateAvailableAmount(), refetch() }
│
└─ Renderiza formulario que:
   ├─ Lee tradingDay.id para enviar en payload
   ├─ Llama a activesActions.createActive()
   └─ Refrescar lista de activos
```

### ActivosTab (Ver historial)
```
ActivosTab (usa ActivesContext)
│
├─ useActivesContext()
│  └─ State: { actives, isLoading, error }
│
└─ Renderiza:
   └─ ActiveTable (presentational component)
      └─ Solo recibe { actives: ActiveType[] } como props
```

### DisponibleTab (Gestionar disponible)
```
DisponibleTab (usa TradingDayContext)
│
├─ useTradingDayContext()
│  └─ State: { tradingDay, isLoading, error }
│  └─ Actions: { updateAvailableAmount(), refetch() }
│
└─ Renderiza:
   ├─ Monto disponible si ya existe
   └─ Formulario para actualizar si no existe
```

---

## Separación de Responsabilidades

```
┌─────────────────────────────────────────────────────────────────┐
│ LEVEL 1: PAGE / LAYOUT                                          │
├─────────────────────────────────────────────────────────────────┤
│ - Dashboard (page.jsx)                                          │
│ - Responsabilidad: Montar providers y layout                    │
│ - No tiene estado, solo composición                            │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ LEVEL 2: CONTEXT / STATE MANAGEMENT                             │
├─────────────────────────────────────────────────────────────────┤
│ - TradingDayProvider                                            │
│ - ActivesProvider                                               │
│ - Tabs.Provider                                                 │
│ - DashboardProvider (composite)                                 │
│                                                                 │
│ Responsabilidad: Gestionar y distribuir estado                 │
│ No renderizan UI, solo contexto                               │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ LEVEL 3: CONTAINER / SMART COMPONENTS                           │
├─────────────────────────────────────────────────────────────────┤
│ - OperacionesTab                                               │
│ - ActivosTab                                                   │
│ - DisponibleTab                                                │
│ - GeneralTabList                                               │
│ - GeneralHeader                                                │
│                                                                 │
│ Responsabilidad: Consumir contexto y orquestar lógica         │
│ Pueden tener estado local mínimo (form state)                │
│ Usan hooks para acceder contexto                              │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ LEVEL 4: PRESENTATIONAL / UI COMPONENTS                         │
├─────────────────────────────────────────────────────────────────┤
│ - ActiveTable                                                  │
│ - ActiveCard                                                   │
│ - Tabs.Frame, Tabs.List, Tabs.Trigger, Tabs.Content          │
│                                                                 │
│ Responsabilidad: Renderizar UI basado en props                │
│ Cero estado, cero side effects                               │
│ 100% predecibles                                              │
└─────────────────────────────────────────────────────────────────┘
```

---

## Data Flow (Ejemplo: Crear una operación)

```
Usuario llena form en OperacionesTab
         ↓
    handleSubmit()
         ↓
activesActions.createActive(payload)
         ↓
POST /api/new-actives
         ↓
      Success
         ↓
refetch de ActivesContext
         ↓
useFetch() retorna nuevos datos
         ↓
setState({ data: [...] })
         ↓
ActivosTab y otros componentes se re-renderean con nuevos datos
         ↓
UI actualizado
```

---

## Dependencies (Importaciones)

```
Tabs (Index.tsx)
├── React (createContext, useState, useCallback, use)
├── No depende de contextos externos

TradingDayContext.tsx
├── React
├── useFetch (hook custom)

ActivesContext.tsx
├── React
├── useFetch (hook custom)

useFetch.ts
├── React (useState, useEffect, useCallback)
└── No depende de nada más

OperacionesTab.tsx
├── React
├── useActivesContext
├── useTradingDayContext
├── Select UI Library
├── Lucide Icons

ActivosTab.tsx
├── React
├── useActivesContext
├── ActiveTable (presentational)

DisponibleTab.tsx
├── React
├── useTradingDayContext

GeneralTabList.tsx
├── React
├── useTabsContext (de Tabs)
├── OperacionesTab
├── ActivosTab
├── DisponibleTab

ActiveTable.tsx
├── React (no hooks)
└── Solo props
```

---

## Escalabilidad Futura

### Agregar nuevo provider
```tsx
// context/NewFeatureContext.tsx
export const NewFeatureProvider = ({ children }) => { ... }
export const useNewFeatureContext = () => { ... }

// context/DashboardProvider.tsx
<NewFeatureProvider>
  {children}
</NewFeatureProvider>
```

### Agregar nuevo tab
```tsx
// components/tabs/NewTab.tsx
export function NewTab() {
  const { state, actions } = useNewFeatureContext()
  return ...
}

// components/GeneralTabList.tsx
<Tabs.Trigger value="new">New Tab</Tabs.Trigger>
<Tabs.Content value="new">
  <NewTab />
</Tabs.Content>
```

### Reutilizar en otro contexto
```tsx
// pages/reports.tsx
<ActivesProvider endpoint="/api/actives-reports">
  <ActiveTable actives={...} />
</ActivesProvider>
```

---

## Estado vs Props vs Context

| Dónde? | Cuándo? | Ejemplo |
|--------|---------|---------|
| **Props** | Datos que fluyen top-down | `<ActiveTable actives={[...]} />` |
| **Local State (useState)** | Formularios, UI temporal | `<input value={form.price} />` |
| **Context** | Estado compartido entre múltiples componentes | `useTradingDayContext()` |
| **Hook (useFetch)** | Lógica reutilizable | `const { data } = useFetch('/api')` |


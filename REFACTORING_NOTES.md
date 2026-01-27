# Refactoring del Proyecto WebAcciones - Patrones de Composición React

## Resumen de Cambios

El proyecto ha sido refactorizado siguiendo los patrones de composición de React documentados en `AGENTS.md`. Los cambios buscan mejorar:

- **Mantenibilidad**: Código más limpio y fácil de entender
- **Escalabilidad**: Patrones que crecen sin explosión de complejidad
- **Responsabilidad**: Cada componente tiene una única responsabilidad
- **Testabilidad**: Componentes desacoplados y más fáciles de probar

---

## Cambios Implementados

### 1. **Hooks Compartidos para Fetching** 
📁 `app/dashboard/hooks/useFetch.ts`

**Patrón**: Lógica de fetching centralizada y reutilizable

```tsx
// Antes: duplicación de fetch en cada componente
const [data, setData] = useState(null)
useEffect(() => {
  fetch('/api/...')
    .then(res => res.json())
    .then(setData)
}, [])

// Después: hook reutilizable
const { data, loading, error, refetch } = useFetch('/api/actives')
```

**Beneficios**:
- ✅ Lógica de error handling centralizada
- ✅ Estados de carga consistentes
- ✅ Refetch manual disponible
- ✅ Reducción de código boilerplate

---

### 2. **Context Providers para State Management**
📁 `app/dashboard/context/`

#### A. `TradingDayContext.tsx` - Estado del día de trading

**Patrón**: Lifting state + Generic context interface para dependency injection

```tsx
// Interfaz genérica que implementan otros providers
interface TradingDayContextValue {
  state: TradingDayState
  actions: TradingDayActions
}

// Provider encapsula toda la lógica
<TradingDayProvider>
  <Componentes que necesitan acceso />
</TradingDayProvider>

// Consumo desacoplado
const { state, actions } = useTradingDayContext()
```

**Responsabilidades**:
- Gestión de estado del disponible (ARS/USD)
- Actualización del monto disponible
- Manejo de errores y loading

#### B. `ActivesContext.tsx` - Estado de los activos

**Patrón**: Mismo patrón genérico aplicado a activos

```tsx
interface ActivesContextValue {
  state: ActivesState
  actions: ActivesActions
}

// Permite múltiples instancias con diferentes endpoints
<ActivesProvider endpoint="/api/actives">
  <ActivosTab />
</ActivesProvider>
```

**Responsabilidades**:
- Fetch y cachés de activos
- Creación de nuevos activos
- Manejo de errores

#### C. `DashboardProvider.tsx` - Provider compuesto

**Patrón**: Composición de providers para aplicación coherente

```tsx
export function DashboardProvider({ children }) {
  return (
    <TradingDayProvider>
      <ActivesProvider>
        <Tabs.Provider>
          {children}
        </Tabs.Provider>
      </ActivesProvider>
    </TradingDayProvider>
  )
}
```

---

### 3. **Compound Components: Sistema de Tabs Mejorado**
📁 `app/dashboard/components/tabs/index.tsx`

**Patrón**: Compound component con context

**Antes** (acoplado, inflexible):
```tsx
const [activeTab, setActiveTab] = useState('tab1')
<Tabs value={activeTab} onValueChange={setActiveTab}>
  <TabsList>...</TabsList>
  <TabsContent value="tab1">...</TabsContent>
</Tabs>
```

**Después** (desacoplado, reutilizable):
```tsx
<Tabs.Provider initialTab="tab1">
  <Tabs.Frame>
    <Tabs.List>
      <Tabs.Trigger value="tab1">Pestaña 1</Tabs.Trigger>
    </Tabs.List>
    <Tabs.Content value="tab1">Contenido</Tabs.Content>
  </Tabs.Frame>
</Tabs.Provider>
```

**Componentes exportados**:
- `Tabs.Provider` - Gestiona estado del tab activo
- `Tabs.Frame` - Contenedor raíz
- `Tabs.List` - Contenedor de triggers
- `Tabs.Trigger` - Botón individual
- `Tabs.Content` - Contenido condicional

**Ventajas**:
- ✅ Estado lifting a provider
- ✅ Sin props drilling
- ✅ Accesible (roles ARIA)
- ✅ Fácil composición

---

### 4. **Variantes Explícitas de Componentes**
📁 `app/dashboard/components/tabs/`

**Patrón**: Cada variante de uso tiene su propio componente explícito

#### `OperacionesTab.tsx`
- Formulario para crear operaciones (BUY/SELL/HOLD)
- Consume `ActivesContext` y `TradingDayContext`
- Responsabilidad única: crear operaciones

#### `ActivosTab.tsx`
- Muestra historial de activos
- Consume `ActivesContext`
- Responsabilidad única: visualizar historial

#### `DisponibleTab.tsx`
- Gestiona disponible diario (ARS/USD)
- Consume `TradingDayContext`
- Responsabilidad única: gestionar disponible

**Beneficio**: Eliminación de boolean prop proliferation

```tsx
// Antes ❌ (múltiples booleans)
<Composer isThread isEditing showAttachments={false} />

// Después ✅ (variante explícita)
<OperacionesTab />
<ActivosTab />
<DisponibleTab />
```

---

### 5. **Componentes Presentacionales Reutilizables**
📁 `app/dashboard/components/ActiveTable.tsx`

**Patrón**: Componentes sin estado (Pure presentational)

```tsx
interface ActiveTableProps {
  actives: ActiveType[]
}

export function ActiveTable({ actives }: ActiveTableProps) {
  // Solo renderiza lo que recibe en props
  // Sin fetchs, sin context, sin side effects
}
```

**Componentes incluidos**:
- `ActiveTable` - Tabla responsiva (desktop/mobile)
- `ActiveCard` - Card individual para mobile

**Ventajas**:
- ✅ Fácil de probar
- ✅ Reusable en múltiples contextos
- ✅ Predecible y sin side effects

---

### 6. **Flujo de Estado Refactorizado**
📁 `app/dashboard/page.jsx`

**Estructura actual**:
```
Dashboard (page.jsx)
├── DashboardProvider (contexts)
│   ├── TradingDayProvider
│   ├── ActivesProvider
│   └── Tabs.Provider
│       └── GeneralHeader
│       └── GeneralTabList
│           ├── OperacionesTab (usa ActivesContext, TradingDayContext)
│           ├── ActivosTab (usa ActivesContext)
│           └── DisponibleTab (usa TradingDayContext)
```

**Flujo de datos**:
1. `DashboardProvider` levanta el estado
2. Sub-providers especializados (TradingDay, Actives, Tabs)
3. Tabs tabs componentes consumen contextos sin conocer implementación
4. Presentational components (ActiveTable) solo reciben props

---

## Principios Aplicados

### 1. **Avoid Boolean Prop Proliferation** ✅
```tsx
// ❌ Antes
<Component isEditing={true} isThread={false} isDM={true} ... />

// ✅ Después
<EditComposer /> // Explícito y autodocumentado
```

### 2. **Compound Components** ✅
```tsx
// Los sub-componentes se exponen como namespaced exports
<Tabs.Provider>
  <Tabs.Frame>
    <Tabs.List>
      <Tabs.Trigger />
    </Tabs.List>
    <Tabs.Content />
  </Tabs.Frame>
</Tabs.Provider>
```

### 3. **Lifting State into Providers** ✅
```tsx
// El estado se levanta fuera del componente
// Ahora accesible desde cualquier descendiente del provider
<TradingDayProvider>
  <ComponentA /> {/* Puede acceder a TradingDayContext */}
  <ComponentB /> {/* Puede acceder a TradingDayContext */}
</TradingDayProvider>
```

### 4. **Generic Context Interfaces** ✅
```tsx
// Interfaces genéricas que cualquier provider puede implementar
interface ContextValue {
  state: State
  actions: Actions
  meta?: Meta
}
```

### 5. **Decoupling State from UI** ✅
```tsx
// UI components no conocen la implementación del estado
// Solo consumen la interfaz del contexto
const { state, actions } = useTradingDayContext()
// No importa si es useState, Zustand, o un servidor
```

### 6. **Prefer Children over Render Props** ✅
```tsx
// ✅ Composición con children (más limpio)
<Tabs.Provider>
  <Tabs.Frame>
    <Tabs.List>...</Tabs.List>
  </Tabs.Frame>
</Tabs.Provider>

// ❌ Render props (menos limpio)
<Tabs renderList={() => ...} renderFrame={() => ...} />
```

---

## Beneficios del Refactoring

| Aspecto | Antes | Después |
|---------|-------|---------|
| **Acoplamiento** | Alto (fetch en cada componente) | Bajo (providers centralizados) |
| **Responsabilidad** | Múltiple | Única |
| **Prop Drilling** | Presente | Eliminado con context |
| **Reutilización** | Limitada | Alta |
| **Testabilidad** | Difícil | Fácil |
| **Escalabilidad** | Mala (añadir feature = refactor) | Buena (composición) |
| **Boolean Props** | Múltiples | Ninguno |
| **Líneas de código** | Más | Menos (menos boilerplate) |

---

## Guía de Uso

### Agregar una nueva funcionalidad

1. **Si necesita estado compartido**: Crea un nuevo Context + Provider
   ```tsx
   // context/NewFeatureContext.tsx
   export const NewFeatureProvider = ({ children }) => { ... }
   export const useNewFeatureContext = () => { ... }
   ```

2. **Si es una variante de tab**: Crea un nuevo componente Tab
   ```tsx
   // components/tabs/NewFeatureTab.tsx
   export function NewFeatureTab() {
     const { state, actions } = useNewFeatureContext()
     return ...
   }
   ```

3. **Si es un componente presentacional**: Crea un componente puro
   ```tsx
   // components/NewFeatureDisplay.tsx
   export function NewFeatureDisplay({ data }) {
     return ... // Solo renderiza props
   }
   ```

4. **Agrégalo a DashboardProvider si es global**
   ```tsx
   // context/DashboardProvider.tsx
   <NewFeatureProvider>
     {children}
   </NewFeatureProvider>
   ```

---

## Archivos Modificados/Creados

### Nuevos archivos:
- ✅ `app/dashboard/hooks/useFetch.ts`
- ✅ `app/dashboard/context/TradingDayContext.tsx`
- ✅ `app/dashboard/context/ActivesContext.tsx`
- ✅ `app/dashboard/context/DashboardProvider.tsx`
- ✅ `app/dashboard/components/tabs/index.tsx`
- ✅ `app/dashboard/components/tabs/OperacionesTab.tsx`
- ✅ `app/dashboard/components/tabs/ActivosTab.tsx`
- ✅ `app/dashboard/components/tabs/DisponibleTab.tsx`
- ✅ `app/dashboard/components/ActiveTable.tsx`

### Archivos modificados:
- ✅ `app/dashboard/page.jsx` (ahora usa DashboardProvider)
- ✅ `app/dashboard/components/GeneralTabList.jsx` → `.tsx` (refactorizado)
- ✅ `app/dashboard/components/ui/tabs.jsx` (deprecado, ve a `tabs/index.tsx`)

### Archivos deprecados:
- ⚠️ `app/dashboard/components/actives.tsx` (reemplazado por OperacionesTab)
- ⚠️ `app/dashboard/components/availableMoney.jsx` (reemplazado por DisponibleTab)
- ⚠️ `app/dashboard/components/ActivosViejos.tsx` (lógica movida a ActivosTab)

---

## Próximos Pasos Sugeridos

1. **Eliminar componentes deprecated** (mantener hasta confirmar que todo funciona)
2. **Agregar tests** a providers y hooks con Vitest/Jest
3. **Implementar error boundaries** para mejor manejo de errores
4. **Agregar loading states** más granulares
5. **Considerar Zustand o Jotai** si el estado se vuelve muy complejo
6. **Documentar propTypes/zod** para validación de datos

---

## Referencias

- [React Composition Patterns - AGENTS.md](/AGENTS.md)
- [React Context API - react.dev](https://react.dev/reference/react/useContext)
- [React.use() - react.dev](https://react.dev/reference/react/use)
- [Custom Hooks - react.dev](https://react.dev/learn/reusing-logic-with-custom-hooks)

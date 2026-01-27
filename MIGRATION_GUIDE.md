# 📝 Guía de Migración - Código Deprecado

## Componentes Deprecados

Este archivo detalla qué componentes fueron reemplazados y cómo usar los nuevos.

---

## 1. Old Tabs System

### ❌ Deprecado: `components/ui/tabs.jsx`

```jsx
// VIEJO - NO USAR
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./ui/tabs"

export function GeneralTabList() {
  const [activeTab, setActiveTab] = useState("operaciones")
  
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList>
        <TabsTrigger value="operaciones">Operaciones</TabsTrigger>
      </TabsList>
      <TabsContent value="operaciones">Contenido</TabsContent>
    </Tabs>
  )
}
```

### ✅ Nuevo: `components/tabs/index.tsx`

```tsx
// NUEVO - USAR ESTO
import { Tabs } from "./tabs"

export function GeneralTabList() {
  // El estado se levanta al provider
  // No necesitas useState aquí
  
  return (
    <Tabs.Frame>
      <Tabs.List>
        <Tabs.Trigger value="operaciones">Operaciones</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="operaciones">Contenido</Tabs.Content>
    </Tabs.Frame>
  )
}

// En app/dashboard/page.jsx:
<DashboardProvider>
  <div className="min-h-screen bg-background">
    <header className="border-b bg-card">
      <GeneralHeader />
    </header>

    <div className="flex flex-col items-center justify-center container px-4 py-6">
      <GeneralTabList />
    </div>
  </div>
</DashboardProvider>
```

**Cambios principales**:
- El estado del tab se levanta a `Tabs.Provider` en `DashboardProvider`
- Componentes más explícitos: `Tabs.Frame`, `Tabs.List`, etc.
- Mejor accesibilidad con roles ARIA

---

## 2. Actives Component

### ❌ Deprecado: `components/actives.tsx`

```tsx
// VIEJO - NO USAR
export function Actives() {
  const [activeList, setActiveList] = useState<activeType[]>([]);
  const [fecha] = useState(new Date());
  const [tradingDayId, setTradingDayId] = useState<number | null>(null);
  const [form, setForm] = useState({...});
  const [mercado, setMercado] = useState([...]);
  const [activosDisponibles, setActivosDisponibles] = useState<any[]>([]);
  
  // 100+ líneas de lógica acoplada
  
  return (...) // Form gigante
}
```

### ✅ Nuevo: `components/tabs/OperacionesTab.tsx`

```tsx
// NUEVO - USAR ESTO
export function OperacionesTab() {
  const { state, actions } = useActivesContext()
  const { state: tradingDayState } = useTradingDayContext()
  const [form, setForm] = useState({...}) // Solo estado del form
  
  // Lógica clara y separada
  
  return (...) // Form limpio y legible
}
```

**Cambios principales**:
- Estado de activos ahora viene de `useActivesContext()`
- Estado del trading day viene de `useTradingDayContext()`
- Solo mantiene el estado del formulario local
- Más legible y testeable

---

## 3. AvailableMoney Component

### ❌ Deprecado: `components/availableMoney.jsx`

```jsx
// VIEJO - NO USAR
export function AvailableMoney() {
  const [availableUSD, setAvailableUSD] = useState(null);
  const [availableARS, setAvailableARS] = useState(null);
  const [loading, setLoading] = useState(true);
  const [arsInput, setArsInput] = useState("");
  const [usdInput, setUsdInput] = useState("");
  
  const getDay = async () => { ... }
  const saveDay = async () => { ... }
  const fetchData = async () => { ... }
  const handleSave = async (e) => { ... }
  
  // Múltiples efectos y funciones
  
  return (...) // Componente que hace demasiado
}
```

### ✅ Nuevo: `components/tabs/DisponibleTab.tsx`

```tsx
// NUEVO - USAR ESTO
export function DisponibleTab() {
  const { state, actions } = useTradingDayContext()
  const [formState, setFormState] = useState({
    usd: '',
    ars: '',
  })
  
  const handleSubmit = async (e) => {
    await actions.updateAvailableAmount(Number(formState.ars), Number(formState.usd))
  }
  
  return (...) // Componente claro y enfocado
}
```

**Cambios principales**:
- Todo el fetch y estado del día viene de `useTradingDayContext()`
- Solo mantiene el estado del formulario
- Lógica más simple y clara

---

## 4. ActivosViejos Component

### ❌ Deprecado: `components/ActivosViejos.tsx`

```tsx
// VIEJO - NO USAR
export function ActivosViejos({ activeList }: { activeList?: activeType[] }) {
  const [activosViejos, setActivosViejos] = useState(activeList || []);
  
  const getActivosViejos = async () => { ... }
  const updateActivosViejos = async () => { ... }
  
  useEffect(() => {
    updateActivosViejos();
  }, []);
  
  return (
    <div>
      {/* Mezcla de tabla + card + lógica de fetch */}
    </div>
  )
}
```

### ✅ Nuevo: `components/tabs/ActivosTab.tsx` + `components/ActiveTable.tsx`

```tsx
// Tab - smart component
// components/tabs/ActivosTab.tsx
export function ActivosTab() {
  const { state } = useActivesContext()
  
  if (state.isLoading) return <div>Cargando...</div>
  
  return (
    <div className="mt-4 border p-4 rounded bg-gray-100">
      <h3 className="font-bold text-lg text-black">Activos anteriores</h3>
      <ActiveTable actives={state.actives} />
    </div>
  )
}

// Presentational - puro componente
// components/ActiveTable.tsx
export function ActiveTable({ actives }: { actives: ActiveType[] }) {
  // Sin estado, sin contexto, sin fetch
  // Solo renderiza lo que recibe
  return (
    <>
      {/* Desktop view */}
      {/* Mobile view */}
    </>
  )
}
```

**Cambios principales**:
- Lógica de fetch en `useActivesContext()`
- Componente Tab orquesta la lógica
- Componente `ActiveTable` es presentacional puro
- Separación clara de responsabilidades

---

## Comparativa Rápida

| Aspecto | Antes | Después |
|---------|-------|---------|
| **Gestión de estado** | En cada componente | En providers centralizados |
| **Fetch de datos** | Duplicado en componentes | Centralizado en contexts |
| **Props drilling** | Sí (pasando múltiples props) | No (context API) |
| **Responsabilidad** | Múltiple | Única |
| **Testabilidad** | Difícil | Fácil |
| **Reutilización** | Limitada | Alta |
| **Líneas de código** | Más | Menos |

---

## Matriz de Migración

Si usabas... | Ahora usa...
---|---
`components/ui/tabs.jsx` | `components/tabs/index.tsx` (Tabs compound component)
`components/actives.tsx` | `components/tabs/OperacionesTab.tsx` + `useActivesContext()`
`components/availableMoney.jsx` | `components/tabs/DisponibleTab.tsx` + `useTradingDayContext()`
`components/ActivosViejos.tsx` | `components/tabs/ActivosTab.tsx` + `components/ActiveTable.tsx`
`useState` para activos | `useActivesContext()`
`useState` para trading day | `useTradingDayContext()`
`fetch()` directo | `useFetch()` hook
Tab state en componente | `Tabs.Provider` en `DashboardProvider`

---

## Plan de Eliminación

### Fase 1 (Ahora)
- ✅ Crear nuevos componentes
- ✅ Verificar que todo funciona
- ✅ Documentar cambios

### Fase 2 (Próximos commits)
- [ ] Remover imports del código viejo en toda la app
- [ ] Confirmar que no hay referencias al código deprecado
- [ ] Ejecutar linter y tests

### Fase 3 (PR merge)
- [ ] Eliminar archivos deprecados
- [ ] Actualizar documentación
- [ ] Hacer merge

---

## Preguntas Frecuentes

### P: ¿Puedo seguir usando el código viejo?
R: No, el código viejo está deprecado. Usa los nuevos componentes y patrones.

### P: ¿Qué pasa si mi componente necesita `activeList`?
R: Ahora viene de `useActivesContext()` automáticamente.

### P: ¿Cómo manejo el estado del formulario?
R: Con `useState` local en el componente (es OK para estado UI temporal).

### P: ¿Necesito cambiar el endpoint del API?
R: Puedes pasar `endpoint` a `ActivesProvider`: `<ActivesProvider endpoint="/custom" />`

### P: ¿Dónde guardo estado global?
R: En un Context + Provider en `app/dashboard/context/`

---

## Recursos

- [REFACTORING_NOTES.md](./REFACTORING_NOTES.md) - Explicación detallada de cambios
- [ARCHITECTURE.md](./ARCHITECTURE.md) - Diagrama de arquitectura
- [QUICK_START.md](./QUICK_START.md) - Cómo usar los nuevos patrones


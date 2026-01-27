# ✅ Checklist de Calidad - WebAcciones Refactoring

## Pre-Merge Checklist

### 1. Funcionalidad Base ✓
- [ ] Dashboard carga sin errores
- [ ] Tab "Operaciones" funciona
  - [ ] Formulario se carga
  - [ ] Select de operación funciona
  - [ ] Inputs aceptan valores
  - [ ] Botón de guardar funciona
  - [ ] Mensajes de error/éxito aparecen
- [ ] Tab "Activos" funciona
  - [ ] Tabla de activos carga
  - [ ] Vista mobile muestra cards
  - [ ] Vista desktop muestra tabla
  - [ ] Sin activos muestra mensaje
- [ ] Tab "Disponible" funciona
  - [ ] Si hay data, muestra montos
  - [ ] Si no hay data, muestra formulario
  - [ ] Inputs aceptan números
  - [ ] Botón de actualizar funciona

### 2. Patrones de Composición ✓
- [ ] No hay estado en componentes presentacionales
  - [ ] `ActiveTable.tsx` - cero hooks
  - [ ] `ActiveCard` - cero hooks
- [ ] Todos los tabs consumen contexto correctamente
  - [ ] `OperacionesTab` usa `useActivesContext()` y `useTradingDayContext()`
  - [ ] `ActivosTab` usa `useActivesContext()`
  - [ ] `DisponibleTab` usa `useTradingDayContext()`
- [ ] No hay prop drilling
  - [ ] Props son máximo 3 por componente
  - [ ] No se pasan estados entre niveles
- [ ] `DashboardProvider` está en la raíz
  - [ ] Envuelve todo en `app/dashboard/page.jsx`

### 3. Error Handling ✓
- [ ] Errors de fetch se muestran al usuario
- [ ] Loading states se muestran
- [ ] Mensajes de error son claros
- [ ] No hay console errors (excepto en dev)

### 4. Performance ✓
- [ ] No hay re-renders innecesarios
- [ ] Componentes presentacionales usan React.memo (optional)
- [ ] No hay memory leaks (cleanup en useEffect)
- [ ] useFetch cancela requests al desmontar

### 5. Accesibilidad ✓
- [ ] Tabs tienen roles ARIA correctos
  - [ ] `<Tabs.Trigger role="tab" aria-selected />`
  - [ ] `<Tabs.Content role="tabpanel" />`
- [ ] Labels están asociados a inputs
- [ ] Botones tienen textos descriptivos
- [ ] Contraste de colores es suficiente

### 6. TypeScript ✓
- [ ] No hay `any` types
- [ ] Interfaces están bien definidas
- [ ] Props tipados correctamente
- [ ] Sin errores de compilación

### 7. Documentación ✓
- [ ] `QUICK_START.md` está actualizado
- [ ] `ARCHITECTURE.md` tiene diagrama correcto
- [ ] `REFACTORING_NOTES.md` documenta cambios
- [ ] `MIGRATION_GUIDE.md` tiene matriz de migración
- [ ] Código tiene comentarios en partes complejas

### 8. Tests (Si aplica) ✓
- [ ] Tests de providers pasan
- [ ] Tests de componentes pasan
- [ ] Coverage > 80% (target)
- [ ] No hay tests ignorados (skip/xdescribe)

### 9. Git ✓
- [ ] Commits están limpios (no WIP)
- [ ] No hay archivos innecesarios commiteados
- [ ] Branch está actualizada con main
- [ ] No hay conflictos

### 10. Code Review ✓
- [ ] Almenos 1 aprobación
- [ ] No hay comentarios de cambios requeridos
- [ ] Todos los comentarios resueltos

---

## Testing Manual Scenarios

### Escenario 1: Crear una operación
```
1. Navegar a /dashboard
2. Click en "Operaciones"
3. Llenar formulario:
   - Operación: SELL
   - Activo: AAPL
   - Tipo: ACCION
   - Mercado: USA
   - Precio: 150.00
   - Cantidad: 10
4. Click "Guardar Operación"
5. ✅ Verificar: Mensaje de éxito, tabla actualizada
```

### Escenario 2: Ver historial de activos
```
1. Navegar a /dashboard
2. Click en "Activos"
3. ✅ Verificar: Tabla muestra activos existentes
4. Redimensionar ventana
5. ✅ Verificar: En mobile muestra cards, en desktop muestra tabla
```

### Escenario 3: Actualizar disponible
```
1. Navegar a /dashboard
2. Click en "Disponible"
3. Si está vacío:
   - Llenar USD: 1000
   - Llenar ARS: 200000
   - Click "Actualizar"
   - ✅ Verificar: Mensaje de éxito
4. Si tiene data:
   - ✅ Verificar: Muestra montos actuales
```

### Escenario 4: Manejo de errores
```
1. Abrir DevTools (Network)
2. Desactivar internet
3. Navegar a /dashboard
4. ✅ Verificar: Muestra error o loading indefinido
5. Reactivar internet
6. Click "Refrescar" (si existe)
7. ✅ Verificar: Datos cargan correctamente
```

### Escenario 5: Performance
```
1. Abrir DevTools (Performance)
2. Hacer click en tabs repetidamente
3. ✅ Verificar: No hay memory leak
4. ✅ Verificar: Re-renders son mínimos
```

---

## Checklist de Responsabilidad

### Providers (app/dashboard/context/)
- [ ] Cada provider tiene:
  - [ ] Interfaz `State` definida
  - [ ] Interfaz `Actions` definida
  - [ ] Interfaz `ContextValue` definida
  - [ ] Hook `useXContext` definida
  - [ ] Componente `XProvider` definida
  - [ ] Error al usar hook fuera del provider

### Componentes Smart (components/tabs/)
- [ ] Cada tab tiene:
  - [ ] Solo los hooks que necesita
  - [ ] Estado local solo del formulario
  - [ ] Manejo de errors
  - [ ] Manejo de loading
  - [ ] Una responsabilidad clara

### Componentes Presentacionales (components/)
- [ ] Cada componente tiene:
  - [ ] Cero hooks
  - [ ] Cero context
  - [ ] Props bien tipadas
  - [ ] Lógica de render limpia
  - [ ] Reutilizable

---

## Checklist Anti-Patrones

### ❌ No debe pasar:
- [ ] useState para estado que debería estar en contexto
- [ ] useContext en componentes presentacionales
- [ ] Fetch code en componentes (debe estar en providers/hooks)
- [ ] Props de estado pasadas múltiples niveles (prop drilling)
- [ ] Componentes con 2+ responsabilidades
- [ ] Boolean props para variantes (`isEditing={true}`)
- [ ] Componentes sin TypeScript tipos
- [ ] Componentes sin tratamiento de errores

---

## Métricas a Validar

```
Métrica              Antes    Después   Target
─────────────────────────────────────────────
Props por comp.      8-15     0-3       < 3
Levels de nesting    4-5      2-3       < 3
Prop drilling        Sí       No        No
Líneas por comp.     100+     50-80     < 80
Reutilización        20%      80%       > 70%
Tests (si hay)       0%       50%+      > 80%
TypeScript errors    5-10     0         0
Console errors       Multiple 0         0
```

---

## Proceso Post-Merge

### Día 1: Validación en Staging
- [ ] Deploy a staging
- [ ] Run smoke tests
- [ ] Check error tracking (Sentry, etc)
- [ ] Performance metrics normal

### Día 2-3: Cleanup
- [ ] Remover archivos deprecados
- [ ] Remover imports al código viejo
- [ ] Update CI/CD si es necesario

### Día 4-5: Monitoreo
- [ ] Monitor en producción
- [ ] Verificar sin regresiones
- [ ] Recopilar feedback del equipo

---

## Sign-Off

```
Project: WebAcciones Refactoring
Date: [Fecha]
Status: ✅ Ready for Merge

Reviewed by: [Nombre]
Approved by: [Nombre]
QA Tested by: [Nombre]

Notes:
- [Nota 1]
- [Nota 2]
```

---

## Recursos de Referencia

- [QUICK_START.md](./QUICK_START.md) - Cómo usar
- [ARCHITECTURE.md](./ARCHITECTURE.md) - Diagrama
- [REFACTORING_NOTES.md](./REFACTORING_NOTES.md) - Detalles
- [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md) - Cambios


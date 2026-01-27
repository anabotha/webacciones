'use client'
import { Tabs } from './tabs'
import { OperacionesTab } from './tabs/OperacionesTab'
import { ActivosTab } from './tabs/ActivosTab'
import { DisponibleTab } from './tabs/DisponibleTab'

/**
 * Refactored GeneralTabList using compound components.
 * State is lifted into providers, reducing component complexity.
 * Each tab is now an explicit, self-contained variant component.
 */
export function GeneralTabList() {
  return (
    <div className="space-y-6">
      <Tabs.List className="w-full">
        <Tabs.Trigger value="operaciones">Operaciones</Tabs.Trigger>
        <Tabs.Trigger value="activos">Activos</Tabs.Trigger>
        <Tabs.Trigger value="disponible">Disponible</Tabs.Trigger>
      </Tabs.List>

      <Tabs.Content value="operaciones">
        <OperacionesTab />
      </Tabs.Content>

      <Tabs.Content value="activos">
        <ActivosTab />
      </Tabs.Content>

      <Tabs.Content value="disponible">
        <DisponibleTab />
      </Tabs.Content>
    </div>
  )
}

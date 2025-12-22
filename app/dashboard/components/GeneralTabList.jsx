'use client'

import { useState } from 'react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./ui/tabs"
import { Actives } from './actives.tsx'
import { AvailableMoney } from './availableMoney.jsx'
import { ActivosViejos } from './ActivosViejos'

export const GeneralTabList = () => {
  const [activeTab, setActiveTab] = useState("operaciones")

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="operaciones">Operaciones</TabsTrigger>
        <TabsTrigger value="activos">Activos</TabsTrigger>
        <TabsTrigger value="disponible">Disponible</TabsTrigger>

      </TabsList>

      <TabsContent value="operaciones">
        <Actives />
      </TabsContent>

      <TabsContent value="activos">
        <ActivosViejos />
      </TabsContent>
      <TabsContent value="disponible">
        <AvailableMoney />
      </TabsContent>
    </Tabs>
  )
}

'use client'
import { ActiveType } from '../context/ActivesContext'

interface ActiveTableProps {
  actives: ActiveType[]
}

/**
 * Presentational component for displaying actives.
 * No state management - only receives data via props.
 * Decoupled from data fetching and context.
 */
export function ActiveTable({ actives }: ActiveTableProps) {
  if (actives.length === 0) {
    return <p className="text-gray-500">No hay activos registrados.</p>
  }

  return (
    <>
      {/* Mobile View */}
      <div className="block sm:hidden space-y-3 mt-4">
        {actives.map((activo, index) => (
          <ActiveCard key={index} active={activo} />
        ))}
      </div>

      {/* Desktop View */}
      <div className="hidden sm:block overflow-x-auto mt-4">
        <table className="min-w-full bg-white border border-gray-200">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Activo
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tipo
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Costo Promedio
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cantidad (UNIDADES)
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Mercado
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {actives.map((activo, index) => (
              <tr key={index} className="text-black">
                <td className="px-4 py-2 whitespace-nowrap text-sm">{activo.activo}</td>
                <td className="px-4 py-2 whitespace-nowrap text-sm">{activo.tipo_activo}</td>
                <td className="px-4 py-2 whitespace-nowrap text-sm">
                  {activo.costo_promedio ? `$${activo.costo_promedio.toFixed(2)}` : '-'}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm">{activo.cantidad_total || '-'}</td>
                <td className="px-4 py-2 whitespace-nowrap text-sm">{activo.mercado || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}

interface ActiveCardProps {
  active: ActiveType
}

/**
 * Mobile card view for a single active.
 * Reusable presentation component.
 */
function ActiveCard({ active }: ActiveCardProps) {
  return (
    <div className="border rounded p-3 bg-white text-black">
      <p className="font-semibold">{active.activo}</p>
      <p className="text-sm text-gray-600">{active.tipo_activo}</p>
      {active.costo_promedio && <p className="text-sm">Costo: ${active.costo_promedio.toFixed(2)}</p>}
      {active.cantidad_total && <p className="text-sm">Cantidad: {active.cantidad_total}</p>}
      {active.mercado && <p className="text-xs text-gray-500">Mercado: {active.mercado}</p>}
    </div>
  )
}

'use client'
import { useActivesContext } from '../../context/ActivesContext'
import { ActiveTable } from '../ActiveTable'

/**
 * Activos tab component - displays historical actives.
 * Consumes state from ActivesContext without knowing implementation details.
 */
export function ActivosTab() {
  const { state } = useActivesContext()

  if (state.isLoading) {
    return <div className="text-center py-4 text-white">Cargando activos...</div>
  }

  return (
    <div className="mt-4 border p-4 rounded bg-gray-100">
      <h3 className="font-bold text-lg text-black">Activos anteriores</h3>
      
      {state.actives.length === 0 ? (
        <p className="text-gray-500">No hay activos registrados.</p>
      ) : (
        <ActiveTable actives={state.actives} />
      )}

      {state.error && (
        <p className="text-red-500 text-sm mt-2">{state.error.message}</p>
      )}
    </div>
  )
}

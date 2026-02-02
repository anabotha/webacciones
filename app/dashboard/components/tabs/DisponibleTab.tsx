'use client'
import { useState } from 'react'
import { useTradingDayContext } from '../../context/TradingDayContext'

/**
 * Disponible tab component.
 * Manages available money (ARS/USD) using TradingDayContext.
 * Self-contained and decoupled from context implementation.
 */
export function DisponibleTab() {
  const { state, actions } = useTradingDayContext()
  const [formState, setFormState] = useState({
    usd: '',
    ars: '',
  })

  const today = new Date()

  const handleInputChange = (field: 'usd' | 'ars') => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormState(prev => ({ ...prev, [field]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formState.usd || !formState.ars) {
      alert('Please fill in all fields')
      return
    }

    try {
      await actions.updateAvailableAmount(Number(formState.ars), Number(formState.usd))
      setFormState({ usd: '', ars: '' })
      alert('Disponible actualizado correctamente!')
    } catch (error) {
      console.error(error)
      alert('Error al actualizar el disponible')
    }
  }

  const hasData = state.tradingDay!=null && (state.tradingDay?.monto_maximo_ars !== null && state.tradingDay?.monto_maximo_usd !== null)
console.log(hasData,state);
  return (
    <div className="flex flex-col items-center justify-center container gap-4 p-10">
      {state.isLoading ? (
        <div className="text-center">Cargando...</div>
      ) : hasData ? (
        <>
          <h1 className="text-lg font-semibold text-white">
            Disponible USD: {String(state.tradingDay?.monto_maximo_usd)}
          </h1>
          <h1 className="text-lg font-semibold text-white">
            Disponible ARS: {String(state.tradingDay?.monto_maximo_ars)}
          </h1>
          <h2 className="text-lg text-gray-200">Mañana deberás volver a ingresar el disponible</h2>
        </>
      ) : (
        <form onSubmit={handleSubmit} className="w-full max-w-sm">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-white">Ingrese el monto disponible para invertir hoy</h3>
            <h4 className="text-sm text-gray-500">
              {String(today.getDate())}/{String(today.getMonth() + 1)}/{String(today.getFullYear())}
            </h4>
          </div>

          <div className="flex flex-col gap-4">
            <div>
              <label htmlFor="availableUSD" className="block text-sm font-medium mb-1 text-white">
                Disponible USD
              </label>
              <input
                type="number"
                id="availableUSD"
                className="bg-black text-white border border-gray-700 p-2 rounded w-full focus:outline-none focus:ring-1 focus:ring-gray-500 placeholder:text-gray-500"
                value={formState.usd}
                onChange={handleInputChange('usd')}
                placeholder="0.00"
                required
              />
            </div>

            <div>
              <label htmlFor="availableARS" className="block text-sm font-medium mb-1 text-white">
                Disponible ARS
              </label>
              <input
                type="number"
                id="availableARS"
                className="bg-black text-white border border-gray-700 p-2 rounded w-full focus:outline-none focus:ring-1 focus:ring-gray-500 placeholder:text-gray-500"
                value={formState.ars}
                onChange={handleInputChange('ars')}
                placeholder="0.00"
                required
              />
            </div>

            <button
              type="submit"
              disabled={state.isLoading}
              className="bg-green-600 text-white px-4 py-2 rounded mt-2 hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {state.isLoading ? 'Guardando...' : 'Actualizar'}
            </button>
          </div>

          {state.error && <p className="text-red-500 text-sm mt-2">{state.error.message}</p>}
        </form>
      )}
    </div>
  )
}

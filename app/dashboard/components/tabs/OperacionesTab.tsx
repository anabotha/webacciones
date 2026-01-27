'use client'
import { useState } from 'react'
import { useActivesContext } from '../../context/ActivesContext'
import { useTradingDayContext } from '../../context/TradingDayContext'
import * as Select from '@radix-ui/react-select'
import { ChevronDown } from 'lucide-react'

interface FormState {
  operacion: string
  activo: string
  tipo_activo: string
  precio: string
  montoBruto: string
  mercado: string
  moneda: string
}

// Constantes
const OPERACIONES = [
  { value: 'BUY', label: 'Compra' },
  { value: 'SELL', label: 'Venta' },
]

const TIPOS_ACTIVO = [
  { value: 'ACCION', label: 'Acción' },
  { value: 'ETF', label: 'ETF' },
  { value: 'LETRAS', label: 'Letras' },
  { value: 'CEDEARS', label: 'Cedears' },

  { value: 'CRYPTO', label: 'Crypto' },
]

const MERCADOS = ['ARGENTINA', 'USA', 'BRASIL', 'JAPON', 'CHINA']

const MONEDAS = [
  { value: 'ARS', label: 'ARS' },
  { value: 'USD', label: 'USD' },
]

/**
 * Operaciones tab component.
 * Consumes state and actions from ActivesContext and TradingDayContext.
 * Decoupled from context implementation details.
 */
export function OperacionesTab() {
  const { state: activesState, actions: activesActions } = useActivesContext()
  const { state: tradingDayState } = useTradingDayContext()
  
  const [form, setForm] = useState<FormState>({
    operacion: '',
    activo: '',
    tipo_activo: '',
    precio: '',
    montoBruto: '',
    mercado: '',
    moneda: 'ARS',
  })

  const today = new Date()
  const isSell = form.operacion === 'SELL'
  const isBuy = form.operacion === 'BUY'
  
  // Activos disponibles para vender (los ya poseídos)
  const activosDisponibles = activesState.actives || []
  
  // Cuando es SELL, obtener los tipos disponibles para el activo seleccionado
  const tiposDisponiblesParaActivo = isSell && form.activo 
    ? Array.from(
        new Set(
          activosDisponibles
            .filter(a => a.activo === form.activo)
            .map(a => a.tipo_activo)
        )
      )
    : []
  
  // Obtener la cantidad disponible del activo seleccionado
  const cantidadDisponible = isSell && form.activo
    ? activosDisponibles.find(a => a.activo === form.activo)?.cantidad_total || 0
    : 0
  
  // Cálculo del máximo dinero a obtener
  const maximoDinero = isSell && form.precio && cantidadDisponible > 0
    ? (parseFloat(form.precio) * cantidadDisponible).toFixed(2)
    : null
  
  // Llenar automáticamente tipo_activo cuando se selecciona un activo en SELL
  const handleActivoChange = (field: keyof FormState) => (value: string) => {
    setForm(prev => {
      const newForm = { ...prev, [field]: value }
      
      if (isSell && field === 'activo') {
        // Obtener el tipo_activo del activo seleccionado
        const activoSeleccionado = activosDisponibles.find(a => a.activo === value)
        if (activoSeleccionado?.tipo_activo) {
          newForm.tipo_activo = activoSeleccionado.tipo_activo
        }
      }
      
      return newForm
    })
  }
  
  // Cálculo de dinero total a vender
//   const montoVenta = isSell && form.precio && cantidadDisponible > 0 
//     ? (parseFloat(form.precio) * parseFloat(form.cantidadDisponible)).toFixed(2)
//     : null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!tradingDayState.tradingDay?.id) {
      alert('Trading day not available')
      return
    }

    const payload = {
      trading_day_id: tradingDayState.tradingDay.id,
      activo: form.activo,
      tipo: form.operacion,
      tipo_activo: form.tipo_activo,
      precio: Number(form.precio),
      moneda: form.moneda || form.mercado || 'ARS',
      source: 'web',
      mercado: form.mercado || 'ARGENTINA',

     montoBruto: Number(form.montoBruto),

    }

    try {
      await activesActions.createActive(payload)
      setForm({
        operacion: '',
        activo: '',
        tipo_activo: '',
        precio: '',
        montoBruto: '',
        mercado: '',
        moneda: 'ARS',
      })
      alert('Operación cargada con éxito!')
    } catch (error) {
      console.error(error)
      alert('Error al guardar la operación')
    }
  }

  const handleSelectChange = (field: keyof FormState) => (value: string) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="text-white">
      <h3 className="text-xl font-bold mb-2">Ingrese los cambios en los activos</h3>
      <h4 className="text-gray-400 mb-6">
        {String(today.getDate())}/{String(today.getMonth() + 1)}/{String(today.getFullYear())}
      </h4>

      {activesState.isLoading ? (
        <div className="text-center py-4">Cargando...</div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-6 py-4">
          {/* Operacion Field */}
          <div>
            <label htmlFor="operacion" className="block text-sm font-medium mb-2">
              Operación
            </label>
            <Select.Root value={form.operacion} onValueChange={handleSelectChange('operacion')}>
              <Select.Trigger className="bg-black text-white border border-gray-700 px-4 py-2 rounded flex items-center justify-between w-full hover:bg-gray-900 transition mt-1">
                <Select.Value placeholder="Seleccionar" />
                <ChevronDown size={16} />
              </Select.Trigger>
              <Select.Content className="bg-black border border-gray-700 rounded text-white z-50">
                <Select.Viewport>
                  {OPERACIONES.map(op => (
                    <Select.Item key={op.value} value={op.value} className="px-4 py-2 cursor-pointer hover:bg-gray-800 outline-none">
                      <Select.ItemText>{op.label}</Select.ItemText>
                    </Select.Item>
                  ))}
                </Select.Viewport>
              </Select.Content>
            </Select.Root>
          </div>

          {/* Activo Field */}
          <div>
            <label htmlFor="activo" className="block text-sm font-medium mb-2">
              {isSell ? 'Activo a Vender' : 'Activo'}
            </label>
            {isSell ? (
              <Select.Root value={form.activo} onValueChange={handleSelectChange('activo')}>
                <Select.Trigger className="bg-black text-white border border-gray-700 px-4 py-2 rounded flex items-center justify-between w-full hover:bg-gray-900 transition mt-1">
                  <Select.Value placeholder="Seleccionar activo poseído" />
                  <ChevronDown size={16} />
                </Select.Trigger>
                <Select.Content className="bg-black border border-gray-700 rounded text-white z-50">
                  <Select.Viewport>
                    {activosDisponibles.length > 0 ? (
                      activosDisponibles.map((activo, idx) => (
                        <Select.Item key={idx} value={activo.activo} className="px-4 py-2 cursor-pointer hover:bg-gray-800 outline-none">
                          <Select.ItemText>
                            {activo.activo} - Cantidad: {activo.cantidad_total || 0}
                          </Select.ItemText>
                        </Select.Item>
                      ))
                    ) : (
                      <div className="px-4 py-2 text-gray-500">No hay activos para vender</div>
                    )}
                  </Select.Viewport>
                </Select.Content>
              </Select.Root>
            ) : (
              <input
                id="activo"
                type="text"
                value={form.activo}
                onChange={e => setForm(prev => ({ ...prev, activo: e.target.value }))}
                className="bg-black text-white border border-gray-700 p-2 rounded w-full focus:outline-none focus:ring-1 focus:ring-gray-500"
                placeholder="Ej: AAPL"
                required
              />
            )}
          </div>

          {/* Tipo Activo Field */}
          <div>
            <label htmlFor="tipo_activo" className="block text-sm font-medium mb-2">
              Tipo de Activo
            </label>
            <Select.Root value={form.tipo_activo} onValueChange={handleSelectChange('tipo_activo')}>
              <Select.Trigger className="bg-black text-white border border-gray-700 px-4 py-2 rounded flex items-center justify-between w-full hover:bg-gray-900 transition mt-1">
                <Select.Value placeholder="Seleccionar" />
                <ChevronDown size={16} />
              </Select.Trigger>
              <Select.Content className="bg-black border border-gray-700 rounded text-white z-50">
                <Select.Viewport>
                  {TIPOS_ACTIVO.map(tipo => (
                    <Select.Item key={tipo.value} value={tipo.value} className="px-4 py-2 cursor-pointer hover:bg-gray-800 outline-none">
                      <Select.ItemText>{tipo.label}</Select.ItemText>
                    </Select.Item>
                  ))}
                </Select.Viewport>
              </Select.Content>
            </Select.Root>
          </div>

          {/* Mercado Field */}
          <div>
            <label htmlFor="mercado" className="block text-sm font-medium mb-2">
              Mercado
            </label>
            <Select.Root value={form.mercado} onValueChange={handleSelectChange('mercado')}>
              <Select.Trigger className="bg-black text-white border border-gray-700 px-4 py-2 rounded flex items-center justify-between w-full hover:bg-gray-900 transition mt-1">
                <Select.Value placeholder="Seleccionar" />
                <ChevronDown size={16} />
              </Select.Trigger>
              <Select.Content className="bg-black border border-gray-700 rounded text-white z-50">
                <Select.Viewport>
                  {MERCADOS.map(m => (
                    <Select.Item key={m} value={m} className="px-4 py-2 cursor-pointer hover:bg-gray-800 outline-none">
                      <Select.ItemText>{m}</Select.ItemText>
                    </Select.Item>
                  ))}
                </Select.Viewport>
              </Select.Content>
            </Select.Root>
          </div>

          {/* Precio Field */}
          <div>
            <label htmlFor="precio" className="block text-sm font-medium mb-2">
              Precio
            </label>
            <input
              id="precio"
              type="number"
              step="0.01"
              value={form.precio}
              onChange={e => setForm(prev => ({ ...prev, precio: e.target.value }))}
              className="bg-black text-white border border-gray-700 p-2 rounded w-full focus:outline-none focus:ring-1 focus:ring-gray-500"
              placeholder="0.00"
              required
            />
            {isSell && maximoDinero && (
              <p className="text-green-400 text-sm mt-2">
                Máximo a recibir: {form.moneda} {Number(maximoDinero).toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ({cantidadDisponible} unidades × {form.moneda} {Number(form.precio).toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })})
              </p>
            )}
          </div>

          {/* Monto/Cantidad Field */}
          <div className="flex gap-4">
            <div className="flex-1">
              <label htmlFor="montoBruto" className="block text-sm font-medium mb-2">
                {isBuy ? 'Monto Invertido' : isSell ? 'Cantidad a Vender' : 'Cantidad'}
              </label>
              <input
                id="montoBruto"
                type="number"
                step="0.01"
                value={form.montoBruto}
                onChange={e => setForm(prev => ({ ...prev, montoBruto: e.target.value }))}
                className="bg-black text-white border border-gray-700 p-2 rounded w-full focus:outline-none focus:ring-1 focus:ring-gray-500"
                placeholder="0.00"
                required
              />
            </div>

            <div className="w-32">
              <label htmlFor="moneda" className="block text-sm font-medium mb-2">
                Moneda
              </label>
              <Select.Root value={form.moneda} onValueChange={handleSelectChange('moneda')}>
                <Select.Trigger className="bg-black text-white border border-gray-700 px-4 py-2 rounded flex items-center justify-between w-full hover:bg-gray-900 transition">
                  <Select.Value placeholder="Seleccionar" />
                  <ChevronDown size={16} />
                </Select.Trigger>
                <Select.Content className="bg-black border border-gray-700 rounded text-white z-50">
                  <Select.Viewport>
                    {MONEDAS.map(moneda => (
                      <Select.Item key={moneda.value} value={moneda.value} className="px-4 py-2 cursor-pointer hover:bg-gray-800 outline-none">
                        <Select.ItemText>{moneda.label}</Select.ItemText>
                      </Select.Item>
                    ))}
                  </Select.Viewport>
                </Select.Content>
              </Select.Root>
            </div>
          </div>

          {/* Dinero total a vender (cálculo automático)
          {isSell && montoVenta && (
            <div className="bg-gray-800 p-4 rounded border border-gray-700">
              <p className="text-gray-400 text-sm">Dinero total a recibir</p>
              <p className="text-white text-xl font-bold">
                ${montoVenta} {form.moneda || 'ARS'}
              </p>
            </div>
          )} */}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={activesState.isLoading}
            className="bg-green-600 text-white px-4 py-2 rounded mt-2 hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {activesState.isLoading ? 'Guardando...' : 'Guardar Operación'}
          </button>

          {activesState.error && (
            <div className="text-red-500 text-sm">{activesState.error.message}</div>
          )}
        </form>
      )}
    </div>
  )
}

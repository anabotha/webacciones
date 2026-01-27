'use client'
import { useState, useEffect } from "react";
import * as Select from "@radix-ui/react-select";
import { ChevronDown } from "lucide-react";

interface activeType {
           operacion: string;
           activo: string;
           tipo_activo: string;
           precio: number;
           montoBruto: number;
           mercado?: string;
           moneda?: string;
           fecha: Date;
} 
export function Actives() {
     const [activeList, setActiveList] = useState<activeType[]>([]);
           const [fecha] = useState(new Date());
           const [tradingDayId, setTradingDayId] = useState<number | null>(null);
           const [form, setForm] = useState({
     operacion: "",
     activo: "",
     tipo_activo: "",
     precio: "",
     montoBruto: "",
     mercado: "",
     moneda: "ARS"
});
const [mercado, setMercado] = useState(["ARGENTINA", "USA", "BRASIL", "JAPON", "CHINA"]);
const [activosDisponibles, setActivosDisponibles] = useState<any[]>([]);
const [cantidadDisponible, setCantidadDisponible] = useState<number>(0);

useEffect(() => {
  const fetchTradingDay = async () => {
    try {
      const res = await fetch("/api/trading-day");
      const data = await res.json();
      if (data?.id) {
        setTradingDayId(data.id);
      }
    } catch (error) {
      console.error("Error obteniendo trading day:", error);
    }
  };
  
  const fetchActivos = async () => {
    try {
      const res = await fetch("/api/actives");
      const data = await res.json();
      if (Array.isArray(data)) {
        setActivosDisponibles(data);
        console.log("Activos disponibles:", data);
      }
    } catch (error) {
      console.error("Error obteniendo activos:", error);
    }
  };
  
  fetchTradingDay();
  fetchActivos();
}, []);

const updateActives = async () => {
     const payload = {
          trading_day_id: tradingDayId,
          activo: form.activo,
          tipo: form.operacion, // BUY | SELL | HOLD
          tipo_activo: form.tipo_activo,
          precio: Number(form.precio),
          moneda: form.moneda || form.mercado || "ARS",
          source: "web",
          mercado: form.mercado,
          ...(form.operacion === "BUY"
               ? { montoBruto: Number(form.montoBruto) }   // BUY → dinero
               : { cantidad: Number(form.montoBruto) }     // SELL → cantidad recibida
          ),
     };}

//           tipo_activo: form.tipo_activo,
//           precio: Number(form.precio),
//           moneda: form.moneda || form.mercado || "ARS",
//           source: "web",
//          // ...existing code...
// mercado: form.mercado,
// ...(form.operacion === "BUY"
//   ? { montoBruto: Number(form.montoBruto) }   // BUY → dinero
//   : { cantidad }),
   
//      };


//      try {
//           const res = await fetch("/api/new-actives", {
//                method: "POST",
//                cache: "no-store",
//                headers: { "Content-Type": "application/json" },
//                body: JSON.stringify(payload),
//           });

//           if (!res.ok) {
//                const err = await res.json().catch(() => ({}));
//                console.error("Error guardando:", err);
//                alert("Error al guardar la operación");
//                return;
//           }

//           const data = await res.json();

//           setActiveList(prev => [
//                ...prev,
//                {
//                     operacion: payload.tipo,
//                     activo: payload.activo,
//                     tipo_activo: payload.tipo_activo,
//                     precio: payload.precio,
//                     montoBruto: payload.montoBruto,
//                     mercado: form.mercado,
//                     moneda: payload.moneda,
//                     fecha: fecha,
//                },
//           ]);

//           // limpiar formulario
//           setForm({ operacion: "", activo: "", tipo_activo: "", precio: "", montoBruto: "", mercado: "", moneda: "ARS" });
// alert("¡Operacion cargada con exito!");
//      } catch (error) {
//           console.error(error);
//           alert("Error en la petición");
//      }

// };
     return (
          <div className="text-white">
               <h3 className="text-xl font-bold mb-2">Ingrese los cambios en los activos</h3>
               <h4 className="text-gray-400 mb-6">{fecha.getDate()}/{fecha.getMonth() + 1}/{fecha.getFullYear()}</h4>
               <div className="flex flex-col gap-6 py-4">
                    <div>
                         <label htmlFor="operacion" className="block text-sm font-medium mb-2">Operacion</label>
                         <Select.Root value={form.operacion} onValueChange={(val) => setForm({...form, operacion: val})}>
                              <Select.Trigger className="bg-black text-white border border-gray-700 px-4 py-2 rounded flex items-center justify-between w-full hover:bg-gray-900 transition mt-1">
                                   <Select.Value placeholder="Seleccionar" />
                                   <ChevronDown size={16} />
                              </Select.Trigger>
                              <Select.Content className="bg-black border border-gray-700 rounded text-white z-50">
                                   <Select.Viewport>
                                        <Select.Item value="BUY" className="px-4 py-2 cursor-pointer hover:bg-gray-800 outline-none">
                                             <Select.ItemText>Compra</Select.ItemText>
                                        </Select.Item>
                                        <Select.Item value="SELL" className="px-4 py-2 cursor-pointer hover:bg-gray-800 outline-none">
                                             <Select.ItemText>Venta</Select.ItemText>
                                        </Select.Item>
                                   </Select.Viewport>
                              </Select.Content>
                         </Select.Root>
                    </div>
                    <div>
                         <label htmlFor="tipo_activo" className="block text-sm font-medium mb-2">Tipo Activo</label>
                         <Select.Root value={form.tipo_activo} onValueChange={(val) => setForm({...form, tipo_activo: val})}>
                              <Select.Trigger className="bg-black text-white border border-gray-700 px-4 py-2 rounded flex items-center justify-between w-full hover:bg-gray-900 transition mt-1">
                                   <Select.Value placeholder="Seleccionar" />
                                   <ChevronDown size={16} />
                              </Select.Trigger>
                              <Select.Content className="bg-black border border-gray-700 rounded text-white z-50">
                                   <Select.Viewport>
                                        <Select.Item value="ACCION" className="px-4 py-2 cursor-pointer hover:bg-gray-800 outline-none"><Select.ItemText>Acciones</Select.ItemText></Select.Item>
                                        <Select.Item value="LETRAS" className="px-4 py-2 cursor-pointer hover:bg-gray-800 outline-none"><Select.ItemText>Letras</Select.ItemText></Select.Item>
                                        <Select.Item value="COMMON_STOCK" className="px-4 py-2 cursor-pointer hover:bg-gray-800 outline-none"><Select.ItemText>Common Stock</Select.ItemText></Select.Item>
                                        <Select.Item value="ETF" className="px-4 py-2 cursor-pointer hover:bg-gray-800 outline-none"><Select.ItemText>ETF</Select.ItemText></Select.Item>
                                        <Select.Item value="BONOS" className="px-4 py-2 cursor-pointer hover:bg-gray-800 outline-none"><Select.ItemText>Bonos</Select.ItemText></Select.Item>
                                        <Select.Item value="CEDEARS" className="px-4 py-2 cursor-pointer hover:bg-gray-800 outline-none"><Select.ItemText>Cedears</Select.ItemText></Select.Item>
                                   </Select.Viewport>
                              </Select.Content>
                         </Select.Root>
                    </div>
                    <div>
                         <label htmlFor="activo" className="block text-sm font-medium mb-2">Activo</label>
                         {form.operacion === "SELL" ? (
                              <Select.Root value={form.activo} onValueChange={(val) => {
                                   setForm({...form, activo: val});
                                   const selected = activosDisponibles.find(a => a.activo === val);
                                   if (selected) {
                                        setCantidadDisponible(Number(selected.cantidad_total));
                                   }
                              }}>
                                   <Select.Trigger className="bg-black text-white border border-gray-700 px-4 py-2 rounded flex items-center justify-between w-full hover:bg-gray-900 transition mt-1">
                                        <Select.Value placeholder="Seleccionar" />
                                        <ChevronDown size={16} />
                                   </Select.Trigger>
                                   <Select.Content className="bg-black border border-gray-700 rounded text-white z-50">
                                        <Select.Viewport>
                                             {activosDisponibles.map((item) => (
                                                  <Select.Item key={`${item.activo}-${item.tipo_activo}-${item.mercado}`} value={item.activo} className="px-4 py-2 cursor-pointer hover:bg-gray-800 outline-none">
                                                       <Select.ItemText>{item.activo} ({item.cantidad_total} unidades)</Select.ItemText>
                                                  </Select.Item>
                                             ))}
                                        </Select.Viewport>
                                   </Select.Content>
                              </Select.Root>
                         ) : (
                              <input 
                                  type="text" 
                                  placeholder="APPL" 
                                  id="activo" 
                                  value={form.activo}
                                  className="bg-black text-white border border-gray-700 p-2 rounded w-full mt-1 focus:outline-none focus:ring-1 focus:ring-gray-500 placeholder:text-gray-500"
                                  onChange={(e)=>setForm({...form, activo: e.target.value})} 
                              />
                         )}
                    </div>
                    <div>
                         <label htmlFor="precio" className="block text-sm font-medium mb-2">Precio</label>
                         <div className="flex flex-row gap-2 mt-1">
                              <input 
                                  type="number" 
                                  placeholder="Precio" 
                                  id="precio" 
                                  value={form.precio}
                                  className="bg-black text-white border border-gray-700 p-2 rounded w-full flex-1 focus:outline-none focus:ring-1 focus:ring-gray-500 placeholder:text-gray-500" 
                                  onChange={(e)=>setForm({...form, precio: e.target.value})} 
                              />
                              <div className="w-32">
                               <Select.Root value={form.moneda} onValueChange={(val) => setForm({...form, moneda: val})}>
                                    <Select.Trigger className="bg-black text-white border border-gray-700 px-4 py-2 rounded flex items-center justify-between w-full h-full hover:bg-gray-900 transition">
                                         <Select.Value />
                                         <ChevronDown size={16} />
                                    </Select.Trigger>
                                    <Select.Content className="bg-black border border-gray-700 rounded text-white z-50">
                                         <Select.Viewport>
                                              <Select.Item value="ARS" className="px-4 py-2 cursor-pointer hover:bg-gray-800 outline-none"><Select.ItemText>ARS</Select.ItemText></Select.Item>
                                              <Select.Item value="USD" className="px-4 py-2 cursor-pointer hover:bg-gray-800 outline-none"><Select.ItemText>USD</Select.ItemText></Select.Item>
                                         </Select.Viewport>
                                    </Select.Content>
                               </Select.Root>
                              </div>
                         </div>
                         {form.operacion === "SELL" && form.precio && cantidadDisponible > 0 && (
                              <p className="text-green-400 text-sm mt-2">
                                   Máximo a recibir: {form.moneda} {(Number(form.precio) * cantidadDisponible).toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                              </p>
                         )}
                    </div>
                    <div>
                         <label htmlFor="cantidad" className="block text-sm font-medium mb-2">{form.operacion === "SELL" ? "Dinero a recibir" : "Cantidad de dinero invertido"}</label>
                         {form.operacion === "SELL" ? (
                              <div>
                                   <input 
                                       type="number" 
                                       placeholder="0" 
                                       id="cantidad" 
                                       value={form.montoBruto}
                                       max={form.precio && cantidadDisponible > 0 ? Number(form.precio) * cantidadDisponible : undefined}
                                       className="bg-black text-white border border-gray-700 p-2 rounded w-full mt-1 focus:outline-none focus:ring-1 focus:ring-gray-500 placeholder:text-gray-500" 
                                       onChange={(e) => {
                                            const valor = Number(e.target.value);
                                            const maximo = form.precio && cantidadDisponible > 0 ? Number(form.precio) * cantidadDisponible : 0;
                                            if (valor <= maximo) {
                                                 setForm({...form, montoBruto: e.target.value});
                                            }
                                       }}
                                   />
                                   {form.precio && cantidadDisponible > 0 && (
                                        <p className="text-blue-400 text-sm mt-2">
                                             Máximo: {form.moneda} {(Number(form.precio) * cantidadDisponible).toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ({cantidadDisponible} unidades × {form.moneda} {Number(form.precio).toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })})
                                        </p>
                                   )}
                                   {form.montoBruto && form.precio && (
                                        <p className="text-green-400 text-sm mt-2 font-semibold">
                                             Venderías: {(Number(form.montoBruto) / Number(form.precio)).toFixed(2)} unidades
                                        </p>
                                   )}
                              </div>
                         ) : (
                              <input 
                                  type="number" 
                                  placeholder="45000" 
                                  id="cantidad" 
                                  value={form.montoBruto}
                                  className="bg-black text-white border border-gray-700 p-2 rounded w-full mt-1 focus:outline-none focus:ring-1 focus:ring-gray-500 placeholder:text-gray-500" 
                                  onChange={(e)=>setForm({...form, montoBruto: e.target.value})} 
                              />
                         )}
                    </div>
                    <div>
                         <label htmlFor="mercado" className="block text-sm font-medium mb-2">Mercado</label>
                         <Select.Root value={form.mercado} onValueChange={(val)=>setForm({...form, mercado: val})}>
                              <Select.Trigger className="bg-black text-white border border-gray-700 px-4 py-2 rounded flex items-center justify-between w-full mt-1 hover:bg-gray-900 transition">
                                   <Select.Value placeholder="Seleccionar" />
                                   <ChevronDown size={16} />
                              </Select.Trigger>
                              <Select.Content className="bg-black border border-gray-700 rounded text-white z-50">
                                   <Select.Viewport>
                                        {mercado.map((c) => (
                                             <Select.Item
                                                  key={c}
                                                  value={c}
                                                  className="px-4 py-2 cursor-pointer hover:bg-gray-800 outline-none"
                                             >
                                                  <Select.ItemText>{c}</Select.ItemText>
                                             </Select.Item>
                                        ))}
                                   </Select.Viewport>
                              </Select.Content>
                         </Select.Root>
                    </div>
                    
                    <button onClick={updateActives} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded mt-6 w-full transition font-medium">Actualizar</button>
               </div>

          </div>
     );
}
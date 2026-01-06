'use client'
import { useState } from "react";
import * as Select from "@radix-ui/react-select";
import { ChevronDown } from "lucide-react";

interface activeType {
           operacion: string;
           activo: string;
           tipo_activo: string;
           precio: number;
           cantidad: number;
           mercado?: string;
           moneda?: string;
           fecha: Date;
} 
export function Actives() {
     const [activeList, setActiveList] = useState<activeType[]>([]);
           const [fecha] = useState(new Date());
           const [form, setForm] = useState({
     operacion: "",
     activo: "",
     tipo_activo: "",
     precio: "",
     cantidad: "",
     mercado: "",
     moneda: "ARS"
});
const [mercado, setMercado] = useState(["ARGENTINA", "USA", "BRASIL", "JAPON", "CHINA"]);

const updateActives = async () => {
     const payload = {
          trading_day_id: 1,
          activo: form.activo,
          tipo: form.operacion, // BUY | SELL | HOLD
          tipo_activo: form.tipo_activo,
          cantidad: Number(form.cantidad),
          precio: Number(form.precio),
          moneda: form.moneda || form.mercado || "ARS",
          source: "web"
     };

     if (!payload.activo || !payload.tipo || !payload.cantidad || !payload.precio || !payload.moneda) {
          alert("Faltan campos requeridos");
          return;
     }

     try {
          const res = await fetch("/api/new-actives", {
               method: "POST",
               cache: "no-store",
               headers: { "Content-Type": "application/json" },
               body: JSON.stringify(payload),
          });

          if (!res.ok) {
               const err = await res.json().catch(() => ({}));
               console.error("Error guardando:", err);
               alert("Error al guardar la operación");
               return;
          }

          const data = await res.json();

          setActiveList(prev => [
               ...prev,
               {
                    operacion: payload.tipo,
                    activo: payload.activo,
                    tipo_activo: payload.tipo_activo,
                    precio: payload.precio,
                    cantidad: payload.cantidad,
                    mercado: form.mercado,
                    moneda: payload.moneda,
                    fecha: fecha,
               },
          ]);

          // limpiar formulario
          setForm({ operacion: "", activo: "", tipo_activo: "", precio: "", cantidad: "", mercado: "", moneda: "ARS" });

     } catch (error) {
          console.error(error);
          alert("Error en la petición");
     }
};

     return (
          <div className="text-white">
               <h3 className="text-xl font-bold mb-2">Ingrese los cambios en los activos</h3>
               <h4 className="text-gray-400 mb-6">{fecha.getDate()}/{fecha.getMonth() + 1}/{fecha.getFullYear()}</h4>
               <div className="flex flex-col gap-6 py-4">
                    <div>
                         <label htmlFor="operacion" className="block text-sm font-medium mb-2">Operacion</label>
                         <Select.Root onValueChange={(val) => setForm({...form, operacion: val})}>
                              <Select.Trigger className="bg-black text-white border border-gray-700 px-4 py-2 rounded flex items-center justify-between w-full hover:bg-gray-900 transition mt-1">
                                   <Select.Value placeholder="Seleccionar" />
                                   <ChevronDown size={16} />
                              </Select.Trigger>
                              <Select.Content className="bg-black border border-gray-700 rounded text-white z-50">
                                   <Select.Viewport>
                                        <Select.Item value="compra" className="px-4 py-2 cursor-pointer hover:bg-gray-800 outline-none">
                                             <Select.ItemText>Compra</Select.ItemText>
                                        </Select.Item>
                                        <Select.Item value="venta" className="px-4 py-2 cursor-pointer hover:bg-gray-800 outline-none">
                                             <Select.ItemText>Venta</Select.ItemText>
                                        </Select.Item>
                                   </Select.Viewport>
                              </Select.Content>
                         </Select.Root>
                    </div>
                    <div>
                         <label htmlFor="tipo_activo" className="block text-sm font-medium mb-2">tipo_activo</label>
                         <Select.Root onValueChange={(val) => setForm({...form, tipo_activo: val})}>
                              <Select.Trigger className="bg-black text-white border border-gray-700 px-4 py-2 rounded flex items-center justify-between w-full hover:bg-gray-900 transition mt-1">
                                   <Select.Value placeholder="Seleccionar" />
                                   <ChevronDown size={16} />
                              </Select.Trigger>
                              <Select.Content className="bg-black border border-gray-700 rounded text-white z-50">
                                   <Select.Viewport>
                                        <Select.Item value="acciones" className="px-4 py-2 cursor-pointer hover:bg-gray-800 outline-none"><Select.ItemText>Acciones</Select.ItemText></Select.Item>
                                        <Select.Item value="etf" className="px-4 py-2 cursor-pointer hover:bg-gray-800 outline-none"><Select.ItemText>ETF</Select.ItemText></Select.Item>
                                        <Select.Item value="bonos" className="px-4 py-2 cursor-pointer hover:bg-gray-800 outline-none"><Select.ItemText>Bonos</Select.ItemText></Select.Item>
                                        <Select.Item value="cedears" className="px-4 py-2 cursor-pointer hover:bg-gray-800 outline-none"><Select.ItemText>Cedears</Select.ItemText></Select.Item>
                                   </Select.Viewport>
                              </Select.Content>
                         </Select.Root>
                    </div>
                    <div>
                         <label htmlFor="activo" className="block text-sm font-medium mb-2">Activo</label>
                         <input 
                             type="text" 
                             placeholder="APPL" 
                             id="activo" 
                             className="bg-black text-white border border-gray-700 p-2 rounded w-full mt-1 focus:outline-none focus:ring-1 focus:ring-gray-500 placeholder:text-gray-500"
                             onChange={(e)=>setForm({...form, activo: e.target.value})} 
                         />
                    </div>
                    <div>
                         <label htmlFor="precio" className="block text-sm font-medium mb-2">Precio</label>
                         <div className="flex flex-row gap-2 mt-1">
                              <input 
                                  type="number" 
                                  placeholder="Precio" 
                                  id="precio" 
                                  className="bg-black text-white border border-gray-700 p-2 rounded w-full flex-1 focus:outline-none focus:ring-1 focus:ring-gray-500 placeholder:text-gray-500" 
                                  onChange={(e)=>setForm({...form, precio: e.target.value})} 
                              />
                              <div className="w-32">
                               <Select.Root defaultValue="ARS" onValueChange={(val) => setForm({...form, moneda: val})}>
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
                    </div>
                    <div>
                         <label htmlFor="cantidad" className="block text-sm font-medium mb-2">Cantidad</label>
                         <input 
                             type="number" 
                             placeholder="Cantidad" 
                             id="cantidad" 
                             className="bg-black text-white border border-gray-700 p-2 rounded w-full mt-1 focus:outline-none focus:ring-1 focus:ring-gray-500 placeholder:text-gray-500" 
                             onChange={(e)=>setForm({...form, cantidad: e.target.value})} 
                         />
                    </div>
                    <div>
                         <label htmlFor="mercado" className="block text-sm font-medium mb-2">Mercado</label>
                         <Select.Root onValueChange={(val)=>setForm({...form, mercado: val})}>
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
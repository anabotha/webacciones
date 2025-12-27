'use client'
import { useEffect, useState } from "react";
import { ActivosViejos } from "./ActivosViejos";

interface activeType {
     operacion: string;
     activo: string;
     tipo_activo: string;
     precio: number;
     cantidad: number;
     mercado: string;
     fecha: Date;
} 
export function Actives() {
     const [activeList, setActiveList] = useState<activeType[]>([]);
     const [fecha, setFecha] = useState(new Date());
     const [actualizar, setActualizar] = useState(false);
     const [form, setForm] = useState({
  operacion: "",
  activo: "",
  tipo_activo: "",
  precio: "",
  cantidad: "",
  mercado: ""
});

     useEffect(() => {
          // updateActives();
          setActualizar(true);
     }, [activeList]);

     const updateActives = () => {
  setActiveList([
    ...activeList,
    {
      ...form,
      precio: Number(form.precio),
      cantidad: Number(form.cantidad),
      fecha: fecha
    },
  ]);

  //aca iria un post a la api del bot
};

     return (
          <div>
               <h3>Ingrese los cambios en los activos</h3>
               <h4>{fecha.getDate()}/{fecha.getMonth() + 1}/{fecha.getFullYear()}</h4>
               <div className="flex flex-col gap-4 py-4">
                    <div>
                         <label htmlFor="operacion" className="block text-sm font-medium mb-1">Operacion</label>
                         <select name="operacion" id="operacion" className="border p-2 rounded w-full" onChange={(e)=>setForm({...form, operacion: e.target.value})}>
                              <option value="compra">Compra</option>
                              <option value="venta">Venta</option>    
                         </select>
                    </div>
                    <div>
                         <label htmlFor="tipo_activo" className="block text-sm font-medium mb-1">tipo_activo</label>
                         <select name="tipo_activo" id="tipo_activo" className="border p-2 rounded w-full" onChange={(e)=>setForm({...form, tipo_activo: e.target.value})}>
                              <option value="acciones">Acciones</option>
                              <option value="etf">ETF</option>
                              <option value="bonos">Bonos</option>
                              <option value="cedears">Cedears</option>
                         </select>
                    </div>
                    <div>
                         <label htmlFor="activo" className="block text-sm font-medium mb-1">Activo</label>
                         <input type="text" placeholder="APPL" id="activo" className="border p-2 rounded w-full"    onChange={(e)=>setForm({...form, activo: e.target.value})} />
                    </div>
                    <div className="flex flex-row gap-2">
                         <label htmlFor="precio" className="block text-sm font-medium mb-1">Precio</label>
                         <input type="number" placeholder="Precio" id="precio" className="border p-2 rounded w-full" onChange={(e)=>setForm({...form, precio: e.target.value})} />
                         <select name="moneda" id="moneda" className="border p-2 rounded w-full">
                              <option value="ARS">ARS</option>
                              <option value="USD">USD</option>
                         </select>
                    </div>
                    <div>
                         <label htmlFor="cantidad" className="block text-sm font-medium mb-1">Cantidad</label>
                         <input type="number" placeholder="Cantidad" id="cantidad" className="border p-2 rounded w-full" onChange={(e)=>setForm({...form, cantidad: e.target.value})} />
                    </div>
                    <div>
                         <label htmlFor="mercado" className="block text-sm font-medium mb-1">Mercado</label>
                         <select name="mercado" id="mercado" className="border p-2 rounded w-full" onChange={(e)=>setForm({...form, mercado: e.target.value})}>
                              <option value="ARGENTINA">ARGENTINA</option>
                              <option value="USA">USA</option>
                              <option value="BRASIL">BRASIL</option>
                              <option value="JAPON">JAPON</option>
                              <option value="CHINA">CHINA</option>
                         </select>
                    </div>
                    
               
               <button onClick={updateActives} className="bg-blue-600 text-white px-4 py-2 rounded mt-4">Actualizar</button>

               </div>

          </div>

     );
}
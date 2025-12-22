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
     useEffect(() => {
          // updateActives();
          setActualizar(true);
     }, [activeList]);

     const updateActives = () => {
          setActiveList([...activeList, {
               operacion: document.getElementById("operacion")?.value,
               activo: document.getElementById("activo")?.value,
               tipo_activo: document.getElementById("tipo_activo")?.value,
               precio: document.getElementById("precio")?.value,
               cantidad: document.getElementById("cantidad")?.value,
               mercado: document.getElementById("mercado")?.value,
               fecha: fecha
          }]);
          
          //aca habria un route para actualizar el monto disponible
          console.log("Payload:", activeList);
     }
     return (
          <div>
               <h3>Ingrese los cambios en los activos</h3>
               <h4>{fecha.getDate()}/{fecha.getMonth() + 1}/{fecha.getFullYear()}</h4>
               <div className="flex flex-col gap-4 py-4">
                    <div>
                         <label htmlFor="operacion" className="block text-sm font-medium mb-1">Operacion</label>
                         <select name="operacion" id="operacion" className="border p-2 rounded w-full">
                              <option value="compra">Compra</option>
                              <option value="venta">Venta</option>
                         </select>
                    </div>
                    <div>
                         <label htmlFor="tipo_activo" className="block text-sm font-medium mb-1">tipo_activo</label>
                         <select name="tipo_activo" id="tipo_activo" className="border p-2 rounded w-full">
                              <option value="acciones">Acciones</option>
                              <option value="etf">ETF</option>
                              <option value="bonos">Bonos</option>
                              <option value="cedears">Cedears</option>
                         </select>
                    </div>
                    <div>
                         <label htmlFor="activo" className="block text-sm font-medium mb-1">Activo</label>
                         <input type="text" placeholder="APPL" id="activo" className="border p-2 rounded w-full" />
                    </div>
                    <div className="flex flex-row gap-2">
                         <label htmlFor="precio" className="block text-sm font-medium mb-1">Precio</label>
                         <input type="number" placeholder="Precio" id="precio" className="border p-2 rounded w-full" />
                         <select name="moneda" id="moneda" className="border p-2 rounded w-full">
                              <option value="ARS">ARS</option>
                              <option value="USD">USD</option>
                         </select>
                    </div>
                    <div>
                         <label htmlFor="cantidad" className="block text-sm font-medium mb-1">Cantidad</label>
                         <input type="number" placeholder="Cantidad" id="cantidad" className="border p-2 rounded w-full" />
                    </div>
                    <div>
                         <label htmlFor="mercado" className="block text-sm font-medium mb-1">Mercado</label>
                         <select name="mercado" id="mercado" className="border p-2 rounded w-full">
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
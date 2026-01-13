'use client'
import React, { useState,useEffect } from 'react';

interface activeType {
     operacion:string;
     activo: string;
     tipo_activo: string;
     costo_promedio: number;
     cantidad_total: number;
     mercado?: string;
     updated_at: Date;
}
export function ActivosViejos({ activeList }: { activeList?: activeType[] }) {
     //conexion a bd para traer los activos viejos
     const [activosViejos, setActivosViejos] = useState(activeList || []);
     const getActivosViejos = async () => {
          //aca habria un route para traer los activos viejos
           try {
               const response = await fetch("/api/actives", {
                    cache: "no-store",
               });

               if (!response.ok) {
                    throw new Error("Error al obtener los activos");
               }

               return await response.json();
          } catch (error) {
               console.error(error);
               return null;
          }
     }
     
    const updateActivosViejos = async () => {
              const activos = await getActivosViejos();
              console.log(activos);
              if (activos) {
                   setActivosViejos(activos);
                   console.log(activosViejos)
              } 
         }
         useEffect(() => {
              updateActivosViejos();
         }, []);
     return (
               <div className="mt-4 border p-4 rounded bg-gray-100">
               <h3 className="font-bold text-lg text-black">Activos anteriores</h3>
               {activosViejos.length === 0 && <p className="text-gray-500">No hay activos registrados.</p>}
               {activosViejos.length > 0 && (
                    <>
                         <div className="block sm:hidden space-y-3 mt-4">
                              {activosViejos.map((activo, index) => (
                                   <div key={index} className="border rounded p-3 bg-white text-black">
                                        <p className="font-semibold">{activo.activo}</p>
                                        <p>Costo: ${activo.costo_promedio}</p>
                                        <p>Cantidad: {activo.cantidad_total}</p>
                                   </div>
                              ))}
                         </div>
                         <div className="hidden sm:block overflow-x-auto mt-4">
                              <table className="min-w-full bg-white border border-gray-200">
                                   <thead className="bg-gray-50 border-b">
                                        <tr>
                                             <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Activo</th>
                                             <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                                             <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Costo Promedio</th>
                                             <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cantidad(UNIDADES)</th>
                                             <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mercado</th>
                                        </tr>
                                   </thead>
                                   <tbody className="divide-y divide-gray-200">
                                        {activosViejos.map((activo, index) => (
                                             <tr key={index} className="text-black">
                                                  <td className="px-4 py-2 whitespace-nowrap text-sm">{activo.activo}</td>
                                                  <td className="px-4 py-2 whitespace-nowrap text-sm">{activo.tipo_activo}</td>
                                                  <td className="px-4 py-2 whitespace-nowrap text-sm">{activo.costo_promedio}</td>
                                                  <td className="px-4 py-2 whitespace-nowrap text-sm">{activo.cantidad_total}</td>
                                                  <td className="px-4 py-2 whitespace-nowrap text-sm">{activo.mercado}</td>
                                             </tr>
                                        ))}
                                   </tbody>
                              </table>
                         </div>
                    </>
               )}
          </div>
     );
}
'use client'
import React, { useState,useEffect } from 'react';

interface activeType {
     operacion:string;
     activo: string;
     tipo_activo: string;
     precio: number;
     cantidad: number;
     mercado: string;
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
               {activosViejos.map((activo, index) => (
                    <div key={index} className="grid grid-cols-5 gap-2 border-b py-2">
                         <p className="font-semibold text-gray-700">{activo.operacion}</p>
                         <p className="text-gray-500">{activo.activo}</p>
                         <p className="text-gray-500">{activo.tipo_activo}</p>
                         <p className="text-gray-500">{activo.precio}</p>   
                         <p className="text-gray-500">{activo.cantidad}</p>
                         <p className="text-gray-500">{activo.mercado}</p>
                    </div>
               ))
          }

          </div>

     );
}
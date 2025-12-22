
import React, { useState } from 'react';

interface activeType {
     operacion:string;
     activo: string;
     tipo_activo: string;
     precio: number;
     cantidad: number;
     mercado: string;
     fecha: Date;
}
export function ActivosViejos({ activeList }: { activeList?: activeType[] }) {
     //conexion a bd para traer los activos viejos
     const [activosViejos, setActivosViejos] = useState(activeList || []);
     const updateActivosViejos = () => {
          //aca habria un route para traer los activos viejos
     }
     console.log(activosViejos);
     return (
          <div className="mt-4 border p-4 rounded bg-gray-100">
               <h3 className="font-bold text-lg text-black">Activos anteriores</h3>
               {activosViejos.length === 0 && <p className="text-gray-500">No hay activos registrados.</p>}
               {activosViejos.map((activo, index) => (
                    <div key={index} className="grid grid-cols-5 gap-2 border-b py-2">
                         <p className="font-semibold">{activo.operacion}</p>
                         <p>{activo.activo}</p>
                         <p>{activo.tipo_activo}</p>
                         <p>{activo.precio}</p>   
                         <p>{activo.cantidad}</p>
                         <p>{activo.mercado}</p>
                         <p>{activo.fecha.toString()}</p>
                    </div>
               ))}
          </div>
     );
}
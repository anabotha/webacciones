'use client'
import { useEffect, useState } from "react";
export function AvailableMoney() {
     const [availableUSD, setAvailableUSD] = useState(0);
     const [availableARS, setAvailableARS] = useState(0);
     const [fecha, setFecha] = useState(new Date())
     // const [day,setDay]=useState([])
     const getDay = async () => {
          try {
               const response = await fetch("/api/trading-day", {
                    cache: "no-store",
               });

               if (!response.ok) {
                    throw new Error("Error al obtener dinero");
               }

               return await response.json();
          } catch (error) {
               console.error(error);
               return null;
          }
     };

     const insertDay = () => {

          //lo deberia mandar a la api
          // const { data: dineroDia, error } = supabase
          //      .from("trading_day")
          //      .insert({
          //           date: new Date().toISOString(),
          //           monto_maximoARS: availableARS,
          //           monto_maximoUSD: availableUSD,
          //           monto_usadoARS: 0,
          //           monto_usadoUSD: 0,
          //      });
          // return Response.json({ dineroDia, error });
     }
     const updateAvailableMoney = async () => {
          const day = await getDay();
          console.log(day);
          if (day) {
               setAvailableARS(day.monto_maximo_ars);
               setAvailableUSD(day.monto_maximo_usd);
          } else {
               insertDay();// lo mandaria a la api     
          }
     }
     useEffect(() => {
          updateAvailableMoney();
     }, []);


     return (

          <div className="flex flex-col items-center justify-center container gap-4 p-10">
               {(availableARS && availableUSD) ? <>
                    <h1 className="text-lg font-semibold">Disponible USD: {availableUSD}</h1>
                    <h1 className="text-lg font-semibold">Disponible ARS: {availableARS}</h1>
                    <h2 className="text-lg text-gray-200">Mañana deberas volver a ingresar el disponible</h2>
               </> :
                    <form id="form">
                         <div>
                              <h3 className="text-lg font-semibold">Ingrese el monto disponible para invertir hoy</h3>
                              <h4 className="text-sm text-gray-500">{fecha.getDate()}/{fecha.getMonth() + 1}/{fecha.getFullYear()}</h4>
                         </div>

                         <div>
                              <label htmlFor="availableUSD" className="block text-sm font-medium mb-1">Disponible USD</label>
                              <input type="number" value={availableUSD} onChange={(e) => setAvailableUSD(e.target.value)} id="availableUSD" className="border p-2 rounded w-full" />
                         </div>

                         <div>
                              <label htmlFor="availableARS" className="block text-sm font-medium mb-1">Disponible ARS</label>
                              <input type="number" value={availableARS} onChange={(e) => setAvailableARS(e.target.value)} id="availableARS" className="border p-2 rounded w-full" />
                         </div>
                         <button onClick={updateAvailableMoney} className="bg-green-600 text-white p-10 px-4 py-2 rounded">Actualizar</button>
                    </form>
               }
          </div>
     );
}
'use client'
import { useEffect, useState } from "react";
export function AvailableMoney() {
     const [availableUSD, setAvailableUSD] = useState(0);
     const [availableARS, setAvailableARS] = useState(0);
     const [ars, setArs] = useState(0)
     const [usd, setUsd] = useState(0)
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

     const insertDay = async () => {
          console.log("insertdar", availableARS, availableUSD)
          const response = await fetch("/api/trading-day", {
               method: "POST",
               cache: "no-store",
               headers: {
                    "Content-Type": "application/json",
               },
               body: JSON.stringify({
                    monto_maximo_ars: availableARS,
                    monto_maximo_usd: availableUSD,
               }),
          });


          return await response.json();
     }
     const updateAvailableMoney = async () => {
          const day = await getDay();
          console.log(day);
          if (day) {
               setAvailableARS(day.monto_maximo_ars);
               setAvailableUSD(day.monto_maximo_usd);
               setArs(day.monto_maximo_ars);
               setUsd(day.monto_maximo_usd);
          } else {
               setAvailableARS(ars);
               setAvailableUSD(usd);
               insertDay();// lo mandaria a la api     
          }
     }
     useEffect(() => {
          updateAvailableMoney();
     }, []);


     return (

          <div className="flex flex-col items-center justify-center container gap-4 p-10">
               {(availableARS >= 0 && availableUSD >= 0) ? <>
                    <h1 className="text-lg font-semibold">Disponible USD: {availableUSD}</h1>
                    <h1 className="text-lg font-semibold">Disponible ARS: {availableARS}</h1>
                    <h2 className="text-lg text-gray-200">Mañana deberas volver a ingresar el disponible</h2>
               </> :
                    <form id="form">
                         <div>
                              <h3 className="text-lg font-semibold">Ingrese el monto disponible para invertir hoy</h3>
                              <h4 className="text-sm text-gray-500">{fecha.getDate()}/{fecha.getMonth() + 1}/{fecha.getFullYear()}</h4>
                         </div>

                         <div className="flex flex-row gap-2 mt-1">
                              <label htmlFor="availableUSD" className="block text-sm font-medium mb-1">Disponible USD</label>
                              <input type="number"
                                   className="bg-black text-white border border-gray-700 p-2 rounded w-full flex-1 focus:outline-none focus:ring-1 focus:ring-gray-500 placeholder:text-gray-500"
                                   value={usd} onChange={(e) => setUsd(e.target.value)} id="availableUSD" />
                         </div>

                         <div className="flex flex-row gap-2 mt-1">
                              <label htmlFor="availableARS" className="block text-sm font-medium mb-1">Disponible ARS</label>
                              <input type="number" value={ars} onChange={(e) => setArs(e.target.value)} id="availableARS" className="bg-black text-white border border-gray-700 p-2 rounded w-full flex-1 focus:outline-none focus:ring-1 focus:ring-gray-500 placeholder:text-gray-500" />
                         </div>
                         <button onClick={updateAvailableMoney} className="bg-green-600 text-white p-10 px-4 py-2 rounded">Actualizar</button>
                    </form>
               }
          </div>
     );
}
'use client'
import { useEffect, useState } from "react";

export function AvailableMoney() {
     const [availableUSD, setAvailableUSD] = useState(0);
     const [availableARS, setAvailableARS] = useState(0);
     const [fecha, setFecha] = useState(new Date())

     const updateAvailableMoney = () => {
          //aca habria un route para actualizar el monto disponible
          console.log("Updated money:", { availableUSD, availableARS });

     }
     useEffect(() => {
          updateAvailableMoney();
          // document.getElementById("form").style.display = "none";
     }, [availableUSD, availableARS]);


     return (

          <div className="flex flex-col items-center justify-center container gap-4 p-10">
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
               {(availableARS && availableUSD) ? <>
                    <h3>Disponible USD: {availableUSD}</h3>
                    <h3>Disponible ARS: {availableARS}</h3>
               </> : null}
          </div>
     );
}
'use client'
import { useEffect, useState } from "react";

export function AvailableMoney() {
     const [availableUSD, setAvailableUSD] = useState(null);
     const [availableARS, setAvailableARS] = useState(null);
     const [loading, setLoading] = useState(true);

     // Form state
     const [arsInput, setArsInput] = useState("");
     const [usdInput, setUsdInput] = useState("");
     const [fecha] = useState(new Date());

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

     const saveDay = async () => {
          try {
               const response = await fetch("/api/trading-day", {
                    method: "POST",
                    cache: "no-store",
                    headers: {
                         "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                         monto_maximo_ars: Number(arsInput),
                         monto_maximo_usd: Number(usdInput),
                    }),
               });

               if (!response.ok) throw new Error("Error al guardar");

               return await response.json();
          } catch (error) {
               console.error(error);
               return null;
          }
     }

     const fetchData = async () => {
          setLoading(true);
          const day = await getDay();
          if (day && day.monto_maximo_ars !== undefined) {
               setAvailableARS(day.monto_maximo_ars);
               setAvailableUSD(day.monto_maximo_usd);
          }
          setLoading(false);
     }

     const handleSave = async (e) => {
          e.preventDefault();
          const result = await saveDay();
          if (result && result.data) {
               setAvailableARS(result.data.monto_maximo_ars);
               setAvailableUSD(result.data.monto_maximo_usd);
          }
     }

     useEffect(() => {
          fetchData();
     }, []);

     if (loading) {
          return <div className="flex justify-center p-10">Cargando...</div>;
     }

     return (
          <div className="flex flex-col items-center justify-center container gap-4 p-10">
               {(availableARS !== null && availableUSD !== null) ? (
                    <>
                         <h1 className="text-lg font-semibold">Disponible USD: {availableUSD}</h1>
                         <h1 className="text-lg font-semibold">Disponible ARS: {availableARS}</h1>
                         <h2 className="text-lg text-gray-200">Mañana deberás volver a ingresar el disponible</h2>
                    </>
               ) : (
                    <form onSubmit={handleSave} className="w-full max-w-sm">
                         <div className="mb-4">
                              <h3 className="text-lg font-semibold">Ingrese el monto disponible para invertir hoy</h3>
                              <h4 className="text-sm text-gray-500">{fecha.getDate()}/{fecha.getMonth() + 1}/{fecha.getFullYear()}</h4>
                         </div>

                         <div className="flex flex-col gap-4">
                              <div>
                                   <label htmlFor="availableUSD" className="block text-sm font-medium mb-1">Disponible USD</label>
                                   <input
                                        type="number"
                                        id="availableUSD"
                                        className="bg-black text-white border border-gray-700 p-2 rounded w-full focus:outline-none focus:ring-1 focus:ring-gray-500 placeholder:text-gray-500"
                                        value={usdInput}
                                        onChange={(e) => setUsdInput(e.target.value)}
                                        required
                                   />
                              </div>

                              <div>
                                   <label htmlFor="availableARS" className="block text-sm font-medium mb-1">Disponible ARS</label>
                                   <input
                                        type="number"
                                        id="availableARS"
                                        className="bg-black text-white border border-gray-700 p-2 rounded w-full focus:outline-none focus:ring-1 focus:ring-gray-500 placeholder:text-gray-500"
                                        value={arsInput}
                                        onChange={(e) => setArsInput(e.target.value)}
                                        required
                                   />
                              </div>

                              <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded mt-2 hover:bg-green-700 transition-colors">
                                   Actualizar
                              </button>
                         </div>
                    </form>
               )}
          </div>
     );
}
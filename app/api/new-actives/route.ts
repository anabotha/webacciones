// import { supabase } from "../../lib/supabase/client";
// import { NextResponse } from "next/server";

// export async function POST(req: Request) {
//   try {
//     const body = await req.json();
//     console.log(body);

//     const {
//       activo,
//       tipo,                // BUY | SELL | HOLD
//       tipo_activo,
//       montoBruto,         // DINERO TOTAL A INVERTIR
//       precio,              // PRECIO UNITARIO
//       moneda,
//       source,
//       mercado
//     } = body;

//     if (
//       !activo ||
//       !tipo ||
//       !montoBruto ||
//       !precio ||
//       !moneda ||
//       !source
//     ) {
//       return NextResponse.json(
//         { error: "Datos incompletos" },
//         { status: 400 }
//       );
//     }

//     const normalizedTipo = tipo.toUpperCase();
//     const montoBrutoNum = Number(montoBruto);
//     const precioUnitario = Number(precio);

//     if (montoBrutoNum <= 0 || precioUnitario <= 0) {
//       return NextResponse.json(
//         { error: "Monto bruto o precio inválido" },
//         { status: 400 }
//       );
//     }

//     // ⚠️ CAMBIO CRÍTICO: enviamos el monto en "cantidad"
// const { data, error } = await supabase
//   .from("operations")
//   .insert({
//     activo,
//     tipo: normalizedTipo,       // BUY | SELL
//     tipo_activo,
//     precio: precioUnitario,     // precio unitario ARS
//     monto_total: montoBrutoNum, // ✅ PLATA TOTAL
//     moneda,
//     source,
//     mercado,
//     fecha: new Date().toISOString()
//   })
//   .select()
//   .single();

   

//     if (error) {
//       return NextResponse.json(
//         { error: error.message },
//         { status: 500 }
//       );
//     }

//     return NextResponse.json({ success: true, data });

//   } catch {
//     return NextResponse.json(
//       { error: "Body inválido" },
//       { status: 400 }
//     );
//   }
// }import { supabase } from "../../lib/supabase/client";
import { supabase } from "../../lib/supabase/client";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("BODY:", body);

    const {
      trading_day_id,
      activo,
      tipo,
      tipo_activo,
      montoBruto,
      precio,
      moneda,
      source,
      mercado
    } = body;

    if (
      !trading_day_id ||
      !activo ||
      !tipo ||
      !montoBruto ||
      !precio ||
      !moneda ||
      !source
    ) {
      return NextResponse.json(
        { error: "Datos incompletos" },
        { status: 400 }
      );
    }

    const normalizedTipo = tipo.toUpperCase();
    const montoBrutoNum = Number(montoBruto);
    const precioUnitario = Number(precio);

    if (
      Number.isNaN(montoBrutoNum) ||
      Number.isNaN(precioUnitario) ||
      montoBrutoNum <= 0 ||
      precioUnitario <= 0
    ) {
      return NextResponse.json(
        { error: "Monto bruto o precio inválido" },
        { status: 400 }
      );
    }

    // ✅ CÁLCULO CORRECTO
    const cantidad = montoBrutoNum / precioUnitario;

    const { data, error } = await supabase
      .from("operations")
      .insert({
        trading_day_id,
        activo,
        tipo: normalizedTipo,
        tipo_activo,
        cantidad,                 // ✅ OBLIGATORIO
        precio: precioUnitario,
        monto_bruto: montoBrutoNum,
        moneda,
        source,
        mercado,
        fecha: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      console.error("SUPABASE ERROR:", error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data });

  } catch (err) {
    console.error("CATCH ERROR:", err);
    return NextResponse.json(
      { error: "Body inválido" },
      { status: 400 }
    );
  }
}

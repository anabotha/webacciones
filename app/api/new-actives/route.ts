// import { supabase } from "../../lib/supabase/client";
// import { NextResponse } from "next/server";

// const DEFAULT_TIPO_ACTIVO = "COMMON_STOCK";

// export async function POST(req: Request) {
//   try {
//     const body = await req.json();

//     const {
//       trading_day_id,
//       activo,
//       tipo,          // BUY | SELL | HOLD
//       tipo_activo,   // ENUM
//       cantidad,
//       precio,
//       moneda,
//       source,
//       mercado
//     } = body;

//     // Validaciones mínimas
//     if (
//       !trading_day_id ||
//       !activo ||
//       !tipo ||
//       !cantidad ||
//       !precio ||
//       !moneda
//     ) {
//       return NextResponse.json(
//         { error: "Datos incompletos" },
//         { status: 400 }
//       );
//     }

//     // Normalizar valores
//     const normalizedTipo = tipo.toUpperCase();
//     const monto = Number(cantidad);
//     const precioUnitario = Number(precio);
//     const unidades = monto / precioUnitario;
// console.log(trading_day_id, activo, normalizedTipo, tipo_activo, cantidad, precio, moneda, source);
//     //  Insert seguro
//     const { data, error } = await supabase
//       .from("operations")
//       .insert({
//         trading_day_id,
//         activo,
//         tipo: normalizedTipo,
//         tipo_activo,
//         monto,
//         unidades,
//         cantidad,
//         ,
//         precio,
//         moneda,
//         source,
//         fecha: new Date().toISOString(),
//         mercado,
//       })
//       .select()
//       .single();

//     if (error) {
//       return NextResponse.json(
//         { error: error.message },
//         { status: 500 }
//       );
//     }

//     return NextResponse.json({ success: true, data });

//   } catch (err) {
//     return NextResponse.json(
//       { error: "Body inválido" },
//       { status: 400 }
//     );
//   }
// }
import { supabase } from "../../lib/supabase/client";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      trading_day_id,
      activo,
      tipo,          // BUY | SELL | HOLD
      tipo_activo,
      cantidad,      // MONTO en dinero (ARS)
      precio,        // precio unitario
      moneda,
      source,
      mercado
    } = body;

    if (
      !trading_day_id ||
      !activo ||
      !tipo ||
      !cantidad ||
      !precio ||
      !moneda
    ) {
      return NextResponse.json(
        { error: "Datos incompletos" },
        { status: 400 }
      );
    }

    const normalizedTipo = tipo.toUpperCase();

    // 🔑 Conversión clave
    const monto = Number(cantidad);
    const precioUnitario = Number(precio);
    const unidades = monto / precioUnitario;

    if (!isFinite(unidades) || unidades <= 0) {
      return NextResponse.json(
        { error: "Monto o precio inválido" },
        { status: 400 }
      );
    }

    console.log({
      trading_day_id,
      activo,
      tipo: normalizedTipo,
      tipo_activo,
      monto,
      precioUnitario,
      unidades,
      moneda,
      mercado
    });

    const { data, error } = await supabase
      .from("operations")
      .insert({
        trading_day_id,
        activo,
        tipo: normalizedTipo,
        tipo_activo,
        cantidad: unidades, // ✅ UNIDADES
        precio: precioUnitario,
        total: monto,       // ✅ DINERO
        moneda,
        source,
        fecha: new Date().toISOString(),
        mercado,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data });

  } catch (err) {
    return NextResponse.json(
      { error: "Body inválido" },
      { status: 400 }
    );
  }
}

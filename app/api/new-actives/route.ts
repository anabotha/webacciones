import { supabase } from "../../lib/supabase/client";
import { NextResponse } from "next/server";

const DEFAULT_TIPO_ACTIVO = "COMMON_STOCK";

const ALLOWED_TIPO_ACTIVO = [
  "ETF",
  "COMMON_STOCK",
  "CEDEAR",
  "ACCION",
  "BONO",
  "LETRAS"
];

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      trading_day_id,
      activo,
      tipo,          // BUY | SELL | HOLD
      tipo_activo,   // ENUM
      cantidad,
      precio,
      moneda,
      source
    } = body;

    // Validaciones mínimas
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

    // Normalizar valores
    const normalizedTipo = tipo.toUpperCase();

//     const resolvedTipoActivo = tipo_activo
//       ? tipo_activo.toUpperCase()
//       : DEFAULT_TIPO_ACTIVO;

//     // Validar ENUM
//     if (!ALLOWED_TIPO_ACTIVO.includes(resolvedTipoActivo)) {
//       return NextResponse.json(
//         { error: "tipo_activo inválido" },
//         { status: 400 }
//       );
//     }
console.log(trading_day_id, activo, normalizedTipo, tipo_activo, cantidad, precio, moneda, source);
    //  Insert seguro
    const { data, error } = await supabase
      .from("operations")
      .insert({
        trading_day_id,
        activo,
        tipo: normalizedTipo,
        tipo_activo,
        cantidad,
        precio,
        moneda,
        source,
        fecha: new Date().toISOString()
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

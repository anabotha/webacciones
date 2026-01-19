import { supabase } from "../../lib/supabase/client";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      trading_day_id,
      activo,
      tipo,                // BUY | SELL | HOLD
      tipo_activo,
      montoBruto,         // DINERO
      precio,              // PRECIO UNITARIO
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

    if (montoBrutoNum <= 0 || precioUnitario <= 0) {
      return NextResponse.json(
        { error: "Monto bruto o precio inválido" },
        { status: 400 }
      );
    }

    const cantidad = montoBrutoNum / precioUnitario;

    if (!isFinite(cantidad) || cantidad <= 0) {
      return NextResponse.json(
        { error: "Cantidad de unidades inválida" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("operations")
      .insert({
        trading_day_id,
        activo,
        tipo: normalizedTipo,
        tipo_activo,
        cantidad,               // ✅ UNIDADES
        precio: precioUnitario, // ✅ UNITARIO
        monto_bruto: montoBrutoNum,
        moneda,
        source,
        mercado,
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

  } catch {
    return NextResponse.json(
      { error: "Body inválido" },
      { status: 400 }
    );
  }
}

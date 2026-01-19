import { supabase } from "../../lib/supabase/client";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      trading_day_id,
      activo,
      tipo,
      tipo_activo,
      monto,          // 🔑 dinero
      precio,
      moneda,
      source,
      mercado
    } = body;

    if (
      !trading_day_id ||
      !activo ||
      !tipo ||
      !monto ||
      !precio ||
      !moneda
    ) {
      return NextResponse.json(
        { error: "Datos incompletos" },
        { status: 400 }
      );
    }

    const normalizedTipo = tipo.toUpperCase();

    const montoNumerico = Number(monto);
    const precioUnitario = Number(precio);

    if (montoNumerico <= 0 || precioUnitario <= 0) {
      return NextResponse.json(
        { error: "Monto o precio inválido" },
        { status: 400 }
      );
    }

    const unidades = montoNumerico / precioUnitario;

    if (!isFinite(unidades) || unidades <= 0) {
      return NextResponse.json(
        { error: "Unidades inválidas" },
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
        cantidad: unidades,      // UNIDADES
        precio: precioUnitario,  // PRECIO UNITARIO
        total: montoNumerico,    // DINERO
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

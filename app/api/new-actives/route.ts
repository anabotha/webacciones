import { supabase } from "../../lib/supabase/client";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const {
      activo,
      tipo,           // BUY | SELL | HOLD
      tipo_activo,    // enum
      cantidad,
      precio,
      moneda,
      source
    } = await req.json();

    if (
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

    const { data, error } = await supabase
      .from("operations")
      .insert({
        activo,
        tipo,
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

  } catch {
    return NextResponse.json(
      { error: "Body inválido" },
      { status: 400 }
    );
  }
}

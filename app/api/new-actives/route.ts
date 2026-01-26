import { supabase } from "../../lib/supabase/client";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log(body);

    const {
      activo,
      tipo,                // BUY | SELL | HOLD
      tipo_activo,
      montoBruto,         // DINERO TOTAL A INVERTIR
      precio,              // PRECIO UNITARIO
      moneda,
      source,
      mercado
    } = body;

    if (
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

    // ⚠️ CAMBIO CRÍTICO: enviamos el monto en "cantidad"
const { data, error } = await supabase
  .from("operations")
  .insert({
    activo,
    tipo: normalizedTipo,       // BUY | SELL
    tipo_activo,
    precio: precioUnitario,     // precio unitario ARS
    monto_total: montoBrutoNum, // ✅ PLATA TOTAL
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
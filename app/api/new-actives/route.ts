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
    // El trigger se encargará de calcular la cantidad real de unidades
    const { data, error } = await supabase
      .from("operations")
      .insert({
        activo,
        tipo: normalizedTipo,
        tipo_activo,
        cantidad: montoBrutoNum,  // ✅ MONTO TOTAL (el trigger calculará las unidades)
        precio: precioUnitario,    // ✅ PRECIO UNITARIO
        moneda,
        source,
        mercado,
        fecha: new Date().toISOString()
        // ❌ NO enviamos monto_bruto, comision, iva, fees, monto_total
        // El trigger los calculará automáticamente
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
import { supabase } from "../../lib/supabase/client";
import { NextResponse } from "next/server";

export async function GET() {

     const { data, error } = await supabase
          .from("positions")
          .select("activo, cantidad_total,costo_promedio, tipo_activo, mercado")
     // .single();

     if (error && error.code !== "PGRST116") {
          return NextResponse.json({ error: error.message }, { status: 500 });
     }

     return NextResponse.json(data ?? null);
}

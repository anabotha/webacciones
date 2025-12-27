import { createSupabaseServerClient } from "@/app/lib/supabase/server";
import { supabase } from "../../lib/supabase/client";
import { NextResponse } from "next/server";

export async function GET() {
     const today = new Date().toISOString().split("T")[0];

     const { data, error } = await supabase
          .from("trading_day")
          .select("*")
          .eq("estado", "ACTIVE")
          .limit(1)
          .single();

     if (error && error.code !== "PGRST116") {
          return NextResponse.json({ error: error.message }, { status: 500 });
     }

     return NextResponse.json(data ?? null);
}

export async function POST(req: Request) {
     try {
          const {
               monto_maximoARS,
               monto_maximoUSD,
          } = await req.json();

          // Validaciones mínimas
          if (!monto_maximoARS || !monto_maximoUSD) {
               return NextResponse.json(
                    { error: "Datos incompletos" },
                    { status: 400 }
               );
          }

          const supabase = await createSupabaseServerClient();

          const { data, error } = await supabase.from("trading_day").insert({
               monto_maximoARS,
               monto_maximoUSD,
               estado: "ACTIVE",
               monto_usadoARS: 0,
               monto_usadoUSD: 0,
               fecha: new Date().toISOString(),
          });

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

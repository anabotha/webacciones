import { createSupabaseServerClient } from "@/app/lib/supabase/server";
import { supabase } from "../../lib/supabase/client";
import { NextResponse } from "next/server";

export async function GET() {
     const today = new Date().toISOString().split("T")[0];

     const { data, error } = await supabase
          .from("trading_day")
          .select("*")
          .eq("fecha", today)
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
               monto_maximo_ars,
               monto_maximo_usd,
          } = await req.json();

          // Validaciones mínimas
          if (monto_maximo_ars === undefined || monto_maximo_usd === undefined) {
               return NextResponse.json(
                    { error: "Datos incompletos" },
                    { status: 400 }
               );
          }
          const { data, error } = await supabase
               .from("trading_day")
               .upsert(
                    {
                         fecha: new Date().toISOString().split("T")[0],
                         monto_maximo_ars: monto_maximo_ars,
                         monto_maximo_usd: monto_maximo_usd,
                         estado: "ACTIVE",
                         monto_usado_ars: 0,
                         monto_usado_usd: 0,
                    },
                    {
                         onConflict: "fecha",
                    }
               )
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
// export async function POST(req: Request) {
//      try {
//           const {
//                monto_maximo_ars,
//                monto_maximo_usd,
//           } = await req.json();

//           // Validaciones mínimas
//           if (monto_maximo_ars === undefined || monto_maximo_usd === undefined) {
//                return NextResponse.json(
//                     { error: "Datos incompletos" },
//                     { status: 400 }
//                );
//           }

//           const supabase = await createSupabaseServerClient();

//           const { data, error } = await supabase.from("trading_day").insert({
//                monto_maximo_ars: Number(monto_maximo_ars),
//                monto_maximo_usd: Number(monto_maximo_usd),
//                estado: "ACTIVE",
//                monto_usado_ars: 0,
//                monto_usado_usd: 0,
//                fecha: new Date().toISOString().split("T")[0],
//           });

//           if (error) {
//                return NextResponse.json(
//                     { error: error.message },
//                     { status: 500 }
//                );
//           }

//           return NextResponse.json({ success: true, data });
//      } catch {
//           return NextResponse.json(
//                { error: "Body inválido" },
//                { status: 400 }
//           );
//      }
// }

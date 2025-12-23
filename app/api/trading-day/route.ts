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

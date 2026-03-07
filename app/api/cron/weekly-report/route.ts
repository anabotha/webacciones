import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

type WeeklyReport = {
  status: string;
  semana_inicio: string;
  semana_fin: string;
  ganancia_realizada: number;
  capital_usado: number;
  rendimiento_pct: number;
  operaciones: number;
  bestTrades: {
    activo: string;
    rendimiento_pct: number;
    capital_invertido: number;
    pnl: number;
  }[];
};

const TELEGRAM_CHAT_IDS = process.env.TELEGRAM_CHAT_ID
  ? process.env.TELEGRAM_CHAT_ID.split(',').map((id: string) => id.trim())
  : [];
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

export async function GET(request: Request) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const p_fin = new Date().toISOString().split("T")[0];
  const date = new Date();
  date.setDate(date.getDate() - 7);
  const p_inicio = date.toISOString().split("T")[0];

  try {
    const { data, error } = await supabase.rpc(
      "generate_weekly_report_range",
      { p_inicio, p_fin }
    );

    if (error) throw error;
    if (!data || data.status !== "success") {
      throw new Error("Weekly report inválido");
    }
    console.log(TELEGRAM_CHAT_IDS, TELEGRAM_BOT_TOKEN)
    await sendTelegramMessage(data as WeeklyReport);

    return NextResponse.json({ success: true, data });
  } catch (err) {
    console.error("Error generando weekly report:", err);
    return new Response("Internal Server Error", { status: 500 });
  }
}

// ─── Build summary text ─────────────────────────────────────────
function buildWeeklySummaryText(report: WeeklyReport): string {
  const {
    semana_inicio,
    semana_fin,
    ganancia_realizada,
    operaciones,
    rendimiento_pct,
    capital_usado,
    bestTrades,
  } = report;

  // --- Resultado semanal
  let resultado: string;
  if (rendimiento_pct >= 5) resultado = "🟢 Muy positivo";
  else if (rendimiento_pct >= 2) resultado = "🟢 Positivo";
  else if (rendimiento_pct > -1) resultado = "🟡 Neutral";
  else resultado = "🔴 Negativo";

  // --- Intensidad operativa
  let actividad: string;
  if (operaciones >= 30) actividad = "alta actividad";
  else if (operaciones >= 15) actividad = "actividad media";
  else actividad = "baja actividad";

  // --- Perfil de riesgo
  let perfilRiesgo: string;
  if (rendimiento_pct >= 5 && operaciones >= 25) {
    perfilRiesgo = "riesgo controlado con alta rotación";
  } else if (rendimiento_pct < 0 && operaciones >= 25) {
    perfilRiesgo = "sobreoperación";
  } else if (rendimiento_pct >= 3 && operaciones < 15) {
    perfilRiesgo = "riesgo conservador";
  } else {
    perfilRiesgo = "riesgo moderado";
  }

  // --- Conclusión estratégica
  let conclusion: string;
  if (rendimiento_pct >= 5) {
    conclusion = "Estrategia efectiva, conviene replicar condiciones similares.";
  } else if (rendimiento_pct >= 2) {
    conclusion = "Buen desempeño, margen para optimizar entradas y timing.";
  } else if (rendimiento_pct < 0) {
    conclusion = "Contexto adverso, conviene reducir riesgo y cantidad de trades.";
  } else {
    conclusion = "Semana lateral, estrategia defensiva adecuada.";
  }

  // --- Best trades section
  let bestTradesText = "";
  if (bestTrades && bestTrades.length > 0) {
    bestTradesText = "\n\n📊 <b>Mejores trades:</b>\n";
    bestTradesText += bestTrades
      .map(
        (t) =>
          `  • <b>${t.activo}</b>: ${t.pnl >= 0 ? "+" : ""}${t.pnl.toFixed(2)} ARS (${t.rendimiento_pct >= 0 ? "+" : ""}${t.rendimiento_pct.toFixed(2)}%)`
      )
      .join("\n");
  }

  return `
📈 <b>Resumen semanal de inversión</b>
━━━━━━━━━━━━━━━━━━━━━

📅 Semana del <b>${semana_inicio}</b> al <b>${semana_fin}</b>

${resultado}
 Ganancia: <b>${ganancia_realizada.toFixed(2)} </b>
 Rendimiento: <b>${rendimiento_pct.toFixed(2)}%</b>
 Operaciones: <b>${operaciones}</b>
 Capital usado: <b>${capital_usado.toFixed(2)} </b>
 Actividad: ${actividad}
 Perfil: ${perfilRiesgo}
${bestTradesText}


`.trim();
}

// ─── Send to Telegram ────────────────────────────────────────────
export const sendTelegramMessage = async (report: WeeklyReport) => {
  if (!TELEGRAM_BOT_TOKEN || TELEGRAM_CHAT_IDS.length === 0) {
    console.error("❌ Configuración incompleta: Falta TELEGRAM_BOT_TOKEN o TELEGRAM_CHAT_ID");
    return;
  }

  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

  const envios = TELEGRAM_CHAT_IDS.map(async (chatId: string) => {
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: buildWeeklySummaryText(report),
          parse_mode: "HTML",
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(`Chat ${chatId} falló: ${errorData.description}`);
      }

      return { chatId, success: true };
    } catch (error) {
      console.error(`Error enviando a ${chatId}:`, error instanceof Error ? error.message : error);
      return { chatId, success: false, error };
    }
  });

  const resultados = await Promise.allSettled(envios);
  return resultados;
};

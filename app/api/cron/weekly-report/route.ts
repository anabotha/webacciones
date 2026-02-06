import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import * as Brevo from '@getbrevo/brevo';
import { alertaInversionTemplate } from "../../../assets/mailTemplate";


type WeeklyReport = {
  semana_inicio: string;      // YYYY-MM-DD
  semana_fin: string;         // YYYY-MM-DD
  ganancia_total: number;
  operaciones: number;
  rendimiento_pct: number;
};
// Instanciar la clase necesaria
const apiInstance = new Brevo.TransactionalEmailsApi();

// Configurar la API Key
apiInstance.setApiKey(
  Brevo.TransactionalEmailsApiApiKeys.apiKey,
  process.env.BREVO_API_KEY!
);

export async function GET(request: Request) {


  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const p_fin = new Date().toISOString().split("T")[0];
  const p_inicio = new Date(
    new Date().setDate(new Date().getDate() - 7)
  ).toISOString().split("T")[0];

  try {
    const { data: report, error } = await supabase.rpc(
      "generate_weekly_report_range",
      { p_inicio, p_fin }
    );

    if (error) throw error;
    if (!report) throw new Error("Weekly report vacío");

    await enviarAlertaInversionMail(report, supabase);

    return NextResponse.json({ success: true, data: report });
  } catch (error) {
    console.error("Error generating weekly report:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}

export async function enviarAlertaInversionMail(
  report: any,
  supabase: any
): Promise<void> {

  /* ---------- NORMALIZACIÓN ---------- */
  const weeklyData: WeeklyReport = {
    semana_inicio: report.semana_inicio,
    semana_fin: report.semana_fin,
    ganancia_total: report.ganancia_total ?? report.ganancia_realizada ?? 0,
    operaciones: report.operaciones ?? 0,
    rendimiento_pct: report.rendimiento_pct ?? 0
  };

  /* ---------- SUMMARY + EMBEDDING ---------- */
  const summaryText = buildWeeklySummaryText(weeklyData);
  // // const embedding = await createEmbedding(summaryText);

  // await supabase.from("weekly_context_embeddings").insert({
  //   weekly_report_id: report.id,
  //   summary_text: summaryText,
  //   embedding: null
  // });

  /* ---------- MAIL ---------- */
  const sendSmtpEmail = new Brevo.SendSmtpEmail();

  sendSmtpEmail.subject = "Resumen semanal de inversión";
  sendSmtpEmail.sender = {
    name: "botinv",
    email: "mauriciobarraa41@gmail.com"
  };

  sendSmtpEmail.to = [
    { email: "josefinabotha@gmail.com", name: "zar de las finanzas" }
  ];

  sendSmtpEmail.htmlContent = alertaInversionTemplate({
    semana_inicio: data.semana_inicio || new Date().toISOString().split('T')[0],
    semana_fin: data.semana_fin || new Date().toISOString().split('T')[0],
    ganancia_realizada: data.ganancia_realizada || 0,
    capital_usado: data.capital_usado || 0,
    rendimiento_pct: data.rendimiento_pct || 0,
    operaciones: data.operaciones || 0,
    bestTrades: data.bestTrades || [],
  });

  try {
    const result = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log("Correo enviado con éxito:", result.body.messageId);
  } catch (error) {
    console.error("Error al enviar correo Brevo:", error);
  }
}



export function buildWeeklySummaryText(report: WeeklyReport): string {
  const {
    semana_inicio,
    semana_fin,
    ganancia_total,
    operaciones,
    rendimiento_pct
  } = report;

  // --- Resultado semanal
  let resultado: string;
  if (rendimiento_pct >= 5) resultado = "muy positivo";
  else if (rendimiento_pct >= 2) resultado = "positivo";
  else if (rendimiento_pct > -1) resultado = "neutral";
  else resultado = "negativo";

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
    conclusion =
      "Estrategia efectiva en este contexto, conviene replicar condiciones similares.";
  } else if (rendimiento_pct >= 2) {
    conclusion =
      "Buen desempeño, existe margen para optimizar entradas y timing.";
  } else if (rendimiento_pct < 0) {
    conclusion =
      "Contexto adverso, conviene reducir riesgo y cantidad de trades.";
  } else {
    conclusion =
      "Semana lateral, estrategia defensiva adecuada.";
  }

  // --- Texto final (esto es lo que se embebe)
  return `
Semana del ${semana_inicio} al ${semana_fin}.
Resultado semanal ${resultado}.
Ganancia total ${ganancia_total.toFixed(2)} ARS.
Rendimiento acumulado ${rendimiento_pct.toFixed(2)}%.
Cantidad de operaciones ${operaciones}.
Nivel de actividad ${actividad}.
Perfil de riesgo ${perfilRiesgo}.
Contexto general: trading intradía con CEDEARs y ETFs.
Conclusión: ${conclusion}
`.trim();
}

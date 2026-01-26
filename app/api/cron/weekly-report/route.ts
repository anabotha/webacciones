import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import * as Brevo from '@getbrevo/brevo';
import { alertaInversionTemplate } from "../../../assets/mailTemplate.js";

// Instanciar la clase necesaria
const apiInstance = new Brevo.TransactionalEmailsApi();

// Configurar la API Key
apiInstance.setApiKey(
  Brevo.TransactionalEmailsApiApiKeys.apiKey,
  process.env.BREVO_API_KEY!
);

export async function GET(request: Request) {
  // 1. Verificación de Seguridad (Vercel Cron)
const authHeader = request.headers.get('authorization');
const expectedToken = `Bearer ${process.env.CRON_SECRET}`;

if (!process.env.CRON_SECRET || authHeader !== expectedToken) {
  return new Response('Unauthorized', { status: 401 });
}

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const p_fin = new Date().toISOString().split('T')[0];
  const p_inicio = new Date(new Date().setDate(new Date().getDate() - 7))
    .toISOString()
    .split('T')[0];

  try {
    // 2. Llamamos a la función de la BD y obtenemos el JSON que devuelve
    const { data: report, error: rpcError } = await supabase.rpc(
      'generate_weekly_report_range',
      {
        p_inicio,
        p_fin,
      }
    );
await enviarAlertaInversionMail(report);
    if (rpcError) throw rpcError;

    return NextResponse.json({ success: true, data: report });
  } catch (error) {
    console.error('Error generating weekly report:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}

export async function enviarAlertaInversionMail(data: any): Promise<void> {
  const sendSmtpEmail = new Brevo.SendSmtpEmail();

  sendSmtpEmail.subject = "Alerta de inversión";
  sendSmtpEmail.sender = {
    name: "botinv",
    email: "mauriciobarraa41@gmail.com",
  };

  sendSmtpEmail.to = [
    { email: "josefinabotha@gmail.com", name: "zar de las finanzas" },
  ];

  sendSmtpEmail.htmlContent = alertaInversionTemplate({
    semana_inicio: data.semana_inicio || new Date().toISOString().split('T')[0],
    semana_fin: data.semana_fin || new Date().toISOString().split('T')[0],
    ganancia_realizada: data.ganancia_realizada || 0,
    capital_usado: data.capital_usado || 0,
    rendimiento_pct: data.rendimiento_pct || 0,
    operaciones: data.operaciones || 0,
  });

  try {
    const result = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log('Correo enviado con éxito. ID:', result.body.messageId);
  } catch (error) {
    console.error('Error al enviar el correo de Brevo:', error);
  }
}
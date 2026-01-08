import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function GET(request: Request) {
  // 1. Verificación de Seguridad (Vercel Cron)
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  try {
    // 2. Llamamos a la función de la BD y obtenemos el JSON que devuelve
    const { data: report, error: rpcError } = await supabase.rpc('generate_weekly_report');

    if (rpcError) throw rpcError;

    // 3. Enviar el Email con los datos recibidos
    const { data: emailData, error: emailError } = await resend.emails.send({
      from: 'Trading Bot <onboarding@resend.dev>', 
      to: ['mauriciobarraa41@gmail.com'],
      subject: `📊 Reporte Semanal: ${report.rendimiento >= 0 ? 'Ganancia' : 'Pérdida'} del ${report.rendimiento.toFixed(2)}%`,
      html: `
        <h1>Resumen Semanal de Trading</h1>
        <p>El mercado ha cerrado y aquí están tus resultados:</p>
        <ul>
          <li><strong>Rendimiento:</strong> ${report.rendimiento.toFixed(2)}%</li>
          <li><strong>Ganancia Total:</strong> $${report.ganancia.toLocaleString()}</li>
          <li><strong>Operaciones realizadas:</strong> ${report.operaciones}</li>
        </ul>
        <hr />
        <p>Reporte generado automáticamente por el sistema.</p>
      `,
    });

    if (emailError) throw emailError;

    return NextResponse.json({ success: true, report, emailData });

  } catch (error: any) {
    console.error('Error en el cron:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
import { createClient } from '@supabase/supabase-js'

export async function POST(req: Request) {
  try {
    const payload = await req.json()

    const { activo, tipo_activo, mercado, precio, moneda } = payload

    if (!activo || !tipo_activo || !mercado || !precio) {
      return new Response(
        JSON.stringify({ error: 'Datos incompletos' }),
        { status: 400 }
      )
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { error } = await supabase.rpc('sell_position_full', {
      p_activo: activo,
      p_tipo_activo: tipo_activo,
      p_moneda: moneda,
      p_mercado: mercado,
      p_precio: Number(precio),
      p_source: 'web',
    })

    if (error) {
      console.error('RPC error:', error)
      return new Response(
        JSON.stringify({ error: error.message }),
        { status: 400 }
      )
    }

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200 }
    )
  } catch (err) {
    console.error('Error vendiendo posición:', err)
    return new Response(
      JSON.stringify({ error: 'Error interno del servidor' }),
      { status: 500 }
    )
  }
}

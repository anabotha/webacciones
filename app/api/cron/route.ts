import { NextResponse } from "next/server";

export async function POST(req: Request) {

  const secret = req.headers.get("x-cron-secret");

  if (secret !== process.env.RENDER_API_KEY) {
    return new Response("Unauthorized", { status: 401 });
  }


  try {
    const base = process.env.NEXT_PUBLIC_BASE_URL || process.env.BASE_URL || 'http://localhost:3000';
    const res = await fetch(`${base}/api/cron/evaluar`, { method: 'GET' 
      });

    return NextResponse.json({ ok: res.ok });
  } catch (error) {
    console.error("Cron error:", error);
    return NextResponse.json(
      { ok: false },
      { status: 500 }
    );
  }
}
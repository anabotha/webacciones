import { NextResponse } from 'next/server';

export async function GET() {
  const res = await fetch(
    // "https://tu-api.onrender.com/api/jobs/evaluar",
    {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.RENDER_API_KEY}`,
        "Content-Type": "application/json"
      }
    }
  );

  return Response.json({ ok: res.ok });
console.log("ana")
}
import { NextRequest, NextResponse } from 'next/server'
 
const BACKEND_URL = process.env.GLOBE_AI_BACKEND_URL ?? "http://localhost:8000"

export async function POST(request: NextRequest) {
  const backendUrl = new URL("/conversations/messages", BACKEND_URL);

  const response = await fetch(backendUrl, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: await request.text(),
  });

  if (!response.body) {
    return NextResponse.json(
      { error: "Backend response did not include a stream." },
      { status: 502 },
    );
  }

  return new Response(response.body, {
    status: response.status,
    headers: {
      "content-type": response.headers.get("content-type") ?? "text/plain",
    },
  });
}
import { NextRequest, NextResponse } from 'next/server'
 
const BACKEND_URL = process.env.GLOBE_AI_BACKEND_URL ?? "http://localhost:8000"

export async function GET(request: NextRequest) {
  const backendUrl = new URL("/describe_location", BACKEND_URL);
  backendUrl.search = request.nextUrl.search;

  const response = await fetch(backendUrl);

  const data = await response.json();

  return NextResponse.json(data, { status: response.status });
}
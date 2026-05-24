import { NextRequest, NextResponse } from 'next/server'
 
const BACKEND_URL = process.env.GLOBE_AI_BACKEND_URL ?? "http://localhost:8000"

export async function GET(request: NextRequest) {
  const backendUrl = new URL("/describe_location", BACKEND_URL);
  backendUrl.search = request.nextUrl.search;

  console.log(backendUrl)

  const response = await fetch(backendUrl);

  console.log(response)

  const data = await response.json();

  console.log(data)

  return NextResponse.json(data, { status: response.status });
}
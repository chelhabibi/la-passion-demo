import { NextResponse } from "next/server";

const BACKEND = process.env.NEXT_PUBLIC_API_URL || "https://backend-production-dc32.up.railway.app";

export async function GET() {
  try {
    const res = await fetch(`${BACKEND}/menu`, { cache: "no-store" });
    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json([], { status: 200 });
  }
}

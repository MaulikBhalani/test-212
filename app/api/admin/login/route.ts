// app/api/admin/login/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  const { password } = await req.json();
  if (password !== process.env.ADMIN_PASSWORD) {
    return new NextResponse("Invalid credentials", { status: 401 });
  }
  const res = NextResponse.json({ ok: true });
  // Set a simple cookie (for dev). In production, set secure and proper flags.
  res.headers.set(
    "Set-Cookie",
    `admin=${process.env.ADMIN_PASSWORD}; Path=/; HttpOnly`
  );
  return res;
}

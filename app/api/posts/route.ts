// app/api/posts/route.ts
import { NextResponse } from "next/server";
import { sql } from "@/app/lib/db";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const limit = Number(url.searchParams.get("limit")) || 10;
  const rows = await sql`
    SELECT id, title, slug, excerpt, is_published, published_at
    FROM posts
    WHERE is_published = true
    ORDER BY published_at DESC NULLS LAST, created_at DESC
    LIMIT ${limit}
  `;
  return NextResponse.json(rows);
}

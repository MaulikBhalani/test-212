// app/api/admin/posts/route.ts
import { NextResponse } from "next/server";
import { sql } from "@/app/lib/db";
import slugify from "slugify";
import { cookies } from "next/headers";

function isAdminReq() {
  // Very simple: check ADMIN_PASSWORD cookie (server-only)
  const cookieStore = cookies();
  const admin = cookieStore.get("admin");
  return admin?.value === process.env.ADMIN_PASSWORD;
}

export async function POST(req: Request) {
  if (!isAdminReq()) return new NextResponse("Unauthorized", { status: 401 });
  const body = await req.json();
  const slug = slugify(body.title || "untitled", { lower: true, strict: true });

  const [row] = await sql`
    INSERT INTO posts (title, slug, excerpt, content, is_published, published_at)
    VALUES (${body.title}, ${slug}, ${body.excerpt}, ${body.content}, ${
    body.is_published ?? false
  }, ${body.published_at ?? null})
    RETURNING *
  `;
  return NextResponse.json(row, { status: 201 });
}

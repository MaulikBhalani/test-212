// app/api/posts/[slug]/route.ts
import { NextResponse } from "next/server";
import { sql } from "@/app/lib/db";

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const [post] = await sql`
    SELECT * FROM posts WHERE slug = ${params.slug} AND is_published = true LIMIT 1
  `;
  if (!post) return new NextResponse("Not found", { status: 404 });
  return NextResponse.json(post);
}

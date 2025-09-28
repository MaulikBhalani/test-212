// app/seed/route.ts
import { NextResponse } from "next/server";
import postgres from "postgres";
import { posts } from "../lib/placeholder-data";

export async function GET() {
  try {
    if (!process.env.POSTGRES_URL) {
      return new NextResponse("POSTGRES_URL not set", { status: 500 });
    }

    const sql = postgres(process.env.POSTGRES_URL, { ssl: "require" });

    // Create tables
    await sql`
      CREATE TABLE IF NOT EXISTS posts (
        id serial PRIMARY KEY,
        title text NOT NULL,
        slug text UNIQUE NOT NULL,
        excerpt text,
        content text NOT NULL,
        is_published boolean DEFAULT false,
        published_at timestamptz,
        created_at timestamptz DEFAULT now(),
        updated_at timestamptz DEFAULT now()
      );
    `;

    // Insert seed posts (safe upsert to avoid duplicates)
    for (const p of posts) {
      const slug = p.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      // Use parameterized query
      await sql`
        INSERT INTO posts (title, slug, excerpt, content, is_published, published_at)
        VALUES (${p.title}, ${slug}, ${p.excerpt}, ${p.content}, ${p.is_published}, ${p.published_at})
        ON CONFLICT (slug) DO UPDATE
        SET title = EXCLUDED.title,
            excerpt = EXCLUDED.excerpt,
            content = EXCLUDED.content,
            is_published = EXCLUDED.is_published,
            published_at = EXCLUDED.published_at,
            updated_at = now();
      `;
    }

    await sql.end(); // close connection
    return new NextResponse("Database seeded successfully");
  } catch (err) {
    console.error(err);
    return new NextResponse("Error seeding DB: " + String(err), {
      status: 500,
    });
  }
}

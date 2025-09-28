import { notFound } from "next/navigation";
import { marked } from "marked";
import createDOMPurify from "dompurify";
import { JSDOM } from "jsdom";

// Initialize DOMPurify for sanitization (keeping the user's setup)
const window = new JSDOM("").window;
const DOMPurify = createDOMPurify(window as any);

/**
 * Fetches a post by slug.
 * IMPORTANT: When calling an internal API from a Next.js Server Component,
 * use a relative path (`/api/...`) to ensure the request is handled internally
 * and does not rely on process.env.NEXT_PUBLIC_SITE_URL being set.
 */
async function getPost(slug: string) {
  // Use relative path for internal API call
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SITE_URL}/api/posts/${slug}`,
    {
      cache: "no-store",
    }
  );

  // Handle network/API errors
  if (!res.ok) {
    console.error(`Error fetching post: ${res.status} ${res.statusText}`);
    return null;
  }

  // Handle 404/not found from the API (optional, but good practice)
  if (res.status === 404) {
    return null;
  }

  return res.json();
}

// Generates metadata for the page
export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = await params;

  const post = await getPost(slug);
  if (!post) return { title: "Not found" };
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: { title: post.title, description: post.excerpt },
  };
}

// Main page component
export default async function PostPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = await params;

  const post = await getPost(slug);
  if (!post) notFound();

  // Convert Markdown to HTML and sanitize it
  const html = DOMPurify.sanitize(marked(post.content));

  return (
    <article className="container mx-auto p-6">
      <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
      <p className="text-sm text-gray-500">
        {new Date(post.published_at).toLocaleString()}
      </p>
      {/* Render the sanitized HTML content */}
      <div className="prose mt-6" dangerouslySetInnerHTML={{ __html: html }} />
    </article>
  );
}

// lib/placeholder-data.ts
export const posts = [
  {
    title: "Welcome to My Blog",
    excerpt: "Short excerpt for welcome post.",
    content: `# Hello\n\nThis is the first blog post. Write markdown here.`,
    is_published: true,
    published_at: new Date().toISOString(),
  },
  {
    title: "Second Post",
    excerpt: "A second post for demonstration.",
    content: `More content in markdown.\n\n- item 1\n- item 2`,
    is_published: true,
    published_at: new Date().toISOString(),
  },
];

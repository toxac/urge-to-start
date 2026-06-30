import { getSortedPostsData, getPostData } from '@/lib/blog';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { notFound } from 'next/navigation';

// 1. This tells Next.js exactly which static paths to generate at build time
export async function generateStaticParams() {
  const posts = getSortedPostsData();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPostData(slug);

  // If the file doesn't exist, safely route to Next.js 404 page
  if (!post) {
    notFound();
  }

  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      {/* Article Header Metadata */}
      <header className="mb-8 border-b pb-6">
        <div className="flex items-center gap-x-2 text-xs font-semibold text-blue-600 uppercase mb-3">
          <span>{post.frontmatter.type}</span>
          <span className="text-gray-300">•</span>
          <span className="text-gray-600">{post.frontmatter.category.replace('-', ' ')}</span>
        </div>
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-4">{post.frontmatter.title}</h1>
        <p className="text-sm text-gray-500">{post.frontmatter.date}</p>
      </header>

      {/* Render parsed Markdown text cleanly into HTML */}
      <article className="prose prose-blue max-w-none">
        <MDXRemote source={post.content} />
      </article>
    </main>
  );
}
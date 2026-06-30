import { getSortedPostsData, PostCategory } from '@/lib/blog';
import Link from 'next/link';
import { notFound } from 'next/navigation';

// Pre-render these category paths at build time
export async function generateStaticParams() {
  const allowedCategories: PostCategory[] = [
    'opportunities', 'market-research', 'monetization', 
    'marketing-and-branding', 'sales', 'finance', 'scaling', 'launch'
  ];
  return allowedCategories.map((cat) => ({
    category: cat,
  }));
}

interface Props {
  params: Promise<{ category: string }>;
}

export default async function BlogCategoryPage({ params }: Props) {
  const { category } = await params;
  const allPosts = getSortedPostsData();
  
  // Filter posts matching this specific category string
  const filteredPosts = allPosts.filter((post) => post.category === category);

  if (filteredPosts.length === 0) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <header className="mb-10 border-b pb-6">
        <Link href="/blog" className="text-sm font-medium text-blue-600 hover:underline">&larr; Back to all notes</Link>
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 mt-2 capitalize">
          Category: {category.replace('-', ' ')}
        </h1>
      </header>

      <div className="grid gap-8 md:grid-cols-2">
        {filteredPosts.map((post) => (
          <article key={post.slug} className="flex flex-col items-start justify-between p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
            <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-3">
              {post.type}
            </span>
            <h2 className="text-2xl font-bold text-gray-900 hover:text-blue-600 tracking-tight">
              <Link href={`/blog/${post.slug}`}>{post.title}</Link>
            </h2>
            <p className="mt-3 text-sm text-gray-600 line-clamp-3">{post.description}</p>
            <div className="mt-6 flex items-center justify-between text-xs text-gray-400 w-full">
              <span>{post.date}</span>
              <Link href={`/blog/${post.slug}`} className="text-sm font-semibold text-blue-600 hover:underline">
                Read entry &rarr;
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
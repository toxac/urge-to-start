import { getSortedPostsData } from '@/lib/blog';
import Link from 'next/link';

export default function BlogListingPage() {
  const allPosts = getSortedPostsData();

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <header className="mb-10 border-b pb-6">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900">The Urge Operator Notes</h1>
        <p className="mt-2 text-lg text-gray-600">Raw, pragmatic guides and insights to beat inertia.</p>
      </header>

      <div className="grid gap-8 md:grid-cols-2">
        {allPosts.map((post) => (
          <article key={post.slug} className="flex flex-col items-start justify-between p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="flex items-center gap-x-2 text-xs font-medium text-blue-600 uppercase tracking-wider mb-3">
              <span>{post.type}</span>
              <span className="text-gray-300">•</span>
              <span className="text-gray-600">{post.category.replace('-', ' ')}</span>
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 hover:text-blue-600 tracking-tight">
              <Link href={`/blog/${post.slug}`}>{post.title}</Link>
            </h2>
            
            <p className="mt-3 text-sm text-gray-600 line-clamp-3">{post.description}</p>
            
            <div className="mt-6 flex items-center text-xs text-gray-400 w-full justify-between">
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
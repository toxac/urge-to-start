import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

// Point directly to your local markdown directory
const postsDirectory = path.join(process.cwd(), 'content/blog');

// Enforce your exact simple custom types
export type PostType = 'guide' | 'insights' | 'trends';

export type PostCategory = 
  | 'opportunities' 
  | 'market-research' 
  | 'monetization' 
  | 'marketing-and-branding' 
  | 'sales' 
  | 'finance' 
  | 'scaling' 
  | 'launch';

export interface PostMetadata {
  slug: string;
  title: string;
  date: string;
  description: string;
  type: PostType;
  category: PostCategory;
  tags?: string[];
}

// 1. Get all posts metadata, perfectly sorted by newest date
export function getSortedPostsData(): PostMetadata[] {
  // Ensure the directory exists so it doesn't crash during build if empty
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(postsDirectory);
  
  const allPostsData = fileNames
    .filter((fileName) => fileName.endsWith('.md'))
    .map((fileName) => {
      const slug = fileName.replace(/\.md$/, '');
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      
      // Parse out frontmatter data metrics
      const { data } = matter(fileContents);

      return {
        slug,
        title: data.title || '',
        date: data.date || '',
        description: data.description || '',
        type: data.type as PostType,
        category: data.category as PostCategory,
        tags: data.tags || [],
      };
    });

  // Sort files from newest to oldest
  return allPostsData.sort((a, b) => (a.date < b.date ? 1 : -1));
}

// 2. Fetch the raw markdown content and data details for a single slug page
export async function getPostData(slug: string) {
  const fullPath = path.join(postsDirectory, `${slug}.md`);
  
  if (!fs.existsSync(fullPath)) {
    return null;
  }

  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);

  return {
    slug,
    frontmatter: {
      title: data.title || '',
      date: data.date || '',
      description: data.description || '',
      type: data.type as PostType,
      category: data.category as PostCategory,
      tags: data.tags || [],
    },
    content, // This raw string string gets consumed directly by <MDXRemote source={content} />
  };
}
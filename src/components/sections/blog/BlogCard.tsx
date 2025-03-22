import { Calendar } from 'lucide-react';
import { BlogPost } from './types';
import { Link } from 'react-router-dom';

interface BlogCardProps {
  post: BlogPost;
  featured?: boolean;
}

export default function BlogCard({ post, featured }: BlogCardProps) {
  const slug = post.title.toLowerCase().replace(/\s+/g, '-');

  return (
    <article className={`bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow ${
      featured ? 'lg:col-span-2 lg:row-span-2' : ''
    }`}>
      <div className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
        <Calendar size={16} />
        <span>{post.date}</span>
        <span className={`px-2 py-1 rounded-full text-xs ${
          post.category === 'Identity' ? 'bg-coral-light' :
          post.category === 'Photography' ? 'bg-sky-light' : 'bg-mint'
        }`}>
          {post.category}
        </span>
      </div>
      <h3 className="text-xl font-semibold mb-3 text-gray-900">{post.title}</h3>
      <p className="text-gray-600">{post.excerpt}</p>
      <Link 
        to={`/blog/${slug}`}
        className="mt-4 inline-block text-sm text-gray-900 hover:text-coral transition-colors"
      >
        Read More →
      </Link>
    </article>
  );
}
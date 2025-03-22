import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Link } from 'react-router-dom';
import { Calendar, ArrowRight } from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  published_at: string;
  slug: string;
}

export default function Blog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data, error } = await supabase
          .from('blog_posts')
          .select('*')
          .eq('published', true)
          .order('published_at', { ascending: false });

        if (error) throw error;
        setPosts(data || []);
      } catch (err) {
        console.error('Error fetching posts:', err);
        setError('Failed to load blog posts');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return (
      <main className="py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-2/4 mb-12"></div>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="h-64 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="py-24">
      <div className="max-w-7xl mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h1 className="text-4xl font-bold mb-6 text-gray-900">Blog</h1>
          <p className="text-lg text-gray-600 leading-relaxed">
            Personal reflections, creative insights, and stories that inspire. Join me on this journey 
            of self-discovery and artistic exploration.
          </p>
        </div>

        {error && (
          <div className="max-w-3xl mx-auto mb-8 p-4 bg-red-50 text-red-700 rounded-lg text-center">
            {error}
          </div>
        )}

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <article 
              key={post.id}
              className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
                <Calendar size={16} />
                <time dateTime={post.published_at}>
                  {new Date(post.published_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </time>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  post.category === 'Identity' ? 'bg-coral-light' :
                  post.category === 'Photography' ? 'bg-sky-light' : 'bg-mint'
                }`}>
                  {post.category || 'General'}
                </span>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">{post.title}</h3>
              <p className="text-gray-600 mb-4">{post.excerpt}</p>
              <Link 
                to={`/blog/${post.slug}`}
                className="inline-flex items-center gap-2 text-sm text-gray-900 hover:text-coral transition-colors group"
              >
                Read More 
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </article>
          ))}
        </div>

        {posts.length === 0 && !error && (
          <div className="text-center text-gray-600">
            No blog posts available yet.
          </div>
        )}
      </div>
    </main>
  );
}
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SEO from '../components/SEO';
import BackButton from '../components/common/BackButton';
import { supabase } from '../lib/supabase';
import { Calendar } from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  content: any;
  excerpt: string;
  category: string;
  published_at: string;
  author_id: string;
}

export default function BlogPost() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('blog_posts')
          .select('*')
          .eq('slug', slug)
          .eq('published', true)
          .single();

        if (error) throw error;
        if (!data) {
          navigate('/');
          return;
        }

        setPost(data);
      } catch (err) {
        console.error('Error fetching post:', err);
        setError('Failed to load blog post');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug, navigate]);

  if (loading) {
    return (
      <main className="py-24">
        <article className="max-w-3xl mx-auto px-4">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          </div>
        </article>
      </main>
    );
  }

  if (error || !post) {
    return (
      <main className="py-24">
        <div className="max-w-3xl mx-auto px-4">
          <BackButton className="mb-8" />
          <div className="p-6 bg-red-50 text-red-700 rounded-lg">
            {error || 'Blog post not found'}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="py-24">
      <SEO 
        title={`${post.title} - Katherine Ayobola Akintade`}
        description={post.excerpt}
        type="article"
        publishedTime={post.published_at}
        keywords={[post.category, 'blog', 'article', 'photography', 'identity']}
      />
      <article className="max-w-3xl mx-auto px-4">
        <BackButton className="mb-8" />
        <h1 className="text-4xl font-bold mb-4 text-gray-900">{post.title}</h1>
        <div className="flex items-center gap-4 mb-8 text-gray-600">
          <div className="flex items-center gap-2">
            <Calendar size={18} />
            <time dateTime={post.published_at}>
              {new Date(post.published_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </time>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm ${
            post.category === 'Identity' ? 'bg-coral-light' :
            post.category === 'Photography' ? 'bg-sky-light' : 'bg-mint'
          }`}>
            {post.category || 'General'}
          </span>
        </div>
        <div className="prose prose-lg max-w-none">
          {post.content.content.map((block: any, index: number) => {
            if (block.type === 'paragraph') {
              return (
                <p key={index} className="mb-4 text-gray-700 leading-relaxed">
                  {block.content?.[0]?.text || ''}
                </p>
              );
            }
            return null;
          })}
        </div>
      </article>
    </main>
  );
}
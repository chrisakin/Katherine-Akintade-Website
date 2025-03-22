import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { blogPosts } from '../components/sections/blog/blog-data';
import BackButton from '../components/common/BackButton';

export default function BlogPost() {
  const { slug } = useParams();
  const navigate = useNavigate();
  
  const post = blogPosts.find(
    post => post.title.toLowerCase().replace(/\s+/g, '-') === slug
  );

  if (!post) {
    React.useEffect(() => {
      navigate('/');
    }, [navigate]);
    return null;
  }

  return (
    <main className="py-24">
      <article className="max-w-3xl mx-auto px-4">
        <BackButton className="mb-8" />
        <h1 className="text-4xl font-bold mb-4 text-gray-900">{post.title}</h1>
        <div className="mb-8 text-gray-600">
          <time>{post.date}</time>
          <span className="mx-2">•</span>
          <span>{post.category}</span>
        </div>
        <div className="prose prose-lg max-w-none">
          {post.content?.split('\n\n').map((paragraph, index) => (
            <p key={index} className="mb-4 text-gray-700 leading-relaxed">
              {paragraph}
            </p>
          ))}
        </div>
      </article>
    </main>
  );
}
import React, { useState, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import { format } from 'date-fns';
import { 
  Bold, 
  Italic, 
  List, 
  ListOrdered, 
  Image as ImageIcon,
  Plus,
  Edit3,
  Trash2,
  Eye,
  Check,
  X
} from 'lucide-react';
import { supabase } from '../../../lib/supabase';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: any;
  excerpt: string;
  category: string;
  published: boolean;
  published_at: string | null;
  created_at: string;
}

const categories = [
  'Identity',
  'Photography',
  'Lifestyle',
  'Creativity',
  'Personal Growth',
  'General'
];

export default function Blog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentPost, setCurrentPost] = useState<Partial<BlogPost>>({});
  const [error, setError] = useState('');

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full rounded-lg',
        },
      }),
    ],
    content: currentPost.content,
    onUpdate: ({ editor }) => {
      setCurrentPost(prev => ({
        ...prev,
        content: editor.getJSON()
      }));
    },
  });

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    if (editor && currentPost.content) {
      editor.commands.setContent(currentPost.content);
    }
  }, [currentPost.content, editor]);

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (err) {
      console.error('Error fetching posts:', err);
      setError('Failed to load posts');
    }
  };

  const handleSave = async () => {
    try {
      if (!currentPost.title || !editor?.getJSON()) {
        setError('Title and content are required');
        return;
      }

      if (!currentPost.category) {
        setError('Category is required');
        return;
      }

      const slug = currentPost.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      const postData = {
        title: currentPost.title,
        slug,
        content: editor.getJSON(),
        excerpt: currentPost.excerpt,
        category: currentPost.category,
        published: currentPost.published || false,
        published_at: currentPost.published ? new Date().toISOString() : null,
      };

      if (currentPost.id) {
        const { error } = await supabase
          .from('blog_posts')
          .update(postData)
          .eq('id', currentPost.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('blog_posts')
          .insert([postData]);

        if (error) throw error;
      }

      setIsEditing(false);
      setCurrentPost({});
      fetchPosts();
    } catch (err) {
      console.error('Error saving post:', err);
      setError('Failed to save post');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return;

    try {
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchPosts();
    } catch (err) {
      console.error('Error deleting post:', err);
      setError('Failed to delete post');
    }
  };

  const addImage = () => {
    const url = prompt('Enter image URL:');
    if (url) {
      editor?.chain().focus().setImage({ src: url }).run();
    }
  };

  if (!isEditing) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Blog Posts</h1>
          <button
            onClick={() => {
              setCurrentPost({});
              setIsEditing(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg 
              hover:bg-gray-800 transition-colors"
          >
            <Plus size={20} />
            New Post
          </button>
        </div>

        {error && (
          <div className="p-4 bg-red-50 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <div className="grid gap-6">
          {posts.map((post) => (
            <div
              key={post.id}
              className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {post.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-sm text-gray-500">
                      {format(new Date(post.created_at), 'MMM d, yyyy')}
                    </p>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      post.category === 'Identity' ? 'bg-coral-light' :
                      post.category === 'Photography' ? 'bg-sky-light' : 'bg-mint'
                    }`}>
                      {post.category || 'General'}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setCurrentPost(post);
                      setIsEditing(true);
                    }}
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <Edit3 size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(post.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              <p className="text-gray-600 mb-4">{post.excerpt}</p>
              <div className="flex items-center gap-2 text-sm">
                <span className={`px-2 py-1 rounded-full ${
                  post.published 
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-700'
                }`}>
                  {post.published ? 'Published' : 'Draft'}
                </span>
                {post.published_at && (
                  <span className="text-gray-500">
                    Published on {format(new Date(post.published_at), 'MMM d, yyyy')}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">
          {currentPost.id ? 'Edit Post' : 'New Post'}
        </h1>
        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              setIsEditing(false);
              setCurrentPost({});
            }}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 
              rounded-lg hover:bg-gray-50 transition-colors"
          >
            <X size={20} />
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white 
              rounded-lg hover:bg-gray-800 transition-colors"
          >
            <Check size={20} />
            Save
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Title
          </label>
          <input
            type="text"
            value={currentPost.title || ''}
            onChange={(e) => setCurrentPost(prev => ({ ...prev, title: e.target.value }))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none 
              focus:ring-2 focus:ring-gray-400 focus:border-transparent"
            placeholder="Enter post title"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <select
            value={currentPost.category || ''}
            onChange={(e) => setCurrentPost(prev => ({ ...prev, category: e.target.value }))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none 
              focus:ring-2 focus:ring-gray-400 focus:border-transparent"
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Excerpt
          </label>
          <textarea
            value={currentPost.excerpt || ''}
            onChange={(e) => setCurrentPost(prev => ({ ...prev, excerpt: e.target.value }))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none 
              focus:ring-2 focus:ring-gray-400 focus:border-transparent"
            rows={3}
            placeholder="Enter post excerpt"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Content
          </label>
          <div className="border border-gray-300 rounded-lg overflow-hidden">
            <div className="flex items-center gap-2 p-2 border-b border-gray-300 bg-gray-50">
              <button
                onClick={() => editor?.chain().focus().toggleBold().run()}
                className={`p-2 rounded hover:bg-gray-200 transition-colors ${
                  editor?.isActive('bold') ? 'bg-gray-200' : ''
                }`}
              >
                <Bold size={18} />
              </button>
              <button
                onClick={() => editor?.chain().focus().toggleItalic().run()}
                className={`p-2 rounded hover:bg-gray-200 transition-colors ${
                  editor?.isActive('italic') ? 'bg-gray-200' : ''
                }`}
              >
                <Italic size={18} />
              </button>
              <button
                onClick={() => editor?.chain().focus().toggleBulletList().run()}
                className={`p-2 rounded hover:bg-gray-200 transition-colors ${
                  editor?.isActive('bulletList') ? 'bg-gray-200' : ''
                }`}
              >
                <List size={18} />
              </button>
              <button
                onClick={() => editor?.chain().focus().toggleOrderedList().run()}
                className={`p-2 rounded hover:bg-gray-200 transition-colors ${
                  editor?.isActive('orderedList') ? 'bg-gray-200' : ''
                }`}
              >
                <ListOrdered size={18} />
              </button>
              <button
                onClick={addImage}
                className="p-2 rounded hover:bg-gray-200 transition-colors"
              >
                <ImageIcon size={18} />
              </button>
            </div>
            <EditorContent 
              editor={editor} 
              className="prose max-w-none p-4 min-h-[400px] focus:outline-none"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="published"
            checked={currentPost.published || false}
            onChange={(e) => setCurrentPost(prev => ({ ...prev, published: e.target.checked }))}
            className="rounded border-gray-300 text-gray-900 focus:ring-gray-400"
          />
          <label htmlFor="published" className="text-sm text-gray-700">
            Publish post
          </label>
        </div>
      </div>
    </div>
  );
}
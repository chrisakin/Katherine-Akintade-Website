import React, { useState, useEffect } from 'react';
import { Plus, Edit3, Trash2, AlertCircle, Upload, X, Check } from 'lucide-react';
import { supabase, STORAGE_BUCKET } from '../../../lib/supabase';

interface Podcast {
  id: string;
  title: string;
  description: string;
  guest: string;
  type: 'audio' | 'video';
  media_url: string;
  thumbnail_url: string | null;
  duration: string;
  active: boolean;
  created_at: string;
}

const ACCEPTED_MEDIA_TYPES = {
  audio: ['audio/mpeg', 'audio/mp3', 'audio/wav'],
  video: ['video/mp4', 'video/webm']
};

const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export default function Podcast() {
  const [podcasts, setPodcasts] = useState<Podcast[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentPodcast, setCurrentPodcast] = useState<Partial<Podcast>>({});
  const [selectedMedia, setSelectedMedia] = useState<File | null>(null);
  const [selectedThumbnail, setSelectedThumbnail] = useState<File | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [playing, setPlaying] = useState<string | null>(null);
console.log(playing)
  useEffect(() => {
    fetchPodcasts();
  }, []);

  const fetchPodcasts = async () => {
    try {
      const { data, error } = await supabase
        .from('podcasts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPodcasts(data || []);
    } catch (err) {
      console.error('Error fetching podcasts:', err);
      setError('Failed to load podcasts');
    }
  };

  const handleMediaSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const type = file.type.startsWith('audio/') ? 'audio' : 'video';
    const acceptedTypes = ACCEPTED_MEDIA_TYPES[type];

    if (!acceptedTypes.includes(file.type)) {
      setError(`Please select a valid ${type} file`);
      return;
    }

    setSelectedMedia(file);
    setCurrentPodcast(prev => ({ ...prev, type }));
    setError('');
  };

  const handleThumbnailSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      setError('Please select a valid image file (JPEG, PNG, or WebP)');
      return;
    }

    setSelectedThumbnail(file);
    setError('');
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      setError('');

      if (!currentPodcast.title || !currentPodcast.type) {
        setError('Title and media type are required');
        return;
      }

      let mediaUrl = currentPodcast.media_url;
      let thumbnailUrl = currentPodcast.thumbnail_url;

      if (selectedMedia) {
        const fileExt = selectedMedia.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const filePath = `podcasts/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from(STORAGE_BUCKET)
          .upload(filePath, selectedMedia);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from(STORAGE_BUCKET)
          .getPublicUrl(filePath);

        mediaUrl = publicUrl;
      }

      if (selectedThumbnail) {
        const fileExt = selectedThumbnail.name.split('.').pop();
        const fileName = `${Date.now()}_thumb.${fileExt}`;
        const filePath = `podcasts/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from(STORAGE_BUCKET)
          .upload(filePath, selectedThumbnail);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from(STORAGE_BUCKET)
          .getPublicUrl(filePath);

        thumbnailUrl = publicUrl;
      }

      const podcastData = {
        title: currentPodcast.title,
        description: currentPodcast.description,
        guest: currentPodcast.guest,
        type: currentPodcast.type,
        media_url: mediaUrl,
        thumbnail_url: thumbnailUrl,
        duration: currentPodcast.duration,
        active: currentPodcast.active ?? true
      };

      if (currentPodcast.id) {
        const { error } = await supabase
          .from('podcasts')
          .update(podcastData)
          .eq('id', currentPodcast.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('podcasts')
          .insert([podcastData]);

        if (error) throw error;
      }

      setIsEditing(false);
      setCurrentPodcast({});
      setSelectedMedia(null);
      setSelectedThumbnail(null);
      fetchPodcasts();
    } catch (err) {
      console.error('Error saving podcast:', err);
      setError('Failed to save podcast');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this podcast?')) return;

    try {
      const { error } = await supabase
        .from('podcasts')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchPodcasts();
    } catch (err) {
      console.error('Error deleting podcast:', err);
      setError('Failed to delete podcast');
    }
  };

  // const togglePlay = (id: string) => {
  //   setPlaying(playing === id ? null : id);
  // };

  if (!isEditing) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Podcasts</h1>
          <button
            onClick={() => {
              setCurrentPodcast({});
              setIsEditing(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg 
              hover:bg-gray-800 transition-colors"
          >
            <Plus size={20} />
            New Podcast
          </button>
        </div>

        {error && (
          <div className="p-4 bg-red-50 text-red-700 rounded-lg flex items-center gap-2">
            <AlertCircle size={20} />
            {error}
          </div>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {podcasts.map((podcast) => (
            <div
              key={podcast.id}
              className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{podcast.title}</h3>
                    {podcast.guest && (
                      <p className="text-gray-600">with {podcast.guest}</p>
                    )}
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    podcast.type === 'audio' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {podcast.type}
                  </span>
                </div>

                {podcast.description && (
                  <p className="text-gray-600 mb-4">{podcast.description}</p>
                )}

                <div className="flex items-center gap-4 mb-4">
                  {podcast.type === 'audio' ? (
                    <audio
                      src={podcast.media_url}
                      controls
                      className="w-full"
                      onPlay={() => setPlaying(podcast.id)}
                      onPause={() => setPlaying(null)}
                    />
                  ) : (
                    <video
                      src={podcast.media_url}
                      controls
                      poster={podcast.thumbnail_url || undefined}
                      className="w-full rounded-lg"
                    />
                  )}
                </div>

                <div className="flex justify-between items-center">
                  <span className={`px-2 py-1 rounded-full text-sm ${
                    podcast.active 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    {podcast.active ? 'Active' : 'Inactive'}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setCurrentPodcast(podcast);
                        setIsEditing(true);
                      }}
                      className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <Edit3 size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(podcast.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
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
          {currentPodcast.id ? 'Edit Podcast' : 'New Podcast'}
        </h1>
        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              setIsEditing(false);
              setCurrentPodcast({});
              setSelectedMedia(null);
              setSelectedThumbnail(null);
            }}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 
              rounded-lg hover:bg-gray-50 transition-colors"
          >
            <X size={20} />
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white 
              rounded-lg hover:bg-gray-800 transition-colors disabled:bg-gray-400"
          >
            <Check size={20} />
            {loading ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-700 rounded-lg flex items-center gap-2">
          <AlertCircle size={20} />
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              value={currentPodcast.title || ''}
              onChange={(e) => setCurrentPodcast(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none 
                focus:ring-2 focus:ring-gray-400 focus:border-transparent"
              placeholder="Podcast title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Guest
            </label>
            <input
              type="text"
              value={currentPodcast.guest || ''}
              onChange={(e) => setCurrentPodcast(prev => ({ ...prev, guest: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none 
                focus:ring-2 focus:ring-gray-400 focus:border-transparent"
              placeholder="Guest name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Duration
            </label>
            <input
              type="text"
              value={currentPodcast.duration || ''}
              onChange={(e) => setCurrentPodcast(prev => ({ ...prev, duration: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none 
                focus:ring-2 focus:ring-gray-400 focus:border-transparent"
              placeholder="e.g., 45:30"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={currentPodcast.description || ''}
              onChange={(e) => setCurrentPodcast(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none 
                focus:ring-2 focus:ring-gray-400 focus:border-transparent"
              rows={4}
              placeholder="Episode description"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="active"
              checked={currentPodcast.active ?? true}
              onChange={(e) => setCurrentPodcast(prev => ({ ...prev, active: e.target.checked }))}
              className="rounded border-gray-300 text-gray-900 focus:ring-gray-400"
            />
            <label htmlFor="active" className="text-sm text-gray-700">
              Podcast is active
            </label>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Media File (Audio or Video)
            </label>
            <div className="mt-2">
              {selectedMedia && (
                <div className="mb-4">
                  {currentPodcast.type === 'audio' ? (
                    <audio src={URL.createObjectURL(selectedMedia)} controls className="w-full" />
                  ) : (
                    <video 
                      src={URL.createObjectURL(selectedMedia)} 
                      controls 
                      className="w-full rounded-lg"
                    />
                  )}
                </div>
              )}
              <div className="relative">
                <input
                  type="file"
                  id="media-upload"
                  className="hidden"
                  accept={[...ACCEPTED_MEDIA_TYPES.audio, ...ACCEPTED_MEDIA_TYPES.video].join(',')}
                  onChange={handleMediaSelect}
                />
                <label
                  htmlFor="media-upload"
                  className="flex items-center justify-center gap-2 px-4 py-2 border-2 
                    border-dashed border-gray-300 rounded-lg hover:border-gray-400 
                    transition-colors cursor-pointer"
                >
                  <Upload size={20} />
                  <span>{selectedMedia ? 'Change Media' : 'Upload Media'}</span>
                </label>
              </div>
              <p className="mt-2 text-sm text-gray-500">
                Accepted formats: MP3, WAV (audio) or MP4, WebM (video)
              </p>
            </div>
          </div>

          {currentPodcast.type === 'video' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Thumbnail Image
              </label>
              <div className="mt-2">
                {(selectedThumbnail || currentPodcast.thumbnail_url) && (
                  <div className="mb-4">
                    <img
                      src={selectedThumbnail ? URL.createObjectURL(selectedThumbnail) : currentPodcast.thumbnail_url!}
                      alt="Thumbnail"
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  </div>
                )}
                <div className="relative">
                  <input
                    type="file"
                    id="thumbnail-upload"
                    className="hidden"
                    accept={ACCEPTED_IMAGE_TYPES.join(',')}
                    onChange={handleThumbnailSelect}
                  />
                  <label
                    htmlFor="thumbnail-upload"
                    className="flex items-center justify-center gap-2 px-4 py-2 border-2 
                      border-dashed border-gray-300 rounded-lg hover:border-gray-400 
                      transition-colors cursor-pointer"
                  >
                    <Upload size={20} />
                    <span>{selectedThumbnail ? 'Change Thumbnail' : 'Upload Thumbnail'}</span>
                  </label>
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  Accepted formats: JPEG, PNG, WebP
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
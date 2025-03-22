import  { useEffect, useState } from 'react';
import { Clock, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

interface PodcastEpisode {
  id: string;
  title: string;
  description: string;
  guest: string;
  type: 'audio' | 'video';
  media_url: string;
  thumbnail_url: string | null;
  duration: string;
}

export default function Podcast() {
  const [episodes, setEpisodes] = useState<PodcastEpisode[]>([]);
  const [loading, setLoading] = useState(true);
  const [playing, setPlaying] = useState<string | null>(null);

  useEffect(() => {
    const fetchEpisodes = async () => {
      try {
        const { data, error } = await supabase
          .from('podcasts')
          .select('*')
          .eq('active', true)
          .order('created_at', { ascending: false })
          .limit(3);

        if (error) throw error;
        setEpisodes(data || []);
      } catch (err) {
        console.error('Error fetching episodes:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEpisodes();
  }, []);

  if (loading) {
    return (
      <section id="podcast" className="py-16 bg-mint-light">
        <div className="max-w-7xl mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-2/4 mb-12"></div>
            <div className="space-y-6">
              {[1, 2].map((n) => (
                <div key={n} className="bg-white rounded-lg p-6">
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (episodes.length === 0) {
    return (
      <section id="podcast" className="py-16 bg-mint-light">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-gray-900">Podcast</h2>
          <p className="text-gray-600 mb-12">
            No episodes available at the moment. Check back soon!
          </p>
        </div>
      </section>
    );
  }

  return (
    <section id="podcast" className="py-16 bg-mint-light">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 text-gray-900">Podcast</h2>
        <p className="text-gray-600 mb-12 max-w-2xl">
          Conversations with artists, creators, and innovators about their craft, 
          process, and vision.
        </p>
        <div className="space-y-6 grid md:grid-cols-2 lg:grid-cols-3">
          {episodes.map((episode) => (
            <div 
              key={episode.id}
              className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">{episode.title}</h3>
                      <p className="text-gray-600">with {episode.guest}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      episode.type === 'audio' 
                        ? 'bg-purple-100 text-purple-700' 
                        : 'bg-blue-100 text-blue-700'
                    }`}>
                      {episode.type}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-4">{episode.description}</p>
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock size={16} className="mr-2" />
                    <span>{episode.duration}</span>
                  </div>
                </div>
                <div>
                  {episode.type === 'audio' ? (
                    <audio
                      src={episode.media_url}
                      controls
                      className="w-full"
                      onPlay={() => setPlaying(episode.id)}
                      onPause={() => setPlaying(null)}
                    />
                  ) : (
                    <video
                      src={episode.media_url}
                      controls
                      poster={episode.thumbnail_url || undefined}
                      className="w-full rounded-lg"
                    />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-12">
          <Link 
            to="/podcast"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-lg 
              hover:bg-gray-800 transition-colors"
          >
            View All Episodes
            <ArrowRight size={20} />
          </Link>
        </div>
      </div>
    </section>
  );
}
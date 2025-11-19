import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useUser } from '../contexts/UserContext'
import { youtubeAPI } from '../services/api'
import SEO from '../components/SEO'

const YOUTUBE_CHANNEL_URL = 'https://www.youtube.com/@munenegeoffrey'

function Learn() {
  const navigate = useNavigate()
  const location = useLocation()
  const { isAuthenticated, loading: userLoading, user } = useUser()
  const [videos, setVideos] = useState([])
  const [playlists, setPlaylists] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Redirect authenticated users to /user/learn for user-specific content
  useEffect(() => {
    if (!userLoading && isAuthenticated && location.pathname === '/learn') {
      navigate('/user/learn', { replace: true })
    }
  }, [isAuthenticated, userLoading, navigate, location.pathname])

  useEffect(() => {
    fetchVideos()
  }, [])

  const fetchVideos = async () => {
    try {
      setLoading(true)
      const videosResponse = await youtubeAPI.getVideos(YOUTUBE_CHANNEL_URL, 12)

      if (videosResponse.success && videosResponse.data.length > 0) {
        setVideos(videosResponse.data)
      } else {
        // If no videos from API, use channel URL for embedding
        setVideos([])
      }

      // Try to fetch playlists
      try {
        const playlistsResponse = await youtubeAPI.getPlaylists(YOUTUBE_CHANNEL_URL)
        if (playlistsResponse.success && playlistsResponse.data.length > 0) {
          setPlaylists(playlistsResponse.data)
        }
      } catch (err) {
        console.log('Playlists not available')
      }

      setError('')
    } catch (err) {
      console.error('Error fetching videos:', err)
      setError('Unable to load videos. Please check back later.')
    } finally {
      setLoading(false)
    }
  }

  // Featured videos
  const featuredVideos = [
    {
      id: '4zb7_9H7s9o',
      title: 'How to create and verify Airtm Account in 2023!',
      description: 'Step-by-step guide to creating and verifying your Airtm account for remote work payments.',
      videoUrl: 'https://www.youtube.com/embed/4zb7_9H7s9o',
    },
    {
      id: '1A6uW4ji7_s',
      title: 'How to Apply For Whatcom | Search Engine Evaluator Appen Project + Language Assessment Exam in 2023!',
      description: 'Complete guide to applying for Whatcom and passing the Appen Search Engine Evaluator project.',
      videoUrl: 'https://www.youtube.com/embed/1A6uW4ji7_s',
    },
    {
      id: 'NS0hPHzl0gc',
      title: 'How To Create a Microsoft Live ID in 2023?',
      description: 'Learn how to create a Microsoft Live ID account for remote work platforms and applications.',
      videoUrl: 'https://www.youtube.com/embed/NS0hPHzl0gc',
    },
  ]

  // Featured playlists
  const featuredPlaylists = [
    {
      id: 'PLd_UwJyzlb33FpeVgneP2jnrqJH2KolA3',
      title: 'TOLOKA YANDEX QUALIFICATIONS',
      description: 'Complete guide to Toloka Yandex qualifications and how to pass them successfully.',
      playlistUrl: 'https://www.youtube.com/embed/videoseries?list=PLd_UwJyzlb33FpeVgneP2jnrqJH2KolA3',
    },
    {
      id: 'PLd_UwJyzlb303hFiI5f83BskJVlDddxFg',
      title: 'How to create Accounts',
      description: 'Tutorials on creating accounts for various remote work platforms and services.',
      playlistUrl: 'https://www.youtube.com/embed/videoseries?list=PLd_UwJyzlb303hFiI5f83BskJVlDddxFg',
    },
    {
      id: 'PLd_UwJyzlb31C2mGwjS4oLBxn7km2f3KP',
      title: 'UHRS QUALIFICATIONS ANSWERS',
      description: 'Answers and tips for UHRS (Universal Human Relevance System) qualification exams.',
      playlistUrl: 'https://www.youtube.com/embed/videoseries?list=PLd_UwJyzlb31C2mGwjS4oLBxn7km2f3KP',
    },
  ]

  const quickTips = [
    {
      id: 1,
      tip: 'Create a dedicated workspace',
      description: 'Set up a professional environment that signals work mode.',
    },
    {
      id: 2,
      tip: 'Master asynchronous communication',
      description: 'Learn to communicate effectively across time zones.',
    },
    {
      id: 3,
      tip: 'Build your online presence',
      description: 'Establish a professional brand on LinkedIn and other platforms.',
    },
  ]

  return (
    <>
      <SEO
        title={isAuthenticated ? "My Courses - Learn Remote Work" : "Learn Remote Work"}
        description={isAuthenticated
          ? "Access your enrolled courses, track progress, and discover new learning resources for remote work."
          : "Comprehensive tutorials, YouTube playlists, and resources to accelerate your remote work journey. Learn from video tutorials, guides, and expert tips."}
        keywords="remote work tutorials, remote work courses, learn remote work, remote work training, work from home guide, remote work skills"
        url={isAuthenticated ? "/user/learn" : "/learn"}
      />
      <div className="learn-page min-h-screen pt-20 pb-12">
        {/* Hero Section */}
        <section className="learn-hero relative py-20 overflow-hidden">
          {/* Background Elements */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
            <div className="absolute top-[-10%] right-[-5%] w-[400px] h-[400px] rounded-full bg-neon-blue/10 dark:bg-neon-blue/20 blur-[100px] animate-pulse-slow"></div>
            <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] rounded-full bg-neon-purple/10 dark:bg-neon-purple/20 blur-[100px] animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
          </div>

          <div className="container mx-auto px-4 relative z-10 text-center">
            <div className="inline-block px-4 py-1 mb-6 rounded-full bg-white/50 dark:bg-white/5 border border-gray-200 dark:border-white/10 backdrop-blur-sm animate-fade-in">
              <span className="text-neon-blue text-sm font-medium tracking-wider">KNOWLEDGE HUB</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-display font-bold mb-6 text-gray-900 dark:text-white animate-fade-in-up">
              {isAuthenticated ? 'My Courses & ' : 'Learn '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-neon-purple">
                {isAuthenticated ? 'Learning' : 'Remote Work'}
              </span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-8 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              {isAuthenticated
                ? 'Access your enrolled courses, track your progress, and discover new learning resources'
                : 'Comprehensive tutorials and YouTube playlists to accelerate your remote work journey'}
            </p>
            {isAuthenticated && user?.subscriptions?.activeCourses?.length > 0 && (
              <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg inline-block animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                <p className="text-blue-800 dark:text-blue-200 font-medium">
                  📚 You're enrolled in {user.subscriptions.activeCourses.length} course{user.subscriptions.activeCourses.length !== 1 ? 's' : ''}
                </p>
              </div>
            )}
          </div>
        </section>

        <section className="learn-content py-12">
          <div className="container mx-auto px-4">
            {/* YouTube Videos Section */}
            <div className="mb-16">
              <h2 className="text-3xl font-display font-bold text-gray-900 dark:text-white mb-8 flex items-center gap-3">
                <span className="w-2 h-8 bg-neon-blue rounded-full"></span>
                Latest Videos
              </h2>

              {loading && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 border-4 border-neon-blue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-600 dark:text-gray-300 animate-pulse">Loading videos...</p>
                </div>
              )}

              {error && (
                <div className="text-center py-12">
                  <p className="text-red-500 bg-red-500/10 px-6 py-4 rounded-lg inline-block border border-red-500/20">{error}</p>
                </div>
              )}

              {!loading && !error && videos.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {videos.map((video) => (
                    <div key={video.id} className="glass-panel rounded-xl overflow-hidden group hover:transform hover:-translate-y-1 transition-all duration-300 border border-gray-200 dark:border-white/5 hover:border-neon-blue/30 dark:hover:border-neon-blue/30 hover:shadow-neon-blue/10">
                      <div className="relative aspect-video overflow-hidden">
                        <a
                          href={`https://www.youtube.com/watch?v=${video.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block w-full h-full"
                        >
                          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors z-10"></div>
                          <img
                            src={video.thumbnail}
                            alt={video.title}
                            loading="lazy"
                            decoding="async"
                            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                          />
                          <div className="absolute inset-0 flex items-center justify-center z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center shadow-lg transform scale-75 group-hover:scale-100 transition-transform duration-300">
                              <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z" />
                              </svg>
                            </div>
                          </div>
                        </a>
                      </div>
                      <div className="p-6">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-neon-blue transition-colors">
                          {video.title}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {new Date(video.publishedAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {!loading && !error && videos.length === 0 && (
                <div className="glass-panel p-12 rounded-2xl text-center max-w-3xl mx-auto border border-gray-200 dark:border-white/5">
                  <p className="text-xl text-gray-700 dark:text-gray-300 mb-8">
                    Check out my YouTube channel for the latest remote work tips and tutorials:
                  </p>
                  <div className="mb-8">
                    <a
                      href={YOUTUBE_CHANNEL_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-8 py-4 rounded-lg bg-red-600 text-white font-bold hover:bg-red-700 transition-colors shadow-lg hover:shadow-red-600/20"
                    >
                      Visit YouTube Channel <svg className="w-5 h-5 ml-2" fill="currentColor" viewBox="0 0 24 24"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" /></svg>
                    </a>
                  </div>
                  <div className="aspect-video w-full rounded-xl overflow-hidden shadow-2xl">
                    <iframe
                      src={`https://www.youtube.com/embed?listType=user_uploads&list=${YOUTUBE_CHANNEL_URL.split('@')[1]}`}
                      title="YouTube Channel"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-full"
                    ></iframe>
                  </div>
                </div>
              )}
            </div>

            {/* Featured Videos Section */}
            <div className="mb-16">
              <h2 className="text-3xl font-display font-bold text-gray-900 dark:text-white mb-8 flex items-center gap-3">
                <span className="w-2 h-8 bg-neon-purple rounded-full"></span>
                Featured Tutorials
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {featuredVideos.map((video) => (
                  <div key={video.id} className="glass-panel p-6 rounded-xl border border-gray-200 dark:border-white/5 hover:border-neon-purple/30 dark:hover:border-neon-purple/30 transition-colors">
                    <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">{video.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4 h-12 line-clamp-2">{video.description}</p>
                    <div className="rounded-lg overflow-hidden mb-4 shadow-lg">
                      <iframe
                        src={video.videoUrl}
                        title={video.title}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full aspect-video"
                      ></iframe>
                    </div>
                    <a
                      href={`https://www.youtube.com/watch?v=${video.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-red-600 font-medium hover:text-red-700 transition-colors"
                    >
                      Watch on YouTube <svg className="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" /></svg>
                    </a>
                  </div>
                ))}
              </div>
            </div>

            {/* Playlists Section */}
            <div className="mb-16">
              <h2 className="text-3xl font-display font-bold text-gray-900 dark:text-white mb-8 flex items-center gap-3">
                <span className="w-2 h-8 bg-neon-green rounded-full"></span>
                Video Playlists
              </h2>

              {playlists.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                  {playlists.map((playlist) => (
                    <div key={playlist.id} className="glass-panel rounded-xl overflow-hidden group hover:transform hover:-translate-y-1 transition-all duration-300 border border-gray-200 dark:border-white/5 hover:border-neon-green/30 dark:hover:border-neon-green/30">
                      <div className="aspect-video overflow-hidden relative">
                        <img
                          src={playlist.thumbnail}
                          alt={playlist.title}
                          loading="lazy"
                          decoding="async"
                          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded font-medium">
                          {playlist.videoCount} videos
                        </div>
                      </div>
                      <div className="p-6">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-1 group-hover:text-neon-green transition-colors">{playlist.title}</h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm line-clamp-2">{playlist.description}</p>
                        <a
                          href={`https://www.youtube.com/playlist?list=${playlist.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-neon-blue font-medium hover:text-neon-purple transition-colors inline-flex items-center"
                        >
                          Watch Playlist <svg className="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" /></svg>
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Featured Playlists */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {featuredPlaylists.map((playlist) => (
                  <div key={playlist.id} className="glass-panel p-6 rounded-xl border border-gray-200 dark:border-white/5 hover:border-neon-green/30 dark:hover:border-neon-green/30 transition-colors">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-1">{playlist.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm h-10 line-clamp-2">{playlist.description}</p>
                    <div className="rounded-lg overflow-hidden mb-4 shadow-lg">
                      <iframe
                        src={playlist.playlistUrl}
                        title={playlist.title}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full aspect-video"
                      ></iframe>
                    </div>
                    <a
                      href={`https://www.youtube.com/playlist?list=${playlist.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-neon-blue font-medium hover:text-neon-purple transition-colors inline-flex items-center"
                    >
                      Watch Full Playlist <svg className="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" /></svg>
                    </a>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Tips Section */}
            <div className="mt-20">
              <h2 className="text-3xl font-display font-bold text-gray-900 dark:text-white mb-8 text-center">Quick Tips for Success</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {quickTips.map((item) => (
                  <div key={item.id} className="glass-panel p-8 rounded-xl border border-gray-200 dark:border-white/5 hover:border-neon-blue/30 dark:hover:border-neon-blue/30 text-center group hover:transform hover:-translate-y-1 transition-all duration-300">
                    <div className="w-12 h-12 bg-neon-blue/10 rounded-full flex items-center justify-center mx-auto mb-4 text-neon-blue font-bold text-xl group-hover:bg-neon-blue group-hover:text-space-900 transition-colors">
                      {item.id}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{item.tip}</h3>
                    <p className="text-gray-600 dark:text-gray-400">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}

export default Learn

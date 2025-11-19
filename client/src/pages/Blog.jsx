import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { blogsAPI } from '../services/api'
import SEO from '../components/SEO'
import SkeletonLoader from '../components/SkeletonLoader'
import { HiMagnifyingGlass } from 'react-icons/hi2'

function Blog() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [blogPosts, setBlogPosts] = useState([])
  const [allPosts, setAllPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [categories, setCategories] = useState([])
  const postsPerPage = 6

  useEffect(() => {
    fetchBlogs()

    // Check URL parameters for filtering
    const categoryParam = searchParams.get('category')
    const searchParam = searchParams.get('search')

    if (categoryParam) {
      setSelectedCategory(categoryParam)
    }

    if (searchParam) {
      setSearchTerm(searchParam)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (allPosts.length > 0) {
      filterPosts()
    }
  }, [searchTerm, selectedCategory, allPosts])

  const fetchBlogs = async () => {
    try {
      setLoading(true)
      setError('')
      const response = await blogsAPI.getAll()
      console.log('Blogs API response:', response)

      // Handle different response formats
      const posts = response?.data || response || []

      if (!Array.isArray(posts)) {
        console.error('Invalid response format:', response)
        setError('Invalid response from server')
        return
      }

      setAllPosts(posts)
      setBlogPosts(posts)

      // Extract unique categories from blog posts
      const uniqueCategories = [...new Set(posts.map(post => post.category).filter(Boolean))]
      // Sort categories alphabetically
      const sortedCategories = uniqueCategories.sort((a, b) => a.localeCompare(b))
      setCategories(sortedCategories)
    } catch (err) {
      console.error('Error fetching blogs:', err)
      setError(err.response?.data?.message || err.message || 'Failed to load blog posts. Please check your connection and try again.')
    } finally {
      setLoading(false)
    }
  }

  const filterPosts = () => {
    let filtered = [...allPosts]

    if (searchTerm) {
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.content?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (selectedCategory) {
      filtered = filtered.filter(post =>
        post.category.toLowerCase() === selectedCategory.toLowerCase()
      )
    }

    setBlogPosts(filtered)
    setCurrentPage(1)
  }

  // Get count of posts per category
  const getCategoryCount = (category) => {
    return allPosts.filter(post =>
      post.category && post.category.toLowerCase() === category.toLowerCase()
    ).length
  }

  // Pagination
  const indexOfLastPost = currentPage * postsPerPage
  const indexOfFirstPost = indexOfLastPost - postsPerPage
  const currentPosts = blogPosts.slice(indexOfFirstPost, indexOfLastPost)
  const totalPages = Math.ceil(blogPosts.length / postsPerPage)

  const paginate = (pageNumber) => setCurrentPage(pageNumber)

  return (
    <>
      <SEO
        title="Remote Work Blog"
        description="Expert tips, guides, and insights on remote work, job searching, productivity, and building a successful remote career. Learn from real experiences and proven strategies."
        keywords="remote work blog, remote work tips, work from home advice, remote job search, digital nomad blog, remote career advice"
        url="/blog"
      />
      <div className="blog-page min-h-screen pt-20 pb-12">
        {/* Hero Section */}
        <section className="blog-hero relative py-20 overflow-hidden">
          {/* Background Elements */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
            <div className="absolute top-[-10%] right-[-5%] w-[400px] h-[400px] rounded-full bg-neon-blue/10 dark:bg-neon-blue/20 blur-[100px] animate-pulse-slow"></div>
            <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] rounded-full bg-neon-purple/10 dark:bg-neon-purple/20 blur-[100px] animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
          </div>

          <div className="container mx-auto px-4 relative z-10 text-center">
            <div className="inline-block px-4 py-1 mb-6 rounded-full bg-white/50 dark:bg-white/5 border border-gray-200 dark:border-white/10 backdrop-blur-sm animate-fade-in">
              <span className="text-neon-blue text-sm font-medium tracking-wider">KNOWLEDGE BASE</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-display font-bold mb-6 text-gray-900 dark:text-white animate-fade-in-up">
              Remote Work <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-neon-purple">Intel</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              Tips, strategies, and insights for your remote career journey.
            </p>
          </div>
        </section>

        <section className="blog-content py-12">
          <div className="container mx-auto px-4">
            {/* Search and Filter Section */}
            <div className="blog-filters mb-12 space-y-6">
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="search-box relative w-full md:w-96">
                  <HiMagnifyingGlass className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search blog posts..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/50 dark:bg-space-800/50 border border-gray-200 dark:border-white/10 focus:border-neon-blue focus:ring-1 focus:ring-neon-blue outline-none transition-all text-gray-900 dark:text-white placeholder-gray-500"
                  />
                </div>

                <div className="category-dropdown w-full md:w-auto">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full md:w-64 px-4 py-3 rounded-xl bg-white/50 dark:bg-space-800/50 border border-gray-200 dark:border-white/10 focus:border-neon-blue focus:ring-1 focus:ring-neon-blue outline-none transition-all text-gray-900 dark:text-white cursor-pointer appearance-none"
                    style={{ backgroundImage: 'none' }}
                  >
                    <option value="" className="bg-white dark:bg-space-900">All Categories</option>
                    {categories.map((category) => {
                      const count = getCategoryCount(category)
                      return (
                        <option key={category} value={category} className="bg-white dark:bg-space-900">
                          {category} ({count})
                        </option>
                      )
                    })}
                  </select>
                </div>
              </div>

              {!loading && !error && blogPosts.length > 0 && (
                <div className="text-gray-500 dark:text-gray-400 text-sm">
                  Showing {indexOfFirstPost + 1}-{Math.min(indexOfLastPost, blogPosts.length)} of {blogPosts.length} posts
                </div>
              )}
            </div>

            {loading && (
              <SkeletonLoader type="blog-card" count={6} />
            )}

            {error && (
              <div className="text-center py-12">
                <p className="text-red-500 bg-red-500/10 px-6 py-4 rounded-lg inline-block border border-red-500/20">{error}</p>
              </div>
            )}

            {!loading && !error && (
              <>
                {currentPosts.length === 0 ? (
                  <div className="text-center py-24">
                    <div className="text-6xl mb-4 opacity-50">📝</div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">No posts found</h3>
                    <p className="text-gray-600 dark:text-gray-400">Try adjusting your search or filters.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                    {currentPosts.map((post) => (
                      <article key={post._id} className="glass-panel rounded-2xl overflow-hidden group hover:transform hover:-translate-y-1 transition-all duration-300 border border-gray-200 dark:border-white/5 hover:border-neon-blue/30 dark:hover:border-neon-blue/30 hover:shadow-neon-blue/10">
                        {post.thumbnail && (
                          <div className="h-48 overflow-hidden relative">
                            <div className="absolute inset-0 bg-gray-900/10 dark:bg-space-900/20 group-hover:bg-transparent transition-colors z-10"></div>
                            <img
                              src={post.thumbnail}
                              alt={post.title}
                              loading="lazy"
                              className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                            />
                          </div>
                        )}
                        <div className="p-6 flex flex-col h-[calc(100%-12rem)]">
                          <div className="flex justify-between items-center mb-4">
                            <span className="text-xs font-bold px-2 py-1 rounded bg-gray-100 dark:bg-white/10 text-neon-blue border border-gray-200 dark:border-white/5">
                              {post.category}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {new Date(post.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                              })}
                            </span>
                          </div>
                          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2 group-hover:text-neon-blue transition-colors">
                            {post.title}
                          </h2>
                          <p className="text-gray-600 dark:text-gray-400 text-sm mb-6 line-clamp-3 flex-grow">
                            {post.excerpt}
                          </p>
                          <Link
                            to={`/blog/${post._id}`}
                            className="inline-flex items-center text-neon-blue font-medium hover:text-neon-purple transition-colors mt-auto"
                          >
                            Read Article <HiMagnifyingGlass className="ml-2 w-4 h-4 rotate-90" />
                          </Link>
                        </div>
                      </article>
                    ))}
                  </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-12">
                    <button
                      onClick={() => paginate(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-4 py-2 rounded-lg bg-white dark:bg-space-800 border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      &lt; Previous
                    </button>
                    {[...Array(totalPages)].map((_, index) => {
                      const pageNumber = index + 1
                      if (
                        pageNumber === 1 ||
                        pageNumber === totalPages ||
                        (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                      ) {
                        return (
                          <button
                            key={pageNumber}
                            onClick={() => paginate(pageNumber)}
                            className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${currentPage === pageNumber
                              ? 'bg-neon-blue text-space-900 font-bold shadow-neon-blue'
                              : 'bg-white dark:bg-space-800 border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5'
                              }`}
                          >
                            {pageNumber}
                          </button>
                        )
                      } else if (
                        pageNumber === currentPage - 2 ||
                        pageNumber === currentPage + 2
                      ) {
                        return <span key={pageNumber} className="text-gray-500 dark:text-gray-400">...</span>
                      }
                      return null
                    })}
                    <button
                      onClick={() => paginate(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 rounded-lg bg-white dark:bg-space-800 border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Next &gt;
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      </div>
    </>
  )
}

export default Blog


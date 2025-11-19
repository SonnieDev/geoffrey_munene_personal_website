import '../styles/components/skeleton-loader.css'

const SkeletonLoader = ({ type = 'card', count = 1 }) => {
  const renderSkeleton = () => {
    switch (type) {
      case 'card':
        return (
          <div className="skeleton-card">
            <div className="skeleton-image"></div>
            <div className="skeleton-content">
              <div className="skeleton-line skeleton-line-short"></div>
              <div className="skeleton-line"></div>
              <div className="skeleton-line"></div>
              <div className="skeleton-line skeleton-line-medium"></div>
            </div>
          </div>
        )
      case 'blog-card':
        return (
          <div className="skeleton-blog-card">
            <div className="skeleton-thumbnail"></div>
            <div className="skeleton-content">
              <div className="skeleton-header">
                <div className="skeleton-badge"></div>
                <div className="skeleton-date"></div>
              </div>
              <div className="skeleton-title"></div>
              <div className="skeleton-excerpt"></div>
              <div className="skeleton-excerpt skeleton-excerpt-short"></div>
            </div>
          </div>
        )
      case 'job-card':
        return (
          <div className="skeleton-job-card">
            <div className="skeleton-content">
              <div className="skeleton-header">
                <div className="skeleton-title"></div>
                <div className="skeleton-badge"></div>
              </div>
              <div className="skeleton-company">
                <div className="skeleton-logo"></div>
                <div className="skeleton-line skeleton-line-short"></div>
              </div>
              <div className="skeleton-details">
                <div className="skeleton-line skeleton-line-short"></div>
                <div className="skeleton-line skeleton-line-short"></div>
              </div>
              <div className="skeleton-line skeleton-line-medium"></div>
              <div className="skeleton-footer">
                <div className="skeleton-date"></div>
                <div className="skeleton-button"></div>
              </div>
            </div>
          </div>
        )
      case 'text':
        return (
          <div className="skeleton-text">
            <div className="skeleton-line"></div>
            <div className="skeleton-line"></div>
            <div className="skeleton-line skeleton-line-short"></div>
          </div>
        )
      case 'testimonial-card':
        return (
          <div className="skeleton-testimonial-card">
            <div className="skeleton-stars"></div>
            <div className="skeleton-content">
              <div className="skeleton-line"></div>
              <div className="skeleton-line"></div>
              <div className="skeleton-line skeleton-line-medium"></div>
            </div>
            <div className="skeleton-author">
              <div className="skeleton-avatar"></div>
              <div className="skeleton-author-info">
                <div className="skeleton-line skeleton-line-short"></div>
                <div className="skeleton-line skeleton-line-short"></div>
              </div>
            </div>
          </div>
        )
      default:
        return <div className="skeleton-default"></div>
    }
  }

  if (count > 1) {
    return (
      <div className="skeleton-container">
        {Array.from({ length: count }).map((_, index) => (
          <div key={index} style={{ animationDelay: `${index * 0.1}s` }}>
            {renderSkeleton()}
          </div>
        ))}
      </div>
    )
  }

  return renderSkeleton()
}

export default SkeletonLoader


import '../styles/pages/projects.css'

function Projects() {
  const projects = [
    {
      id: 1,
      title: 'Project One',
      description: 'A full-stack web application built with React and Node.js.',
      technologies: ['React', 'Node.js', 'MongoDB'],
    },
    {
      id: 2,
      title: 'Project Two',
      description: 'A responsive website with modern UI/UX design.',
      technologies: ['React', 'Tailwind CSS'],
    },
    {
      id: 3,
      title: 'Project Three',
      description: 'An API-driven application with RESTful architecture.',
      technologies: ['Express.js', 'MongoDB', 'Node.js'],
    },
  ]

  return (
    <div className="projects-page">
      <section className="projects-hero">
        <div className="projects-container">
          <h1 className="page-title">My Projects</h1>
          <p className="page-subtitle">Explore some of my recent work</p>
        </div>
      </section>

      <section className="projects-content">
        <div className="projects-grid-container">
          <div className="projects-grid">
            {projects.map((project) => (
              <div key={project.id} className="project-card">
                <h3 className="project-title">{project.title}</h3>
                <p className="project-description">{project.description}</p>
                <div className="project-technologies">
                  {project.technologies.map((tech, index) => (
                    <span key={index} className="tech-tag">
                      {tech}
                    </span>
                  ))}
                </div>
                <button className="project-button">View Project</button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default Projects


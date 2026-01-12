import React from 'react';

const Projects = () => {
  const projects = [
    {
      id: 1,
      title: 'Modern Residential Complex',
      description: 'A stunning residential development featuring contemporary architecture and sustainable design.',
      image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&h=400&fit=crop',
      category: 'Residential',
      status: 'Completed'
    },
    {
      id: 2,
      title: 'Commercial Tower',
      description: 'Iconic commercial space designed for efficiency and aesthetics in the heart of the city.',
      image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&h=400&fit=crop',
      category: 'Commercial',
      status: 'Completed'
    },
    {
      id: 3,
      title: 'Luxury Villa',
      description: 'Exclusive villa with premium finishes and scenic views, perfect for luxury living.',
      image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&h=400&fit=crop',
      category: 'Luxury',
      status: 'Completed'
    },
    {
      id: 4,
      title: 'Urban Mixed-Use Development',
      description: 'Innovative mixed-use project combining residential, commercial, and recreational spaces.',
      image: 'https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=600&h=400&fit=crop',
      category: 'Mixed-Use',
      status: 'Ongoing'
    },
    {
      id: 5,
      title: 'Eco-Friendly Apartments',
      description: 'Sustainable living spaces with green architecture and energy-efficient features.',
      image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&h=400&fit=crop',
      category: 'Sustainable',
      status: 'Completed'
    },
    {
      id: 6,
      title: 'Historic Renovation',
      description: 'Careful restoration of historic building with modern amenities and preserved charm.',
      image: 'https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=600&h=400&fit=crop',
      category: 'Renovation',
      status: 'Planning'
    }
  ];

  const categories = ['All', 'Residential', 'Commercial', 'Luxury', 'Mixed-Use', 'Sustainable', 'Renovation'];

  return (
    <div className="page">
      <div className="section">
        <div className="section-content">
          <h1 className="section-title" style={{marginBottom: '2rem'}}>Our Projects</h1>
          <p className="text-lg text-gray-600 mb-8 max-w-3xl mx-auto">
            Discover our portfolio of exceptional architectural projects that showcase innovation,
            sustainability, and timeless design excellence.
          </p>

          <div className="filter-buttons" style={{marginBottom: '3rem'}}>
            {categories.map(category => (
              <button
                key={category}
                className="filter-btn"
                style={{
                  padding: '0.5rem 1.5rem',
                  margin: '0 0.5rem',
                  borderRadius: '25px',
                  border: '2px solid #FF6B35',
                  background: 'transparent',
                  color: '#FF6B35',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  fontWeight: '500'
                }}
                onMouseOver={(e) => {
                  e.target.style.background = 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)';
                  e.target.style.color = 'white';
                }}
                onMouseOut={(e) => {
                  e.target.style.background = 'transparent';
                  e.target.style.color = '#FF6B35';
                }}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="projects-grid">
            {projects.map(project => (
              <div key={project.id} className="project-card">
                <div className="project-image-container">
                  <img src={project.image} alt={project.title} className="project-image" />
                  <div className="project-overlay">
                    <span className="project-category">{project.category}</span>
                    <span className="project-status">{project.status}</span>
                  </div>
                </div>
                <div className="project-content">
                  <h3 className="project-title">{project.title}</h3>
                  <p className="project-description">{project.description}</p>
                  <button className="project-btn">View Details</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Projects;

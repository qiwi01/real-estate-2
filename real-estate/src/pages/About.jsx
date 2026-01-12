import React from 'react';

const About = () => {
  const team = [
    {
      name: 'Sarah Johnson',
      role: 'Principal Architect',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=300&h=300&fit=crop&crop=face',
      bio: 'With 15+ years in architectural design, Sarah leads our creative vision and sustainable practices.'
    },
    {
      name: 'Michael Chen',
      role: 'Project Manager',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face',
      bio: 'Michael ensures seamless project execution from concept to completion with meticulous attention to detail.'
    },
    {
      name: 'Emma Rodriguez',
      role: 'Interior Designer',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face',
      bio: 'Emma specializes in creating functional and beautiful interior spaces that reflect client personalities.'
    }
  ];

  const values = [
    {
      icon: '🎯',
      title: 'Excellence',
      description: 'We strive for perfection in every project, delivering unparalleled quality and innovation.'
    },
    {
      icon: '🌱',
      title: 'Sustainability',
      description: 'Environmental responsibility is at the core of our design philosophy and construction methods.'
    },
    {
      icon: '🤝',
      title: 'Collaboration',
      description: 'We work closely with clients, partners, and communities to achieve shared success.'
    },
    {
      icon: '💡',
      title: 'Innovation',
      description: 'We embrace cutting-edge technology and creative solutions to solve complex challenges.'
    }
  ];

  return (
    <div className="page">
      {/* Hero Section */}
      <section className="hero" style={{
        background: 'url("https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&h=600&fit=crop") center/cover no-repeat',
        backgroundAttachment: 'fixed',
        padding: '6rem 0'
      }}>
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1 className="hero-title">About Our Company</h1>
          <p className="hero-subtitle">
            Discover the passion, expertise, and vision that drive our architectural excellence
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="section">
        <div className="section-content">
          <h2 className="section-title">Our Story</h2>
          <div className="story-content">
            <div className="story-text">
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                Founded in 2009, our architectural firm has evolved from a small design studio into a
                comprehensive real estate development company. What started as a passion for creating
                beautiful spaces has grown into a mission to transform communities through innovative design.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                Over the past decade, we've completed over 50 major projects across residential,
                commercial, and mixed-use developments. Our commitment to sustainability, attention to detail,
                and client satisfaction has earned us recognition as industry leaders.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                Today, we continue to push boundaries, embracing new technologies and design philosophies
                while maintaining our core values of excellence, sustainability, and collaboration.
              </p>
            </div>
            <div className="story-image">
              <img
                src="https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=600&h=400&fit=crop"
                alt="Our office"
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="section section-alt">
        <div className="section-content">
          <h2 className="section-title">Our Values</h2>
          <div className="grid-3">
            {values.map((value, index) => (
              <div key={index} className="card">
                <div className="card-icon">{value.icon}</div>
                <h3 className="card-title">{value.title}</h3>
                <p className="card-text">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Vision Section */}
      <section className="section">
        <div className="section-content">
          <div className="mission-vision-grid">
            <div className="mission-vision-card">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Our Mission</h3>
              <p className="text-gray-600 leading-relaxed">
                To transform visions into reality through exceptional architectural design and real estate development,
                creating spaces that inspire, endure, and enhance the quality of life for our clients and communities.
              </p>
            </div>
            <div className="mission-vision-card">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Our Vision</h3>
              <p className="text-gray-600 leading-relaxed">
                To be the premier choice for architectural and real estate development services,
                recognized for our innovation, sustainability, and commitment to excellence.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="section section-alt">
        <div className="section-content">
          <h2 className="section-title">Meet Our Team</h2>
          <div className="team-grid">
            {team.map((member, index) => (
              <div key={index} className="team-card">
                <img src={member.image} alt={member.name} className="team-image" />
                <div className="team-content">
                  <h3 className="team-name">{member.name}</h3>
                  <p className="team-role">{member.role}</p>
                  <p className="team-bio">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="section">
        <div className="section-content">
          <h2 className="section-title">Our Impact</h2>
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-number">50+</div>
              <div className="stat-label">Projects Completed</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">15+</div>
              <div className="stat-label">Years of Experience</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">100%</div>
              <div className="stat-label">Client Satisfaction</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">25+</div>
              <div className="stat-label">Awards Won</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;

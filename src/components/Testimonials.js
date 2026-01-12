import React from 'react';
import './Testimonials.css';

const Testimonials = () => {
  const testimonials = [
    {
      quote: "ArchDev Realty transformed our vision into reality. Their attention to detail and innovative design solutions exceeded our expectations. The result is a stunning commercial complex that has become a landmark in our city.",
      author: "Sarah Johnson",
      position: "CEO, TechCorp Industries",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&w=150&h=150&fit=crop&crop=face"
    },
    {
      quote: "Working with ArchDev Realty was a pleasure from start to finish. Their sustainable approach and commitment to quality made our residential development project a complete success.",
      author: "Michael Chen",
      position: "Property Developer",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&w=150&h=150&fit=crop&crop=face"
    },
    {
      quote: "The team's expertise in architectural design and project management helped us achieve our goals on time and within budget. Highly recommend their services to anyone in real estate development.",
      author: "Emma Rodriguez",
      position: "Real Estate Investor",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&w=150&h=150&fit=crop&crop=face"
    }
  ];

  return (
    <section className="testimonials">
      <div className="container">
        <h2>What Our Clients Say</h2>
        <div className="testimonials-grid">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="testimonial-card">
              <div className="quote-icon">"</div>
              <p className="testimonial-quote">{testimonial.quote}</p>
              <div className="testimonial-author">
                <img src={testimonial.avatar} alt={testimonial.author} className="author-avatar" />
                <div className="author-info">
                  <div className="author-name">{testimonial.author}</div>
                  <div className="author-position">{testimonial.position}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
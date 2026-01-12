import React from 'react';
import './Statistics.css';

const Statistics = () => {
  const stats = [
    {
      number: '15+',
      label: 'Years Experience',
      icon: '📅'
    },
    {
      number: '50+',
      label: 'Projects Completed',
      icon: '🏗️'
    },
    {
      number: '1000+',
      label: 'Happy Clients',
      icon: '😊'
    },
    {
      number: '25',
      label: 'Awards Won',
      icon: '🏆'
    }
  ];

  return (
    <section className="statistics">
      <div className="container">
        <div className="stats-grid">
          {stats.map((stat, index) => (
            <div key={index} className="stat-item">
              <div className="stat-icon">{stat.icon}</div>
              <div className="stat-number">{stat.number}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Statistics;
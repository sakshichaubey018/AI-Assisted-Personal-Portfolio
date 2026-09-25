import React from 'react';

export default function Skills() {
  const skillsData = [
    {
      icon: 'fa-code',
      prompt: 'lang',
      category: 'Languages',
      tags: ['C', 'Java', 'Python'],
      isComp: false
    },
    {
      icon: 'fa-globe',
      prompt: 'web',
      category: 'Web Technologies',
      tags: ['HTML', 'CSS', 'JavaScript', 'React.js', 'Node.js', 'Express.js'],
      isComp: false
    },
    {
      icon: 'fa-database',
      prompt: 'db',
      category: 'Databases',
      tags: ['MySQL', 'MongoDB'],
      isComp: false
    },
    {
      icon: 'fa-wrench',
      prompt: 'tools',
      category: 'Tools & Platforms',
      tags: ['VS Code', 'NetBeans', 'Git', 'Canva', 'MS Office'],
      isComp: false
    },
    {
      icon: 'fa-bolt',
      prompt: 'other',
      category: 'Other Skills',
      tags: ['REST APIs', 'Fast Typing', 'Tech Docs', 'Presentations'],
      isComp: false
    },
    {
      icon: 'fa-user-check',
      prompt: 'soft',
      category: 'Core Competencies',
      tags: ['Communication', 'Problem Solving', 'Teamwork', 'Adaptability', 'Time Management'],
      isComp: true
    }
  ];

  return (
    <section id="skills">
      {/* Terminal-style section header */}
      <div className="terminal-header-bar reveal">
        <span className="terminal-dot terminal-dot--red" />
        <span className="terminal-dot terminal-dot--yellow" />
        <span className="terminal-dot terminal-dot--green" />
        <span className="terminal-path">~/sakshi/skills</span>
      </div>

      <div className="section-eyebrow reveal">Technical Skills</div>
      <h2 className="section-title reveal">My <span className="highlight">Toolkit</span></h2>
      <span className="section-rule reveal" />

      <div className="skills-grid">
        {skillsData.map((skill, index) => (
          <div key={index} className={`skill-card glass reveal reveal-delay-${index + 1}`}>
            {/* Terminal prompt line */}
            <div className="skill-terminal-prompt">
              <span className="skill-prompt-dollar">$</span>
              <span className="skill-prompt-cmd">ls --category</span>
              <span className="skill-prompt-arg">{skill.prompt}</span>
            </div>

            <div className="skill-card-header">
              <div className="skill-icon-wrap">
                <i className={`fas ${skill.icon}`} />
              </div>
              <div className="skill-category">{skill.category}</div>
            </div>

            <div className="skill-tags">
              {skill.tags.map((tag, tagIndex) => (
                <span key={tagIndex} className={skill.isComp ? 'comp-pill' : 'tag'}>
                  {tag}
                </span>
              ))}
            </div>

            {/* Blink cursor on last item */}
            {index === skillsData.length - 1 && (
              <div className="skill-cursor-line">
                <span className="skill-blink-cursor" aria-hidden="true">█</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

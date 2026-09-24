function Skills({ skillList }) {
  return (
    <section className="content-section skills-section">
      <div className="section-heading">
        <span className="section-number">02</span>
        <h2>My toolkit</h2>
      </div>

      <ul className="skill-grid">
        {skillList.map((skill) => (
          <li key={skill}><span aria-hidden="true">✦</span>{skill}</li>
        ))}
      </ul>
    </section>
  );
}

export default Skills;
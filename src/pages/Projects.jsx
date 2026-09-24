import React, { useState, useEffect } from 'react';
import Spinner from '../components/Spinner';
import ErrorMessage from '../components/ErrorMessage';

function Projects() {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch('https://api.github.com/users/Poojandave09/repos')
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => setRepos(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [retryCount]);

  const handleRetry = () => {
    setRetryCount((prev) => prev + 1);
  };

  const filteredRepos = repos.filter((repo) =>
    repo.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <main className="page-shell projects-page">
      <div className="page-intro">
        <span className="section-number">03 / SELECTED WORK</span>
        <h1>Projects that keep me curious.</h1>
        <p>Small experiments and practical builds from my GitHub journey.</p>
        <a href="https://github.com/Poojandave09" target="_blank" rel="noopener noreferrer" className="github-link">View GitHub profile ↗</a>
      </div>
      
      <div className="project-search">
        <input
          type="text"
          placeholder="Search repositories..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {loading && <Spinner />}
      
      {error && <ErrorMessage message={error} onRetry={handleRetry} />}
      
      {!loading && !error && (
        <ul className="project-list">
          {filteredRepos.map((repo) => (
            <li key={repo.id} className="project-item">
              <div>
                <h3>
                  <a href={repo.html_url} target="_blank" rel="noopener noreferrer">
                    {repo.name}
                  </a>
                </h3>
                <p>{repo.description || 'A work in progress from my development journey.'}</p>
              </div>
              <span className="project-star" aria-label={`${repo.stargazers_count} stars`}>★ {repo.stargazers_count}</span>
            </li>
          ))}
          {!loading && !error && filteredRepos.length === 0 && (
            <p>No repositories found matching your search.</p>
          )}
        </ul>
      )}
    </main>
  );
}

export default Projects;
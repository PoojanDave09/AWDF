import { useState } from "react";

function Contact() {

  const [message, setMessage] = useState("");

  const [showHelp, setShowHelp] = useState(false);

  return (
    <main className="page-shell contact-page">
      <div className="page-intro">
        <span className="section-number">04 / SAY HELLO</span>
        <h1>Have an idea?<br />Let&apos;s talk.</h1>
        <p>Whether it is a project, a question, or a useful conversation, I would love to hear from you.</p>
      </div>

      <section className="contact-panel">
        <label htmlFor="contact-message">Your message</label>
        <textarea
          id="contact-message"
          placeholder="Tell me a little about what you are working on..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <div className="contact-panel-footer">
          <span>{message.length} characters</span>
          <a href={`mailto:poojandave09@gmail.com?body=${encodeURIComponent(message)}`}>Open email ↗</a>
        </div>
      </section>

      <button className="help-button" onClick={() => setShowHelp(!showHelp)}>
        {showHelp ? 'Hide note' : 'Need a prompt?'}
      </button>
      {showHelp && <p className="help-note">Share what you are building, what you are learning, or where you are stuck.</p>}
    </main>
  );
}

export default Contact;
import { Link } from 'react-router-dom'

function Footer() {
  return (
    <footer className="footer">
      <section className="footer-top">
        <div className="footer-brand">
          <span className="footer-kicker">Built For Event Nights</span>
          <h2>Ticket Seer</h2>
          <p>
            Discover premium events, move faster through checkout, and give every ticket journey a
            sharper visual identity.
          </p>
          <div className="footer-pills">
            <span>Live drops</span>
            <span>Fast resale</span>
            <span>Secure checkout</span>
          </div>
        </div>

        <div>
          <h3>Explore</h3>
          <ul>
            <li><Link to="/events">Events</Link></li>
            <li><Link to="/offers">Offers</Link></li>
            <li><Link to="/bookings">Bookings</Link></li>
          </ul>
        </div>

        <div>
          <h3>Platform</h3>
          <ul>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/signup">Create Account</Link></li>
            <li><Link to="/resale">Ticket Resale</Link></li>
          </ul>
        </div>

        <div>
          <h3>Support</h3>
          <ul>
            <li><Link to="/help">Help Center</Link></li>
            <li><Link to="/help">Refunds</Link></li>
            <li><Link to="/help">Terms</Link></li>
          </ul>
        </div>
      </section>

      <section className="footer-bottom">
        <p>© 2026 Ticket Seer. Built for better event nights.</p>
        <div className="footer-socials">
          <a href="/">Instagram</a>
          <a href="/">LinkedIn</a>
          <a href="/">X</a>
        </div>
      </section>
    </footer>
  )
}

export default Footer

import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Compass, MapPin, Search, Wallet, Sparkles } from 'lucide-react'
import API from '../services/api'

const services = ['All', 'Movies', 'Music', 'Comedy', 'Play', 'Sports']
const cities = ['All', 'Bangalore', 'Mumbai', 'Delhi', 'Hyderabad', 'Chennai', 'Pune', 'Goa']

function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const [selectedType, setSelectedType] = useState('all')
  const [selectedCity, setSelectedCity] = useState(() => localStorage.getItem('selectedCity') || 'Bangalore')
  const [isCityMenuOpen, setIsCityMenuOpen] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [walletBalance, setWalletBalance] = useState(0)
  const [loadingWallet, setLoadingWallet] = useState(false)
  const isLoggedIn = Boolean(localStorage.getItem('access'))
  const loggedInUsername = localStorage.getItem('username') || 'User'

  useEffect(() => {
    if (isLoggedIn) fetchWalletBalance()
  }, [isLoggedIn])

  useEffect(() => {
    if (isLoggedIn && (location.pathname === '/dashboard' || location.pathname === '/success' || location.pathname === '/bookings')) {
      const timer = setTimeout(fetchWalletBalance, 500)
      return () => clearTimeout(timer)
    }
  }, [location.pathname, isLoggedIn])

  const fetchWalletBalance = async () => {
    try {
      setLoadingWallet(true)
      const token = localStorage.getItem('access')
      if (!token) return

      const response = await API.get('/auth/wallet/', {
        headers: { Authorization: `Bearer ${token}` },
      })

      setWalletBalance(response.data.wallet?.balance || 0)
    } catch (error) {
      console.error('Failed to fetch wallet:', error)
      setWalletBalance(0)
    } finally {
      setLoadingWallet(false)
    }
  }

  useEffect(() => {
    if (location.pathname === '/events') {
      const params = new URLSearchParams(location.search)
      const cityParam = params.get('city')
      const typeParam = params.get('type')
      setSelectedCity(cityParam && cities.includes(cityParam) ? cityParam : 'All')
      setSelectedType(typeParam ? typeParam.toLowerCase() : 'all')
    }
  }, [location])

  useEffect(() => {
    localStorage.setItem('selectedCity', selectedCity)
  }, [selectedCity])

  const handleLogout = () => {
    localStorage.removeItem('access')
    localStorage.removeItem('username')
    navigate('/login')
    setIsMenuOpen(false)
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (!searchQuery.trim()) return

    const params = new URLSearchParams()
    if (selectedCity && selectedCity !== 'All') params.set('city', selectedCity)
    params.set('search', searchQuery.trim())
    navigate(`/events?${params.toString()}`)
    setIsMenuOpen(false)
  }

  const handleTypeSelect = (type) => {
    const lowerType = type.toLowerCase()
    setSelectedType(lowerType)
    setIsMenuOpen(false)
    const params = new URLSearchParams()

    if (lowerType === 'all') {
      setSelectedCity('All')
    } else {
      if (selectedCity && selectedCity !== 'All') params.set('city', selectedCity)
      params.set('type', lowerType)
    }

    navigate(params.toString() ? `/events?${params.toString()}` : '/events')
  }

  const handleCitySelect = (city) => {
    setSelectedCity(city)
    setIsCityMenuOpen(false)
    setIsMenuOpen(false)
    const params = new URLSearchParams()

    if (city === 'All') {
      setSelectedType('all')
    } else {
      if (selectedType !== 'all') params.set('type', selectedType)
      params.set('city', city)
    }

    navigate(params.toString() ? `/events?${params.toString()}` : '/events')
  }

  const handleOpenOrganizerPortal = () => {
    setIsMenuOpen(false)
    window.open('http://localhost:3002/login', '_blank', 'noopener,noreferrer')
  }

  const handleBrowseClick = () => {
    setSelectedType('all')
    setSelectedCity('All')
    setSearchQuery('')
    setIsCityMenuOpen(false)
    setIsMenuOpen(false)
    navigate('/events')
  }

  return (
    <motion.header
      className="navbar"
      initial={{ opacity: 0, y: -18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
    >
      <div className="navbar-top">
        <div
          className="brand"
          onClick={() => { navigate(isLoggedIn ? '/dashboard' : '/events'); setIsMenuOpen(false) }}
          style={{ cursor: 'pointer' }}
        >
          <span className="brand-mark">ST</span>
          <div>
            <p className="brand-title">Ticket Seer</p>
            <p className="brand-subtitle">Cinematic nights, live and loud</p>
          </div>
        </div>

        <div className={`navbar-utilities ${isMenuOpen ? 'open' : ''}`}>
          <div className="city-picker">
            <button
              type="button"
              className="city-picker-button"
              aria-haspopup="menu"
              aria-expanded={isCityMenuOpen}
              onClick={() => setIsCityMenuOpen((current) => !current)}
            >
              <MapPin className="city-pin-icon" color="#ffffff" />
              <div className="city-picker-text">
                <span className="city-picker-label">Location</span>
                <span className="city-picker-value">{selectedCity}</span>
              </div>
              <span className="city-picker-arrow">▾</span>
            </button>

            <AnimatePresence>
              {isCityMenuOpen && (
                <motion.div
                  className="city-dropdown open"
                  role="menu"
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.18 }}
                >
                  {cities.map((city) => (
                    <button
                      key={city}
                      type="button"
                      className={`city-dropdown-item${selectedCity === city ? ' active' : ''}`}
                      onClick={() => handleCitySelect(city)}
                      role="menuitem"
                    >
                      {city === 'All' ? 'All Locations' : city}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="search-wrap">
            <form onSubmit={handleSearch}>
              <div className="input-container">
                <Search size={18} color="#ffffff" />
                <input
                  type="search"
                  placeholder="Search movies, concerts, comedy, sports..."
                  aria-label="Search events"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </form>
          </div>

          <div className="nav-actions">
            {isLoggedIn ? (
              <>
                <button
                  className="wallet-btn"
                  type="button"
                  onClick={() => { navigate('/dashboard'); setIsMenuOpen(false) }}
                  title="View wallet details"
                >
                  <Wallet size={16} />
                  <span className="wallet-label">Wallet</span>
                  <span className="wallet-balance">{loadingWallet ? '...' : `Rs ${walletBalance.toLocaleString('en-IN')}`}</span>
                </button>
                <button className="btn btn-light" type="button" onClick={() => { navigate('/dashboard'); setIsMenuOpen(false) }}>
                  {loggedInUsername}
                </button>
                <button className="btn btn-strong" type="button" onClick={handleLogout}>
                  Logout
                </button>
              </>
            ) : (
              <>
                <button className="btn btn-light" type="button" onClick={() => { navigate('/login'); setIsMenuOpen(false) }}>
                  Login
                </button>
                <button className="btn btn-strong" type="button" onClick={() => { navigate('/signup'); setIsMenuOpen(false) }}>
                  Join Now
                </button>
              </>
            )}
          </div>
        </div>

        <button
          className="menu-toggle"
          type="button"
          aria-label="Toggle menu"
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen((current) => !current)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      <div className={`navbar-bottom ${isMenuOpen ? 'open' : ''}`}>
        <nav className="service-tabs" aria-label="Service categories">
          {services.map((service) => (
            <button
              key={service}
              type="button"
              className={selectedType === service.toLowerCase() ? 'service-tab active' : 'service-tab'}
              onClick={() => handleTypeSelect(service)}
            >
              {service}
            </button>
          ))}
        </nav>

        <nav className="nav-links" aria-label="Primary navigation">
          <a onClick={handleBrowseClick} style={{ cursor: 'pointer' }}><Compass size={14} style={{ verticalAlign: 'middle', marginRight: 6 }} />Browse</a>
          <a onClick={() => { navigate('/offers'); setIsMenuOpen(false) }} style={{ cursor: 'pointer' }}><Sparkles size={14} style={{ verticalAlign: 'middle', marginRight: 6 }} />Coupons</a>
          <a onClick={() => { navigate('/bookings'); setIsMenuOpen(false) }} style={{ cursor: 'pointer' }}>My List</a>
          <a onClick={() => { navigate('/resale'); setIsMenuOpen(false) }} style={{ cursor: 'pointer' }}>Resale</a>
          <a onClick={handleOpenOrganizerPortal} style={{ cursor: 'pointer' }}>Organizer</a>
          <a onClick={() => { navigate('/help'); setIsMenuOpen(false) }} style={{ cursor: 'pointer' }}>Support</a>
        </nav>
      </div>
    </motion.header>
  )
}

export default Navbar

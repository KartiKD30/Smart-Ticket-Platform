import { useMemo, useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import API from "../services/api";
import "../css/Dashboard.css";

const bookingHistory = [
  { id: "TK-9012", event: "Pushpa 2", amount: 2499, status: "Confirmed", date: "Mar 28, 2026" },
  { id: "TK-8741", event: "Arijit Live", amount: 1800, status: "Confirmed", date: "Mar 15, 2026" },
  { id: "TK-7654", event: "IPL Match", amount: 3500, status: "Completed", date: "Feb 20, 2026" },
];

const heroSlides = [
  {
    image: "https://images.unsplash.com/photo-1524985069026-dd778a71c7b4",
    title: "Experience Entertainment",
    subtitle: "Movies, events and sports in one fast-moving dashboard.",
  },
  {
    image: "https://images.unsplash.com/photo-1507874457470-272b3c8d8ee2",
    title: "Live Concerts Near You",
    subtitle: "Jump into tonight's shows before the best seats disappear.",
  },
  {
    image: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e",
    title: "Sports Action Live",
    subtitle: "Track premium matches and book standout seats in seconds.",
  },
];

const allItems = [
  { id: 1, name: "Pushpa 2", genre: "Action", rating: "9.0", image: "https://images.unsplash.com/photo-1497032628192-86f99bcd76bc" },
  { id: 2, name: "KGF 3", genre: "Action", rating: "8.8", image: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c" },
  { id: 3, name: "Leo", genre: "Thriller", rating: "8.5", image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba" },
  { id: 4, name: "Arijit Live", genre: "Concert", rating: "9.5", image: "https://images.unsplash.com/photo-1507874457470-272b3c8d8ee2" },
  { id: 5, name: "Standup Night", genre: "Comedy", rating: "8.2", image: "https://images.unsplash.com/photo-1521336575822-6da63fb45455" },
  { id: 6, name: "IPL Match", genre: "Cricket", rating: "9.2", image: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e" },
];

const discoverSections = [
  { key: "all", label: "All", items: allItems },
  {
    key: "movies",
    label: "Movies",
    items: [
      { id: 1, name: "Pushpa 2", genre: "Action", rating: "9.0", image: "https://images.unsplash.com/photo-1497032628192-86f99bcd76bc" },
      { id: 2, name: "KGF 3", genre: "Action", rating: "8.8", image: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c" },
      { id: 3, name: "Leo", genre: "Thriller", rating: "8.5", image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba" },
    ],
  },
  {
    key: "events",
    label: "Events",
    items: [
      { id: 4, name: "Arijit Live", genre: "Concert", rating: "9.5", image: "https://images.unsplash.com/photo-1507874457470-272b3c8d8ee2" },
      { id: 5, name: "Standup Night", genre: "Comedy", rating: "8.2", image: "https://images.unsplash.com/photo-1521336575822-6da63fb45455" },
    ],
  },
  {
    key: "sports",
    label: "Sports",
    items: [
      { id: 6, name: "IPL Match", genre: "Cricket", rating: "9.2", image: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e" },
    ],
  },
];

const quickActions = [
  { icon: "01", label: "Browse Events", path: "/events" },
  { icon: "02", label: "My Bookings", path: "/bookings" },
  { icon: "03", label: "Offers", path: "/offers" },
  { icon: "04", label: "History", path: "/history" },
];

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.08,
    },
  },
};

const sectionVariants = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 18, scale: 0.96 },
  show: (index = 0) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.45,
      delay: index * 0.05,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

const headingSwapVariants = {
  enter: { opacity: 0, y: 22, scale: 0.98 },
  center: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.45, ease: "easeOut" } },
  exit: { opacity: 0, y: -18, scale: 1.02, transition: { duration: 0.28, ease: "easeIn" } },
};

const categoryToType = (category = "") => {
  const normalized = category.toLowerCase();
  if (normalized.includes("sport")) return "sports";
  if (normalized.includes("music") || normalized.includes("concert")) return "events";
  if (normalized.includes("comedy")) return "events";
  if (normalized.includes("conference") || normalized.includes("workshop") || normalized.includes("theatre") || normalized.includes("play")) return "events";
  if (normalized.includes("entertainment")) return "events";
  return "events";
};

function useCountUp(target, duration = 1200) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let current = 0;
    const steps = 40;
    const increment = target / steps;
    const delay = duration / steps;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, delay);
    return () => clearInterval(timer);
  }, [target, duration]);

  return count;
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good Morning";
  if (h < 17) return "Good Afternoon";
  return "Good Evening";
}

export default function Dashboard() {
  const navigate = useNavigate();
  const username = localStorage.getItem("username") || "User";

  const [activeTab, setActiveTab] = useState("all");
  const [slideIndex, setSlideIndex] = useState(0);
  const [isSliding, setIsSliding] = useState(false);
  const [walletBalance, setWalletBalance] = useState(0);
  const [loadingWallet, setLoadingWallet] = useState(true);
  const [approvedEvents, setApprovedEvents] = useState([]);
  const [loadingApprovedEvents, setLoadingApprovedEvents] = useState(true);

  const walletCount = useCountUp(walletBalance, 1400);

  useEffect(() => {
    fetchWalletBalance();
    fetchApprovedEvents();
  }, []);

  const fetchWalletBalance = async () => {
    try {
      const token = localStorage.getItem("access");
      if (!token) {
        setLoadingWallet(false);
        return;
      }

      const response = await API.get("/auth/wallet/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setWalletBalance(response.data.wallet?.balance || 0);
    } catch (error) {
      console.error("Failed to fetch wallet:", error);
    } finally {
      setLoadingWallet(false);
    }
  };

  const fetchApprovedEvents = async () => {
    try {
      setLoadingApprovedEvents(true);
      const response = await API.get("/events/public/approved");
      const events = Array.isArray(response.data?.data) ? response.data.data : [];

      const normalizedEvents = events
        .map((event) => ({
          id: event._id || event.id,
          _id: event._id || event.id,
          name: event.title || event.name,
          genre: event.category || "Event",
          rating: "New",
          image: event.imageUrl || event.images?.[0] || "https://images.unsplash.com/photo-1540575467063-178f50002cbc",
          city: event.city || "",
          price: event.price || 0,
          type: categoryToType(event.category),
          venue: event.venue || "",
          date: event.date,
          description: event.description || "",
          category: event.category || "Event",
          availableTickets: event.availableTickets,
          totalTickets: event.totalTickets,
        }))
        .sort((a, b) => new Date(a.date || 0) - new Date(b.date || 0));

      setApprovedEvents(normalizedEvents);
    } catch (error) {
      console.error("Failed to fetch approved events:", error);
      setApprovedEvents([]);
    } finally {
      setLoadingApprovedEvents(false);
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setIsSliding(true);
      setTimeout(() => {
        setSlideIndex((prev) => (prev + 1) % heroSlides.length);
        setIsSliding(false);
      }, 300);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const goToSlide = (index) => {
    if (index === slideIndex) return;
    setIsSliding(true);
    setTimeout(() => {
      setSlideIndex(index);
      setIsSliding(false);
    }, 300);
  };

  const logout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("username");
    toast.success("Logout successful!");
    navigate("/login");
  };

  const mergedDiscoverSections = useMemo(() => {
    const approvedEventItems = approvedEvents.filter((item) => item.type !== "sports");
    const approvedSportsItems = approvedEvents.filter((item) => item.type === "sports");

    return discoverSections.map((section) => {
      if (section.key === "all") {
        return {
          ...section,
          items: [...section.items, ...approvedEvents],
        };
      }

      if (section.key === "events") {
        return {
          ...section,
          items: [...section.items, ...approvedEventItems],
        };
      }

      if (section.key === "sports") {
        return {
          ...section,
          items: [...section.items, ...approvedSportsItems],
        };
      }

      return section;
    });
  }, [approvedEvents]);

  const activeSection = mergedDiscoverSections.find((s) => s.key === activeTab) || { items: [] };
  const activeTabIndex = Math.max(mergedDiscoverSections.findIndex((s) => s.key === activeTab), 0);

  return (
    <motion.main className="dashboard-page" aria-label="User dashboard" variants={containerVariants} initial="hidden" animate="show">
      <motion.section className="dashboard-header" variants={sectionVariants}>
        <div className="dashboard-header__glow dashboard-header__glow--one" />
        <div className="dashboard-header__glow dashboard-header__glow--two" />
        <div>
          <p className="dashboard-greeting">{getGreeting()},</p>
          <h1 className="dashboard-title">{username}</h1>
          <p className="dashboard-subtitle">Track live updates and manage your account with a more cinematic flow.</p>
        </div>
        <div className="dashboard-header__actions">
          <motion.button className="btn btn-strong" type="button" onClick={logout} whileHover={{ y: -2, scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            Logout
          </motion.button>
        </div>
      </motion.section>

      <motion.section className="db-quick-actions" aria-label="Quick actions" variants={sectionVariants}>
        <motion.div className="db-wallet-card" whileHover={{ y: -6, scale: 1.01 }} transition={{ duration: 0.25 }}>
          <div className="db-wallet-card__shine" />
          <span className="db-wallet-icon">Rs</span>
          <div className="db-wallet-info">
            <p className="db-wallet-label">Wallet Balance</p>
            <p className="db-wallet-balance">Rs. {(loadingWallet ? 0 : walletCount).toLocaleString("en-IN")}</p>
            <small className="db-wallet-tip">Earn rewards on every booking</small>
          </div>
          <div className="db-wallet-pulse" />
        </motion.div>

        {quickActions.map((action, index) => (
          <motion.button
            key={action.label}
            className="db-quick-action"
            type="button"
            onClick={() => navigate(action.path)}
            custom={index}
            variants={cardVariants}
            whileHover={{ y: -8, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="db-quick-action__glow" />
            <span className="db-quick-action__icon">{action.icon}</span>
            <span className="db-quick-action__label">{action.label}</span>
          </motion.button>
        ))}
      </motion.section>

      <motion.div className="dashboard-hero" variants={sectionVariants}>
        <div className="dashboard-hero__ambient dashboard-hero__ambient--left" />
        <div className="dashboard-hero__ambient dashboard-hero__ambient--right" />
        <AnimatePresence mode="wait">
          <motion.img
            key={heroSlides[slideIndex].image}
            src={heroSlides[slideIndex].image}
            alt="Entertainment hero"
            className={`dashboard-hero__img${isSliding ? " dashboard-hero__img--fade" : ""}`}
            initial={{ scale: 1.08, opacity: 0.2 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.04, opacity: 0 }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          />
        </AnimatePresence>
        <div className="dashboard-hero__overlay" />
        <div className="dashboard-hero__scanline" />
        <div className="dashboard-hero__progress">
          <motion.span
            key={slideIndex}
            className="dashboard-hero__progress-bar"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 4, ease: "linear" }}
          />
        </div>
        <AnimatePresence mode="wait">
          <motion.div key={slideIndex} className="dashboard-hero__content" variants={headingSwapVariants} initial="enter" animate="center" exit="exit">
            <div className="dashboard-hero__eyebrow">Fresh picks for tonight</div>
            <h2 className="dashboard-hero__title">{heroSlides[slideIndex].title}</h2>
            <p className="dashboard-hero__sub">{heroSlides[slideIndex].subtitle}</p>
            <motion.button className="dashboard-hero__btn" onClick={() => navigate("/events")} whileHover={{ y: -2, scale: 1.03 }} whileTap={{ scale: 0.98 }}>
              Explore Now
            </motion.button>
          </motion.div>
        </AnimatePresence>
        <div className="dashboard-hero__dots">
          {heroSlides.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Slide ${i + 1}`}
              className={`dashboard-hero__dot${i === slideIndex ? " dashboard-hero__dot--active" : ""}`}
              onClick={() => goToSlide(i)}
            />
          ))}
        </div>
      </motion.div>

      <motion.section className="dashboard-discover" variants={sectionVariants}>
        <div className="dashboard-discover__head">
          <div>
            <p className="dashboard-discover__eyebrow">Discover</p>
            <h2 className="dashboard-discover__title">Fast-moving picks</h2>
          </div>
          <p className="dashboard-discover__meta">
            {loadingApprovedEvents ? "Refreshing event feed..." : `${activeSection.items.length} cards ready to explore`}
          </p>
        </div>
        <div className="db-section-tabs">
          {mergedDiscoverSections.map((s) => (
            <motion.button
              key={s.key}
              type="button"
              className={`db-section-tab${activeTab === s.key ? " db-section-tab--active" : ""}`}
              onClick={() => setActiveTab(s.key)}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              {activeTab === s.key && (
                <motion.span
                  className="db-section-tab__active-glow"
                  layoutId="dashboard-active-tab"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              <span className="db-section-tab__label">{s.label}</span>
            </motion.button>
          ))}
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            className="dashboard-scroll-row"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
          >
            {activeSection.items.map((item, index) => (
              <motion.div
                key={`${activeTab}-${item.id}-${index}`}
                className="dashboard-event-card"
                onClick={() => navigate(`/event/${item.id}`, { state: item })}
                custom={index}
                variants={cardVariants}
                initial="hidden"
                animate="show"
                whileHover={{ y: -8, rotateX: 2, rotateY: index % 2 === 0 ? -2 : 2 }}
                style={{ "--card-delay": `${(index + activeTabIndex) * 0.04}s` }}
              >
                <div className="dashboard-event-card__img-wrap">
                  <img src={item.image} alt={item.name} className="dashboard-event-card__img" />
                  <div className="dashboard-event-card__overlay">
                    <button className="dashboard-event-card__book-btn" type="button" onClick={(e) => { e.stopPropagation(); navigate(`/event/${item.id}`, { state: item }); }}>
                      Book Now
                    </button>
                  </div>
                  <span className="dashboard-event-card__rating">{item.rating}</span>
                </div>
                <p className="dashboard-event-card__name">{item.name}</p>
                <span className="dashboard-event-card__genre">{item.genre}</span>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </motion.section>

      <motion.section className="db-recent" variants={sectionVariants}>
        <div className="db-recent__head">
          <h2 className="db-recent__title">Recent Bookings</h2>
          <button type="button" className="db-recent__view-all" onClick={() => navigate("/history")}>
            View All
          </button>
        </div>
        <div className="db-recent__list">
          {bookingHistory.map((booking, index) => (
            <motion.div
              key={booking.id}
              className="db-recent-item"
              custom={index}
              variants={cardVariants}
              initial="hidden"
              animate="show"
              whileHover={{ x: 8 }}
            >
              <div className="db-recent-item__left">
                <span className="db-recent-item__icon">TK</span>
                <div>
                  <p className="db-recent-item__event">{booking.event}</p>
                  <p className="db-recent-item__date">{booking.date}</p>
                </div>
              </div>
              <div className="db-recent-item__right">
                <span className={`db-recent-item__status db-status--${booking.status.toLowerCase()}`}>
                  {booking.status}
                </span>
                <p className="db-recent-item__amount">Rs. {booking.amount.toLocaleString("en-IN")}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>
    </motion.main>
  );
}

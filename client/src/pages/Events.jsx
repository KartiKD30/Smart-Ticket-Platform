import { useMemo, useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Flame, Heart, Sparkles, Ticket, Zap } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import SplitType from "split-type";
import API from "../services/api";
import "../css/Events.css";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const cities = ["All", "Bangalore", "Mumbai", "Delhi", "Hyderabad", "Chennai", "Pune", "Goa"];

const categoryToType = (category = "") => {
  const normalized = category.toLowerCase();
  if (normalized.includes("sport")) return "sports";
  if (normalized.includes("music") || normalized.includes("concert")) return "music";
  if (normalized.includes("comedy")) return "comedy";
  if (
    normalized.includes("conference") ||
    normalized.includes("workshop") ||
    normalized.includes("theatre") ||
    normalized.includes("play")
  ) {
    return "play";
  }
  if (normalized.includes("entertainment")) return "comedy";
  return "play";
};

const pageVariants = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      staggerChildren: 0.08,
    },
  },
};

const blockVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

export default function Events() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const pageRef = useRef(null);
  const heroTitleRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [databaseEvents, setDatabaseEvents] = useState([]);

  const [selectedCity, setSelectedCity] = useState(() => {
    const urlCity = new URLSearchParams(window.location.search).get("city");
    const storedCity = localStorage.getItem("selectedCity");
    return urlCity || storedCity || "All";
  });
  const [selectedType, setSelectedType] = useState(() => {
    const urlType = new URLSearchParams(window.location.search).get("type");
    return urlType || "all";
  });
  const [sortBy, setSortBy] = useState("recommended");
  const [maxPrice, setMaxPrice] = useState(5000);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const response = await API.get("/events/public/approved");
        if (response.data && response.data.data) {
          const transformedEvents = response.data.data.map((event) => ({
            id: event._id || event.id,
            _id: event._id || event.id,
            name: event.title || event.name,
            title: event.title,
            city: event.city || "All",
            price: event.price || 0,
            type: categoryToType(event.category),
            category: event.category || "Event",
            venue: event.venue || "",
            venueAddress: event.venue || "",
            image:
              event.imageUrl ||
              event.images?.[0] ||
              "https://images.unsplash.com/photo-1540575467063-178f50002cbc",
            date: event.date,
            description: event.description,
            totalTickets: event.totalTickets,
            availableTickets: event.availableTickets,
            organizer: event.organizer,
            source: "created",
          }));
          setDatabaseEvents(transformedEvents);
        }
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const movies = [
    { id: 0, name: "Dhurandhar", city: "Mumbai", price: 360, type: "movies", image: "https://assets-in.bmscdn.com/iedb/movies/images/mobile/thumbnail/xlarge/dhurandhar-the-revenge-et00478890-1772893614.jpg" },
    { id: 1, name: "KGF Chapter 2", city: "Bangalore", price: 300, type: "movies", image: "https://m.media-amazon.com/images/M/MV5BZjY0NzdiODktZTUwYi00MDU5LWE2NjgtOTg3YjUyMmMxZGNhXkEyXkFqcGc@._V1_QL75_UX582_.jpg" },
    { id: 2, name: "RRR", city: "Hyderabad", price: 250, type: "movies", image: "https://assets-in.bmscdn.com/iedb/movies/images/extra/vertical_logo/mobile/thumbnail/xxlarge/rrr-et00094579-1700135873.jpg" },
    { id: 3, name: "Kantara", city: "Bangalore", price: 220, type: "movies", image: "https://assets-in.bmscdn.com/iedb/movies/images/mobile/thumbnail/xlarge/kantara-hindi-et00342025-1665304124.jpg" },
    { id: 4, name: "Jawan", city: "Mumbai", price: 350, type: "movies", image: "https://assets-in.bmscdn.com/iedb/movies/images/mobile/thumbnail/xlarge/jawan-et00330424-1693892482.jpg" },
    { id: 5, name: "Pathaan", city: "Delhi", price: 320, type: "movies", image: "https://assets-in.bmscdn.com/iedb/movies/images/mobile/thumbnail/xlarge/pathaan-et00323848-1674372556.jpg" },
    { id: 6, name: "Leo", city: "Chennai", price: 280, type: "movies", image: "https://assets-in.bmscdn.com/iedb/movies/images/mobile/thumbnail/xlarge/leo-et00351731-1675663884.jpg" },
    { id: 7, name: "Salaam", city: "Pune", price: 300, type: "movies", image: "https://assets-in.bmscdn.com/iedb/movies/images/mobile/thumbnail/xlarge/salaam--marathi--et00021681-24-03-2017-17-22-46.jpg" },
    { id: 8, name: "Animal", city: "Mumbai", price: 340, type: "movies", image: "https://assets-in.bmscdn.com/iedb/movies/images/mobile/thumbnail/xlarge/animal-et00311762-1672646524.jpg" },
  ];

  const upcomingMovies = [
    { id: 21, name: "Pushpa 2", city: "All", price: 350, type: "movies", image: "https://assets-in.bmscdn.com/iedb/movies/images/mobile/thumbnail/xlarge/pushpa-2-the-rule-et00356724-1737184762.jpg" },
    { id: 22, name: "Dunki", city: "All", price: 300, type: "movies", image: "https://assets-in.bmscdn.com/iedb/movies/images/mobile/thumbnail/xlarge/dunki-et00326964-1703064829.jpg" },
    { id: 23, name: "Game Changer", city: "All", price: 330, type: "movies", image: "https://assets-in.bmscdn.com/iedb/movies/images/mobile/thumbnail/xlarge/game-changer-et00311772-1731311322.jpg" },
  ];

  const events = [
    { id: 101, name: "Arijit Singh Live", city: "Bangalore", price: 1500, type: "music", venue: "Phoenix Arena", venueAddress: "Phoenix Arena, 560001, MG Road, Ashok Nagar, Bengaluru, Karnataka", image: "https://images.unsplash.com/photo-1507874457470-272b3c8d8ee2" },
    { id: 102, name: "Standup Comedy Night", city: "Pune", price: 800, type: "comedy", venue: "Bal Gandharva Rang Mandir", venueAddress: "Bal Gandharva Rang Mandir, JM Road, Shivajinagar, Pune, Maharashtra 411005", image: "https://in.bmscdn.com/Artist/1085821.jpg" },
    { id: 103, name: "Tech Conference 2026", city: "Hyderabad", price: 1200, type: "play", venue: "HITEX Exhibition Centre", venueAddress: "HITEX Exhibition Centre, Izzat Nagar, Kondapur, Hyderabad, Telangana 500084", image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df" },
    { id: 104, name: "EDM Festival Goa", city: "Goa", price: 2500, type: "music", venue: "Vagator Beach Grounds", venueAddress: "Vagator Beach Grounds, Vagator, Bardez, North Goa, Goa 403509", image: "https://images.unsplash.com/photo-1506157786151-b8491531f063" },
    { id: 105, name: "Coldplay Concert", city: "Mumbai", price: 5000, type: "music", venue: "DY Patil Stadium", venueAddress: "DY Patil Stadium, Sector 7, Nerul, Navi Mumbai, Maharashtra 400706", image: "https://images.unsplash.com/photo-1497032205916-ac775f0649ae" },
    { id: 106, name: "IPL Match - MI vs CSK", city: "Mumbai", price: 2000, type: "sports", venue: "Wankhede Stadium", venueAddress: "Wankhede Stadium, D Road, Churchgate, Mumbai, Maharashtra 400020", image: "https://images.unsplash.com/photo-1543326727-cf6c39e8f84c" },
  ];

  const upcomingEvents = [
    { id: 201, name: "Sunburn Festival 2026", city: "Goa", price: 3500, type: "music", venue: "Sunburn Arena", venueAddress: "Sunburn Arena, Candolim Beach Road, Candolim, Goa 403515", image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745" },
    { id: 202, name: "Startup Summit India", city: "Bangalore", price: 1800, type: "play", venue: "KTPO Trade Center", venueAddress: "KTPO Trade Center, Whitefield, Bengaluru, Karnataka 560066", image: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678" },
    { id: 203, name: "Comedy Fest", city: "Mumbai", price: 900, type: "comedy", venue: "Nehru Centre Auditorium", venueAddress: "Nehru Centre Auditorium, Dr Annie Besant Road, Worli, Mumbai, Maharashtra 400018", image: "https://assets-in.bmscdn.com/nmcms/events/banner/weblisting/vipul-goyal-unleashed-surat-et00476535-2025-12-16-t-8-33-46.jpg" },
  ];

  useEffect(() => {
    const typeParam = searchParams.get("type");
    if (typeParam) {
      setSelectedType(typeParam.toLowerCase());
    } else if (!typeParam) {
      setSelectedType("all");
    }
  }, [searchParams]);

  useEffect(() => {
    const cityParam = searchParams.get("city");
    if (cityParam && cities.includes(cityParam)) {
      setSelectedCity(cityParam);
    } else if (!cityParam) {
      const storedCity = localStorage.getItem("selectedCity");
      if (storedCity && cities.includes(storedCity)) {
        setSelectedCity(storedCity);
      }
    }
  }, [searchParams]);

  useEffect(() => {
    localStorage.setItem("selectedCity", selectedCity);
  }, [selectedCity]);

  const allItems = useMemo(
    () => [...movies, ...upcomingMovies, ...events, ...upcomingEvents, ...databaseEvents],
    [databaseEvents]
  );

  const mergedLiveEvents = useMemo(() => {
    const now = new Date();
    const createdLiveEvents = databaseEvents.filter((event) => {
      if (event.type === "movies") return false;
      const eventDate = event.date ? new Date(event.date) : null;
      return !eventDate || eventDate <= now;
    });

    return [...events, ...createdLiveEvents];
  }, [databaseEvents]);

  const mergedUpcomingEvents = useMemo(() => {
    const now = new Date();
    const createdUpcomingEvents = databaseEvents.filter((event) => {
      if (event.type === "movies") return false;
      const eventDate = event.date ? new Date(event.date) : null;
      return eventDate && eventDate > now;
    });

    return [...upcomingEvents, ...createdUpcomingEvents];
  }, [databaseEvents]);

  const filteredCount = useMemo(() => {
    const searchQuery = searchParams.get("search") || "";
    return allItems.filter((item) => {
      const cityMatch =
        selectedCity === "All" ||
        item.city?.toLowerCase() === selectedCity.toLowerCase() ||
        item.city === "All";
      const typeMatch = selectedType === "all" || item.type === selectedType;
      const priceMatch = item.price <= maxPrice;
      const searchMatch =
        !searchQuery ||
        item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.category && item.category.toLowerCase().includes(searchQuery.toLowerCase()));
      return cityMatch && typeMatch && priceMatch && searchMatch;
    }).length;
  }, [allItems, maxPrice, selectedCity, selectedType, searchParams]);

  useGSAP(
    () => {
      if (loading || !heroTitleRef.current) {
        return undefined;
      }

      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduceMotion) {
        gsap.set(
          [
            ".events-hero__badge",
            ".events-hero__sub",
            ".events-hero__metrics",
            ".events-hero__art",
            ".events-toolbar",
            ".events-section__head",
            ".events-card",
          ],
          { clearProps: "all" }
        );
        return undefined;
      }

      const split = new SplitType(heroTitleRef.current, {
        types: "lines, words",
        lineClass: "events-hero__title-line",
        wordClass: "events-hero__title-word",
      });

      const introTimeline = gsap.timeline({ defaults: { ease: "power3.out" } });
      introTimeline
        .from(split.words, {
          yPercent: 130,
          rotateX: -65,
          opacity: 0,
          duration: 1,
          stagger: 0.045,
        })
        .from(
          ".events-hero__badge, .events-hero__sub, .events-hero__metrics > *, .events-hero__art-card, .events-toolbar",
          {
            y: 32,
            opacity: 0,
            duration: 0.72,
            stagger: 0.08,
          },
          "-=0.58"
        );

      gsap.to(".events-hero__art-card--primary", {
        yPercent: -8,
        rotate: 2,
        duration: 4.4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      gsap.to(".events-hero__art-card--secondary", {
        yPercent: -12,
        xPercent: 4,
        rotate: -3,
        duration: 5.2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      gsap.to(".events-hero__art-glow", {
        scale: 1.16,
        opacity: 0.9,
        duration: 3.8,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      gsap.to(".events-hero", {
        backgroundPosition: "center 56%",
        ease: "none",
        scrollTrigger: {
          trigger: ".events-hero",
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      return () => {
        split.revert();
      };
    },
    { scope: pageRef, dependencies: [loading] }
  );

  const applyFiltersAndSort = (data) => {
    const searchQuery = searchParams.get("search") || "";
    const filtered = data.filter((item) => {
      const cityMatch =
        selectedCity === "All" ||
        item.city?.toLowerCase() === selectedCity.toLowerCase() ||
        item.city === "All";
      const typeMatch = selectedType === "all" || item.type === selectedType;
      const priceMatch = item.price <= maxPrice;
      const searchMatch =
        !searchQuery ||
        item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.category && item.category.toLowerCase().includes(searchQuery.toLowerCase()));
      return cityMatch && typeMatch && priceMatch && searchMatch;
    });

    if (sortBy === "priceLow") return [...filtered].sort((a, b) => a.price - b.price);
    if (sortBy === "priceHigh") return [...filtered].sort((a, b) => b.price - a.price);
    if (sortBy === "name") return [...filtered].sort((a, b) => a.name.localeCompare(b.name));
    return filtered;
  };

  const toggleFavorite = (id) => {
    setFavorites((prev) => (prev.includes(id) ? prev.filter((entry) => entry !== id) : [...prev, id]));
  };

  const getRating = (id) => (8 + (id % 20) / 10).toFixed(1);

  const renderRow = (title, subtitle, data, icon) => {
    const rows = applyFiltersAndSort(data);

    return (
      <section className="events-section" aria-label={title}>
        <div className="events-section__head">
          <div>
            <h2 className="events-section-title">
              <span className="events-section-title__icon">{icon}</span>
              {title}
            </h2>
            <p className="events-section-sub">{subtitle}</p>
          </div>
          <span className="events-count-pill">{rows.length} results</span>
        </div>

        {rows.length === 0 ? (
          <div className="events-empty">
            <p>No matches for current filters in this section.</p>
          </div>
        ) : (
          <div className="events-row">
            {rows.map((item, index) => {
              const isFav = favorites.includes(item.id);

              return (
                <motion.article
                  key={item.id}
                  className="events-card"
                  whileHover={{ y: -10, rotateX: 4, rotateY: index % 2 === 0 ? 3 : -3 }}
                  transition={{ type: "spring", stiffness: 220, damping: 18 }}
                  onClick={() => navigate(`/event/${item.id}`, { state: item })}
                >
                  <div className="events-card__media">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="events-card__poster"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = "https://picsum.photos/seed/ticketx-fallback/400/600";
                      }}
                    />
                    <span className="events-card__rating">{getRating(item.id)} IMDb</span>
                    <span className="events-card__glow"></span>
                    <button
                      type="button"
                      className={`events-card__fav${isFav ? " events-card__fav--active" : ""}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(item.id);
                      }}
                      aria-label={isFav ? "Remove favorite" : "Add favorite"}
                    >
                      <Heart size={16} fill={isFav ? "currentColor" : "none"} />
                    </button>
                  </div>
                  <h4 className="events-card__name">{item.name}</h4>
                  {item.source === "created" && <p className="events-card__city">Created Event</p>}
                  <p className="events-card__city">{item.city}</p>
                  <div className="events-card__foot">
                    <p className="events-card__price">Rs. {item.price}</p>
                    <span className="events-card__cta">
                      Book <ArrowRight size={12} />
                    </span>
                  </div>
                </motion.article>
              );
            })}
          </div>
        )}
      </section>
    );
  };

  if (loading) {
    return (
      <div className="events-page">
        <section className="events-hero events-hero--loading">
          <div className="events-skeleton events-skeleton--title" />
          <div className="events-skeleton events-skeleton--text" />
          <div className="events-skeleton events-skeleton--text short" />
        </section>
      </div>
    );
  }

  return (
    <motion.div ref={pageRef} className="events-page" initial="hidden" animate="show" variants={pageVariants}>
      <motion.header className="events-hero" variants={blockVariants}>
        <div className="events-hero__content">
          <div className="events-hero__badge">
            <Sparkles size={14} />
            Curated live experiences
          </div>
          <h1 ref={heroTitleRef} className="events-hero__title">
            Discover events that feel worth stepping out for.
          </h1>
          <p className="events-hero__sub">
            Browse city-specific drops, premium concerts, festivals, comedy nights, and blockbuster
            screenings with a smoother booking flow.
          </p>
          <div className="events-hero__metrics">
            <div className="events-metric">
              <Ticket size={16} />
              <span>{filteredCount}+ picks live</span>
            </div>
            <div className="events-metric">
              <Flame size={16} />
              <span>Fast-selling drops</span>
            </div>
            <div className="events-metric">
              <Zap size={16} />
              <span>Lightning quick checkout</span>
            </div>
          </div>
        </div>

        <div className="events-hero__art" aria-hidden="true">
          <div className="events-hero__art-glow" />
          <div className="events-hero__art-card events-hero__art-card--primary">
            <span className="events-hero__art-kicker">Tonight's highlight</span>
            <strong>Midnight arena vibes</strong>
            <p>Sound, lights, and last-minute drops staged like a streaming premiere.</p>
          </div>
          <div className="events-hero__art-card events-hero__art-card--secondary">
            <span className="events-hero__art-stat">Top picks</span>
            <strong>128</strong>
            <p>Fresh releases across movies, concerts, sports, and comedy.</p>
          </div>
        </div>
      </motion.header>

      <motion.section className="events-toolbar" aria-label="Filters and sorting" variants={blockVariants}>
        <div className="events-toolbar__group">
          <label htmlFor="sortBy">Sort</label>
          <select id="sortBy" className="events-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="recommended">Recommended</option>
            <option value="priceLow">Price: Low to High</option>
            <option value="priceHigh">Price: High to Low</option>
            <option value="name">Name (A-Z)</option>
          </select>
        </div>

        <div className="events-toolbar__group events-toolbar__group--range">
          <label htmlFor="maxPrice">Max Price: Rs. {maxPrice}</label>
          <input
            id="maxPrice"
            type="range"
            min="200"
            max="5000"
            step="100"
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
          />
        </div>

        <div className="events-toolbar__summary">
          Showing <strong>{filteredCount}</strong> items
        </div>
      </motion.section>

      {(selectedType === "all" || selectedType === "movies") &&
        renderRow("Now Showing", "Current theatrical releases", movies, <Flame size={18} />)}
      {(selectedType === "all" || selectedType === "movies") &&
        renderRow("Upcoming Movies", "Advance booking now open", upcomingMovies, <Sparkles size={18} />)}
      {(selectedType === "all" || ["music", "comedy", "play", "sports"].includes(selectedType)) &&
        renderRow("Live Events", "Concerts, comedy and tech gatherings", mergedLiveEvents, <Zap size={18} />)}
      {(selectedType === "all" || ["music", "comedy", "play", "sports"].includes(selectedType)) &&
        renderRow("Upcoming Events", "Plan your next outing ahead", mergedUpcomingEvents, <Ticket size={18} />)}
    </motion.div>
  );
}

import { useMemo, useState, useEffect, useRef } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { CalendarDays, Heart, MapPin, ShieldCheck, Star, Ticket } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import SplitType from "split-type";
import API from "../services/api";
import "../css/EventDetails.css";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const EVENT_FALLBACKS = [
  {
    id: 1,
    name: "Dhurandhar",
    city: "Mumbai",
    category: "Action",
    price: 360,
    date: "Apr 20, 2026",
    image:
      "https://assets-in.bmscdn.com/iedb/movies/images/mobile/thumbnail/xlarge/dhurandhar-the-revenge-et00478890-1772893614.jpg",
    venue: "INOX Megaplex",
  },
  {
    id: 101,
    name: "Arijit Singh Live",
    city: "Bangalore",
    category: "Concert",
    price: 1500,
    date: "May 05, 2026",
    image:
      "https://images.unsplash.com/photo-1507874457470-272b3c8d8ee2?auto=format&fit=crop&w=1200&q=80",
    venue: "Phoenix Arena",
  },
];

export default function EventDetails() {
  const { state } = useLocation();
  const { id } = useParams();
  const navigate = useNavigate();
  const pageRef = useRef(null);
  const titleRef = useRef(null);
  const [loadingEvent, setLoadingEvent] = useState(!state);
  const [fetchedEvent, setFetchedEvent] = useState(null);

  const [activeTab, setActiveTab] = useState("overview");
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    if (!state && id) {
      const fetchEvent = async () => {
        try {
          setLoadingEvent(true);
          const response = await API.get(`/events/public/${id}`);
          if (response.data) {
            const event = response.data;
            setFetchedEvent({
              id: event._id,
              _id: event._id,
              name: event.title,
              city: event.city || "Unknown",
              category: event.category || "Event",
              price: event.price,
              date: new Date(event.date).toLocaleDateString(),
              image: event.imageUrl || "https://picsum.photos/seed/event/800/600",
              venue: event.venue,
              description: event.description,
              totalTickets: event.totalTickets,
              availableTickets: event.availableTickets,
            });
          }
        } catch (error) {
          console.error("Error fetching event:", error);
        } finally {
          setLoadingEvent(false);
        }
      };
      fetchEvent();
    } else {
      setLoadingEvent(false);
    }
  }, [id, state]);

  const event = useMemo(() => {
    if (state) return state;
    if (fetchedEvent) return fetchedEvent;
    const eventId = Number(id);
    return EVENT_FALLBACKS.find((entry) => entry.id === eventId) || null;
  }, [id, state, fetchedEvent]);

  useGSAP(
    () => {
      if (!event || !titleRef.current) {
        return undefined;
      }

      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduceMotion) {
        return undefined;
      }

      const split = new SplitType(titleRef.current, {
        types: "lines, words",
        lineClass: "ed-title-line",
        wordClass: "ed-title-word",
      });

      const introTimeline = gsap.timeline({ defaults: { ease: "power3.out" } });
      introTimeline
        .from(".ed-hero__backdrop", {
          scale: 1.14,
          duration: 1.4,
        })
        .from(
          split.words,
          {
            yPercent: 120,
            opacity: 0,
            duration: 0.9,
            stagger: 0.05,
          },
          "-=1.05"
        )
        .from(
          ".ed-hero__pill, .ed-hero__meta, .ed-hero__chips > *, .ed-poster, .ed-info",
          {
            y: 32,
            opacity: 0,
            duration: 0.72,
            stagger: 0.08,
          },
          "-=0.58"
        );

      gsap.from(".ed-tabs .ed-tab, .ed-panel", {
        y: 28,
        opacity: 0,
        duration: 0.7,
        stagger: 0.07,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".ed-content",
          start: "top 78%",
        },
      });

      gsap.to(".ed-hero__backdrop", {
        yPercent: 10,
        ease: "none",
        scrollTrigger: {
          trigger: ".ed-hero",
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      return () => {
        split.revert();
      };
    },
    { scope: pageRef, dependencies: [event, activeTab] }
  );

  if (loadingEvent) {
    return (
      <main className="ed-page">
        <div className="ed-no-data">
          <h2>Loading event details...</h2>
          <div className="ed-loader-ring" aria-hidden="true" />
        </div>
      </main>
    );
  }

  if (!event) {
    return (
      <main className="ed-page">
        <div className="ed-no-data">
          <h2>Event not found</h2>
          <button type="button" className="ed-book-btn" onClick={() => navigate("/events")}>
            Back to Events
          </button>
        </div>
      </main>
    );
  }

  const perTicket = event.price || 0;
  const isMovieEvent = event?.type === "movies";
  const locationLabel = isMovieEvent ? "Theater" : "Venue";
  const locationName = event.venue || (isMovieEvent ? "PVR Cinemas" : "Main Venue");
  const locationAddress = event?.venueAddress || `${locationName}, ${event.city || ""}`;
  const eventBlurb =
    event.description ||
    "Step into a premium night out with elevated production, sharp venue design, and a smoother booking experience from discovery to checkout.";
  const availabilityLabel =
    typeof event.availableTickets === "number"
      ? `${event.availableTickets} seats left`
      : "Limited seats available";

  return (
    <main ref={pageRef} className="ed-page">
      <section className="ed-hero">
        <img src={event.image} alt={event.name} className="ed-hero__img ed-hero__backdrop" />
        <div className="ed-hero__overlay" />
        <div className="ed-hero__content">
          <span className="ed-hero__pill">{event.category || "Entertainment"}</span>
          <h1 ref={titleRef}>{event.name}</h1>
          <p className="ed-hero__meta">{event.city} / {event.date || "Coming Soon"}</p>
          <div className="ed-hero__chips">
            <span><Star size={15} /> Premium crowd favorite</span>
            <span><Ticket size={15} /> {availabilityLabel}</span>
            <span><ShieldCheck size={15} /> Secure instant checkout</span>
          </div>
        </div>
      </section>

      <section className="ed-wrapper">
        <img src={event.image} alt={event.name} className="ed-poster" />

        <div className="ed-info">
          <div className="ed-info__top">
            <div>
              <h2 className="ed-info__title">{event.name}</h2>
              <p className="ed-info__meta">{event.city} / {locationLabel}: {locationName}</p>
            </div>
            <button
              type="button"
              className={`ed-like-btn${liked ? " ed-like-btn--active" : ""}`}
              onClick={() => setLiked((value) => !value)}
            >
              <Heart size={15} />
              {liked ? "Saved" : "Save"}
            </button>
          </div>

          <div className="ed-pricing">
            <p className="ed-info__price">Rs. {perTicket.toLocaleString("en-IN")}</p>
            <span>per ticket</span>
          </div>

          <p className="ed-info__blurb">{eventBlurb}</p>

          <div className="ed-info__highlights">
            <div className="ed-highlight">
              <CalendarDays size={16} />
              <div>
                <strong>Date</strong>
                <span>{event.date || "Coming Soon"}</span>
              </div>
            </div>
            <div className="ed-highlight">
              <MapPin size={16} />
              <div>
                <strong>{locationLabel}</strong>
                <span>{locationName}</span>
              </div>
            </div>
            <div className="ed-highlight">
              <Ticket size={16} />
              <div>
                <strong>Availability</strong>
                <span>{availabilityLabel}</span>
              </div>
            </div>
          </div>

          <div className="ed-actions">
            <button
              type="button"
              className="ed-book-btn"
              onClick={() => navigate(`/buytickets/${event.id}`, { state: event })}
            >
              Book Tickets
            </button>
            <button type="button" className="ed-secondary-btn" onClick={() => navigate("/events")}>
              More Events
            </button>
          </div>
        </div>
      </section>

      <section className="ed-content">
        <div className="ed-tabs">
          {[
            { key: "overview", label: "Overview" },
            { key: "venue", label: locationLabel },
            { key: "policy", label: "Policies" },
          ].map((tab) => (
            <button
              key={tab.key}
              type="button"
              className={`ed-tab${activeTab === tab.key ? " ed-tab--active" : ""}`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "overview" && (
          <div className="ed-panel">
            <h3>About this event</h3>
            <p>{eventBlurb}</p>
            <div className="ed-grid">
              <div className="ed-box"><strong>Date</strong><p>{event.date || "Coming Soon"}</p></div>
              <div className="ed-box"><strong>Category</strong><p>{event.category || "Entertainment"}</p></div>
              <div className="ed-box"><strong>Access</strong><p>Mobile ticket with instant confirmation</p></div>
            </div>
          </div>
        )}

        {activeTab === "venue" && (
          <div className="ed-panel">
            <h3>{locationLabel} details</h3>
            <div className="ed-grid">
              <div className="ed-box"><strong>{locationLabel}</strong><p>{locationName}</p></div>
              <div className="ed-box"><strong>Address</strong><p>{locationAddress}</p></div>
              <div className="ed-box"><strong>City</strong><p>{event.city}</p></div>
              <div className="ed-box"><strong>Entry</strong><p>Gate opens 45 mins before showtime</p></div>
            </div>
          </div>
        )}

        {activeTab === "policy" && (
          <div className="ed-panel">
            <h3>Booking policies</h3>
            <ul className="ed-policy-list">
              <li>No cancellation within 2 hours of showtime.</li>
              <li>Carry valid ID and booking confirmation at entry.</li>
              <li>Outside food and beverages are not allowed.</li>
            </ul>
          </div>
        )}
      </section>
    </main>
  );
}

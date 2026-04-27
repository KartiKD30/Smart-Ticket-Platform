import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowUpRight,
  BadgeCheck,
  CalendarDays,
  Clock3,
  CreditCard,
  IndianRupee,
  MapPin,
  Receipt,
  RefreshCw,
  ScanSearch,
  ShieldCheck,
  Sparkles,
  Ticket,
  UserRound,
  Wallet,
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import SplitType from "split-type";
import API from "../services/api";
import "../css/ResaleTicket.css";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const normalizeDateForInput = (value) => {
  if (!value) return "";
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;

  const parsed = new Date(value);
  if (isNaN(parsed)) return "";

  const year = parsed.getFullYear();
  const month = String(parsed.getMonth() + 1).padStart(2, "0");
  const day = String(parsed.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const normalizeTimeForInput = (value) => {
  if (!value) return "";
  if (/^\d{2}:\d{2}$/.test(value)) return value;

  const match = String(value).trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return "";

  let hours = Number(match[1]);
  const minutes = match[2];
  const period = match[3].toUpperCase();

  if (period === "PM" && hours !== 12) hours += 12;
  if (period === "AM" && hours === 12) hours = 0;

  return `${String(hours).padStart(2, "0")}:${minutes}`;
};

const INITIAL_FORM_DATA = {
  ticketId: "",
  eventName: "",
  venue: "",
  city: "",
  eventDate: "",
  eventTime: "",
  seats: "",
  originalPrice: "",
  resalePrice: "",
  sellerName: "",
  sellerContact: "",
  notes: "",
};

const shellVariants = {
  hidden: { opacity: 0, y: 24 },
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
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.38, ease: "easeOut" } },
};

const formatCurrency = (value) => `Rs. ${Number(value || 0).toLocaleString("en-IN")}`;

const formatReadableDate = (value) => {
  if (!value) return "Date pending";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;

  return parsed.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

export default function ResaleTicket() {
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [activeTab, setActiveTab] = useState("sell");
  const [submitted, setSubmitted] = useState(false);
  const [fetchingTicket, setFetchingTicket] = useState(false);
  const [submittingTicket, setSubmittingTicket] = useState(false);
  const [fetchMessage, setFetchMessage] = useState("");
  const [approvalMessage, setApprovalMessage] = useState("");
  const [myRequests, setMyRequests] = useState([]);
  const [requestsLoading, setRequestsLoading] = useState(true);
  const [requestsError, setRequestsError] = useState("");
  const [showRequests, setShowRequests] = useState(true);
  const [marketListings, setMarketListings] = useState([]);
  const [marketLoading, setMarketLoading] = useState(false);
  const [marketError, setMarketError] = useState("");
  const [purchaseInputs, setPurchaseInputs] = useState({});
  const [buyingId, setBuyingId] = useState("");
  const [purchaseMessage, setPurchaseMessage] = useState("");

  const pageRef = useRef(null);
  const heroTitleRef = useRef(null);

  useEffect(() => {
    const pendingMessage = localStorage.getItem("resaleApprovalMessage");
    if (pendingMessage) {
      setApprovalMessage(pendingMessage);
      localStorage.removeItem("resaleApprovalMessage");
    }

    fetchMyRequests();
    fetchMarketListings();
  }, []);

  useGSAP(
    () => {
      if (!heroTitleRef.current) {
        return undefined;
      }

      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduceMotion) {
        gsap.set(
          [
            ".resale-hero__eyebrow",
            ".resale-hero__sub",
            ".resale-hero__metric",
            ".resale-hero__panel",
            ".resale-tabs",
            ".resale-form-card",
            ".resale-market-card",
            ".resale-request-card",
          ],
          { clearProps: "all" }
        );
        return undefined;
      }

      const split = new SplitType(heroTitleRef.current, {
        types: "lines, words",
        lineClass: "resale-hero__line",
        wordClass: "resale-hero__word",
      });

      const intro = gsap.timeline({ defaults: { ease: "power3.out" } });
      intro
        .from(split.words, {
          yPercent: 130,
          rotateX: -75,
          opacity: 0,
          duration: 0.95,
          stagger: 0.04,
        })
        .from(
          ".resale-hero__eyebrow, .resale-hero__sub, .resale-hero__metric, .resale-hero__panel, .resale-tabs",
          {
            y: 26,
            opacity: 0,
            duration: 0.7,
            stagger: 0.08,
          },
          "-=0.55"
        );

      gsap.to(".resale-hero__glow", {
        scale: 1.12,
        opacity: 0.9,
        duration: 3.8,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut",
      });

      gsap.to(".resale-hero__panel--primary", {
        yPercent: -7,
        rotate: 1.5,
        duration: 4.8,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      gsap.to(".resale-hero__panel--secondary", {
        yPercent: -10,
        xPercent: 3,
        rotate: -2.5,
        duration: 5.4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      gsap.from(".resale-form-card", {
        y: 28,
        opacity: 0,
        duration: 0.62,
        ease: "power3.out",
      });

      gsap.from(".resale-market-card, .resale-request-card", {
        y: 42,
        opacity: 0,
        duration: 0.78,
        stagger: 0.08,
        ease: "power3.out",
        immediateRender: false,
        scrollTrigger: {
          trigger: ".resale-content",
          start: "top 78%",
          once: true,
        },
      });

      return () => {
        split.revert();
      };
    },
    {
      scope: pageRef,
      dependencies: [activeTab, myRequests.length, marketListings.length],
      revertOnUpdate: true,
    }
  );

  const fetchMyRequests = async () => {
    const token = localStorage.getItem("access");
    if (!token) {
      setRequestsLoading(false);
      setRequestsError("Please log in to view resale requests.");
      return;
    }

    setRequestsLoading(true);
    setRequestsError("");
    try {
      const response = await API.get("/bookings/resale/my", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setMyRequests(response.data?.resaleTickets || []);
    } catch (error) {
      setRequestsError(
        error?.response?.data?.error || "Unable to load resale requests right now."
      );
    } finally {
      setRequestsLoading(false);
    }
  };

  const getStatusClass = (status) => {
    if (status === "Approved") return "resale-badge--approved";
    if (status === "Rejected") return "resale-badge--rejected";
    if (status === "Sold") return "resale-badge--listed";
    return "resale-badge--pending";
  };

  const fetchMarketListings = async () => {
    const token = localStorage.getItem("access");
    if (!token) {
      setMarketLoading(false);
      setMarketError("Please log in to view resale listings.");
      return;
    }

    setMarketLoading(true);
    setMarketError("");
    try {
      const response = await API.get("/bookings/resale/market", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setMarketListings(response.data?.resaleTickets || []);
    } catch (error) {
      setMarketError(
        error?.response?.data?.error || "Unable to load resale listings right now."
      );
    } finally {
      setMarketLoading(false);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === "listings") {
      fetchMarketListings();
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setSubmitted(false);
    if (name === "ticketId") {
      setFetchMessage("");
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFetchTicketDetails = async () => {
    const ticketId = formData.ticketId.trim();
    if (!ticketId) {
      setFetchMessage("Enter a ticket ID first.");
      return;
    }

    const token = localStorage.getItem("access");
    if (!token) {
      setFetchMessage("Please log in to fetch ticket details.");
      return;
    }

    setFetchingTicket(true);
    setFetchMessage("");

    try {
      const response = await API.get(`/bookings/${ticketId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const booking = response.data?.booking;
      if (!booking) {
        setFetchMessage("Ticket not found.");
        return;
      }

      setFormData((prev) => ({
        ...prev,
        eventName: booking.event?.name || prev.eventName,
        venue: booking.event?.venue || booking.venue || prev.venue,
        city: booking.event?.city || booking.city || prev.city,
        eventDate: normalizeDateForInput(booking.date) || prev.eventDate,
        eventTime: normalizeTimeForInput(booking.time) || prev.eventTime,
        seats: Array.isArray(booking.seats) ? booking.seats.join(", ") : prev.seats,
        originalPrice: booking.total ? String(booking.total) : prev.originalPrice,
      }));

      setFetchMessage("Ticket details fetched successfully.");
    } catch (error) {
      setFetchMessage(
        error?.response?.data?.error || "Unable to fetch ticket details for this ID."
      );
    } finally {
      setFetchingTicket(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (
      !formData.ticketId.trim() ||
      !formData.eventName.trim() ||
      !formData.venue.trim() ||
      !formData.city.trim() ||
      !formData.eventDate ||
      !formData.eventTime ||
      !formData.seats.trim() ||
      !formData.originalPrice ||
      !formData.resalePrice
    ) {
      alert("Please fill all required ticket details.");
      return;
    }

    const token = localStorage.getItem("access");
    if (!token) {
      setFetchMessage("Please log in to submit a resale request.");
      return;
    }

    setSubmittingTicket(true);
    setFetchMessage("Submitting resale request...");

    try {
      const response = await API.post(
        `/bookings/${formData.ticketId.trim()}/resale`,
        {
          eventName: formData.eventName.trim(),
          venue: formData.venue.trim(),
          city: formData.city.trim(),
          eventDate: formData.eventDate,
          eventTime: formData.eventTime,
          seats: formData.seats
            .split(",")
            .map((seat) => seat.trim())
            .filter(Boolean),
          originalPrice: Number(formData.originalPrice),
          resalePrice: Number(formData.resalePrice),
          sellerName: formData.sellerName.trim(),
          sellerContact: formData.sellerContact.trim(),
          notes: formData.notes.trim(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSubmitted(true);
      setApprovalMessage(
        response.data?.message || "Resale request submitted. Waiting for admin approval."
      );
      setFormData(INITIAL_FORM_DATA);
      setFetchMessage("");
      await fetchMyRequests();
    } catch (error) {
      setFetchMessage(
        error?.response?.data?.error || "Unable to submit resale request right now."
      );
    } finally {
      setSubmittingTicket(false);
    }
  };

  const handlePurchaseInputChange = (id, field, value) => {
    setPurchaseInputs((current) => ({
      ...current,
      [id]: {
        ...(current[id] || {}),
        [field]: value,
      },
    }));
  };

  const handleBuyListing = async (listing) => {
    const token = localStorage.getItem("access");
    if (!token) {
      setPurchaseMessage("Please log in to buy resale tickets.");
      return;
    }

    const input = purchaseInputs[listing.id] || {};
    if (!input.method) {
      setPurchaseMessage("Select a payment method before buying.");
      return;
    }

    setBuyingId(listing.id);
    setPurchaseMessage("Processing purchase...");

    try {
      await API.post(
        `/bookings/resale/${listing.id}/buy`,
        {
          method: input.method,
          transactionId: input.transactionId || "",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMarketListings((current) => current.filter((item) => item.id !== listing.id));
      setPurchaseInputs((current) => {
        const next = { ...current };
        delete next[listing.id];
        return next;
      });
      setPurchaseMessage("Ticket purchased successfully. Check My Bookings.");
    } catch (error) {
      setPurchaseMessage(
        error?.response?.data?.error || "Unable to buy this resale ticket right now."
      );
    } finally {
      setBuyingId("");
    }
  };

  const stats = useMemo(
    () => [
      {
        label: "My Requests",
        value: myRequests.length,
        icon: Ticket,
      },
      {
        label: "Live Listings",
        value: marketListings.length,
        icon: Wallet,
      },
      {
        label: "Approved",
        value: myRequests.filter((request) => request.status === "Approved").length,
        icon: BadgeCheck,
      },
    ],
    [marketListings.length, myRequests]
  );

  return (
    <motion.main
      ref={pageRef}
      className="resale-page"
      initial="hidden"
      animate="show"
      variants={shellVariants}
    >
      <motion.section className="resale-hero" variants={blockVariants}>
        <div className="resale-hero__glow" />
        <div className="resale-hero__content">
          <div className="resale-hero__eyebrow">
            <Sparkles size={14} />
            User Resale Exchange
          </div>
          <h1 ref={heroTitleRef} className="resale-title">
            Sell faster, buy safer, and track every second-chance ticket in one motion-rich flow.
          </h1>
          <p className="resale-hero__sub">
            List approved tickets, monitor your request status, and grab resale inventory with a
            cleaner, more premium experience.
          </p>

          <div className="resale-hero__metrics">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="resale-hero__metric">
                  <span className="resale-hero__metric-icon">
                    <Icon size={16} />
                  </span>
                  <div>
                    <strong>{stat.value}</strong>
                    <span>{stat.label}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="resale-hero__art" aria-hidden="true">
          <div className="resale-hero__panel resale-hero__panel--primary">
            <span>Live resale pulse</span>
            <strong>Protected handoff</strong>
            <p>Verified requests, cleaner pricing, and a smoother route from seller to buyer.</p>
          </div>
          <div className="resale-hero__panel resale-hero__panel--secondary">
            <span>Checkout speed</span>
            <strong>3 steps</strong>
            <p>Review listing, choose payment, confirm transfer.</p>
          </div>
        </div>
      </motion.section>

      <motion.div className="resale-tabs" role="tablist" aria-label="Resale ticket actions" variants={blockVariants}>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "sell"}
          className={`resale-tab${activeTab === "sell" ? " resale-tab--active" : ""}`}
          onClick={() => handleTabChange("sell")}
        >
          <Ticket size={15} />
          Sell Ticket
          <span className="resale-tab__count">{myRequests.length}</span>
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "listings"}
          className={`resale-tab${activeTab === "listings" ? " resale-tab--active" : ""}`}
          onClick={() => handleTabChange("listings")}
        >
          <Wallet size={15} />
          Buy Listings
          <span className="resale-tab__count">{marketListings.length}</span>
        </button>
      </motion.div>

      <div className="resale-content">
        <AnimatePresence mode="wait">
          {activeTab === "sell" ? (
            <motion.div
              key="sell"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.28 }}
            >
              <motion.section className="resale-form-card" variants={blockVariants} aria-label="Resale ticket details form">
                <div className="resale-form-card__head">
                  <div>
                    <p className="resale-panel-kicker">Seller Console</p>
                    <h2 className="resale-section-title">Create a resale request</h2>
                  </div>
                  <button
                    type="button"
                    className="resale-toggle-btn"
                    onClick={() => setShowRequests((prev) => !prev)}
                  >
                    {showRequests ? "Hide Requests" : "Show Requests"}
                  </button>
                </div>

                {approvalMessage && <p className="resale-form-success">{approvalMessage}</p>}

                <form className="resale-manual-form" onSubmit={handleSubmit}>
                  <div className="resale-form-grid">
                    <div className="resale-price-row resale-ticket-id-row">
                      <label className="resale-ticket-id-input-wrap" htmlFor="resale-ticket-id">
                        <span className="resale-price-label">Ticket ID *</span>
                        <input
                          id="resale-ticket-id"
                          className="resale-price-input"
                          type="text"
                          name="ticketId"
                          value={formData.ticketId}
                          onChange={handleChange}
                          placeholder="Enter ticket ID"
                        />
                      </label>
                      <button
                        type="button"
                        className="resale-fetch-btn"
                        onClick={handleFetchTicketDetails}
                        disabled={fetchingTicket}
                      >
                        <ScanSearch size={16} />
                        {fetchingTicket ? "Fetching..." : "Fetch Details"}
                      </button>
                    </div>

                    <label className="resale-price-row">
                      <span className="resale-price-label">Event Name *</span>
                      <input
                        className="resale-price-input"
                        type="text"
                        name="eventName"
                        value={formData.eventName}
                        onChange={handleChange}
                        placeholder="Enter event name"
                      />
                    </label>

                    <label className="resale-price-row">
                      <span className="resale-price-label">Venue *</span>
                      <input
                        className="resale-price-input"
                        type="text"
                        name="venue"
                        value={formData.venue}
                        onChange={handleChange}
                        placeholder="Enter venue"
                      />
                    </label>

                    <label className="resale-price-row">
                      <span className="resale-price-label">City *</span>
                      <input
                        className="resale-price-input"
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        placeholder="Enter city"
                      />
                    </label>

                    <label className="resale-price-row">
                      <span className="resale-price-label">Event Date *</span>
                      <input
                        className="resale-price-input"
                        type="date"
                        name="eventDate"
                        value={formData.eventDate}
                        onChange={handleChange}
                      />
                    </label>

                    <label className="resale-price-row">
                      <span className="resale-price-label">Event Time *</span>
                      <input
                        className="resale-price-input"
                        type="time"
                        name="eventTime"
                        value={formData.eventTime}
                        onChange={handleChange}
                      />
                    </label>

                    <label className="resale-price-row">
                      <span className="resale-price-label">Seat Numbers *</span>
                      <input
                        className="resale-price-input"
                        type="text"
                        name="seats"
                        value={formData.seats}
                        onChange={handleChange}
                        placeholder="Example: A12, A13"
                      />
                    </label>

                    <label className="resale-price-row">
                      <span className="resale-price-label">Original Price (Rs.) *</span>
                      <input
                        className="resale-price-input"
                        type="number"
                        min="1"
                        name="originalPrice"
                        value={formData.originalPrice}
                        onChange={handleChange}
                        placeholder="Enter original ticket price"
                      />
                    </label>

                    <label className="resale-price-row">
                      <span className="resale-price-label">Resale Price (Rs.) *</span>
                      <input
                        className="resale-price-input"
                        type="number"
                        min="1"
                        name="resalePrice"
                        value={formData.resalePrice}
                        onChange={handleChange}
                        placeholder="Enter resale ticket price"
                      />
                    </label>

                    <label className="resale-price-row">
                      <span className="resale-price-label">Seller Name</span>
                      <input
                        className="resale-price-input"
                        type="text"
                        name="sellerName"
                        value={formData.sellerName}
                        onChange={handleChange}
                        placeholder="Enter seller name"
                      />
                    </label>

                    <label className="resale-price-row">
                      <span className="resale-price-label">Seller Contact</span>
                      <input
                        className="resale-price-input"
                        type="text"
                        name="sellerContact"
                        value={formData.sellerContact}
                        onChange={handleChange}
                        placeholder="Enter contact number"
                      />
                    </label>
                  </div>

                  {fetchMessage && <p className="resale-fetch-message">{fetchMessage}</p>}

                  <label className="resale-price-row resale-price-row--full">
                    <span className="resale-price-label">Additional Notes</span>
                    <textarea
                      className="resale-price-input resale-notes-input"
                      name="notes"
                      value={formData.notes}
                      onChange={handleChange}
                      placeholder="Any extra details about this ticket"
                      rows={4}
                    />
                  </label>

                  <div className="resale-form-actions">
                    <button
                      type="submit"
                      className="resale-list-btn resale-list-btn--manual"
                      disabled={submittingTicket}
                    >
                      <ArrowUpRight size={16} />
                      {submittingTicket ? "Submitting..." : "Save Ticket Details"}
                    </button>

                    {submitted && (
                      <p className="resale-form-success">Ticket details saved successfully.</p>
                    )}
                  </div>
                </form>
              </motion.section>

              <section className="resale-grid" aria-label="My resale ticket requests">
                <div className="resale-section-head">
                  <div>
                    <p className="resale-panel-kicker">Request Timeline</p>
                    <h2 className="resale-section-title">My Resale Ticket Requests</h2>
                  </div>
                </div>

                {!showRequests ? (
                  <div className="resale-empty">
                    <p>Requests are hidden. Click Show Requests to view them.</p>
                  </div>
                ) : requestsLoading ? (
                  <div className="resale-loading">Loading resale requests...</div>
                ) : requestsError ? (
                  <div className="resale-error">
                    <p>{requestsError}</p>
                  </div>
                ) : myRequests.length === 0 ? (
                  <div className="resale-empty">
                    <span className="resale-empty__icon">
                      <Ticket size={40} />
                    </span>
                    <p>No resale ticket requests found.</p>
                  </div>
                ) : (
                  myRequests.map((request, index) => (
                    <motion.article
                      key={request.id}
                      className="resale-card resale-request-card resale-card--listed"
                      initial={{ opacity: 0, y: 18 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.2 }}
                      transition={{ duration: 0.35, delay: index * 0.05 }}
                      whileHover={{ y: -6, rotateX: 2, rotateY: index % 2 === 0 ? 2 : -2 }}
                    >
                      <div className="resale-card__left">
                        <span className="resale-card__icon">
                          <Ticket size={28} />
                        </span>
                      </div>

                      <div className="resale-card__body">
                        <div className="resale-card__top">
                          <div>
                            <p className="resale-card__event">{request.event?.name || "Event"}</p>
                            <p className="resale-card__venue">
                              <MapPin size={14} /> {request.event?.city || "Location"}
                            </p>
                            <p className="resale-card__venue">
                              <ShieldCheck size={14} /> Venue: {request.event?.venue || "N/A"}
                            </p>
                          </div>
                          <span className={`resale-badge ${getStatusClass(request.status)}`}>
                            {request.status || "Pending"}
                          </span>
                        </div>

                        <div className="resale-card__pills">
                          {request.event?.date && (
                            <span className="resale-pill">
                              <CalendarDays size={13} />
                              {formatReadableDate(request.event.date)}
                            </span>
                          )}
                          {request.event?.time && (
                            <span className="resale-pill">
                              <Clock3 size={13} />
                              {request.event.time}
                            </span>
                          )}
                          {request.seats?.length > 0 && (
                            <span className="resale-pill">
                              <Ticket size={13} />
                              {request.seats.join(", ")}
                            </span>
                          )}
                        </div>

                        <div className="resale-card__price-summary">
                          <div className="resale-price-summary-row">
                            <span>Original Price</span>
                            <strong>{formatCurrency(request.originalPrice || 0)}</strong>
                          </div>
                          <div className="resale-price-summary-row resale-price-summary-row--highlight">
                            <span>Resale Price</span>
                            <strong>{formatCurrency(request.resalePrice || 0)}</strong>
                          </div>
                        </div>

                        {request.status === "Pending" && (
                          <p className="resale-card__hint">Waiting for admin approval.</p>
                        )}
                        <p className="resale-card__id">
                          <Receipt size={13} />
                          Receipt ID: {request.receiptId || "Not Available"}
                        </p>
                      </div>
                    </motion.article>
                  ))
                )}
              </section>
            </motion.div>
          ) : (
            <motion.section
              key="listings"
              className="resale-grid"
              aria-label="Approved resale ticket listings"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.28 }}
            >
              <div className="resale-section-head">
                <div>
                  <p className="resale-panel-kicker">Marketplace</p>
                  <h2 className="resale-section-title">Available Resale Listings</h2>
                </div>
                <button type="button" className="resale-toggle-btn" onClick={fetchMarketListings}>
                  <RefreshCw size={15} />
                  Refresh Listings
                </button>
              </div>

              {purchaseMessage && <p className="resale-fetch-message">{purchaseMessage}</p>}

              {marketLoading ? (
                <div className="resale-loading">Loading resale listings...</div>
              ) : marketError ? (
                <div className="resale-error">
                  <p>{marketError}</p>
                </div>
              ) : marketListings.length === 0 ? (
                <div className="resale-empty">
                  <span className="resale-empty__icon">
                    <Wallet size={40} />
                  </span>
                  <p>No approved resale tickets are available right now.</p>
                </div>
              ) : (
                marketListings.map((listing, index) => {
                  const input = purchaseInputs[listing.id] || {};
                  const isBuying = buyingId === listing.id;

                  return (
                    <motion.article
                      key={listing.id}
                      className="resale-card resale-market-card resale-card--listed"
                      initial={{ opacity: 0, y: 18 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.15 }}
                      transition={{ duration: 0.35, delay: index * 0.05 }}
                      whileHover={{ y: -6, rotateX: 2, rotateY: index % 2 === 0 ? 2 : -2 }}
                    >
                      <div className="resale-card__left">
                        <span className="resale-card__icon">
                          <Wallet size={28} />
                        </span>
                      </div>

                      <div className="resale-card__body">
                        <div className="resale-card__top">
                          <div>
                            <p className="resale-card__event">{listing.event?.name || "Event"}</p>
                            <p className="resale-card__venue">
                              <MapPin size={14} />
                              {listing.event?.city || "N/A"}
                            </p>
                            <p className="resale-card__venue">
                              <ShieldCheck size={14} />
                              Venue: {listing.event?.venue || "N/A"}
                            </p>
                          </div>
                          <span className="resale-badge resale-badge--approved">Available</span>
                        </div>

                        <div className="resale-card__pills">
                          {listing.event?.date && (
                            <span className="resale-pill">
                              <CalendarDays size={13} />
                              {formatReadableDate(listing.event.date)}
                            </span>
                          )}
                          {listing.event?.time && (
                            <span className="resale-pill">
                              <Clock3 size={13} />
                              {listing.event.time}
                            </span>
                          )}
                          {listing.seats?.length > 0 && (
                            <span className="resale-pill">
                              <Ticket size={13} />
                              {listing.seats.join(", ")}
                            </span>
                          )}
                        </div>

                        <div className="resale-card__price-summary">
                          <div className="resale-price-summary-row">
                            <span>Original Price</span>
                            <strong>{formatCurrency(listing.originalPrice || 0)}</strong>
                          </div>
                          <div className="resale-price-summary-row resale-price-summary-row--highlight">
                            <span>Buy Price</span>
                            <strong>{formatCurrency(listing.resalePrice || 0)}</strong>
                          </div>
                        </div>

                        <div className="resale-buy-form">
                          <label className="resale-price-row">
                            <span className="resale-price-label">Payment Method *</span>
                            <select
                              className="resale-price-input"
                              value={input.method || ""}
                              onChange={(event) =>
                                handlePurchaseInputChange(listing.id, "method", event.target.value)
                              }
                            >
                              <option value="">Select payment method</option>
                              <option value="UPI">UPI</option>
                              <option value="Card">Card</option>
                              <option value="Net Banking">Net Banking</option>
                            </select>
                          </label>

                          <label className="resale-price-row">
                            <span className="resale-price-label">Transaction ID</span>
                            <input
                              className="resale-price-input"
                              type="text"
                              placeholder="Optional"
                              value={input.transactionId || ""}
                              onChange={(event) =>
                                handlePurchaseInputChange(
                                  listing.id,
                                  "transactionId",
                                  event.target.value
                                )
                              }
                            />
                          </label>

                          <button
                            type="button"
                            className="resale-list-btn"
                            disabled={isBuying}
                            onClick={() => handleBuyListing(listing)}
                          >
                            <CreditCard size={16} />
                            {isBuying ? "Buying..." : "Buy Ticket"}
                          </button>
                        </div>

                        <div className="resale-market-meta">
                          <span className="resale-card__id">
                            <Receipt size={13} />
                            Receipt ID: {listing.receiptId || "Not Available"}
                          </span>
                          <span className="resale-card__id">
                            <UserRound size={13} />
                            Seller verified through admin approval
                          </span>
                        </div>
                      </div>
                    </motion.article>
                  );
                })
              )}
            </motion.section>
          )}
        </AnimatePresence>
      </div>
    </motion.main>
  );
}

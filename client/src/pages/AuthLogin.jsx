import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import API from "../services/api";
import "../css/Login.css";

function AuthLogin() {
  const navigate = useNavigate();
  const location = useLocation();

  // Start on signup panel if navigated to /signup
  const [toggled, setToggled] = useState(location.pathname === "/signup");

  // Login state
  const [loginForm, setLoginForm] = useState({ identifier: "", password: "" });
  const [loginLoading, setLoginLoading] = useState(false);
  const [showLoginPw, setShowLoginPw] = useState(false);

  // Signup state
  const [signupForm, setSignupForm] = useState({ username: "", email: "", phone: "", password: "", otp: "" });
  const [signupStep, setSignupStep] = useState(1);
  const [signupLoading, setSignupLoading] = useState(false);
  const [showSignupPw, setShowSignupPw] = useState(false);
  const [role, setRole] = useState("user");

  useEffect(() => {
    setToggled(location.pathname === "/signup");
  }, [location.pathname]);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!loginForm.identifier || !loginForm.password) { toast.error("Please fill all fields."); return; }
    try {
      setLoginLoading(true);
      const res = await API.post("/auth/login/", { username: loginForm.identifier, password: loginForm.password });
      localStorage.setItem("access", res.data.access);
      localStorage.setItem("username", res.data.username || loginForm.identifier);
      toast.success("Login successful!");
      setTimeout(() => navigate("/dashboard"), 500);
    } catch (err) {
      toast.error(err.response?.data?.error || "Invalid credentials.");
    } finally { setLoginLoading(false); }
  };

  const handleSignupStep1 = async (e) => {
    e.preventDefault();
    if (!signupForm.username || !signupForm.email || !signupForm.password) { toast.error("Please fill all fields."); return; }
    try {
      setSignupLoading(true);
      const endpoint = role === "organizer" ? "/auth/organizer/signup/" : "/auth/signup/";
      await API.post(endpoint, { username: signupForm.username, email: signupForm.email, phone: signupForm.phone, password: signupForm.password });
      toast.success("OTP sent to your email!");
      setSignupStep(2);
    } catch (err) {
      toast.error(err.response?.data?.error || "Registration failed.");
    } finally { setSignupLoading(false); }
  };

  const handleSignupStep2 = async (e) => {
    e.preventDefault();
    if (signupForm.otp.length !== 6) { toast.error("Enter 6-digit OTP."); return; }
    try {
      setSignupLoading(true);
      const res = await API.post("/auth/verify-otp/", { username: signupForm.username, otp: signupForm.otp });
      localStorage.setItem("access", res.data.access);
      localStorage.setItem("username", res.data.username || signupForm.username);
      localStorage.setItem("role", res.data.role || "user");
      toast.success("Account created!");
      setTimeout(() => navigate("/dashboard"), 500);
    } catch (err) {
      toast.error(err.response?.data?.error || "Verification failed.");
    } finally { setSignupLoading(false); }
  };

  const switchToSignup = (e) => { e.preventDefault(); setToggled(true); navigate("/signup"); };
  const switchToLogin  = (e) => { e.preventDefault(); setToggled(false); navigate("/login"); };
  const continueWithoutSignin = () => navigate("/events");

  return (
    <div className="sl-page">
      <div className={`sl-wrapper${toggled ? " sl-toggled" : ""}`}>

        {/* Animated background shapes */}
        <div className="sl-shape sl-shape--bg" />
        <div className="sl-shape sl-shape--sec" />

        {/* ── LOGIN PANEL ── */}
        <div className="sl-panel sl-panel--login">
          <h2 className="sl-el">Sign In</h2>
          <form onSubmit={handleLogin}>
            <div className="sl-field sl-el">
              <input type="text" required value={loginForm.identifier}
                onChange={e => setLoginForm({...loginForm, identifier: e.target.value})} />
              <label>Username or Email</label>
              <i className="sl-icon">👤</i>
            </div>
            <div className="sl-field sl-el">
              <input type={showLoginPw ? "text" : "password"} required value={loginForm.password}
                onChange={e => setLoginForm({...loginForm, password: e.target.value})} />
              <label>Password</label>
              <button type="button" className="sl-eye" onClick={() => setShowLoginPw(v=>!v)}>
                {showLoginPw ? "🙈" : "👁"}
              </button>
            </div>
            <div className="sl-field sl-el">
              <button className="sl-btn" type="submit" disabled={loginLoading}>
                {loginLoading ? "Signing in..." : "Sign In"}
              </button>
            </div>
            <div className="sl-switch sl-el">
              <p>Don't have an account?<br />
                <a href="/signup" onClick={switchToSignup}>Create Account</a>
              </p>
            </div>
          </form>
        </div>

        {/* ── LOGIN WELCOME ── */}
        <div className="sl-welcome sl-welcome--login">
          <div className="sl-welcome__inner">
            <span className="sl-welcome__logo sl-el">ST</span>
            <h2 className="sl-el">Welcome<br />Back!</h2>
            <p className="sl-el">Sign in to access your tickets, bookings and wallet.</p>
          </div>
        </div>

        {/* ── SIGNUP PANEL ── */}
        <div className="sl-panel sl-panel--signup">
          <h2 className="sl-el">{signupStep === 1 ? "Create Account" : "Verify OTP"}</h2>

          {signupStep === 1 ? (
            <form onSubmit={handleSignupStep1}>
              <div className="sl-tabs sl-el">
                <button type="button" className={`sl-tab${role==="user"?" sl-tab--active":""}`} onClick={()=>setRole("user")}>🎟 User</button>
                <button type="button" className={`sl-tab${role==="organizer"?" sl-tab--active":""}`} onClick={()=>setRole("organizer")}>🎪 Organizer</button>
              </div>
              <div className="sl-field sl-el">
                <input type="text" required value={signupForm.username}
                  onChange={e => setSignupForm({...signupForm, username: e.target.value})} />
                <label>Username</label>
                <i className="sl-icon">👤</i>
              </div>
              <div className="sl-field sl-el">
                <input type="email" required value={signupForm.email}
                  onChange={e => setSignupForm({...signupForm, email: e.target.value})} />
                <label>Email</label>
                <i className="sl-icon">✉</i>
              </div>
              <div className="sl-field sl-el">
                <input type={showSignupPw ? "text" : "password"} required value={signupForm.password}
                  onChange={e => setSignupForm({...signupForm, password: e.target.value})} />
                <label>Password</label>
                <button type="button" className="sl-eye" onClick={() => setShowSignupPw(v=>!v)}>
                  {showSignupPw ? "🙈" : "👁"}
                </button>
              </div>
              <div className="sl-field sl-el">
                <button className="sl-btn" type="submit" disabled={signupLoading}>
                  {signupLoading ? "Sending OTP..." : "Create Account"}
                </button>
              </div>
              <div className="sl-switch sl-el">
                <p>Already have an account?<br />
                  <a href="/login" onClick={switchToLogin}>Sign In</a>
                </p>
              </div>
            </form>
          ) : (
            <form onSubmit={handleSignupStep2}>
              <p className="sl-otp-hint sl-el">Enter the 6-digit OTP sent to {signupForm.email}</p>
              <div className="sl-field sl-el">
                <input type="text" required maxLength={6} value={signupForm.otp}
                  onChange={e => setSignupForm({...signupForm, otp: e.target.value})} />
                <label>6-digit OTP</label>
                <i className="sl-icon">🔐</i>
              </div>
              <div className="sl-field sl-el">
                <button className="sl-btn" type="submit" disabled={signupLoading}>
                  {signupLoading ? "Verifying..." : "Verify & Continue"}
                </button>
              </div>
              <div className="sl-switch sl-el">
                <p><a href="#" onClick={e=>{e.preventDefault();setSignupStep(1);}}>← Back</a></p>
              </div>
            </form>
          )}
        </div>

        {/* ── SIGNUP WELCOME ── */}
        <div className="sl-welcome sl-welcome--signup">
          <div className="sl-welcome__inner">
            <span className="sl-welcome__logo sl-el">ST</span>
            <h2 className="sl-el">Hello,<br />Friend!</h2>
            <p className="sl-el">Join thousands of fans booking events across India.</p>
          </div>
        </div>

      </div>

      <button className="sl-guest-btn" type="button" onClick={continueWithoutSignin}>
        Continue without signing in
      </button>
    </div>
  );
}

export default AuthLogin;

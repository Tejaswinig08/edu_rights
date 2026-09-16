import { Sparkles } from "lucide-react";

function BrandPanel({ mode }) {

  const isSignup = mode === "signup";

  return (
    <div className="brand-panel">

      <div className="brand-logo">

        <div className="brand-icon">
          ⚖
        </div>

        <span>
          EduRight
        </span>

      </div>

      <Sparkles
        className="brand-sparkle"
        size={32}
      />

      <div className="hero-image">

        <div className="hero-image-placeholder">

          <div className="hero-emoji">
            {isSignup
              ? "👩‍🎓 👨‍🎓 📚"
              : "📚 👩‍🎓 📖"}
          </div>

          <span>
            {isSignup
              ? "Excited kids learning together in a classroom"
              : "Student surrounded by books, ready to learn"}
          </span>

        </div>

      </div>

      <div className="hero-text">

        <h1>
          {isSignup ? (
            <>
              Start your
              <br />
              adventure!
            </>
          ) : (
            <>
              Welcome
              <br />
              back, hero!
            </>
          )}
        </h1>

        <p>
          Learn your rights, earn badges, and level up
          your knowledge — one quest at a time.
        </p>

      </div>

      <div className="hero-pills">

        <span>Learn</span>
        <span>Explore</span>
        <span>Play</span>

      </div>

      <div className="circle circle-one"></div>
      <div className="circle circle-two"></div>

    </div>
  );
}

export default BrandPanel;
// src/pages/Landing.jsx
//
// TEMPORARY placeholder for the landing page. This will be
// replaced with the full Hero/Features/Testimonials/etc. design
// in the "Pages - Landing" module. For now it just confirms the
// router and theme are wired up correctly.

function Landing() {
  return (
    <div
      style={{
        minHeight: "70vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "48px 24px",
      }}
    >
      <h1 className="gradient-text" style={{ fontSize: "3rem" }}>
        Kalavini
      </h1>
      <p style={{ color: "var(--text-secondary)", maxWidth: 480, margin: "12px 0" }}>
        Hidden Talent Network — teach what you know, learn what you love.
        Full landing page coming in the next module.
      </p>
    </div>
  );
}

export default Landing;

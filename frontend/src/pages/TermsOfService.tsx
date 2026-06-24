import "./Legal.scss";

const TermsOfService = () => {
  return (
    <div className="legal">
      <div className="legal__hero">
        <h1>Terms of Service</h1>
        <p>Last updated June 2026</p>
      </div>

      <div className="legal__content">
        <section className="legal__section">
          <h2>Using Guitlab</h2>
          <p>Guitlab is a free guitar learning tool. By using this site you agree to use it for its intended purpose and not attempt to abuse, reverse engineer, or disrupt the service.</p>
        </section>

        <section className="legal__section">
          <h2>Your account</h2>
          <p>You are responsible for keeping your account credentials secure. You must be at least 13 years old to create an account. We reserve the right to terminate accounts that violate these terms.</p>
        </section>

        <section className="legal__section">
          <h2>Intellectual property</h2>
          <p>All content on Guitlab, including the app design, code, and educational materials, is owned by Guitlab. You may not reproduce or redistribute any part of the service without permission.</p>
        </section>

        <section className="legal__section">
          <h2>Disclaimer</h2>
          <p>Guitlab is provided as-is. We make no guarantees about uptime or the accuracy of educational content. Use it as a learning aid alongside other resources and your own practice.</p>
        </section>

        <section className="legal__section">
          <h2>Changes</h2>
          <p>We may update these terms from time to time. Continued use of Guitlab after changes means you accept the updated terms.</p>
        </section>

        <section className="legal__section">
          <h2>Contact</h2>
          <p>Questions about these terms? Reach out at <a href="mailto:guitlab@gmail.com">guitlab@gmail.com</a>.</p>
        </section>
      </div>
    </div>
  );
};

export default TermsOfService;

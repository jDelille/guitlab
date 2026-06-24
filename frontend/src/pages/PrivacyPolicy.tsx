import "./Legal.scss";

const PrivacyPolicy = () => {
  return (
    <div className="legal">
      <div className="legal__hero">
        <h1>Privacy Policy</h1>
        <p>Last updated June 2026</p>
      </div>

      <div className="legal__content">
        <section className="legal__section">
          <h2>What we collect</h2>
          <p>When you create an account, we collect your email address and username. If you sign in with Google, we receive your name and email from Google. We also store your drill progress and activity so you can track your learning over time.</p>
        </section>

        <section className="legal__section">
          <h2>How we use it</h2>
          <p>Your data is used solely to provide the Guitlab service. We use your email to send account-related emails such as password resets and confirmations. We do not sell your data, share it with third parties, or use it for advertising.</p>
        </section>

        <section className="legal__section">
          <h2>Data storage</h2>
          <p>Your account and progress data is stored securely using Supabase. Passwords are hashed and never stored in plain text. We use industry-standard security practices to protect your information.</p>
        </section>

        <section className="legal__section">
          <h2>Cookies</h2>
          <p>We use cookies only to maintain your login session. We do not use tracking cookies or third-party advertising cookies.</p>
        </section>

        <section className="legal__section">
          <h2>Your rights</h2>
          <p>You can update or delete your account at any time from the Settings page. Deleting your account removes your personal data from our systems.</p>
        </section>

        <section className="legal__section">
          <h2>Contact</h2>
          <p>If you have questions about this policy, reach out at <a href="mailto:guitlab@gmail.com">guitlab@gmail.com</a>.</p>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicy;

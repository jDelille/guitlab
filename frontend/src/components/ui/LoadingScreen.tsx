import "./LoadingScreen.scss";

interface LoadingScreenProps {
  label?: string;
}

const LoadingScreen = ({ label }: LoadingScreenProps) => (
  <div className="loading-screen">
    <div className="loading-screen__strings">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="loading-screen__bar" style={{ animationDelay: `${i * 0.09}s` }} />
      ))}
    </div>
    {label && <p className="loading-screen__label">{label}</p>}
  </div>
);

export default LoadingScreen;

import '../../styles/components/AuthCard.css';

function AuthCard({
  children,
  title,
  subtitle,
  theme = 'hr',
  maxWidth = '450px'
}) {
  return (
    <div className={`auth-container auth-container--${theme}`}>
      <div className="auth-card" style={{ maxWidth }}>
        {(title || subtitle) && (
          <div className="auth-header">
            {title && <h1 className="auth-title">{title}</h1>}
            {subtitle && <p className="auth-subtitle">{subtitle}</p>}
          </div>
        )}
        <div className="auth-content">
          {children}
        </div>
      </div>
    </div>
  );
}

export default AuthCard;

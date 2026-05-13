import '../../styles/components/AlertBox.css';

function AlertBox({ type = 'error', message, onClose }) {
  const icons = {
    error: '⚠',
    success: '✓',
    info: 'ℹ',
    warning: '!',
  };

  return (
    <div className={`alert alert--${type}`} role="alert">
      <div className="alert-content">
        <span className="alert-icon">{icons[type]}</span>
        <span className="alert-message">{message}</span>
      </div>
      {onClose && (
        <button className="alert-close" onClick={onClose} aria-label="Close alert">
          ✕
        </button>
      )}
    </div>
  );
}

export default AlertBox;

import "./ErrorState.css";

export default function ErrorState({ message = "Something went wrong.", onRetry }) {
  return (
    <div className="error-state" role="alert">
      <span className="error-state__icon" aria-hidden="true">⚠️</span>
      <p className="error-state__message">{message}</p>
      {onRetry && (
        <button type="button" className="btn btn--outline-dark" onClick={onRetry}>
          Try again
        </button>
      )}
    </div>
  );
}

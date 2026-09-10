function ErrorModal({
  title,
  message,
  primaryLabel,
  onPrimary,
  onClose,
}) {

  return (

    <div className="modal-overlay">

      <div className="modal">

        <button
          className="modal-close"
          onClick={onClose}
        >
          ×
        </button>

        <div className="modal-icon">
          !
        </div>

        <h3>
          {title}
        </h3>

        <p>
          {message}
        </p>

        <div className="modal-buttons">

          <button
            className="cancel-button"
            onClick={onClose}
          >
            Cancel
          </button>

          <button
            className="modal-primary"
            onClick={onPrimary}
          >
            {primaryLabel}
          </button>

        </div>

      </div>

    </div>
  );
}

export default ErrorModal;
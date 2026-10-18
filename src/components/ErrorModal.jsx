import { useLanguage } from "../context/LanguageContext";

function ErrorModal({
  title,
  message,
  primaryLabel,
  onPrimary,
  onClose,
}) {
  const { t } = useLanguage();

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
            {t("cancel")}
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
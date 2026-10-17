import BrandPanel from "./BrandPanel";
import AuthTabs from "./AuthTabs";
import LanguageSelector from "./LanguageSelector";

function AuthShell({
  mode,
  title,
  subtitle,
  children,
}) {

  return (
    <main className="auth-page">

      <section className="auth-card">

        <BrandPanel mode={mode} />

        <section className="auth-content">

          <div className="auth-top-bar">
            <LanguageSelector />
          </div>

          <AuthTabs active={mode} />

          <div className="form-heading">

            <h2>
              {title}
            </h2>

            <p>
              {subtitle}
            </p>

          </div>

          {children}

        </section>

      </section>

    </main>
  );
}

export default AuthShell;
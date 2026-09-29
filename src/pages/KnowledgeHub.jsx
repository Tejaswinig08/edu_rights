import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import DashboardHeader from "../components/DashboardHeader";
import { useLanguage } from "../context/LanguageContext";

const KnowledgeHub = () => {
  const { t, getArticleList } = useLanguage();
  const [articles, setArticles] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        const url =
          activeTab === "all"
            ? "/knowledge"
            : `/knowledge?category=${activeTab}`;
        const res = await api.get(url);
        if (res.data.success) {
          setArticles(res.data.articles);
        }
      } catch (error) {
        console.error("Failed to load knowledge hub", error);
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, [activeTab]);

  const displayArticles = getArticleList(articles);

  const tabLabels = {
    all: t("tabAll"),
    article: t("tabStories"),
    faq: t("tabFaqs"),
  };

  return (
    <div className="knowledge-page">
      <DashboardHeader />
      <main className="knowledge-content-area">
        <h1>{t("knowledgeHubTitle")}</h1>
        <p>
          {t("knowledgeHubDesc")}
        </p>

        <div className="knowledge-tabs">
          {Object.entries(tabLabels).map(([key, label]) => (
            <button
              key={key}
              className={`knowledge-tab ${activeTab === key ? "active" : ""}`}
              onClick={() => setActiveTab(key)}
            >
              {label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="loading-screen">{t("loading")}</div>
        ) : (
          <div className="knowledge-grid">
            {displayArticles.map((article) => (
              <Link
                to={`/knowledge/${article._id}`}
                key={article._id}
                className="knowledge-card"
              >
                <span className="knowledge-card-category">
                  {article.category}
                </span>
                <h3 className="knowledge-card-title">{article.title}</h3>
                <p className="knowledge-card-preview">
                  {article.content?.substring(0, 120)}...
                </p>
                {article.source && (
                  <span className="knowledge-card-source">
                    📎 {article.source}
                  </span>
                )}
              </Link>
            ))}
            {displayArticles.length === 0 && (
              <p className="empty-state">
                {t("noCategoryContent")}
              </p>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default KnowledgeHub;

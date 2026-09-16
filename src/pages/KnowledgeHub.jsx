import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import DashboardHeader from "../components/DashboardHeader";

const KnowledgeHub = () => {
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

  const tabLabels = {
    all: "📚 All",
    article: "📰 Real Stories",
    faq: "❓ FAQs",
  };

  return (
    <div className="knowledge-page">
      <DashboardHeader />
      <main className="knowledge-content-area">
        <h1>Knowledge Hub 📚</h1>
        <p>
          Explore real-life stories, FAQs, and learn about your rights from
          trusted sources like UNICEF.
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
          <div className="loading-screen">Loading...</div>
        ) : (
          <div className="knowledge-grid">
            {articles.map((article) => (
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
            {articles.length === 0 && (
              <p className="empty-state">
                No content available for this category.
              </p>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default KnowledgeHub;

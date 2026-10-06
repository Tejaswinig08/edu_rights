import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/axios";
import DashboardHeader from "../components/DashboardHeader";
import { useLanguage } from "../context/LanguageContext";
import { ArrowLeft, ExternalLink } from "lucide-react";

const KnowledgeArticlePage = () => {
  const { id } = useParams();
  const { t, getArticle } = useLanguage();
  const [rawArticle, setRawArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const res = await api.get(`/knowledge/${id}`);
        if (res.data.success) {
          setRawArticle(res.data.article);
        }
      } catch (err) {
        console.error("Failed to load article", err);
      } finally {
        setLoading(false);
      }
    };
    fetchArticle();
  }, [id]);

  const article = getArticle(rawArticle);

  if (loading) return <div className="loading-screen">{t("loadingArticle")}</div>;
  if (!article)
    return <div className="loading-screen">{t("articleNotFound")}</div>;

  return (
    <div className="article-page">
      <DashboardHeader />
      <main className="article-content-area">
        <Link to="/knowledge" className="article-back-link">
          <ArrowLeft size={16} /> {t("backToKnowledgeHub")}
        </Link>

        <div className="article-header">
          <span className="article-category-badge">{article.category}</span>
          <h1>{article.title}</h1>
          {article.source && (
            <p className="knowledge-card-source">{t("sourceLabel")} {article.source}</p>
          )}
        </div>

        <div className="article-content">
          {article.content?.split("\n").map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>

        {article.sourceUrl && (
          <a
            href={article.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="article-source-link"
          >
            <ExternalLink size={16} />
            {t("readOriginalSource")}
          </a>
        )}

        {article.tags && article.tags.length > 0 && (
          <div className="article-tags">
            {article.tags.map((tag, i) => (
              <span key={i} className="tag">
                #{tag}
              </span>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default KnowledgeArticlePage;

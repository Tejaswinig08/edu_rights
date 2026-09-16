import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/axios";
import DashboardHeader from "../components/DashboardHeader";
import { ArrowLeft, ExternalLink } from "lucide-react";

const KnowledgeArticlePage = () => {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const res = await api.get(`/knowledge/${id}`);
        if (res.data.success) {
          setArticle(res.data.article);
        }
      } catch (err) {
        console.error("Failed to load article", err);
      } finally {
        setLoading(false);
      }
    };
    fetchArticle();
  }, [id]);

  if (loading) return <div className="loading-screen">Loading article...</div>;
  if (!article)
    return <div className="loading-screen">Article not found</div>;

  return (
    <div className="article-page">
      <DashboardHeader />
      <main className="article-content-area">
        <Link to="/knowledge" className="article-back-link">
          <ArrowLeft size={16} /> Back to Knowledge Hub
        </Link>

        <div className="article-header">
          <span className="article-category-badge">{article.category}</span>
          <h1>{article.title}</h1>
          {article.source && (
            <p className="knowledge-card-source">Source: {article.source}</p>
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
            Read Original Source
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

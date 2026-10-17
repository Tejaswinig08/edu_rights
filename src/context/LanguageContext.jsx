import React, { createContext, useContext, useState, useEffect } from "react";
import { translations } from "../translations/translations";
import {
  hindiModuleContent,
  hindiQuizzes,
  hindiArticles,
  marathiModuleContent,
  marathiQuizzes,
  marathiArticles,
  spanishModuleContent,
  spanishQuizzes,
  spanishArticles
} from "../translations/contentTranslations";
import api from "../api/axios";

const LanguageContext = createContext();

export const toHindiDigits = (val) => {
  if (val === null || val === undefined) return "";
  const devanagariDigits = ["०", "१", "२", "३", "४", "५", "६", "७", "८", "९"];
  return String(val).replace(/[0-9]/g, (w) => devanagariDigits[+w]);
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguageState] = useState(() => {
    const saved = localStorage.getItem("edurights-language");
    return saved === "hi" ? "hi" : saved === "mr" ? "mr" : saved === "es" ? "es" : "en";
  });

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const setLanguage = (lang) => {
    if (lang === "en" || lang === "hi" || lang === "mr" || lang === "es") {
      setLanguageState(lang);
      localStorage.setItem("edurights-language", lang);
      document.documentElement.lang = lang;
      const token = localStorage.getItem("accessToken");
      if (token) {
        api.put("/auth/language", { language: lang }).catch(() => {});
      }
    }
  };

  const formatNumber = (num) => {
    if (num === null || num === undefined) return "";
    if (language === "hi" || language === "mr") {
      return toHindiDigits(num);
    }
    return String(num);
  };

  const t = (key, params = {}) => {
    const langDict = translations[language] || translations["en"];
    let text = langDict[key] || translations["en"][key] || key;

    if (typeof text === "string" && params) {
      Object.keys(params).forEach((paramKey) => {
        let val = params[paramKey];
        if ((language === "hi" || language === "mr") && (typeof val === "number" || /^\d+$/.test(String(val)))) {
          val = toHindiDigits(val);
        }
        text = text.replace(new RegExp(`\\{${paramKey}\\}`, "g"), val);
      });
    }
    if (language === "hi" && typeof text === "string") {
      text = text.replace(/Module\s*(\d+)/gi, (m, p1) => `अनुभाग ${toHindiDigits(p1)}`);
      text = text.replace(/Section\s*(\d+)/gi, (m, p1) => `अनुभाग ${toHindiDigits(p1)}`);
    } else if (language === "mr" && typeof text === "string") {
      text = text.replace(/Module\s*(\d+)/gi, (m, p1) => `विभाग ${toHindiDigits(p1)}`);
      text = text.replace(/Section\s*(\d+)/gi, (m, p1) => `विभाग ${toHindiDigits(p1)}`);
    } else if (language === "es" && typeof text === "string") {
      text = text.replace(/Module\s*(\d+)/gi, (m, p1) => `Módulo ${p1}`);
      text = text.replace(/Section\s*(\d+)/gi, (m, p1) => `Sección ${p1}`);
    }
    return text;
  };

  const getModuleTitle = (mod) => {
    if (!mod) return "";
    const slug = mod.slug;
    if (language === "hi") {
      if (slug && translations.hi.moduleTitles[slug]) {
        return translations.hi.moduleTitles[slug];
      }
      if (mod.translations?.hi?.title) {
        return mod.translations.hi.title;
      }
      if (typeof mod.title === "string") {
        return mod.title
          .replace(/Module\s*(\d+)/gi, (m, p1) => `अनुभाग ${toHindiDigits(p1)}`)
          .replace(/Section\s*(\d+)/gi, (m, p1) => `अनुभाग ${toHindiDigits(p1)}`);
      }
    } else if (language === "mr") {
      if (slug && translations.mr.moduleTitles[slug]) {
        return translations.mr.moduleTitles[slug];
      }
      if (mod.translations?.mr?.title) {
        return mod.translations.mr.title;
      }
      if (typeof mod.title === "string") {
        return mod.title
          .replace(/Module\s*(\d+)/gi, (m, p1) => `विभाग ${toHindiDigits(p1)}`)
          .replace(/Section\s*(\d+)/gi, (m, p1) => `विभाग ${toHindiDigits(p1)}`);
      }
    } else if (language === "es") {
      if (slug && translations.es?.moduleTitles?.[slug]) {
        return translations.es.moduleTitles[slug];
      }
      if (mod.translations?.es?.title) {
        return mod.translations.es.title;
      }
      if (typeof mod.title === "string") {
        return mod.title
          .replace(/Module\s*(\d+)/gi, (m, p1) => `Módulo ${p1}`)
          .replace(/Section\s*(\d+)/gi, (m, p1) => `Sección ${p1}`);
      }
    }
    return mod.title || "";
  };

  const getModuleDescription = (mod) => {
    if (!mod) return "";
    const slug = mod.slug;
    if (language === "hi") {
      if (slug && translations.hi.moduleDescriptions[slug]) {
        return translations.hi.moduleDescriptions[slug];
      }
      if (mod.translations?.hi?.description) {
        return mod.translations.hi.description;
      }
    } else if (language === "mr") {
      if (slug && translations.mr.moduleDescriptions[slug]) {
        return translations.mr.moduleDescriptions[slug];
      }
      if (mod.translations?.mr?.description) {
        return mod.translations.mr.description;
      }
    } else if (language === "es") {
      if (slug && translations.es?.moduleDescriptions?.[slug]) {
        return translations.es.moduleDescriptions[slug];
      }
      if (mod.translations?.es?.description) {
        return mod.translations.es.description;
      }
    }
    return mod.description || "";
  };

  const getModuleContent = (mod) => {
    if (!mod) return "";
    const slug = mod.slug;
    if (language === "hi") {
      if (slug && hindiModuleContent[slug]) {
        return hindiModuleContent[slug];
      }
      if (mod.translations?.hi?.content) {
        return mod.translations.hi.content;
      }
    } else if (language === "mr") {
      if (slug && marathiModuleContent[slug]) {
        return marathiModuleContent[slug];
      }
      if (mod.translations?.mr?.content) {
        return mod.translations.mr.content;
      }
    } else if (language === "es") {
      if (slug && spanishModuleContent[slug]) {
        return spanishModuleContent[slug];
      }
      if (mod.translations?.es?.content) {
        return mod.translations.es.content;
      }
    }
    return mod.content || "";
  };

  const getBadgeName = (badgeName) => {
    if (!badgeName) return "";
    if (language === "hi" && translations.hi.badgeNames[badgeName]) {
      return translations.hi.badgeNames[badgeName];
    }
    if (language === "mr" && translations.mr.badgeNames[badgeName]) {
      return translations.mr.badgeNames[badgeName];
    }
    if (language === "es" && translations.es?.badgeNames?.[badgeName]) {
      return translations.es.badgeNames[badgeName];
    }
    return badgeName;
  };

  const getLevelName = (level) => {
    const levelKeys = ["levelExplorer", "levelLearner", "levelChampion", "levelHero", "levelMaster"];
    const key = levelKeys[level - 1] || "levelMaster";
    return t(key);
  };

  const getQuizData = (slug, quizObj) => {
    if (!quizObj) return null;
    const qMap = language === "hi" ? hindiQuizzes : language === "mr" ? marathiQuizzes : language === "es" ? spanishQuizzes : null;
    if (qMap && slug && qMap[slug]) {
      const questions = qMap[slug];
      return {
        ...quizObj,
        questions: quizObj.questions.map((q, idx) => {
          const mq = questions[idx];
          if (!mq) return q;
          return {
            ...q,
            question: mq.question,
            options: mq.options,
            explanation: mq.explanation
          };
        })
      };
    }
    if (language !== "en" && quizObj.translations?.[language] && Array.isArray(quizObj.translations[language])) {
      const tQuestions = quizObj.translations[language];
      return {
        ...quizObj,
        questions: quizObj.questions.map((q, idx) => {
          const tq = tQuestions[idx];
          if (!tq) return q;
          return {
            ...q,
            question: tq.question || q.question,
            options: Array.isArray(tq.options) && tq.options.length ? tq.options : q.options,
            explanation: tq.explanation || q.explanation,
          };
        }),
      };
    }
    return quizObj;
  };

  const getFeedbackComment = (fb) => {
    if (!fb) return "";
    if (typeof fb === "string") return fb;
    if (language === "en") {
      return fb.translations?.en || fb.comment || "";
    }
    if (fb.translations?.[language]) {
      return fb.translations[language];
    }
    return fb.comment || "";
  };

  const normalizeStr = (str) =>
    (str || "")
      .toLowerCase()
      .replace(/[\u2010-\u2015\u2212]/g, "-")
      .replace(/[^a-z0-9]/g, "");

  const translateCategory = (cat) => {
    if (language === "hi") {
      if (cat === "article" || cat === "Real Stories" || cat === "Stories") return "वास्तविक कहानी";
      if (cat === "faq" || cat === "FAQs") return "अक्सर पूछे जाने वाले प्रश्न";
    } else if (language === "mr") {
      if (cat === "article" || cat === "Real Stories" || cat === "Stories") return "वास्तव कथा";
      if (cat === "faq" || cat === "FAQs") return "सतत विचारले जाणारे प्रश्न";
    } else if (language === "es") {
      if (cat === "article" || cat === "Real Stories" || cat === "Stories") return "Historias Reales";
      if (cat === "faq" || cat === "FAQs") return "Preguntas Frecuentes";
    }
    return cat;
  };

  const getArticle = (art) => {
    if (!art) return null;
    if (language === "hi" || language === "mr" || language === "es") {
      const normTitle = normalizeStr(art.title);
      const articleList = language === "hi" ? hindiArticles : language === "mr" ? marathiArticles : spanishArticles;
      const matched = articleList.find(
        (h) =>
          (h.englishTitle && normalizeStr(h.englishTitle) === normTitle) ||
          (h.title && normalizeStr(h.title) === normTitle) ||
          (art.content && h.content && art.content.substring(0, 20) === h.content.substring(0, 20))
      );

      const displayCategory = translateCategory(art.category);
      const displaySource =
        art.source === "UNICEF India"
          ? (language === "hi" ? "यूनिसेफ इंडिया" : language === "mr" ? "युनिसेफ इंडिया" : "UNICEF India")
          : art.source === "UNICEF"
          ? (language === "hi" ? "यूनिसेफ" : language === "mr" ? "युनिसेफ" : "UNICEF")
          : art.source === "CBSE"
          ? (language === "hi" ? "सीबीएसई" : language === "mr" ? "सीबीएसई" : "CBSE")
          : art.source === "EduRight Knowledge Hub"
          ? (language === "hi" ? "EduRight ज्ञान कोष" : language === "mr" ? "EduRight ज्ञान कोष" : "Centro de Conocimiento EduRight")
          : art.source;

      if (matched) {
        return {
          ...art,
          title: matched.title,
          content: matched.content,
          category: displayCategory,
          source: matched.source || displaySource
        };
      }

      return {
        ...art,
        category: displayCategory,
        source: displaySource
      };
    }

    return art;
  };

  const getArticleList = (articlesArr) => {
    if (!articlesArr || !Array.isArray(articlesArr)) return [];
    if (language === "hi" || language === "mr" || language === "es") {
      return articlesArr.map((art) => getArticle(art));
    }
    return articlesArr;
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
        formatNumber,
        getModuleTitle,
        getModuleDescription,
        getModuleContent,
        getBadgeName,
        getLevelName,
        getQuizData,
        getArticle,
        getArticleList,
        getFeedbackComment,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};

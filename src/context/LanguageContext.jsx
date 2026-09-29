import React, { createContext, useContext, useState, useEffect } from "react";
import { translations } from "../translations/translations";
import {
  hindiModuleContent,
  hindiQuizzes,
  hindiArticles,
  marathiModuleContent,
  marathiQuizzes,
  marathiArticles
} from "../translations/contentTranslations";

const LanguageContext = createContext();

export const toHindiDigits = (val) => {
  if (val === null || val === undefined) return "";
  const devanagariDigits = ["०", "१", "२", "३", "४", "५", "६", "७", "८", "९"];
  return String(val).replace(/[0-9]/g, (w) => devanagariDigits[+w]);
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguageState] = useState(() => {
    const saved = localStorage.getItem("edurights-language");
    return saved === "hi" ? "hi" : saved === "mr" ? "mr" : "en";
  });

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const setLanguage = (lang) => {
    if (lang === "en" || lang === "hi" || lang === "mr") {
      setLanguageState(lang);
      localStorage.setItem("edurights-language", lang);
      document.documentElement.lang = lang;
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
      if (typeof mod.title === "string") {
        return mod.title
          .replace(/Module\s*(\d+)/gi, (m, p1) => `अनुभाग ${toHindiDigits(p1)}`)
          .replace(/Section\s*(\d+)/gi, (m, p1) => `अनुभाग ${toHindiDigits(p1)}`);
      }
    } else if (language === "mr") {
      if (slug && translations.mr.moduleTitles[slug]) {
        return translations.mr.moduleTitles[slug];
      }
      if (typeof mod.title === "string") {
        return mod.title
          .replace(/Module\s*(\d+)/gi, (m, p1) => `विभाग ${toHindiDigits(p1)}`)
          .replace(/Section\s*(\d+)/gi, (m, p1) => `विभाग ${toHindiDigits(p1)}`);
      }
    }
    return mod.title || "";
  };

  const getModuleDescription = (mod) => {
    if (!mod) return "";
    const slug = mod.slug;
    if (language === "hi" && slug && translations.hi.moduleDescriptions[slug]) {
      return translations.hi.moduleDescriptions[slug];
    }
    if (language === "mr" && slug && translations.mr.moduleDescriptions[slug]) {
      return translations.mr.moduleDescriptions[slug];
    }
    return mod.description || "";
  };

  const getModuleContent = (mod) => {
    if (!mod) return "";
    const slug = mod.slug;
    if (language === "hi" && slug && hindiModuleContent[slug]) {
      return hindiModuleContent[slug];
    }
    if (language === "mr" && slug && marathiModuleContent[slug]) {
      return marathiModuleContent[slug];
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
    return badgeName;
  };

  const getLevelName = (level) => {
    const levelKeys = ["levelExplorer", "levelLearner", "levelChampion", "levelHero", "levelMaster"];
    const key = levelKeys[level - 1] || "levelMaster";
    return t(key);
  };

  const getQuizData = (slug, quizObj) => {
    if (!quizObj) return null;
    const qMap = language === "hi" ? hindiQuizzes : language === "mr" ? marathiQuizzes : null;
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
    return quizObj;
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
    }
    return cat;
  };

  const getArticle = (art) => {
    if (!art) return null;
    if (language === "hi" || language === "mr") {
      const normTitle = normalizeStr(art.title);
      const articleList = language === "hi" ? hindiArticles : marathiArticles;
      const matched = articleList.find(
        (h) =>
          (h.englishTitle && normalizeStr(h.englishTitle) === normTitle) ||
          (h.title && normalizeStr(h.title) === normTitle) ||
          (art.content && h.content && art.content.substring(0, 20) === h.content.substring(0, 20))
      );

      const displayCategory = translateCategory(art.category);
      const displaySource =
        art.source === "UNICEF India"
          ? (language === "hi" ? "यूनिसेफ इंडिया" : "युनिसेफ इंडिया")
          : art.source === "UNICEF"
          ? (language === "hi" ? "यूनिसेफ" : "युनिसेफ")
          : art.source === "CBSE"
          ? (language === "hi" ? "सीबीएसई" : "सीबीएसई")
          : art.source === "EduRight Knowledge Hub"
          ? (language === "hi" ? "EduRight ज्ञान कोष" : "EduRight ज्ञान कोष")
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
    if (language === "hi" || language === "mr") {
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
        getArticleList
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

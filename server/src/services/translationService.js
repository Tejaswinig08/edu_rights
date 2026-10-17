/**
 * Translation Service for EduRights Platform
 * Supports dynamic multilingual translation (English, Hindi, Marathi, Spanish)
 * Uses free Google Translate endpoint with optional GOOGLE_TRANSLATE_API_KEY support.
 * Features in-memory caching, delimiter batching, throttle delays, and graceful degradation.
 */

export const SUPPORTED_LANGUAGES = ["en", "hi", "mr", "es"];

// In-memory cache for translated strings to minimize network requests
const memoryCache = new Map();
const MAX_CACHE_SIZE = 2500;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const getCacheKey = (text, targetLang, sourceLang) =>
  `${sourceLang || "auto"}:${targetLang}:${text.trim()}`;

/**
 * Low-level translation fetcher with retry on 429
 */
async function fetchTranslation(text, targetLang, sourceLang = "auto", retries = 2) {
  const trimmed = text.trim();
  const apiKey = process.env.GOOGLE_TRANSLATE_API_KEY;

  if (apiKey) {
    try {
      const url = `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`;
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          q: trimmed,
          target: targetLang,
          source: sourceLang === "auto" ? undefined : sourceLang,
          format: "text",
        }),
        signal: AbortSignal.timeout(6000),
      });

      if (response.ok) {
        const data = await response.json();
        const item = data?.data?.translations?.[0];
        if (item?.translatedText) {
          return {
            translatedText: item.translatedText,
            detectedSource: item.detectedSourceLanguage || (sourceLang === "auto" ? "en" : sourceLang),
          };
        }
      }
    } catch (err) {
      console.warn("Official Google Translate API error, falling back to endpoint:", err.message);
    }
  }

  // Free Google Translate endpoint
  const gtxUrl = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${encodeURIComponent(
    sourceLang
  )}&tl=${encodeURIComponent(targetLang)}&dt=t&q=${encodeURIComponent(trimmed)}`;

  try {
    const response = await fetch(gtxUrl, {
      signal: AbortSignal.timeout(6000),
    });

    if (response.status === 429 && retries > 0) {
      await sleep(600);
      return fetchTranslation(text, targetLang, sourceLang, retries - 1);
    }

    if (!response.ok) {
      console.warn(`Translation endpoint returned ${response.status}: using original text.`);
      return { translatedText: text, detectedSource: "en" };
    }

    const data = await response.json();
    let translated = text;
    let detectedSource = "en";

    if (Array.isArray(data)) {
      if (Array.isArray(data[0])) {
        translated = data[0].map((chunk) => chunk[0] || "").join("");
      }
      if (data[2] && typeof data[2] === "string") {
        detectedSource = data[2];
      }
    }

    return {
      translatedText: translated || text,
      detectedSource,
    };
  } catch (err) {
    if (retries > 0) {
      await sleep(400);
      return fetchTranslation(text, targetLang, sourceLang, retries - 1);
    }
    console.warn(`Translation request failed for '${targetLang}': ${err.message}`);
    return { translatedText: text, detectedSource: "en" };
  }
}

/**
 * Single-string translation helper
 * @param {string} text - text to translate
 * @param {string} targetLang - target language code ('en', 'hi', 'mr', 'es')
 * @param {string} sourceLang - source language code or 'auto'
 * @returns {Promise<{ translatedText: string, detectedSource: string }>}
 */
export const translateText = async (text, targetLang, sourceLang = "auto") => {
  if (!text || typeof text !== "string" || !text.trim()) {
    return { translatedText: text || "", detectedSource: sourceLang === "auto" ? "en" : sourceLang };
  }

  const trimmed = text.trim();
  const cacheKey = getCacheKey(trimmed, targetLang, sourceLang);

  if (memoryCache.has(cacheKey)) {
    return memoryCache.get(cacheKey);
  }

  if (sourceLang !== "auto" && sourceLang === targetLang) {
    return { translatedText: text, detectedSource: sourceLang };
  }

  const result = await fetchTranslation(trimmed, targetLang, sourceLang);

  if (memoryCache.size >= MAX_CACHE_SIZE) memoryCache.clear();
  memoryCache.set(cacheKey, result);

  return result;
};

/**
 * Automatically translate learning module fields (title, description, content)
 * into all supported target languages ('hi', 'mr', 'es').
 * Uses delimiter batching to translate all fields in a single request per language.
 * @param {Object} moduleData - { title, description, content }
 * @returns {Promise<Object>} translations map: { hi: {...}, mr: {...}, es: {...} }
 */
export const translateModuleData = async ({ title, description, content }) => {
  const targetLanguages = ["hi", "mr", "es"];
  const translations = {};
  const DELIM = "\n<<<DIV>>>\n";

  for (const lang of targetLanguages) {
    try {
      const parts = [
        title || "",
        description || "",
        content || "",
      ];

      const combined = parts.join(DELIM);
      const res = await translateText(combined, lang, "auto");
      
      const split = res.translatedText.split(/<<<DIV>>>/i);
      
      if (split.length >= 3) {
        translations[lang] = {
          title: split[0].trim() || title || "",
          description: split[1].trim() || description || "",
          content: split.slice(2).join("<<<DIV>>>").trim() || content || "",
        };
      } else {
        // Fallback to individual translation if delimiter was affected
        await sleep(100);
        const [tTitle, tDesc, tContent] = await Promise.all([
          title ? translateText(title, lang).then(r => r.translatedText) : Promise.resolve(""),
          description ? translateText(description, lang).then(r => r.translatedText) : Promise.resolve(""),
          content ? translateText(content, lang).then(r => r.translatedText) : Promise.resolve(""),
        ]);
        translations[lang] = {
          title: tTitle || title || "",
          description: tDesc || description || "",
          content: tContent || content || "",
        };
      }
      
      await sleep(120); // Friendly throttle between languages
    } catch (err) {
      console.warn(`Failed translating module to ${lang}:`, err.message);
      translations[lang] = {
        title: title || "",
        description: description || "",
        content: content || "",
      };
    }
  }

  return translations;
};

/**
 * Automatically translate quiz questions, options, and explanations into target languages.
 * @param {Array} questions - array of { question, options, explanation }
 * @returns {Promise<Object>} translations map: { hi: [...], mr: [...], es: [...] }
 */
export const translateQuizData = async (questions) => {
  if (!Array.isArray(questions) || questions.length === 0) {
    return {};
  }

  const targetLanguages = ["hi", "mr", "es"];
  const translations = {};

  for (const lang of targetLanguages) {
    try {
      const translatedQuestions = [];
      for (const q of questions) {
        // Build question payload
        const qParts = [
          q.question || "",
          q.explanation || "",
          ...(Array.isArray(q.options) ? q.options : []),
        ];

        const combined = qParts.join("\n<<<DIV>>>\n");
        const res = await translateText(combined, lang, "auto");
        const split = res.translatedText.split(/<<<DIV>>>/i).map(s => s.trim());

        if (split.length >= 2 + (q.options ? q.options.length : 0)) {
          translatedQuestions.push({
            question: split[0] || q.question,
            explanation: split[1] || q.explanation,
            options: split.slice(2),
          });
        } else {
          // Fallback to separate option translation
          const tQ = await translateText(q.question, lang).then(r => r.translatedText);
          const tExp = q.explanation ? await translateText(q.explanation, lang).then(r => r.translatedText) : "";
          const tOpts = [];
          if (Array.isArray(q.options)) {
            for (const opt of q.options) {
              const to = await translateText(opt, lang).then(r => r.translatedText);
              tOpts.push(to || opt);
            }
          }
          translatedQuestions.push({
            question: tQ || q.question,
            explanation: tExp || q.explanation,
            options: tOpts.length === q.options.length ? tOpts : q.options,
          });
        }
        await sleep(80); // Friendly throttle
      }

      translations[lang] = translatedQuestions;
      await sleep(120);
    } catch (err) {
      console.warn(`Failed translating quiz to ${lang}:`, err.message);
      translations[lang] = questions.map((q) => ({
        question: q.question,
        options: q.options,
        explanation: q.explanation,
      }));
    }
  }

  return translations;
};

/**
 * Automatically translate a user feedback comment into supported dashboard languages.
 * @param {string} comment - original feedback comment
 * @returns {Promise<{ translations: Object, detectedLanguage: string }>}
 */
export const translateFeedbackComment = async (comment) => {
  if (!comment || typeof comment !== "string" || !comment.trim()) {
    return {
      translations: { en: "", hi: "", mr: "", es: "" },
      detectedLanguage: "en",
    };
  }

  const trimmed = comment.trim();
  // Probe language detection
  const firstProbe = await translateText(trimmed, "en", "auto");
  const detectedLanguage = firstProbe.detectedSource || "en";

  const targetLanguages = ["en", "hi", "mr", "es"];
  const translations = {};

  for (const lang of targetLanguages) {
    if (lang === detectedLanguage) {
      translations[lang] = trimmed;
    } else if (lang === "en") {
      translations[lang] = firstProbe.translatedText || trimmed;
    } else {
      await sleep(100);
      const res = await translateText(trimmed, lang, detectedLanguage);
      translations[lang] = res.translatedText || trimmed;
    }
  }

  return {
    translations,
    detectedLanguage,
  };
};

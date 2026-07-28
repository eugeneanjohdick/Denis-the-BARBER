import { createContext, useContext, useEffect, useState, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import fr from "./translations/fr.json";
import en from "./translations/en.json";

const dictionaries = { fr, en };
const STORAGE_KEY = "denis-the-barber:language";
const DEFAULT_LANGUAGE = "fr";

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(DEFAULT_LANGUAGE);
  // Distingue "aucun choix enregistre" (premier lancement) de "a choisi fr",
  // qui seraient sinon indiscernables puisque fr est aussi la langue par defaut.
  const [hasSelectedLanguage, setHasSelectedLanguage] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((stored) => {
      if (stored === "fr" || stored === "en") {
        setLanguageState(stored);
        setHasSelectedLanguage(true);
      }
      setReady(true);
    });
  }, []);

  const setLanguage = useCallback((lang) => {
    setLanguageState(lang);
    setHasSelectedLanguage(true);
    AsyncStorage.setItem(STORAGE_KEY, lang);
  }, []);

  const t = useCallback((key) => dictionaries[language][key] ?? key, [language]);

  if (!ready) return null;

  return (
    <LanguageContext.Provider value={{ language, setLanguage, hasSelectedLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslation() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useTranslation doit etre utilise a l'interieur d'un LanguageProvider");
  }
  return ctx;
}

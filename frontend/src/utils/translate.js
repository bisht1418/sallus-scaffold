import { store } from "../Redux/store";
import { en } from "./i18n/en";
import { no } from "./i18n/no";

const showingTranslateValue = (data, lang) => {
  const translation =
    data !== undefined && Object?.keys(data).includes(lang)
      ? data[lang]
      : data?.de;
  return translation;
};

const showingImage = (data) => {
  return data !== undefined && data;
};

const showingUrl = (data) => {
  return data !== undefined ? data : "!#";
};


const t = (text) => {
  const currentLang = store.getState().global.current_language
  if (currentLang === "en") {
    return en[text]
  } else if (currentLang === "no") {
    return no[text]
  }
}

export { showingTranslateValue, showingImage, showingUrl, t };

const oFormat = require("date-fns/format");
const oDistanceInWords = "date-fns/distance_in_words";

var locales = {
  fr: require("date-fns/locale/fr")
};

export const format = (date, formatStr) =>
  oFormat(date, formatStr, {
    locale: locales[window.__localeId__]
  });

export const distanceInWords = (date1, date2) =>
  oDistanceInWords(date1, date2, { locale: locales[window.__localeId__] });

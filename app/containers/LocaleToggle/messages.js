/*
 * LocaleToggle Messages
 *
 * This contains all the text for the LanguageToggle component.
 */
import { defineMessages } from 'react-intl';
import { appLocales } from '../../i18n';

const getLocaleMessages = (locales) =>
  locales.reduce((messages, locale) => ({
    ...messages,
    [locale]: {
      id: `app.components.LocaleToggle.${locale}`,
      defaultMessage: `${locale}`,
    },
  }), {});

export default defineMessages(
  getLocaleMessages(appLocales)
);

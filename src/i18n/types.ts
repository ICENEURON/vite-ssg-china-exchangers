import 'react-i18next';
import type { Resources } from '../locales';

declare module 'react-i18next' {
  interface CustomTypeOptions {
    defaultNS: 'translation';
    resources: Resources['en'];
  }
}
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n.use(initReactI18next).init({
    resources: {
        en: {
            translation: {
                welcome: 'Welcome to Invox',
                dashboard: 'Dashboard'
            }
        },
        hi: {
            translation: {
                welcome: 'इनवॉक्स में आपका स्वागत है',
                dashboard: 'डैशबोर्ड'
            }
        }
    },
    lng: 'en',
    fallbackLng: 'en'
}); 
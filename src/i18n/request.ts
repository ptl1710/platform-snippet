import { getRequestConfig } from "next-intl/server";

const locales = ["vi", "en"];

export default getRequestConfig(async ({ locale }) => {
    const loc = locale && locales.includes(locale) ? locale : "vi";
    return {
        locale: loc,
        messages: (await import(`../../messages/${loc}.json`)).default
    };
});

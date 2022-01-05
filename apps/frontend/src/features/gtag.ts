export const GA_TRACKING_ID = "UA-214136519-1";

// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
export const pageview = (url: URL): void => {
    window.gtag("config", GA_TRACKING_ID, {
        page_path: url,
    });
};

type GTagEvent = {
    action: string;
    category: string;
    label: string;
    value: number;
};

// https://developers.google.com/analytics/devguides/collection/gtagjs/events
export const event = ({ action, category, label, value }: GTagEvent): void => {
    try{
        window.gtag("event", action, {
            event_category: category,
            event_label: label,
            value,
        });
    } catch (e){
        console.warn(e);
    }
};
export const GA_TRACKING_ID = "G-ZRDMH3VQ6W";

type EventParams = {
    category?: string;
    label?: string;
    value?: number;
    [key: string]: any;
};

// Declare gtag as a global function on window
declare global {
    interface Window {
        gtag: (
            command: "config" | "event",
            targetId: string,
            params?: EventParams
        ) => void;
        dataLayer: any[];
    }
}

export const trackEvent = (
    eventName: string,
    params?: EventParams
) => {
    if (typeof window !== "undefined" && window.gtag) {
        window.gtag("event", eventName, params);
    } else {
        console.log(`[Analytics Dev] Event: ${eventName}`, params);
    }
};

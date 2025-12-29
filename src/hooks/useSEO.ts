import { useEffect } from "react";

interface SEOProps {
    title: string;
    description: string;
    image?: string;
    url?: string;
}

export const useSEO = ({ title, description, image, url }: SEOProps) => {
    useEffect(() => {
        // Update Title
        document.title = title;

        // Update Meta Description
        updateMetaName("description", description);

        // Update OG Tags
        updateMetaProperty("og:title", title);
        updateMetaProperty("og:description", description);
        if (image) updateMetaProperty("og:image", image);
        if (url) updateMetaProperty("og:url", url);

        // Update Twitter Tags
        updateMetaProperty("twitter:title", title);
        updateMetaProperty("twitter:description", description);
        if (image) updateMetaProperty("twitter:image", image);
        if (url) updateMetaProperty("twitter:url", url);

    }, [title, description, image, url]);
};

function updateMetaName(name: string, content: string) {
    let element = document.querySelector(`meta[name="${name}"]`);
    if (!element) {
        element = document.createElement("meta");
        element.setAttribute("name", name);
        document.head.appendChild(element);
    }
    element.setAttribute("content", content);
}

function updateMetaProperty(property: string, content: string) {
    let element = document.querySelector(`meta[property="${property}"]`);
    if (!element) {
        element = document.createElement("meta");
        element.setAttribute("property", property);
        document.head.appendChild(element);
    }
    element.setAttribute("content", content);
}

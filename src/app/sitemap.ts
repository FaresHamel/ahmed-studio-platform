import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = "https://ahmed-studio.com";

    return [
        {
            url: `${baseUrl}/`,
            lastModified: new Date(),
        },
        {
            url: `${baseUrl}/formats`,
            lastModified: new Date(),
        },
        {
            url: `${baseUrl}/consultant`,
            lastModified: new Date(),
        },
        {
            url: `${baseUrl}/ourlab`,
            lastModified: new Date(),
        },
        {
            url: `${baseUrl}/cloudStorage`,
            lastModified: new Date(),
        },
        {
            url: `${baseUrl}/quote`,
            lastModified: new Date(),
        },
        {
            url: `${baseUrl}/subscription`,
            lastModified: new Date(),
        },
        {
            url: `${baseUrl}/services`,
            lastModified: new Date(),
        },
        {
            url: `${baseUrl}/order`,
            lastModified: new Date(),
        },
        {
            url: `${baseUrl}/enhancement`,
            lastModified: new Date(),
        },
        {
            url: `${baseUrl}/differences`,
            lastModified: new Date(),
        },
    ];
}
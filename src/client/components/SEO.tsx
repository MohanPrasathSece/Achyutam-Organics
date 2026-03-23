import { Helmet } from "react-helmet-async";

interface SEOProps {
    title?: string;
    description?: string;
    keywords?: string;
    ogImage?: string;
    ogType?: "website" | "article" | "product";
    canonicalUrl?: string;
    schemas?: object[];
    preloadImage?: string;
}

const SEO = ({
    title = "Achyutam Organics | Pure Desi Gir Cow Ghee & Organic Dairy",
    description = "Achyutam Organics brings you the finest Organic Desi Gir Cow Ghee, made using the traditional Bilona method. Fresh from our farm in Katni to your home.",
    keywords = "organic ghee, desi Gir cow ghee, bilona ghee, A2 Gir cow ghee, farm fresh dairy, organic dairy products, Achyutam Organics",
    ogImage = "/src/client/assets/ghee-hero.jpg",
    ogType = "website",
    canonicalUrl,
    schemas = [],
    preloadImage,
}: SEOProps) => {
    const siteUrl = "https://achyutamorganics.com"; // Updated domain
    const fullTitle = title.includes("Achyutam Organics") ? title : `${title} | Achyutam Organics`;
    const url = canonicalUrl ? `${siteUrl}${canonicalUrl}` : siteUrl;

    return (
        <Helmet>
            {/* Basic Meta Tags */}
            <title>{fullTitle}</title>
            <meta name="description" content={description} />
            <meta name="keywords" content={keywords} />
            <link rel="canonical" href={url} />

            {/* Performance Optimization */}
            {preloadImage && (
                <link rel="preload" as="image" href={preloadImage} />
            )}

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={ogType} />
            <meta property="og:url" content={url} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={ogImage.startsWith("http") ? ogImage : `${siteUrl}${ogImage}`} />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:url" content={url} />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={ogImage.startsWith("http") ? ogImage : `${siteUrl}${ogImage}`} />

            {/* Structured Data */}
            {schemas.map((schema, index) => (
                <script key={index} type="application/ld+json">
                    {JSON.stringify(schema)}
                </script>
            ))}
        </Helmet>
    );
};

export default SEO;

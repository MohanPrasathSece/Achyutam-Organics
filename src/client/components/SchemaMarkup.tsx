import { Helmet } from "react-helmet-async";

const SchemaMarkup = () => {
    const siteUrl = "https://achyutamorganics.com";

    const organizationSchema = {
        "@context": "https://schema.org",
        "@type": "DairyFarm",
        "name": "Achyutam Organics",
        "url": siteUrl,
        "logo": `${siteUrl}/favicon.png`,
        "description": "Pure Desi Gir Cow Ghee & Organic Dairy products handcrafted using traditional Vedic Bilona methods.",
        "sameAs": [
            "https://www.instagram.com/achyutam_organics",
            "https://twitter.com/achyutam_org",
            "https://facebook.com/achyutamorganics"
        ],
        "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "+91-9425156801",
            "contactType": "customer service",
            "areaServed": "IN",
            "availableLanguage": "en"
        }
    };

    const websiteSchema = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "Achyutam Organics",
        "url": siteUrl,
        "potentialAction": {
            "@type": "SearchAction",
            "target": {
                "@type": "EntryPoint",
                "urlTemplate": `${siteUrl}/products?search={search_term_string}`
            },
            "query-input": "required name=search_term_string"
        }
    };

    const navigationSchema = {
        "@context": "https://schema.org",
        "@type": "SiteNavigationElement",
        "name": [
            "Home",
            "About",
            "Products",
            "Contact"
        ],
        "url": [
            `${siteUrl}/`,
            `${siteUrl}/about`,
            `${siteUrl}/products`,
            `${siteUrl}/contact`
        ]
    };

    const productSchema = {
        "@context": "https://schema.org",
        "@type": "Product",
        "name": "Pure Desi Gir Cow Ghee",
        "description": "100% pure A2 milk ghee from indigenous Gir cows, handcrafted using traditional Vedic Bilona methods.",
        "brand": {
            "@type": "Brand",
            "name": "Achyutam Organics"
        },
        "offers": {
            "@type": "Offer",
            "priceCurrency": "INR",
            "priceRange": "550-2100",
            "availability": "https://schema.org/InStock",
            "seller": {
                "@type": "Organization",
                "name": "Achyutam Organics"
            }
        },
        "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "5.0",
            "reviewCount": "50"
        }
    };

    return (
        <Helmet>
            <script type="application/ld+json">
                {JSON.stringify(organizationSchema)}
            </script>
            <script type="application/ld+json">
                {JSON.stringify(websiteSchema)}
            </script>
            <script type="application/ld+json">
                {JSON.stringify(navigationSchema)}
            </script>
            <script type="application/ld+json">
                {JSON.stringify(productSchema)}
            </script>
        </Helmet>
    );
};

export default SchemaMarkup;

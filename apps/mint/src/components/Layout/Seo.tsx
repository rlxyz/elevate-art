import { useGetProjectDetail } from "@hooks/useGetProjectDetail";
import Head from "next/head";
import React from "react";

interface SeoProps {
  title?: string;
  description?: string;
}

export const Seo: React.FC<SeoProps> = ({ title = "Home", description }) => {
  const { data, isLoading } = useGetProjectDetail("rlxyz");
  const pageName = `${data?.projectName} - ${title}`;

  if (isLoading) {
    return null;
  }

  return (
    <Head>
      <meta charSet="utf-8" />
      <meta name="language" content="english" />
      <meta httpEquiv="content-type" content="text/html" />
      <meta name="author" content={data.projectOwner} />
      <meta name="designer" content="RLXYZ" />

      {/* Search Engine Optimization Meta Tags */}
      <title>{pageName}</title>
      <meta name="description" content={data.projectDescription} />
      <meta name="keywords" content={`${data.keywords}`} />
      <meta name="robots" content="index,follow" />
      <meta name="distribution" content="web" />

      {/* Facebook Open Graph meta tags */}
      <meta name="og:title" content={pageName} />
      <meta
        name="og:description"
        content={description || data.projectDescription}
      />
      <meta name="og:type" content="site" />
      <meta name="og:image" content={data.projectInfoBanner} />
      <meta name="og:url" content={data.websiteUrl} />
      <meta name="og:author" content={data.projectOwner} />
      <meta name="og:author" content="RLXYZ" />
      <meta name="og:site_name" content={data.projectName} />

      {/* Twitter Card meta tags */}
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:site" content="@rlxyz_eth" />
      <meta name="twitter:title" content={data.projectName} />
      <meta name="twitter:description" content={data.projectDescription} />
      <meta name="twitter:image" content={data.projectInfoBanner} />

      <meta
        name="viewport"
        content="width=device-width, minimum-scale=1, initial-scale=1.0"
      />
      <meta name="theme-color" content="#000" />
      <link rel="shortcut icon" href="/favicon.ico" />
    </Head>
  );
};

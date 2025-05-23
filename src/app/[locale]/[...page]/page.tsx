import { builder } from "@builder.io/sdk";
import { RenderBuilderContent } from "@/components/RenderBuilderContent";

// Replace with your Public API Key
builder.init(process.env.NEXT_PUBLIC_BUILDER_API_KEY!);

interface PageProps {
  params: Promise<{
    page: string[];
    locale: string;
  }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { locale, page } = await params;

  const content = await builder
    .get("locale-page-test", {
      userAttributes: {
        urlPath: "/" + (page ? page.join("/") : ""),
        locale: locale,
      },
      prerender: false,
      options: {
        locale: locale,
      },
    })
    .toPromise();

  return {
    title: content?.data?.title || "Default Page Title",
    description: content?.data?.description || "Default page description",
    openGraph: {
      title: content?.data?.title || "Default Page Title",
      description: content?.data?.description || "Default page description",
      locale: locale,
    },
    alternates: {
      canonical: "",
      languages: {
        "en-US": "/en-US",
        "de-DE": "/de-DE",
      },
    },
  };
}

export default async function Page(props: PageProps) {
  // Explicitly await the params object as suggested by the error message
  const params = await props.params;
  const locale = params.locale;
  const page = params.page;

  const model = "locale-page-test";

  const content = await builder
    // Get the page content from Builder with the specified options
    .get("locale-page-test", {
      userAttributes: {
        // Use the page path specified in the URL to fetch the content
        urlPath: "/" + (page ? page.join("/") : ""),
        locale: locale,
      },
      // Set prerender to false to return JSON instead of HTML
      prerender: false,
      options: {
        locale: locale,
      },
    })
    // Convert the result to a promise
    .toPromise();

  return (
    <>
      {/* Render the Builder page */}
      <RenderBuilderContent locale={locale} content={content} model={model} />
    </>
  );
}

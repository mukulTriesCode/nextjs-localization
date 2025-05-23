// Example file structure, app/[...page]/page.tsx
// You could alternatively use src/app/[...page]/page.tsx
import { builder } from "@builder.io/sdk";
import { RenderBuilderContent } from "@/components/RenderBuilderContent";

// Replace with your Public API Key
builder.init(process.env.NEXT_PUBLIC_BUILDER_API_KEY!);

interface PageProps {
  params: Promise<{
    page: string[];
  }>;
}

export default async function Page(props: PageProps) {
  const { params } = props;
  const { page } = await params;
  const model = "locale-page-test";
  const content = await builder
    // Get the page content from Builder with the specified options
    .get("locale-page-test", {
      userAttributes: {
        // Use the page path specified in the URL to fetch the content
        urlPath: "/" + (page ? page.join("/") : ""),
      },
      // Set prerender to false to return JSON instead of HTML
      prerender: false,
      options: {},
    })
    // Convert the result to a promise
    .toPromise();
  return (
    <>
      {/* Render the Builder page */}
      <RenderBuilderContent content={content} model={model} />
    </>
  );
}

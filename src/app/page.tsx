import { builder } from "@builder.io/sdk";
import { PageProps } from "../../.next/types/app/layout";
import { RenderBuilderContent } from "@/components/RenderBuilderContent";
import { defaultLocale } from "@/lib/helper";

builder.init(process.env.NEXT_PUBLIC_BUILDER_API_KEY!);

export async function generateMetadata({ params }: PageProps) {
  const { locale = 'en-US', page } = await params;

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
    metadataBase: new URL('http://localhost:3000/'),
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
export default async function Home() {
  const model = "locale-page-test";
  
  const content = await builder
  .get("locale-page-test", {
    userAttributes: {
      // urlPath: "/" + (page ? page.join("/") : ""),
      urlPath: "/",
      locale: defaultLocale,
    },
    prerender: false,
    options: {
      locale: defaultLocale,
    },
  })
  .toPromise();
  return (
    <RenderBuilderContent locale={defaultLocale} content={content} model={model} />
  );
}

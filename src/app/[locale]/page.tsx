import { RenderBuilderContent } from "@/components/RenderBuilderContent";
import { regions } from "@/lib/helper";
import { builder } from "@builder.io/sdk";

builder.init(process.env.NEXT_PUBLIC_BUILDER_API_KEY!);

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const isLocalePage = regions.includes(locale);

  const model = "locale-page-test";

  const content = await builder
    .get("locale-page-test", {
      userAttributes: {
        // urlPath: "/" + (page ? page.join("/") : ""),
        urlPath: isLocalePage ? "/" : `/${locale}`,
        locale: locale,
      },
      prerender: false,
      options: {
        locale: locale,
      },
    })
    .toPromise();
  return (
    <RenderBuilderContent locale={locale} content={content} model={model} />
  );
}

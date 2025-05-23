"use client";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

const regions = [
  { value: "en-AU", label: "Australia (English)" },
  { value: "nl-NL", label: "Netherlands (Dutch)" },
  { value: "de-CH", label: "Switzerland (German)" },
  { value: "fr-CH", label: "Switzerland (French)" },
  { value: "en-NZ", label: "New Zealand (English)" },
  { value: "en-ZA", label: "South Africa (English)" },
  { value: "sv-SE", label: "Sweden (Swedish)" },
  { value: "nb-NO", label: "Norway (Norwegian)" },
  { value: "es-ES", label: "Spain (Spanish)" },
  { value: "pt-PT", label: "Portugal (Portuguese)" },
  { value: "fr-BE", label: "Belgium (French)" },
  { value: "nl-BE", label: "Belgium (Dutch)" },
  { value: "fr-FR", label: "France (French)" },
  { value: "en-CA", label: "Canada (English)" },
  { value: "fr-CA", label: "Canada (French)" },
  { value: "es-MX", label: "Mexico (Spanish)" },
  { value: "pt-BR", label: "Brazil (Portuguese)" },
  { value: "en-SA", label: "Saudi Arabia (English)" },
  { value: "en-AE", label: "UAE (English)" },
];

const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [selectedRegion, setSelectedRegion] = useState(regions[0].value);
  useEffect(() => {
    // Check if the locale is stored in localStorage
    const storedLocale = sessionStorage.getItem("locale");
    if (storedLocale) {
      setSelectedRegion(storedLocale);
    }
  }, []);

  useEffect(() => {
    // Extract locale from URL path
    const pathParts = pathname.split("/");
    const localeFromPath = pathParts[1];

    // Check if the locale in URL is valid
    if (regions.some((region) => region.value === localeFromPath)) {
      setSelectedRegion(localeFromPath);
    }
  }, [pathname]);

  const handleRegionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newRegion = e.target.value;
    setSelectedRegion(newRegion);

    console.log("pathname", pathname)

    // Get the current path without the locale
    const pathParts = pathname.split("/");
    const pathWithoutLocale = pathParts.slice(2).join("/");
    const localePage = regions.some((region) => region.value === pathParts[1])
    console.log("pathWithoutLocale", pathWithoutLocale)
    console.log("localePage", localePage)
    
    // Construct new path with selected locale
    const newPath = `/${newRegion}${pathWithoutLocale ? "/" + pathWithoutLocale : ""}`;

    // Store the selected locale in localStorage
    sessionStorage.setItem("locale", newRegion);

    // Navigate to the new path
    router.push(newPath);
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0">
            <h1 className="text-xl font-bold">Logo</h1>
          </div>
          <div className="ml-4">
            <select
              value={selectedRegion}
              onChange={handleRegionChange}
              className="block w-48 px-3 py-2 text-base border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {regions.map((region) => (
                <option key={region.value} value={region.value}>
                  {region.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

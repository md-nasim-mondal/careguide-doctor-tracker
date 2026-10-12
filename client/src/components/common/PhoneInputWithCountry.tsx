"use client";

import { useState } from "react";

export interface CountryCode {
  name: string;
  code: string;
  flag: string;
  iso: string;
}

export const COUNTRIES: CountryCode[] = [
  { name: "Bangladesh", code: "+880", flag: "🇧🇩", iso: "BD" },
  { name: "United States", code: "+1", flag: "🇺🇸", iso: "US" },
  { name: "United Kingdom", code: "+44", flag: "🇬🇧", iso: "GB" },
  { name: "India", code: "+91", flag: "🇮🇳", iso: "IN" },
  { name: "Canada", code: "+1", flag: "🇨🇦", iso: "CA" },
  { name: "Australia", code: "+61", flag: "🇦🇺", iso: "AU" },
  { name: "United Arab Emirates", code: "+971", flag: "🇦🇪", iso: "AE" },
  { name: "Saudi Arabia", code: "+966", flag: "🇸🇦", iso: "SA" },
  { name: "Germany", code: "+49", flag: "🇩🇪", iso: "DE" },
  { name: "France", code: "+33", flag: "🇫🇷", iso: "FR" },
  { name: "Italy", code: "+39", flag: "🇮🇹", iso: "IT" },
  { name: "Spain", code: "+34", flag: "🇪🇸", iso: "ES" },
  { name: "Singapore", code: "+65", flag: "🇸🇬", iso: "SG" },
  { name: "Malaysia", code: "+60", flag: "🇲🇾", iso: "MY" },
  { name: "Pakistan", code: "+92", flag: "🇵🇰", iso: "PK" },
  { name: "Qatar", code: "+974", flag: "🇶🇦", iso: "QA" },
  { name: "Kuwait", code: "+965", flag: "🇰🇼", iso: "KW" },
  { name: "Oman", code: "+968", flag: "🇴🇲", iso: "OM" },
  { name: "Japan", code: "+81", flag: "🇯🇵", iso: "JP" },
  { name: "South Korea", code: "+82", flag: "🇰🇷", iso: "KR" },
  { name: "China", code: "+86", flag: "🇨🇳", iso: "CN" },
  { name: "Turkey", code: "+90", flag: "🇹🇷", iso: "TR" },
  { name: "Netherlands", code: "+31", flag: "🇳🇱", iso: "NL" },
  { name: "Sweden", code: "+46", flag: "🇸🇪", iso: "SE" },
  { name: "Switzerland", code: "+41", flag: "🇨🇭", iso: "CH" },
  { name: "Brazil", code: "+55", flag: "🇧🇷", iso: "BR" },
  { name: "South Africa", code: "+27", flag: "🇿🇦", iso: "ZA" },
  { name: "Nepal", code: "+977", flag: "🇳🇵", iso: "NP" },
  { name: "Sri Lanka", code: "+94", flag: "🇱🇰", iso: "LK" },
];

interface PhoneInputWithCountryProps {
  name?: string;
  defaultValue?: string;
  placeholder?: string;
  required?: boolean;
  className?: string;
}

export default function PhoneInputWithCountry({
  name = "phone",
  defaultValue = "",
  placeholder = "17XXXXXXXX",
  required = false,
  className = "",
}: PhoneInputWithCountryProps) {
  // Try to parse country code from defaultValue, or default to Bangladesh (+880)
  const findInitialCountry = () => {
    if (!defaultValue) return COUNTRIES[0];
    const match = COUNTRIES.find((c) => defaultValue.startsWith(c.code));
    return match || COUNTRIES[0];
  };

  const [selectedCountry, setSelectedCountry] = useState<CountryCode>(findInitialCountry);
  const [nationalNumber, setNationalNumber] = useState<string>(() => {
    if (!defaultValue) return "";
    if (defaultValue.startsWith(selectedCountry.code)) {
      return defaultValue.slice(selectedCountry.code.length).replace(/^0+/, "");
    }
    return defaultValue;
  });

  // Calculate full international phone number
  const fullPhone = nationalNumber ? `${selectedCountry.code}${nationalNumber.replace(/^0+/, "")}` : "";

  return (
    <div className={`space-y-1 ${className}`}>
      <div className="flex rounded-xl border border-input bg-background focus-within:ring-2 focus-within:ring-primary/40 focus-within:border-primary overflow-hidden transition">
        {/* Country Selector Dropdown */}
        <div className="relative flex items-center bg-muted/50 border-r border-input/60 px-2.5 py-1.5 shrink-0 hover:bg-muted transition cursor-pointer">
          <span className="text-base mr-1.5">{selectedCountry.flag}</span>
          <span className="text-xs font-semibold text-foreground mr-1">{selectedCountry.code}</span>
          <select
            value={selectedCountry.iso}
            onChange={(e) => {
              const country = COUNTRIES.find((c) => c.iso === e.target.value);
              if (country) {
                setSelectedCountry(country);
              }
            }}
            aria-label="Select Country Code"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          >
            {COUNTRIES.map((c) => (
              <option key={c.iso} value={c.iso}>
                {c.flag} {c.name} ({c.code})
              </option>
            ))}
          </select>
          <span className="text-[10px] text-muted-foreground pointer-events-none">▼</span>
        </div>

        {/* National Number Input */}
        <input
          type="tel"
          value={nationalNumber}
          onChange={(e) => {
            // Keep digits only
            const cleaned = e.target.value.replace(/[^\d]/g, "");
            setNationalNumber(cleaned);
          }}
          placeholder={placeholder}
          required={required}
          className="w-full px-3 py-2 text-sm bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none"
        />
      </div>

      {/* Hidden input submitted with the form containing the full E.164 number with country code */}
      <input type="hidden" name={name} value={fullPhone} />
    </div>
  );
}

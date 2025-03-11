"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from "next/image";
import { useStore } from "@/store";
import { useState } from "react";
import { translateLocale } from "@/lib/locales";
import { useRouter } from "next/navigation";

export default function Home() {
  const { election } = useStore();
  const [language, setLanguage] = useState("de");
  const router = useRouter();

  if (!election) return null;

  return (
    <>
      {/* Main Image */}
      <div className="relative w-full h-[33vh]">
        <Image
          src={election.image}
          alt="cover image"
          fill
          className="object-cover"
          priority
        />
      </div>

      <div className="p-4 grid grid-cols-[minmax(0,_1fr)_minmax(0,_4fr)] gap-4">
        {/* Date and Title */}
        <div className="flex flex-col text-center leading-none mr-6">
          <div className="font-bold text-3xl">
            {election.date.toLocaleDateString(undefined, { day: "2-digit" })}
          </div>
          <div className="font-bold text-lg -mt-1">
            {election.date.toLocaleDateString(undefined, { month: "short" })}
          </div>
          <div>{election.date.getFullYear()}</div>
        </div>
        <div className="flex flex-col justify-center">
          <div className="text-xl font-bold">{election.location}</div>
          <div>{election.name}</div>
        </div>

        {/* Language Selection */}
        <div className="place-self-center">Sprache:</div>
        <Select value={language} onValueChange={setLanguage}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Deutsch" />
          </SelectTrigger>
          <SelectContent>
            {election.locales.map((locale) => (
              <SelectItem key={locale} value={locale}>
                {translateLocale(locale, locale)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Start Button */}
        <Button
          size={"lg"}
          className="col-span-2 w-full text-lg bg-votopurple-500 hover:bg-votopurple-600 transition-colors"
          onClick={() => router.push(`/elections/${election.id}/runs/1`)}
        >
          Start
        </Button>

        {/* Content Area */}
        <div className="col-span-2">
          <div className="font-bold">Content Area:</div>
          <div>Intro, Relevante Infos, Kooperations-partner, FAQs etc.</div>
        </div>
      </div>
    </>
  );
}

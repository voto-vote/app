"use client";

import { Button } from "@/components/ui/button";
import MatchBar from "@/app/[locale]/elections/[electionid]/(theses)/result/match-bar";
import { Bookmark, ChevronDown, CircleQuestionMark } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useElectionStore } from "@/stores/election-store";
import { useBackButtonStore } from "@/stores/back-button-store";

export default function CandidatePage() {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isAboutMeExpanded, setIsAboutMeExpanded] = useState(false);
  const [aboutMeHeight, setAboutMeHeight] = useState(0);
  const aboutMeRef = useRef<HTMLDivElement>(null);
  const { election } = useElectionStore();
  const { setBackPath } = useBackButtonStore();

  useEffect(() => {
    if (election?.id) {
      setBackPath(`/elections/${election?.id}/result`);
    } else {
      setBackPath("/");
    }
  }, [election?.id, setBackPath]);

  useEffect(() => {
    if (aboutMeRef.current) {
      setAboutMeHeight(aboutMeRef.current.scrollHeight);
    }
  }, []);

  return (
    <div className="container mx-auto max-w-3xl px-2 pb-16 space-y-8">
      {/* Header */}
      <div className="relative">
        <div className="bg-[url(https://upload.wikimedia.org/wikipedia/commons/0/05/Bernstein_%28Burgenland%29_-_Luftaufnahme.JPG)] h-36 bg-cover bg-center"></div>
        <div className="absolute bg-[url(https://i.pravatar.cc/300)] h-38 bg-cover bg-center aspect-square rounded-full border-4 border-background left-2 top-18"></div>
        <div className="flex items-center ml-42 p-4">
          <MatchBar value={60} className="grow" />
          <button
            aria-label="Merken"
            onClick={() => setIsBookmarked(!isBookmarked)}
            className="ml-4"
          >
            <Bookmark
              className={`size-8 transition text-primary ${isBookmarked ? "fill-current" : "fill-transparent hover:fill-current/25"}`}
            />
          </button>
        </div>
      </div>

      {/* Candidate Info */}
      <div>
        <h1 className="text-xl font-bold">Brigitte Burn-Müllhaupt</h1>
        <div className="grid grid-cols-6 gap-2">
          <div className="col-span-4 text-lg">
            Für eine musterhafte Stadt mit einer musterhaften Geschichte im Land
            und in der Welt. Lorem Ipsum dolor sit amet!
          </div>
          <div className="font-bold text-sm pl-6">
            Liste
            <br />
            Position
            <br />
            Region
          </div>
          <div className="text-sm">
            CDU
            <br />
            6
            <br />
            Stuttgart-Nord
          </div>
        </div>
      </div>

      {/* About me */}
      <div>
        <h2 className="text-lg font-bold">Über mich</h2>
        <div
          className="grid grid-cols-6 overflow-hidden transition-all duration-500 ease-in-out"
          style={{
            maxHeight: isAboutMeExpanded ? `${aboutMeHeight}px` : "7.5rem",
          }}
        >
          <div className="col-span-4" ref={aboutMeRef}>
            Ich möchte mich vorstellen Mein Name ist Brigitte Burn-Müllhaupt.
            Ich bin am 03.05.1971 in Halle an der Saale geboren und
            aufgewach-sen und lebe nunmehr seit 53 Jahren in eben dieser Stadt,
            zu der ich mich sehr verbunden fühle. Nach meiner Ausbildung als
            Maler, habe ich mich auf Werbung und Design spezialisiert. Als
            Inhaber der Werbeagentur &quot;Machart&quot; bin ich bereits viele
            Jahre erfolgreich tätig. Vielleicht kennen Sie ja noch die &quot;Koi
            an den Hallmarkt-Stufen&quot; oder sind bereits einer meiner
            gestalte-ten Tram-Bahnen begegnet?! Ich bin vielseitig interessiert,
            begeisterungsfähig, liebe, was ich mache und bin immer mit Herzblut
            dabei und gehe gern unkonventionelle Wege. Neben meinen
            unterschiedlichen beruflichen Aktivitä-ten war ich viele Jahre u.a.
            selbst begeisterter Motocross-Fahrer und durfte nach meiner akti-ven
            Karriere Events wie &quot;Kings of Extrem&quot; und &quot;Night of
            Freestyle&quot; organisieren und erfolgreich umsetzen. Als Gastronom
            bin ich Teil einer Ge-meinschaft und habe direkte und sehr
            persönli-che Verbindungen zu meinen Kunden. Ich weiß was die
            Menschen in Halle bewegt und be-schäftigt, befinde ich mich doch im
            täglichen Austausch mit ihnen. Ich konnte meine Ideen und Projekte
            immer mit Leiden- schaft und Überzeugung vertreten und möchte meine
            Erfahrungen, mein Organisationstalent aber auch die Fähigkeit,
            Entscheidungen zu treffen gern dem Gemeinwohl zur Verfügung stellen;
            für ein besseres Halle.
          </div>
        </div>

        {/* Gradient overlay when collapsed */}
        {!isAboutMeExpanded && (
          <div className="h-6 bg-gradient-to-t from-background to-transparent -mt-6 relative z-10" />
        )}

        <Button
          variant="ghost"
          className="text-primary text-sm -ml-3"
          onClick={() => setIsAboutMeExpanded(!isAboutMeExpanded)}
        >
          Details
          <ChevronDown
            className={`transition ${isAboutMeExpanded ? "rotate-180" : "rotate-0"}`}
          />
        </Button>
      </div>

      {/* Theses */}
      <div>
        <h2 className="text-lg font-bold">
          VOTO Antworten von Brigitte Burn-Müllhaupt
        </h2>
        <div className="flex items-center text-sm">
          <div className="mr-1">Sortiert nach Kategorien.</div>
          <Button variant="link" className="text-primary p-0 h-fit">
            Sortierung Deines VOTOs stattdessen verwenden
          </Button>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" className="text-primary h-fit p-1!">
                <CircleQuestionMark />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="bg-primary text-primary-foreground text-sm py-1 px-2 border-primary"
              side="top"
            >
              Die Thesen eines VOTOs sind beim Beantworten zufällig sortiert, um
              Dich nicht zu beeinflussen.
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 backdrop-blur-md bg-accent z-10 border-t">
        <div className="container mx-auto max-w-3xl flex items-center justify-center py-2">
          <Button variant="ghost" className="text-primary text-base">
            Legende
          </Button>
        </div>
      </div>
    </div>
  );
}

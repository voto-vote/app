"use client";

import { Button } from "@/components/ui/button";
import MatchBar from "@/app/[locale]/elections/[electionid]/(theses)/result/match-bar";
import { Bookmark, ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useBackButtonStore } from "@/stores/back-button-store";
import { useThesesStore } from "@/stores/theses-store";
import { useRatingsStore } from "@/stores/ratings-store";
import { useElection } from "@/contexts/election-context";
import ThesesResultCarousel from "../../theses-result-carousel";

export default function CandidatePage() {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isAboutMeExpanded, setIsAboutMeExpanded] = useState(false);
  const [aboutMeHeight, setAboutMeHeight] = useState(0);
  const aboutMeRef = useRef<HTMLDivElement>(null);
  const { election } = useElection();
  const { theses } = useThesesStore();
  const { ratings } = useRatingsStore();
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
  }, [aboutMeRef.current]);

  if (!theses) {
    return null;
  }

  return (
    <div className="overflow-hidden">
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
              Für eine musterhafte Stadt mit einer musterhaften Geschichte im
              Land und in der Welt. Lorem Ipsum dolor sit amet!
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
              aufgewachsen und lebe nunmehr seit 53 Jahren in eben dieser Stadt,
              zu der ich mich sehr verbunden fühle. Nach meiner Ausbildung als
              Maler, habe ich mich auf Werbung und Design spezialisiert. Als
              Inhaber der Werbeagentur &quot;Machart&quot; bin ich bereits viele
              Jahre erfolgreich tätig. Vielleicht kennen Sie ja noch die
              &quot;Koi an den Hallmarkt-Stufen&quot; oder sind bereits einer
              meiner gestalteten Tram-Bahnen begegnet?! Ich bin vielseitig
              interessiert, begeisterungsfähig, liebe, was ich mache und bin
              immer mit Herzblut dabei und gehe gern unkonventionelle Wege.
              Neben meinen unterschiedlichen beruflichen Aktivitäten war ich
              viele Jahre u.a. selbst begeisterter Motocross-Fahrer und durfte
              nach meiner aktiven Karriere Events wie &quot;Kings of
              Extrem&quot; und &quot;Night of Freestyle&quot; organisieren und
              erfolgreich umsetzen. Als Gastronom bin ich Teil einer
              Gemeinschaft und habe direkte und sehr persönliche Verbindungen zu
              meinen Kunden. Ich weiß was die Menschen in Halle bewegt und
              beschäftigt, befinde ich mich doch im täglichen Austausch mit
              ihnen. Ich konnte meine Ideen und Projekte immer mit Leidenschaft
              und Überzeugung vertreten und möchte meine Erfahrungen, mein
              Organisationstalent aber auch die Fähigkeit, Entscheidungen zu
              treffen gern dem Gemeinwohl zur Verfügung stellen; für ein
              besseres Halle.
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
        <div className="mb-0">
          <h2 className="text-lg font-bold">
            VOTO Antworten von Brigitte Burn-Müllhaupt
          </h2>

          <ThesesResultCarousel
            election={election}
            theses={theses}
            ratings={ratings[election.id]}
          />
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
    </div>
  );
}

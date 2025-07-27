"use client";

import CandidateOrParty from "../../candidate-or-party";

export default function CandidatePage() {
  return (
    <CandidateOrParty
      participant={{
        id: "1",
        name: "Brigitte Burn-Müllhaupt",
        image: "https://i.pravatar.cc/300",
        description:
          "Für eine musterhafte Stadt mit einer musterhaften Geschichte im Land und in der Welt. Lorem Ipsum dolor sit amet!",
        aboutMe:
          "Ich möchte mich vorstellen, mein Name ist Brigitte Burn-Müllhaupt. Ich bin am 03.05.1971 in Halle an der Saale geboren und aufgewachsen und lebe nunmehr seit 53 Jahren in eben dieser Stadt, zu der ich mich sehr verbunden fühle. Nach meiner Ausbildung als Maler, habe ich mich auf Werbung und Design spezialisiert. Als Inhaber der Werbeagentur 'Machart' bin ich bereits viele Jahre erfolgreich tätig. Vielleicht kennen Sie ja noch die 'Koi an den Hallmarkt-Stufen' oder sind bereits einer meiner gestalteten Tram-Bahnen begegnet?! Ich bin vielseitig interessiert, begeisterungsfähig, liebe, was ich mache und bin immer mit Herzblut dabei und gehe gern unkonventionelle Wege. Neben meinen unterschiedlichen beruflichen Aktivitäten war ich viele Jahre u.a. selbst begeisterter Motocross-Fahrer und durfte nach meiner aktiven Karriere Events wie 'Kings of Extrem' und 'Night of Freestyle' organisieren und erfolgreich umsetzen. Als Gastronom bin ich Teil einer Gemeinschaft und habe direkte und sehr persönliche Verbindungen zu meinen Kunden. Ich weiß was die Menschen in Halle bewegt und beschäftigt, befinde ich mich doch im täglichen Austausch mit ihnen. Ich konnte meine Ideen und Projekte immer mit Leidenschaft und Überzeugung vertreten und möchte meine Erfahrungen, mein Organisationstalent aber auch die Fähigkeit, Entscheidungen zu treffen gern dem Gemeinwohl zur Verfügung stellen; für ein besseres Halle.",
      }}
    />
  );
}

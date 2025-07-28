"use client";

import CandidateOrParty from "../../candidate-or-party";

export default function CandidatePage() {
  return (
    <CandidateOrParty
      participant={{
        id: "42",
        name: "Die Grünen Burgenland",
        image:
          "https://firebasestorage.googleapis.com/v0/b/votoprod.appspot.com/o/parties%2F3787957%2FpartyPicture.jpg?alt=media",
        description:
          "Eine glückliche Zukunft mit Wiesenböden statt Betonwüsten, lebendigen Ortskernen als Treffpunkt für Jung und Alt, Vertrauen und Zuversicht durch transparente Politik und Wirtschaft, ein gutes Leben für alle – was wir uns vorstellen können, das können wir auch erreichen. Wir GRÜNE bringen den progressiven Wind der Veränderung ins Burgenland – für ein lebenswertes Hier und Jetzt und eine Zukunft für unsere Kinder und Enkelkinder.",
      }}
    />
  );
}

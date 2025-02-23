import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTrigger,
} from "@/components/ui/drawer";

export default function ShareDrawer() {
  return (
    <Drawer>
      <DrawerTrigger className="fixed bottom-6 right-6 rounded-full bg-votopurple-500 text-white p-3">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="18" cy="5" r="3" />
          <circle cx="6" cy="12" r="3" />
          <circle cx="18" cy="19" r="3" />
          <line x1="8.59" x2="15.42" y1="13.51" y2="17.49" />
          <line x1="15.41" x2="8.59" y1="6.51" y2="10.49" />
        </svg>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader></DrawerHeader>
        <div className="space-y-4 text-center p-4">
          <div className="relative mx-auto w-fit">
            <div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-purple-600 to-purple-400 opacity-75 blur" />
            <div className="relative rounded-lg border-2 border-purple-200/20 bg-white p-4">
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/grafik-tAvwjugWL8YpxJLTeSOmDuOLgRZcG9.png"
                alt="QR Code"
                className="h-48 w-48"
              />
              <div className="mt-2 font-mono text-sm font-medium text-purple-700">
                #29DH27L
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-lg font-semibold">
              Dein persönlicher VOTO Code
            </h2>
            <p className="text-sm text-muted-foreground">
              Deine Bewertungen sind die nächsten 3 Monate über den obigen Code
              abrufbar. Du kannst jederzeit weitermachen, wo du aufgehört hast
              oder Dir Dein Ergebnis erneut ansehen. Dein persönlicher Code ist
              jederzeit über das QR Code Symbol oben rechts einsehbar.
            </p>
          </div>
        </div>
        <DrawerFooter>
          <Button>Submit</Button>
          <DrawerClose>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

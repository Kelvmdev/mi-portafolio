import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function TarjetaTrabajo({ titulo, descripcion, imagen }) {
  const [aplausos, setAplausos] = useState(0);

  return (
    <article className="rounded-xl border border-gray-200 overflow-hidden shadow-sm">
      <img src={imagen} alt={titulo} className="w-full h-48 object-cover" />
      <div className="p-4">
        <h3 className="text-lg font-bold">{titulo}</h3>
        <p className="mt-1 text-sm text-gray-600">{descripcion}</p>
        <div className="mt-3 flex gap-2">
          <Button onClick={() => setAplausos(aplausos + 1)}>
            👏 {aplausos}
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">Ver detalles</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{titulo}</DialogTitle>
                <DialogDescription>{descripcion}</DialogDescription>
              </DialogHeader>
              <img src={imagen} alt={titulo} className="w-full rounded-lg" />
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </article>
  );
}
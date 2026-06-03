import { useState } from "react";

export default function Contador({ nombre = "amigo" }) {
  const [cuenta, setCuenta] = useState(0);

  return (
    <div className="rounded-xl border border-gray-300 p-6 max-w-sm">
      <p className="text-lg">Hola, {nombre} 👋</p>
      <p className="my-3 text-2xl font-bold">Clics: {cuenta}</p>
      <button
        onClick={() => setCuenta(cuenta + 1)}
        className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
      >
        Súmale uno
      </button>
    </div>
  );
}
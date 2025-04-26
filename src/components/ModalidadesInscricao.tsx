import { Button } from "../components/ui/button";

function ModalidadesInscricao() {
  const modalidades = [
    { nome: "Atletismo", horario: "10:00 às 11:00", local: "Quadra do Centro" },
    { nome: "Futebol", horario: "11:00 às 12:00", local: "Campo Municipal" },
    { nome: "Vôlei", horario: "14:00 às 15:00", local: "Ginásio Poliesportivo" },
  ];

  return (
    <main className="w-full lg:w-3/4 mx-auto mt-8 p-4">
      <h2 className="text-2xl font-bold mb-8 text-left text-[#EB8317]">
        Modalidades Disponíveis
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {modalidades.map((mod, index) => (
          <div
            key={index}
            className="bg-[#d9d9d9] p-6 rounded border border-black shadow-md flex flex-col justify-between mb-4"
          >
            <div>
              <h3 className="text-xl font-semibold text-orange-500 mb-2 uppercase tracking-wide text-center">{mod.nome}</h3>
              <p className="text-gray-700 text-center mb-1">Horário: <span className="font-medium">{mod.horario}</span></p>
              <p className="text-gray-500 text-center mb-2">Local: <span className="font-medium">{mod.local}</span></p>
            </div>
            <Button className="mt-4">
              Inscrever-se
            </Button>
          </div>
        ))}
      </div>
    </main>
  );
}
export default ModalidadesInscricao;

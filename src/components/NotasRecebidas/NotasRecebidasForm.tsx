
import React, { useState } from "react";
import { FiltrosMdfe } from "./FiltrosMdfe";
import { ListaMdfeRecebidos } from "./ListaMdfeRecebidos";
import { DetalhesMdfe } from "./DetalhesMdfe";
import { useMdfeRecebidos } from "@/hooks/useMdfeRecebidos";

export const NotasRecebidasForm: React.FC = () => {
  const [filtros, setFiltros] = useState({
    dataInicio: "",
    dataFim: "",
    chaveAcesso: "",
    status: "",
    remetenteCnpj: "",
    remetenteNome: ""
  });
  
  const [mdfeSelcionado, setMdfeSelcionado] = useState<string | null>(null);
  
  const { data: mdfeList, isLoading } = useMdfeRecebidos(filtros);

  const handleBuscar = (novosFiltros: typeof filtros) => {
    setFiltros(novosFiltros);
    setMdfeSelcionado(null);
  };

  const handleSelecionarMdfe = (mdfeId: string) => {
    setMdfeSelcionado(mdfeId);
  };

  return (
    <div className="space-y-6">
      <FiltrosMdfe onBuscar={handleBuscar} isLoading={isLoading} />
      
      {mdfeList && mdfeList.length > 0 && (
        <ListaMdfeRecebidos 
          mdfeList={mdfeList}
          onSelecionarMdfe={handleSelecionarMdfe}
          mdfeSelcionado={mdfeSelcionado}
        />
      )}
      
      {mdfeSelcionado && (
        <DetalhesMdfe mdfeId={mdfeSelcionado} />
      )}
    </div>
  );
};


import React, { useState } from "react";
import { NfceTable } from "./NfceTable";
import { NfceForm } from "./NfceForm";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function NfcePage() {
  const [formOpen, setFormOpen] = useState(false);
  const [nfceEdit, setNfceEdit] = useState<any>(null);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl mb-4 font-bold">Notas NFC-e</h1>
      <Dialog open={formOpen} onOpenChange={v => setFormOpen(v)}>
        <DialogTrigger asChild>
          <Button onClick={() => { setNfceEdit(null); setFormOpen(true); }}>
            + Nova NFC-e
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogTitle>{nfceEdit ? "Editar NFC-e" : "Cadastrar NFC-e"}</DialogTitle>
          <NfceForm nfce={nfceEdit} onClose={() => setFormOpen(false)} />
        </DialogContent>
      </Dialog>
      <NfceTable onEdit={nfce => { setNfceEdit(nfce); setFormOpen(true); }} />
    </div>
  );
}

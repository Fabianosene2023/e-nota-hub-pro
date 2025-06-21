
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Loader2 } from "lucide-react";
import { useCreateNaturezaOperacao } from '@/hooks/useNaturezaOperacaoMutations';

interface CreateNaturezaModalProps {
  empresaId: string;
  triggerText?: string;
  triggerVariant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive";
}

export const CreateNaturezaModal: React.FC<CreateNaturezaModalProps> = ({ 
  empresaId, 
  triggerText = "Nova Natureza",
  triggerVariant = "default"
}) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    codigo: '',
    descricao: '',
    cfop_dentro_estado: '5102',
    cfop_fora_estado: '6102',
    cfop_exterior: '7102',
    finalidade: 'venda'
  });

  const createNatureza = useCreateNaturezaOperacao();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.codigo || !formData.descricao) {
      return;
    }

    try {
      await createNatureza.mutateAsync({
        empresa_id: empresaId,
        ...formData
      });
      
      setOpen(false);
      setFormData({
        codigo: '',
        descricao: '',
        cfop_dentro_estado: '5102',
        cfop_fora_estado: '6102',
        cfop_exterior: '7102',
        finalidade: 'venda'
      });
    } catch (error) {
      // Error handled by mutation
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={triggerVariant}>
          <Plus className="h-4 w-4 mr-2" />
          {triggerText}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Criar Natureza de Operação</DialogTitle>
          <DialogDescription>
            Configure uma nova natureza de operação para suas notas fiscais
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="codigo">Código *</Label>
              <Input
                id="codigo"
                value={formData.codigo}
                onChange={(e) => setFormData({...formData, codigo: e.target.value})}
                placeholder="Ex: 5102"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="finalidade">Finalidade</Label>
              <Select 
                value={formData.finalidade} 
                onValueChange={(value) => setFormData({...formData, finalidade: value})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="venda">Venda</SelectItem>
                  <SelectItem value="compra">Compra</SelectItem>
                  <SelectItem value="transferencia">Transferência</SelectItem>
                  <SelectItem value="devolucao">Devolução</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="descricao">Descrição *</Label>
            <Input
              id="descricao"
              value={formData.descricao}
              onChange={(e) => setFormData({...formData, descricao: e.target.value})}
              placeholder="Ex: Venda de mercadoria adquirida pelo estabelecimento"
              required
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cfop_dentro">CFOP Dentro UF</Label>
              <Input
                id="cfop_dentro"
                value={formData.cfop_dentro_estado}
                onChange={(e) => setFormData({...formData, cfop_dentro_estado: e.target.value})}
                placeholder="5102"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cfop_fora">CFOP Fora UF</Label>
              <Input
                id="cfop_fora"
                value={formData.cfop_fora_estado}
                onChange={(e) => setFormData({...formData, cfop_fora_estado: e.target.value})}
                placeholder="6102"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cfop_exterior">CFOP Exterior</Label>
              <Input
                id="cfop_exterior"
                value={formData.cfop_exterior}
                onChange={(e) => setFormData({...formData, cfop_exterior: e.target.value})}
                placeholder="7102"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={createNatureza.isPending}>
              {createNatureza.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Criando...
                </>
              ) : (
                'Criar Natureza'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

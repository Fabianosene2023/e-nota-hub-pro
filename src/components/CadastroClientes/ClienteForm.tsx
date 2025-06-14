
import { useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DialogFooter } from "@/components/ui/dialog";
import { maskCpfCnpj, maskCep } from "@/utils/maskUtils";
import { Loader2, Check, AlertCircle } from "lucide-react";
import { UseFormReturn } from "react-hook-form";

interface ClienteFormProps {
  form: UseFormReturn<any>;
  onSubmit: (data: any) => void;
  buttonState: "idle" | "loading" | "success" | "error";
  isEdit: boolean;
  onCancel: () => void;
}

export function ClienteForm({ form, onSubmit, buttonState, isEdit, onCancel }: ClienteFormProps) {
  useEffect(() => {
    form.register("nome_razao_social");
    form.register("cpf_cnpj");
    form.register("tipo_pessoa");
    form.register("inscricao_estadual");
    form.register("endereco");
    form.register("cidade");
    form.register("estado");
    form.register("cep");
    form.register("telefone");
    form.register("email");
  }, [form]);

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <div className="grid grid-cols-2 gap-4 py-4">
        <div className="space-y-2">
          <Label htmlFor="nome_razao_social">Razão Social/Nome *</Label>
          <Input id="nome_razao_social" {...form.register("nome_razao_social")} />
          <span className="text-xs text-red-600">
            {form.formState.errors.nome_razao_social?.message ?? ""}
          </span>
        </div>
        <div className="space-y-2">
          <Label htmlFor="tipo_pessoa">Tipo Pessoa *</Label>
          <Select
            value={form.watch('tipo_pessoa')}
            onValueChange={(value: 'fisica' | 'juridica') => form.setValue("tipo_pessoa", value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="fisica">Pessoa Física</SelectItem>
              <SelectItem value="juridica">Pessoa Jurídica</SelectItem>
            </SelectContent>
          </Select>
          <span className="text-xs text-red-600">
            {form.formState.errors.tipo_pessoa?.message ?? ""}
          </span>
        </div>
        <div className="space-y-2">
          <Label htmlFor="cpf_cnpj">{form.watch('tipo_pessoa') === 'fisica' ? 'CPF *' : 'CNPJ *'}</Label>
          <Input
            id="cpf_cnpj"
            {...form.register("cpf_cnpj")}
            value={maskCpfCnpj(form.watch('cpf_cnpj'))}
            onChange={e => form.setValue('cpf_cnpj', e.target.value.replace(/\D/g, ""))}
          />
          <span className="text-xs text-red-600">
            {form.formState.errors.cpf_cnpj?.message ?? ""}
          </span>
        </div>
        <div className="space-y-2">
          <Label htmlFor="inscricao_estadual">Inscrição Estadual</Label>
          <Input
            id="inscricao_estadual"
            {...form.register("inscricao_estadual")}
          />
        </div>
        <div className="col-span-2 space-y-2">
          <Label htmlFor="endereco">Endereço *</Label>
          <Input id="endereco" {...form.register("endereco")} />
          <span className="text-xs text-red-600">
            {form.formState.errors.endereco?.message ?? ""}
          </span>
        </div>
        <div className="space-y-2">
          <Label htmlFor="cidade">Cidade *</Label>
          <Input id="cidade" {...form.register("cidade")} />
          <span className="text-xs text-red-600">
            {form.formState.errors.cidade?.message ?? ""}
          </span>
        </div>
        <div className="space-y-2">
          <Label htmlFor="estado">Estado *</Label>
          <Input id="estado" {...form.register("estado")} maxLength={2} />
          <span className="text-xs text-red-600">
            {form.formState.errors.estado?.message ?? ""}
          </span>
        </div>
        <div className="space-y-2">
          <Label htmlFor="cep">CEP *</Label>
          <Input
            id="cep"
            {...form.register("cep")}
            value={maskCep(form.watch('cep'))}
            onChange={e => form.setValue('cep', e.target.value.replace(/\D/g, ""))}
          />
          <span className="text-xs text-red-600">
            {form.formState.errors.cep?.message ?? ""}
          </span>
        </div>
        <div className="space-y-2">
          <Label htmlFor="telefone">Telefone</Label>
          <Input id="telefone" {...form.register("telefone")} />
        </div>
        <div className="col-span-2 space-y-2">
          <Label htmlFor="email">E-mail</Label>
          <Input id="email" type="email" {...form.register("email")} />
          <span className="text-xs text-red-600">
            {form.formState.errors.email?.message ?? ""}
          </span>
        </div>
      </div>
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>Cancelar</Button>
        <Button
          type="submit"
          disabled={buttonState === "loading"}
          className={
            buttonState === "loading"
              ? "cursor-wait"
              : buttonState === "success"
              ? "bg-green-600"
              : buttonState === "error"
              ? "bg-destructive"
              : ""
          }
        >
          {buttonState === "loading" && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          {buttonState === "success" && <Check className="w-4 h-4 mr-2" />}
          {buttonState === "error" && <AlertCircle className="w-4 h-4 mr-2" />}
          {isEdit ? "Atualizar" : "Criar"}
        </Button>
      </DialogFooter>
    </form>
  );
}

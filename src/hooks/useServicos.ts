export const useServicosManager = () => {
  const queryClient = useQueryClient();

  const createServico = useMutation({
    mutationFn: async (servico: Omit<Servico, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('servicos')
        .insert(servico)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['servicos', variables.empresa_id] });
      toast({
        title: "Sucesso",
        description: "Serviço cadastrado com sucesso",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Erro ao cadastrar serviço",
        variant: "destructive",
      });
    },
  });

  const updateServico = useMutation({
    mutationFn: async (servico: Partial<Servico> & { id: string }) => {
      const { data, error } = await supabase
        .from('servicos')
        .update(servico)
        .eq('id', servico.id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['servicos', data.empresa_id] });
      toast({
        title: "Sucesso",
        description: "Serviço atualizado com sucesso",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Erro ao atualizar serviço",
        variant: "destructive",
      });
    },
  });

  const deleteServico = useMutation({
    mutationFn: async ({ id, empresaId }: { id: string; empresaId: string }) => {
      const { error } = await supabase
        .from('servicos')
        .update({ ativo: false })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['servicos', variables.empresaId] });
      toast({
        title: "Sucesso",
        description: "Serviço removido com sucesso",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Erro ao remover serviço",
        variant: "destructive",
      });
    },
  });

  return {
    createServico,
    updateServico,
    deleteServico,
  };
};

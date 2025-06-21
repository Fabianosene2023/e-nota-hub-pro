
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from '@/hooks/use-toast';
import { Loader2, TestTube, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface TestResult {
  step: string;
  status: 'pending' | 'success' | 'error' | 'warning';
  message: string;
  details?: any;
}

export const TesteSefazEmissao = () => {
  const { profile } = useAuth();
  const [testing, setTesting] = useState(false);
  const [results, setResults] = useState<TestResult[]>([]);

  const addResult = (result: TestResult) => {
    setResults(prev => [...prev, result]);
  };

  const runSefazTest = async () => {
    if (!profile?.empresa_id) {
      toast({
        title: "Erro",
        description: "Empresa não encontrada",
        variant: "destructive",
      });
      return;
    }

    setTesting(true);
    setResults([]);

    try {
      // Teste 1: Verificar configurações SEFAZ
      addResult({
        step: "Configurações SEFAZ",
        status: 'pending',
        message: "Verificando configurações SEFAZ..."
      });

      const { data: configs, error: configError } = await supabase
        .from('configuracoes_sefaz')
        .select('*')
        .eq('empresa_id', profile.empresa_id)
        .single();

      if (configError || !configs) {
        addResult({
          step: "Configurações SEFAZ",
          status: 'error',
          message: "Configurações SEFAZ não encontradas"
        });
        return;
      }

      addResult({
        step: "Configurações SEFAZ",
        status: 'success',
        message: `Configurações encontradas - Ambiente: ${configs.ambiente}`,
        details: configs
      });

      // Teste 2: Verificar certificado digital
      addResult({
        step: "Certificado Digital",
        status: 'pending',
        message: "Verificando certificado digital..."
      });

      const { data: certificados } = await supabase
        .from('certificados_digitais')
        .select('*')
        .eq('empresa_id', profile.empresa_id)
        .eq('ativo', true);

      if (!certificados || certificados.length === 0) {
        addResult({
          step: "Certificado Digital",
          status: 'warning',
          message: "Nenhum certificado digital ativo encontrado"
        });
      } else {
        const cert = certificados[0];
        const validadeFim = new Date(cert.validade_fim);
        const agora = new Date();
        
        if (validadeFim < agora) {
          addResult({
            step: "Certificado Digital",
            status: 'error',
            message: "Certificado digital expirado"
          });
        } else {
          addResult({
            step: "Certificado Digital",
            status: 'success',
            message: `Certificado válido até ${validadeFim.toLocaleDateString()}`
          });
        }
      }

      // Teste 3: Testar conexão com SEFAZ
      addResult({
        step: "Conexão SEFAZ",
        status: 'pending',
        message: "Testando conexão com SEFAZ..."
      });

      const { data: sefazResult, error: sefazError } = await supabase.functions.invoke('sefaz-integration', {
        body: {
          operation: 'testar_conexao',
          data: { empresa_id: profile.empresa_id }
        }
      });

      if (sefazError) {
        addResult({
          step: "Conexão SEFAZ",
          status: 'error',
          message: `Erro na conexão: ${sefazError.message}`
        });
      } else if (sefazResult.success) {
        addResult({
          step: "Conexão SEFAZ",
          status: 'success',
          message: sefazResult.mensagem || "Conexão com SEFAZ bem-sucedida"
        });
      } else {
        addResult({
          step: "Conexão SEFAZ",
          status: 'error',
          message: sefazResult.error || "Falha na conexão com SEFAZ"
        });
      }

      // Teste 4: Simular emissão de NFe
      addResult({
        step: "Emissão NFe (Simulação)",
        status: 'pending',
        message: "Simulando emissão de NFe..."
      });

      // Buscar cliente para teste
      const { data: clientes } = await supabase
        .from('clientes')
        .select('*')
        .eq('empresa_id', profile.empresa_id)
        .limit(1);

      if (!clientes || clientes.length === 0) {
        addResult({
          step: "Emissão NFe (Simulação)",
          status: 'warning',
          message: "Nenhum cliente encontrado para teste"
        });
      } else {
        const dadosSimulacao = {
          empresa_id: profile.empresa_id,
          cliente_id: clientes[0].id,
          numero: configs.proximo_numero_nfe,
          serie: configs.serie_nfe,
          valor_total: 100.00,
          natureza_operacao: 'Teste de conexão SEFAZ',
          itens: [
            {
              produto_id: 'teste-produto',
              quantidade: 1,
              valor_unitario: 100.00,
              valor_total: 100.00,
              cfop: '5102'
            }
          ]
        };

        const { data: nfeResult, error: nfeError } = await supabase.functions.invoke('sefaz-integration', {
          body: {
            operation: 'emitir_nfe',
            data: dadosSimulacao
          }
        });

        if (nfeError) {
          addResult({
            step: "Emissão NFe (Simulação)",
            status: 'error',
            message: `Erro na emissão: ${nfeError.message}`
          });
        } else if (nfeResult.success) {
          addResult({
            step: "Emissão NFe (Simulação)",
            status: 'success',
            message: `NFe simulada com sucesso - Chave: ${nfeResult.chave_acesso?.substring(0, 10)}...`
          });
        } else {
          addResult({
            step: "Emissão NFe (Simulação)",
            status: 'error',
            message: nfeResult.mensagem_retorno || "Falha na emissão da NFe"
          });
        }
      }

    } catch (error) {
      console.error('Erro no teste SEFAZ:', error);
      addResult({
        step: "Erro Geral",
        status: 'error',
        message: error instanceof Error ? error.message : "Erro desconhecido"
      });
    } finally {
      setTesting(false);
    }
  };

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'pending':
        return <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />;
    }
  };

  const getStatusBadge = (status: TestResult['status']) => {
    switch (status) {
      case 'success':
        return <Badge className="bg-green-500">Sucesso</Badge>;
      case 'error':
        return <Badge variant="destructive">Erro</Badge>;
      case 'warning':
        return <Badge variant="secondary">Aviso</Badge>;
      case 'pending':
        return <Badge variant="outline">Processando</Badge>;
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TestTube className="h-5 w-5" />
          Teste de Conexão SEFAZ e Emissão
        </CardTitle>
        <CardDescription>
          Execute um teste completo da integração SEFAZ para verificar se é possível emitir notas fiscais
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-muted-foreground">
              Este teste verificará configurações, certificados, conexão SEFAZ e simulará uma emissão de NFe
            </p>
          </div>
          <Button 
            onClick={runSefazTest} 
            disabled={testing || !profile?.empresa_id}
          >
            {testing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Testando...
              </>
            ) : (
              <>
                <TestTube className="mr-2 h-4 w-4" />
                Executar Teste
              </>
            )}
          </Button>
        </div>

        {results.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-semibold">Resultados do Teste:</h4>
            {results.map((result, index) => (
              <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                {getStatusIcon(result.status)}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">{result.step}</span>
                    {getStatusBadge(result.status)}
                  </div>
                  <p className="text-sm text-muted-foreground">{result.message}</p>
                  {result.details && (
                    <details className="mt-2">
                      <summary className="text-xs cursor-pointer text-blue-600">Ver detalhes</summary>
                      <pre className="text-xs bg-muted p-2 rounded mt-1 overflow-auto">
                        {JSON.stringify(result.details, null, 2)}
                      </pre>
                    </details>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {!testing && results.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <TestTube className="h-16 w-16 mx-auto mb-4 opacity-50" />
            <p>Clique em "Executar Teste" para verificar a integração SEFAZ</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

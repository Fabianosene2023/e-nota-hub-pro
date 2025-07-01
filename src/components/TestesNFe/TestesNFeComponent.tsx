
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, XCircle, Play, FileText } from "lucide-react";
import { NFETestService, TestResult } from '@/utils/nfe/tests/nfeTestService';

export const TestesNFeComponent = () => {
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [xmlExemplo, setXmlExemplo] = useState('');

  const executarTestes = async () => {
    setIsRunning(true);
    try {
      const resultados = await NFETestService.executarTestesCompletos();
      setTestResults(resultados);
    } catch (error) {
      console.error('Erro ao executar testes:', error);
    } finally {
      setIsRunning(false);
    }
  };

  const gerarXmlExemplo = () => {
    const xml = NFETestService.gerarExemploXML();
    setXmlExemplo(xml);
  };

  const sucessos = testResults.filter(r => r.success).length;
  const falhas = testResults.filter(r => !r.success).length;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Play className="h-5 w-5" />
            Testes de Conformidade NFe
          </CardTitle>
          <CardDescription>
            Execute testes automáticos para validar a geração e conformidade das NFe
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <Button 
              onClick={executarTestes} 
              disabled={isRunning}
              className="flex items-center gap-2"
            >
              <Play className="h-4 w-4" />
              {isRunning ? 'Executando...' : 'Executar Testes'}
            </Button>
            
            <Button 
              onClick={gerarXmlExemplo}
              variant="outline"
              className="flex items-center gap-2"
            >
              <FileText className="h-4 w-4" />
              Gerar XML Exemplo
            </Button>
          </div>

          {testResults.length > 0 && (
            <div className="mt-6">
              <div className="flex gap-4 mb-4">
                <Badge variant="default" className="bg-green-100 text-green-800">
                  ✓ Sucessos: {sucessos}
                </Badge>
                <Badge variant="destructive">
                  ✗ Falhas: {falhas}
                </Badge>
              </div>

              <div className="space-y-3">
                {testResults.map((result, index) => (
                  <Card key={index} className={`border-l-4 ${
                    result.success ? 'border-l-green-500' : 'border-l-red-500'
                  }`}>
                    <CardContent className="pt-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {result.success ? (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          ) : (
                            <XCircle className="h-5 w-5 text-red-500" />
                          )}
                          <span className="font-medium">{result.testName}</span>
                        </div>
                        <Badge variant={result.success ? "default" : "destructive"}>
                          {result.success ? 'Sucesso' : 'Falha'}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">
                        {result.message}
                      </p>
                      {result.details && (
                        <details className="mt-2">
                          <summary className="text-sm font-medium cursor-pointer">
                            Ver detalhes
                          </summary>
                          <pre className="text-xs bg-gray-50 p-2 rounded mt-2 overflow-auto">
                            {JSON.stringify(result.details, null, 2)}
                          </pre>
                        </details>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {xmlExemplo && (
        <Card>
          <CardHeader>
            <CardTitle>XML NFe Exemplo</CardTitle>
            <CardDescription>
              XML gerado conforme padrão 4.00 da SEFAZ
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              value={xmlExemplo}
              readOnly
              rows={20}
              className="font-mono text-xs"
            />
            <div className="mt-2 flex gap-2">
              <Button
                size="sm"
                onClick={() => navigator.clipboard.writeText(xmlExemplo)}
              >
                Copiar XML
              </Button>
              <Badge variant="outline">
                Tamanho: {xmlExemplo.length} caracteres
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

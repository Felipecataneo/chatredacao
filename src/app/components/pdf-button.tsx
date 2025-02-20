// pdfButton.tsx
import React from 'react';
import { Button } from '@/components/ui/button';
import { FileText } from 'lucide-react';
import { useToast } from "@/hooks/use-toast"

import { ToastAction } from "@/components/ui/toast";

export function PdfButton({ onPdfContent }: { onPdfContent: (content: string) => void }) {
  const { toast } = useToast();
  
  const handlePdfUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    if (file.type !== 'application/pdf') {
      toast({
        variant: "destructive",
        title: "Tipo de arquivo inválido",
        description: "Por favor, envie apenas arquivos PDF.",
        action: (
          <ToastAction altText="Tentar novamente">Tentar novamente</ToastAction>
        ),
      });
      return;
    }

    try {
      const formData = new FormData();
      formData.append('pdf', file);

      const response = await fetch('/api/extract-pdf', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Falha ao extrair texto do PDF');

      const { text } = await response.json();
      onPdfContent(text);
      
      toast({
        title: "PDF carregado com sucesso",
        description: "O texto foi extraído e será analisado.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao processar PDF",
        description: "Não foi possível extrair o texto do arquivo.",
        action: (
          <ToastAction altText="Tentar novamente">Tentar novamente</ToastAction>
        ),
      });
    }
  };

  return (
    <div className="relative">
      <input
        type="file"
        accept=".pdf"
        onChange={handlePdfUpload}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        aria-label="Upload PDF"
      />
      <Button variant="outline" className="gap-2">
        <FileText className="w-4 h-4" />
        PDF
      </Button>
    </div>
  );
}
// chat-component.tsx
import type { CompletionMessage } from "@/hooks/use-completion";
import { MarkdownBlock } from "@/components/ui/markdown-block";
import { AlertCircle, CornerDownLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";
import { MicButton } from "./mic-button";
import { PdfButton } from "./pdf-button";
import { Toaster } from "@/components/ui/toaster";

export function ChatComponent({
  messages,
  error,
  handleNewMessage,
  defaultPrompt,
}: {
  messages: CompletionMessage[];
  error?: Error | null;
  handleNewMessage: (message: string) => void;
  defaultPrompt: string;
}) {
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [input, setInput] = useState(defaultPrompt);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleNewMessage(input);
    setInput("");
  };

  const handlePdfContent = (content: string) => {
    const prompt = `Analise o seguinte texto com base nos critérios de avaliação do ENEM:

${content}

Por favor, avalie cada competência:
1. Domínio da escrita formal
2. Compreensão da proposta e desenvolvimento do tema
3. Seleção e organização de argumentos
4. Mecanismos linguísticos e argumentativos
5. Proposta de intervenção

Forneça uma nota de 0 a 200 para cada competência e justifique.`;
    
    handleNewMessage(prompt);
  };

  useEffect(() => {
    const chatContainer = chatContainerRef.current;
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    const input = inputRef.current;
    if (input) {
      input.select();
    }
  }, []);

  return (
    <>
      <div className="flex flex-col gap-6 h-svh items-center p-10 pb-6 overflow-y-auto w-full">
        <div className="w-full flex-1 overflow-y-auto" ref={chatContainerRef}>
          <div className="flex flex-col gap-4">
            {messages.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                className="max-w-[500px] last:mb-10"
              >
                <div className="opacity-50">{message.role}</div>
                <MarkdownBlock>
                  {message.tool_calls ? "(using tool)" : message.content}
                </MarkdownBlock>
              </div>
            ))}
          </div>
        </div>
        {error && (
          <div className="flex justify-center items-center gap-3 bg-destructive text-destructive-foreground py-2 px-4 rounded-md">
            <AlertCircle className="w-4 h-4" />
            {error.message}
          </div>
        )}
        <form className="flex justify-center gap-4 w-full" onSubmit={handleSubmit}>
          <Input
            placeholder="Digite sua mensagem"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 w-auto"
            autoFocus
            ref={inputRef}
          />
          <Button type="submit">
            <CornerDownLeft className="w-4 h-4" /> Enviar
          </Button>
          <MicButton onTranscription={handleNewMessage} />
          <PdfButton onPdfContent={handlePdfContent} />
        </form>
      </div>
      <Toaster />
    </>
  );
}
// page.tsx
"use client";

import {
  type ToolCall,
  useCompletionWithTools,
} from "@/hooks/use-completion-tools";
import { ChatComponent } from "./components/chat-component";

const systemPrompt = `Você é um assistente que também possui conhecimento das regras de redação do ENEM, interaja de forma amigável e animada.Essa redação pode ser copiada no chat mas pode ser anexado pdf.

Você deve avaliar redações considerando as seguintes competências:
1. Domínio da modalidade escrita formal da língua portuguesa
2. Compreensão da proposta e desenvolvimento do tema
3. Seleção e organização de argumentos
4. Mecanismos linguísticos para argumentação
5. Proposta de intervenção

Cada competência é avaliada de 0 a 200 pontos, #importante# podendo ser somente em steps de 40 pontos:
0 - desclassificado
40 - precário
80 - insuficiente
120 - mediano
160 - bom
200 - ótimo
No final passe a nota total
`;

const prompt = "";

const toolHandler = {
  async handler(tool: ToolCall) {
    return {
      content: JSON.stringify({ weather: "sunny", temperature: 90 }),
    };
  },
};

export default function Home() {
  const { messages, error, sendMessage } = useCompletionWithTools({
    messages: [{ role: "system", content: systemPrompt }],
    //toolHandler,
  });

  return (
    <main className="flex flex-col min-h-screen">
      {/* Wrapper para garantir que o conteúdo ocupe o espaço correto */}
      <div className="flex flex-1 items-center justify-center p-4">
        <ChatComponent
          defaultPrompt={prompt}
          messages={messages.filter(msg => msg.role !== "system")}
          error={error}
          handleNewMessage={sendMessage}
        />
      </div>
    </main>
  );
}
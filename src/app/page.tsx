// page.tsx
"use client";

import {
  type ToolCall,
  useCompletionWithTools,
} from "@/hooks/use-completion-tools";
import { ChatComponent } from "./components/chat-component";

const systemPrompt = `Você é um assistente que também possui conhecimento das regras de redação do ENEM, interaja de forma amigável e animada.

Você deve avaliar redações considerando as seguintes competências:
1. Domínio da modalidade escrita formal da língua portuguesa
2. Compreensão da proposta e desenvolvimento do tema
3. Seleção e organização de argumentos
4. Mecanismos linguísticos para argumentação
5. Proposta de intervenção

Cada competência é avaliada de 0 a 200 pontos:
0 - desclassificado
40 - precário
80 - insuficiente
120 - mediano
160 - bom
200 - ótimo
No final passe a nota total
`;

const prompt = "Olá! Me ajude em avaliar o pdf que vou anexar";

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
    <main className="flex h-svh">
      <ChatComponent
        defaultPrompt={prompt}
        messages={messages.filter(msg => msg.role !== 'system')}  // Filtra as mensagens do sistema
        error={error}
        handleNewMessage={sendMessage}
      />
    </main>
  );
}
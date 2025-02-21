import { NextResponse } from 'next/server';

export const config = {
  runtime: 'edge'
};

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const pdfFile = formData.get('pdf') as File;
    
    if (!pdfFile) {
      return NextResponse.json(
        { error: 'Nenhum arquivo PDF fornecido' },
        { status: 400 }
      );
    }

    // Criar um novo FormData para enviar ao n8n
    const formDataToSend = new FormData();
    formDataToSend.append('pdf', pdfFile);

    // Enviar para o webhook do n8n
    const response = await fetch(process.env.N8N_WEBHOOK_URL!, {
      method: 'POST',
      body: formDataToSend,
    });

    if (!response.ok) {
      throw new Error(`Erro n8n: ${response.statusText}`);
    }

    const data = await response.json();

    // Verificar se a resposta é um array e tem pelo menos um item
    if (!Array.isArray(data) || data.length === 0 || !data[0].text) {
      throw new Error('Resposta do n8n não contém dados válidos');
    }

    // O campo `text` é uma string JSON, então precisamos fazer `JSON.parse`
    const parsedText = JSON.parse(data[0].text);

    return NextResponse.json({ 
      text: parsedText.text, // Agora extraindo corretamente o texto
      metadata: data[0].metadata || null // Caso tenha metadados
    });

  } catch (error) {
    console.error('Erro no processamento:', error);
    return NextResponse.json(
      { error: 'Falha ao processar PDF' },
      { status: 500 }
    );
  }
}

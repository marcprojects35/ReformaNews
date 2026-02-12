import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Mensagem inválida" },
        { status: 400 }
      );
    }

    // Chamar o endpoint do backend Python
    const response = await fetch("http://localhost:8001/api/chatbot/ask", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message }),
    });

    if (!response.ok) {
      throw new Error("Erro ao consultar o chatbot");
    }

    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error("[ChatBot API] Erro:", error);

    // Fallback em caso de erro de conexão com o backend
    return NextResponse.json({
      response: "Desculpe, o serviço está temporariamente indisponível. Por favor, tente novamente em alguns instantes.",
      found: false,
      redirect_whatsapp: false,
      whatsapp_number: null
    });
  }
}

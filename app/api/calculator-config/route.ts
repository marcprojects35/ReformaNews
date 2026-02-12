import { NextResponse } from "next/server"

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8001"

export async function GET() {
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 5000)

    const [configRes, paramsRes] = await Promise.all([
      fetch(`${BACKEND_URL}/api/calculator-config`, {
        cache: "no-store",
        signal: controller.signal,
      }),
      fetch(`${BACKEND_URL}/api/calculator-parameters`, {
        cache: "no-store",
        signal: controller.signal,
      }),
    ])

    clearTimeout(timeoutId)

    if (configRes.ok && paramsRes.ok) {
      const calculators = await configRes.json()
      const parameters = await paramsRes.json()
      return NextResponse.json({ calculators, parameters })
    }

    return NextResponse.json(
      { error: "Backend retornou erro ao buscar configurações" },
      { status: 502 }
    )
  } catch (error) {
    console.error("[API] Erro ao conectar com backend:", error)
    return NextResponse.json(
      { error: "Backend não disponível. Inicie o servidor em http://localhost:8001" },
      { status: 503 }
    )
  }
}

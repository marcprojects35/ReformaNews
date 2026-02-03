import { NextRequest, NextResponse } from 'next/server'
import pg from 'pg'

const { Pool } = pg

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
})

function safeParseFloat(value: unknown, defaultValue: number = 0): number {
  if (value === null || value === undefined) return defaultValue
  const parsed = parseFloat(String(value))
  return isNaN(parsed) ? defaultValue : parsed
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const q = searchParams.get('q') || ''
  const categoria = searchParams.get('categoria') || ''
  const limitParam = searchParams.get('limit')
  const limit = Math.min(Math.max(parseInt(limitParam || '20') || 20, 1), 50)

  if (!q && categoria === 'todas') {
    return NextResponse.json({ produtos: [], total: 0 })
  }
  
  if (!q && !categoria) {
    return NextResponse.json({ produtos: [], total: 0 })
  }

  try {
    let query = `
      SELECT 
        id, original_id, nome, gtin, ncm, cest, origem, 
        icms, ipi, pis, cofins, ibs_estadual, ibs_municipal, cbs, 
        categoria, unit_federation
      FROM produtos
      WHERE 1=1
    `
    const params: (string | number)[] = []
    let paramIndex = 1

    if (q) {
      query += ` AND (
        nome ILIKE $${paramIndex} 
        OR ncm ILIKE $${paramIndex + 1}
        OR gtin ILIKE $${paramIndex + 2}
      )`
      params.push(`%${q}%`, `%${q}%`, `%${q}%`)
      paramIndex += 3
    }

    if (categoria && categoria !== 'todas') {
      query += ` AND categoria = $${paramIndex}`
      params.push(categoria)
      paramIndex += 1
    }

    query += ` ORDER BY nome LIMIT $${paramIndex}`
    params.push(limit)

    const result = await pool.query(query, params)

    const produtos = result.rows.map((row) => ({
      id: row.id as number,
      nome: row.nome as string,
      gtin: row.gtin as string,
      ncm: row.ncm as string,
      cest: (row.cest as string) || '',
      origem: row.origem as string,
      icms: safeParseFloat(row.icms, 0),
      ipi: safeParseFloat(row.ipi, 0),
      pis: safeParseFloat(row.pis, 1.65),
      cofins: safeParseFloat(row.cofins, 7.6),
      ibsEstadual: safeParseFloat(row.ibs_estadual, 0),
      ibsMunicipal: safeParseFloat(row.ibs_municipal, 0),
      cbs: safeParseFloat(row.cbs, 0),
      categoria: row.categoria as string,
      unitFederation: row.unit_federation as string
    }))

    return NextResponse.json({ 
      produtos, 
      total: produtos.length 
    })
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar produtos', produtos: [], total: 0 },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { q, categoria, limit = 20 } = body

    const searchParams = new URLSearchParams()
    if (q) searchParams.set('q', q)
    if (categoria) searchParams.set('categoria', categoria)
    searchParams.set('limit', String(limit))

    const url = new URL(request.url)
    url.search = searchParams.toString()

    return GET(new NextRequest(url))
  } catch {
    return NextResponse.json(
      { error: 'Invalid request body', produtos: [], total: 0 },
      { status: 400 }
    )
  }
}

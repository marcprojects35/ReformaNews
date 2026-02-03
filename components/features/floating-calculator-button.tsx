"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Calculator } from 'lucide-react'
import Link from "next/link"

export function FloatingCalculatorButton() {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <Link href="/ferramentas" className="fixed bottom-32 left-8 z-40">
      <Button
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="h-16 w-16 rounded-full bg-gradient-to-r from-[#2D3748] to-[#1a1a1a] hover:from-[#FFD700] hover:to-[#FFC107] shadow-2xl shadow-gray-900/40 hover:shadow-yellow-500/50 transition-all duration-300 hover:scale-110 group"
        size="icon"
      >
        <Calculator className="h-7 w-7 text-white group-hover:text-gray-900 transition-colors" />
        
        {isHovered && (
          <span className="absolute left-20 whitespace-nowrap bg-gray-900 text-white text-sm px-4 py-2 rounded-lg shadow-xl animate-fade-in">
            Calculadora IBS/CBS
          </span>
        )}
      </Button>
    </Link>
  )
}

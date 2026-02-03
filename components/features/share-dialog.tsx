"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Copy, Check, MessageCircle, Facebook, Linkedin, Mail, Link2 } from "lucide-react"
import { toast } from "sonner"

interface ShareDialogProps {
  isOpen: boolean
  onClose: () => void
  title: string
  url?: string
}

export function ShareDialog({ isOpen, onClose, title, url }: ShareDialogProps) {
  const [copied, setCopied] = useState(false)
  const [currentUrl, setCurrentUrl] = useState("")
  
  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentUrl(url || window.location.href)
    }
  }, [url, isOpen])
  
  const shareUrl = currentUrl
  const encodedUrl = encodeURIComponent(shareUrl)
  const encodedTitle = encodeURIComponent(title)
  const encodedText = encodeURIComponent(`${title}\n\nConfira esta notícia no Reforma Tributária News:`)

  const shareLinks = [
    {
      name: "WhatsApp",
      icon: MessageCircle,
      color: "bg-green-500 hover:bg-green-600",
      url: `https://wa.me/?text=${encodedText}%20${encodedUrl}`,
    },
    {
      name: "Facebook",
      icon: Facebook,
      color: "bg-blue-600 hover:bg-blue-700",
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedTitle}`,
    },
    {
      name: "LinkedIn",
      icon: Linkedin,
      color: "bg-blue-700 hover:bg-blue-800",
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    },
    {
      name: "X (Twitter)",
      icon: () => (
        <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
      color: "bg-black hover:bg-gray-800",
      url: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    },
    {
      name: "E-mail",
      icon: Mail,
      color: "bg-gray-600 hover:bg-gray-700",
      url: `mailto:?subject=${encodedTitle}&body=${encodedText}%20${encodedUrl}`,
    },
  ]

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      toast.success("Link copiado para a área de transferência!")
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      toast.error("Não foi possível copiar o link")
    }
  }

  const handleShare = (shareLink: string) => {
    window.open(shareLink, "_blank", "noopener,noreferrer,width=600,height=400")
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-[#0046B3]">
            Compartilhar notícia
          </DialogTitle>
          <DialogDescription className="sr-only">
            Compartilhe esta notícia nas redes sociais
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <p className="text-sm text-gray-600 line-clamp-2">{title}</p>
          
          <div className="grid grid-cols-5 gap-3">
            {shareLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => handleShare(link.url)}
                className={`flex flex-col items-center justify-center p-3 rounded-lg ${link.color} text-white transition-all duration-200 hover:scale-105 shadow-md`}
                title={`Compartilhar no ${link.name}`}
              >
                <link.icon className="h-5 w-5" />
                <span className="text-[10px] mt-1 font-medium">{link.name}</span>
              </button>
            ))}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Ou copie o link
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Link2 className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  readOnly
                  value={shareUrl}
                  className="pl-10 pr-4 bg-gray-50 text-sm"
                />
              </div>
              <Button
                onClick={copyToClipboard}
                variant="outline"
                className={`px-4 transition-all duration-200 ${
                  copied 
                    ? "bg-green-50 border-green-500 text-green-600" 
                    : "hover:bg-[#FF7A00] hover:text-white hover:border-[#FF7A00]"
                }`}
              >
                {copied ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          <div className="bg-orange-50 rounded-lg p-3 border border-orange-200">
            <p className="text-xs text-orange-700">
              <strong>Dica:</strong> Para compartilhar no Instagram, copie o link acima e cole na sua história ou bio.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

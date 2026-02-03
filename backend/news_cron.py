import asyncio
import aiohttp
import os
from datetime import datetime

async def fetch_news_cron():
    """Cron job que busca notícias a cada hora"""
    print(f"[{datetime.now()}] 🤖 Iniciando busca automática de notícias...")
    
    # URL do backend
    backend_url = "http://localhost:8000/api/fetch-news"
    
    # Token de admin (em produção, use variável de ambiente)
    # Por enquanto, vamos fazer login para pegar o token
    login_url = "http://localhost:8000/api/auth/login"
    
    try:
        async with aiohttp.ClientSession() as session:
            # Login
            async with session.post(login_url, json={
                "username": "admin",
                "password": "admin"
            }) as response:
                if response.status != 200:
                    print("❌ Erro ao fazer login")
                    return
                
                data = await response.json()
                token = data["access_token"]
            
            # Buscar notícias
            headers = {"Authorization": f"Bearer {token}"}
            async with session.post(backend_url, headers=headers) as response:
                if response.status == 200:
                    data = await response.json()
                    print(f"✅ {data['message']}")
                    print(f"📊 Processadas: {data['processed']} | Buscadas: {data['total_fetched']}")
                else:
                    print(f"❌ Erro: {response.status}")
    
    except Exception as e:
        print(f"❌ Erro ao buscar notícias: {e}")

if __name__ == "__main__":
    asyncio.run(fetch_news_cron())

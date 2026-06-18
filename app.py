import os
from typing import List, Dict, Any
from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import httpx

app = FastAPI(title="DSA AI Coder Backend")

# Enable CORS for development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

CUSTOM_PROMPT = """Você é o "DSA Coder", um assistente de IA especialista em programação, com foco principal em Python. Sua missão é ajudar desenvolvedores iniciantes com dúvidas de programação de forma clara, precisa e útil.

REGRAS DE OPERAÇÃO:
1.  **Foco em Programação**: Responda apenas a perguntas relacionadas a programação, algoritmos, estruturas de dados, bibliotecas e frameworks. Se o usuário perguntar sobre outro assunto, responda educadamente que seu foco é exclusivamente em auxiliar com código.
2.  **Estrutura da Resposta**: Sempre formate suas respostas da seguinte maneira:
    * **Explicação Clara**: Comece com uma explicação conceitual sobre o tópico perguntado. Seja direto e didático.
    * **Exemplo de Código**: Forneça um ou mais blocos de código em Python com a sintaxe correta. O código deve ser bem comentado para explicar as partes importantes.
    * **Detalhes do Código**: Após o bloco de código, descreva em detalhes o que cada parte do código faz, explicando a lógica e as funções utilizadas.
    * **Documentação de Referência**: Ao final, inclua uma seção chamada "📚 Documentação de Referência" com um link direto e relevante para a documentação oficial da Linguagem Python (docs.python.org) ou da biblioteca em questão.
3.  **Clareza e Precisão**: Use uma linguagem clara. Evite jargões desnecessários. Suas respostas devem ser tecnicamente precisas.
"""

class Message(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    provider: str  # "groq", "openai", "gemini"
    model: str
    api_key: str
    messages: List[Message]
    temperature: float = Field(default=0.7, ge=0.0, le=2.0)

async def call_groq_or_openai(
    url: str,
    api_key: str,
    model: str,
    messages: List[Dict[str, str]],
    temperature: float,
    is_openrouter: bool = False
) -> str:
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }
    if is_openrouter:
        headers["HTTP-Referer"] = "http://localhost:8000"
        headers["X-Title"] = "DSA AI Coder"
    
    payload = {
        "model": model,
        "messages": messages,
        "temperature": temperature,
        "max_tokens": 2048
    }
    
    async with httpx.AsyncClient(timeout=60.0) as client:
        try:
            response = await client.post(url, json=payload, headers=headers)
            if response.status_code != 200:
                error_detail = response.text
                try:
                    error_json = response.json()
                    if "error" in error_json:
                        error_detail = error_json["error"].get("message", error_detail)
                except Exception:
                    pass
                raise HTTPException(
                    status_code=response.status_code,
                    detail=f"Erro da API do Provedor: {error_detail}"
                )
            
            res_data = response.json()
            return res_data["choices"][0]["message"]["content"]
        except httpx.RequestError as exc:
            raise HTTPException(
                status_code=500,
                detail=f"Erro de conexão com o provedor: {exc}"
            )

async def call_gemini(
    api_key: str,
    model: str,
    messages: List[Dict[str, str]],
    temperature: float
) -> str:
    # Format Gemini messages
    # Gemini uses a different structure.
    system_instruction = CUSTOM_PROMPT
    
    contents = []
    for msg in messages:
        if msg["role"] == "system":
            system_instruction = msg["content"]
            continue
        
        role = "user" if msg["role"] == "user" else "model"
        contents.append({
            "role": role,
            "parts": [{"text": msg["content"]}]
        })
        
    url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={api_key}"
    
    payload = {
        "contents": contents,
        "systemInstruction": {
            "parts": [{"text": system_instruction}]
        },
        "generationConfig": {
            "temperature": temperature,
            "maxOutputTokens": 2048
        }
    }
    
    async with httpx.AsyncClient(timeout=60.0) as client:
        try:
            response = await client.post(url, json=payload)
            if response.status_code != 200:
                error_detail = response.text
                try:
                    error_json = response.json()
                    if "error" in error_json:
                        error_detail = error_json["error"].get("message", error_detail)
                except Exception:
                    pass
                raise HTTPException(
                    status_code=response.status_code,
                    detail=f"Erro da API Gemini: {error_detail}"
                )
            
            res_data = response.json()
            try:
                return res_data["candidates"][0]["content"]["parts"][0]["text"]
            except (KeyError, IndexError) as e:
                raise HTTPException(
                    status_code=500,
                    detail="Formato de resposta inesperado da API Gemini."
                )
        except httpx.RequestError as exc:
            raise HTTPException(
                status_code=500,
                detail=f"Erro de conexão com Gemini: {exc}"
            )

async def call_anthropic(
    api_key: str,
    model: str,
    messages: List[Dict[str, str]],
    temperature: float
) -> str:
    headers = {
        "x-api-key": api_key,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json"
    }
    
    # Anthropic expects system prompt at the top level, and only user/assistant role inside messages
    system_prompt = ""
    api_messages = []
    
    for msg in messages:
        if msg["role"] == "system":
            system_prompt = msg["content"]
        else:
            api_messages.append({
                "role": msg["role"],
                "content": msg["content"]
            })
            
    payload = {
        "model": model,
        "max_tokens": 2048,
        "messages": api_messages,
        "temperature": temperature
    }
    
    if system_prompt:
        payload["system"] = system_prompt
        
    url = "https://api.anthropic.com/v1/messages"
    
    async with httpx.AsyncClient(timeout=60.0) as client:
        try:
            response = await client.post(url, json=payload, headers=headers)
            if response.status_code != 200:
                error_detail = response.text
                try:
                    error_json = response.json()
                    if "error" in error_json:
                        error_detail = error_json["error"].get("message", error_detail)
                except Exception:
                    pass
                raise HTTPException(
                    status_code=response.status_code,
                    detail=f"Erro da API Anthropic: {error_detail}"
                )
            
            res_data = response.json()
            return res_data["content"][0]["text"]
        except httpx.RequestError as exc:
            raise HTTPException(
                status_code=500,
                detail=f"Erro de conexão com Anthropic: {exc}"
            )

@app.post("/api/chat")
async def chat_endpoint(request: ChatRequest):
    if not request.api_key or not request.api_key.strip():
        raise HTTPException(status_code=400, detail="Por favor, forneça a chave API.")
        
    # Prepara mensagens contendo o prompt do sistema
    api_messages = [{"role": "system", "content": CUSTOM_PROMPT}]
    for msg in request.messages:
        api_messages.append({"role": msg.role, "content": msg.content})

    provider = request.provider.lower()
    
    if provider == "groq":
        url = "https://api.groq.com/openai/v1/chat/completions"
        return {"response": await call_groq_or_openai(url, request.api_key, request.model, api_messages, request.temperature)}
        
    elif provider == "openai":
        url = "https://api.openai.com/v1/chat/completions"
        return {"response": await call_groq_or_openai(url, request.api_key, request.model, api_messages, request.temperature)}
        
    elif provider == "gemini":
        model_name = request.model
        return {"response": await call_gemini(request.api_key, model_name, api_messages, request.temperature)}
        
    elif provider == "anthropic":
        return {"response": await call_anthropic(request.api_key, request.model, api_messages, request.temperature)}
        
    elif provider == "openrouter":
        url = "https://openrouter.ai/api/v1/chat/completions"
        return {"response": await call_groq_or_openai(url, request.api_key, request.model, api_messages, request.temperature, is_openrouter=True)}
        
    else:
        raise HTTPException(status_code=400, detail=f"Provedor '{request.provider}' não suportado.")

# Serve static files from the /static folder (registered after API routes)
try:
    os.makedirs("static", exist_ok=True)
    app.mount("/", StaticFiles(directory="static", html=True), name="static")
except Exception as e:
    print(f"Erro ao montar arquivos estáticos: {e}")

# 🤖 PyCoder — Assistente de Programação em Python

Assistente de programação com interface web moderna (tema escuro) que permite **alternar entre múltiplos provedores de LLM** (Groq, OpenAI, Gemini, Anthropic e OpenRouter), informando sua chave de API diretamente na interface.

---

## ✨ Funcionalidades

- Chat de apoio à programação Python.
- Suporte a múltiplos provedores: **Groq, OpenAI, Gemini, Anthropic, OpenRouter**.
- Chave de API informada na própria interface e salva localmente no navegador (não fica salva no código/servidor).
- Interface web premium desenvolvida em **FastAPI** e **Uvicorn** (HTML/CSS/JS nativo).

---

## 🛠️ Tecnologias

- **Python** · **FastAPI** · **Uvicorn** · **httpx**
- Frontend em HTML/CSS/JS

---

## 🚀 Como Rodar

1. Instale as dependências:
   ```bash
   pip install -r requirements.txt
   ```

2. Inicie o servidor FastAPI:
   ```bash
   uvicorn app:app --reload
   ```

3. Acesse no seu navegador:
   👉 **http://localhost:8000**

---

## 👤 Autor
**Jorge Sereghetti** — Especialista em IA e Automação para Negócios

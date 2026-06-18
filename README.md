# 🤖 DSA AI Coder — Assistente de Programação em Python

Assistente de programação com interface web moderna (tema escuro) que permite **alternar entre múltiplos provedores de LLM** (Groq, OpenAI e Gemini), informando sua chave de API diretamente na interface.

> Estudo de caso estendido: além da versão original em Streamlit, ganhou um frontend próprio em FastAPI.

![Demonstração](EstudoCaso1.jpg)

---

## ✨ Funcionalidades

- Chat de apoio à programação Python
- Suporte a múltiplos provedores: **Groq, OpenAI, Gemini**
- Chave de API informada na própria interface (não fica salva no código)
- Duas interfaces: **Web Premium (FastAPI)** e **Streamlit (original)**

## 🛠️ Tecnologias

- **Python** · **FastAPI** · **Uvicorn** · **httpx**
- Streamlit (versão original)
- Frontend em HTML/CSS/JS

## 🚀 Como rodar (interface web)

```bash
pip install fastapi uvicorn httpx
uvicorn app:app --reload
```

Acesse `http://localhost:8000`, escolha o provedor e cole sua chave de API na interface.

> 🔒 As chaves de API são inseridas em tempo de execução pelo usuário — nenhuma chave é versionada.

## 👤 Autor
**Jorge Sereghetti** — Especialista em IA e Automação para Negócios

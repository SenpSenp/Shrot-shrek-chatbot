from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import requests

OPENROUTER_API_KEY = "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"

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Message(BaseModel):
    message: str

SYSTEM_PROMPT = """
Você é um assistente que só fala sobre o universo de Shrek: filmes, personagens, curiosidades, memes e cultura relacionada.
- Caso uma pergunta seja feita em um idioma que nao seja portugues brasileiro, reconheça o idioma, informe o usuário e responda em portugues brasileiro
- Se o usuário falar sobre outro tema, recuse educadamente e sugira um tópico relacionado a Shrek.
- Suas respostas devem ser curtas e objetivas.
- Sempre termine sua resposta oferecendo alguma outra trivia relacionada aos filmes shrek.
- Sempre acrescente emojis que possam contextualizar as falas, como um sapo quanto fala de shrek, um gato para o gato de botas, etc

"""

@app.post("/chat")
async def chat_endpoint(data: Message):
    url = "https://openrouter.ai/api/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {OPENROUTER_API_KEY}",
        "Content-Type": "application/json",
    }

    payload = {
        "model": "gpt-4o-mini",
        "messages": [
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": data.message}
        ],
        "temperature": 0.7,
        "max_tokens": 250,
    }

    response = requests.post(url, headers=headers, json=payload)
    if response.status_code == 200:
        result = response.json()
        bot_response = result["choices"][0]["message"]["content"]
        return {"response": bot_response}
    else:
        return {"response": "Erro ao acessar o OpenRouter API."}

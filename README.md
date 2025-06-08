# ***Guia Rápido de Instalação e Uso do Shrot, o chatbot shrek***

**Pré-requisitos**
  Node.js (versão 16+ recomendada)
  
  Python 3.10+ (ou superior)
  
  Pip para gerenciar pacotes Python

# **Configurando o backend:**

  cd backend
  
  python -m venv venv
  
  .\venv\Scripts\activate 
  
  pip install -r requirements.txt
  
  uvicorn app:app --reload


# **Configurando o frontend:**

  *É recomendável fazer um split no terminal para facilitar o uso entre front e backend*

  cd frontend
  
  npm install
  
  npm run dev
  #
***Após isso, o Shrot estará rodando em http://localhost:5173***

## Estrutura do Projeto
```
websockets
├── backend
├── app
```

## Pré-requisitos
Certifique-se de ter as seguintes ferramentas instaladas em sua máquina:

* Python (3.8 ou superior)
* Node.js (14.x ou superior) e npm

## Instruções para Iniciar o Backend
Passo 1: Configurar o Ambiente Virtual
Navegue até o diretório backend:

```
cd websockets/backend
```

Crie um ambiente virtual:

```
python -m venv venv
```

Ative o ambiente virtual:

No Windows:
```
venv\Scripts\activate
```
No macOS/Linux:
```
source venv/bin/activate
```

Passo 2: Instalar Dependências
Instale as dependências do projeto:
```
pip install -r requirements.txt
```

Passo 3: Configurar o Banco de Dados
Aplique as migrações do banco de dados:

```
python manage.py migrate
```

Crie um superusuário para acessar o painel administrativo:
```
python manage.py createsuperuser
```
Crie outros usuários para transferir Tickets via websockets

Passo 4: Executar o Servidor de Desenvolvimento
Execute o servidor de desenvolvimento:
```
python manage.py runserver
```
Passo 5: Configurar e Iniciar o Django Channels
Certifique-se de que o channels está configurado no seu settings.py:

```
INSTALLED_APPS = [
    # outras aplicações
    'channels',
    'orders',
]
```
```
ASGI_APPLICATION = 'websockets.routing.application'
```
```
CHANNEL_LAYERS = {
    "default": {
        "BACKEND": "channels_redis.core.RedisChannelLayer",
        "CONFIG": {
            "hosts": [("127.0.0.1", 6379)],
        },
    },
}
```
Instale e configure o Redis (se ainda não estiver instalado):

```
sudo apt-get install redis-server
```
```
sudo service redis-server start
```

Instruções para Iniciar o Frontend
Passo 1: Instalar Dependências
Navegue até o diretório app:

```
cd ../app
```
Instale as dependências do projeto:

```
npm install
```

Passo 2: Configurar Variáveis de Ambiente
Crie um arquivo .env.local na raiz do diretório app e adicione as seguintes variáveis de ambiente:
```
NEXT_PUBLIC_BACKEND_URL=http://127.0.0.1:8000
```
Passo 3: Executar o Servidor de Desenvolvimento
Execute o servidor de desenvolvimento:
```
npm run dev
```

Acessando a Aplicação
Backend: Acesse o backend em http://127.0.0.1:8000
Frontend: Acesse o frontend em http://localhost:3000


Faça login pelo frontend e crie ordens de serviço que serão renderizadas automaticamente para os outros usuários via websocket
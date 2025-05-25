
# MAIServant 🤵

Just a simple full-stack LLM-chat web application featuring a Next.js frontend and a FastAPI backend! 😖


## Tech Stack 🎬

**🏏 Client:** Next.js, React, TailwindCSS, ShadCN/Radix UI, Zustand, TanStack/Query, Socket.IO Client, Axios, Framer-Motion, React Hook Form, Zod

**🐝 Server:** FastAPI, FastAPI Users, FastAPI Socket.IO, Agno, Beanie

**💴 Database:** MongoDB

## Features 🍓

### **💃 Beautifully Designed Authentication Flow** 
  - Animated gradient background with a sleek logo animation
  - Dynamic call-to-action (CTA) using typing effects
  - Tabbed Sign Up / Sign In forms with smooth transitions
  - Stylish floating label inputs and interactive buttons with hover effects
  - Secure authentication powered by JWT tokens via FastAPI Users
### **😝 Interactive Real-Time Chat Experience**
  - Responsive chat interface with a collapsible sidebar that nests seamlessly into the layout
  - Real-time communication powered by WebSockets using Socket.IO (Client + FastAPI) and Agno
  - Persistent chat history per user, with support for renaming and deleting sessions
  - Context-aware LLM responses: retrieves relevant past messages from the same session for continuity
  - Model flexibility: switch between different LLMs mid-conversation
  - Smart session handling: users are automatically logged out after token expiration or inactivity
### **🚇 UPCOMING FEATURES!!! (Not in any particular order)**
-    **Advanced Authentication**: OAuth login, magic link via email, and password reset functionality
    
-    **Message Controls**: Edit or delete messages, and regenerate LLM responses on demand
    
-    **Multimodal RAG**: Enable Retrieval-Augmented Generation on user-uploaded documents, with support for **audio** and **image** inputs
    
-    **Custom AI Assistants**: Design and deploy personalized “servants” with full control over behavior, tools, and personalit

## Demo ⛅️

*Please beware that I will add much more features, so stay tuned!*

*Please also ignore the white gaps at the top and botom of the video. I used Canva to make this video, and they won't allow me to edit the video's  size unless I pay them money.* 🤑

[![Watch the video](https://github.com/user-attachments/assets/9fda239c-8c01-4642-a8df-7dfbd5620b03)](https://drive.google.com/file/d/1IVGb64n16T5fOAgfLVv-bEMVsJuLs8hn/view?usp=sharing)

## Installation & Usage 🚈

### Prerequisites 🍦

- [Docker](https://www.docker.com/get-started) & [Docker Compose](https://docs.docker.com/compose/install/)  
  *(for one-command setup)*  
- **OR**, if you prefer to run locally without Docker:  
  - **Node.js** ≥ 18 & **npm**  
  - **Python** ≥ 3.11  
  - **Git**

---

### 1. Clone the repository 🦄

```bash
git clone https://github.com/trndnhan/maiservant
cd your-repo
```



### 2.  Environment Variables 💻

In the `server/` folder you’ll find an example file:
```bash
cp server/.env.example server/.env
```

Edit server/.env and set your values:

```bash
`PORT`

`RESET_SECRET`

`VERIFICATION_SECRET`

`ACCESS_PUBLIC_KEY`

`ACCESS_PRIVATE_KEY`

`REFRESH_PRIVATE_KEY`

`REFRESH_PUBLIC_KEY`
```

You should add your own LLM providers API, too. Just make sure to change the models list in `client\src\data\modelGroups.ts`,  `server\src\api\socket_handlers.py`, and `server\src\config\config.py`. 

There is also a `MONGODB_URI` variable that should be set with your own URI. If you want to use a different database, refer to [Agno](https://docs.agno.com/introduction)'s and [FastAPI Users](https://fastapi-users.github.io/fastapi-users/latest/)'s documentations.

Your Next.js client uses `NEXT_PUBLIC_API_URL` from Docker Compose, so no extra client `.env` is needed.

### 3. One-command (Docker) setup 🍟
Build and start both services:

```bash
docker-compose up --build
```
FastAPI → http://localhost:8000

Next.js → http://localhost:2501

To tear everything down:

```bash
docker-compose down
```

### 4. Manual (non-Docker) setup 🔗
#### 4.1. Server 🌲

```bash
cd server
python -m venv .venv
source .venv/bin/activate    # (or `.venv\Scripts\activate` on Windows)
pip install --no-cache-dir -r requirements.txt
uvicorn src.main:app --reload
# Server is now running at http://localhost:8000
```

#### 4.2. Client 🚬

```bash
cd client
npm ci
npm run dev
# Client is now running at http://localhost:2501
```
## License 📙

 This project is licensed under the [MIT](https://choosealicense.com/licenses/mit/)
 License.

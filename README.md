# COOKED

COOKED is a full-stack MERN web app that helps you take whatever ingredients you have in your pantry and generate a recipe idea. You can sign in, add items to a virtual pantry, select which ones you want to cook with, and get back a recipe suggestion powered by the Gemini API.

## Demo
https://youtu.be/KaF2EvX65L8

## Features

- User authentication with Clerk, (sign up / sign in / sign out, also includes Google email sign in, changing user profile picture, changing user name)
- Landing page with sign up / sign in button and bouncing jars animation 
- Pantry page, add and remove ingredients, displayed as styled jars, ingredients are saved when the user signs out 
- Recipe generation, using the Gemini API, displayed as a cookbook-style recipe card

## Tech Stack
- Frontend: React (Vite) + Tailwind CSS 
- Backend: Node.js, Express  
- Database: MongoDB Atlas  
- Authentication: Clerk (JWT-protected API routes)  
- External API: Google Gemini for recipe generation  

## How to run locally

1. Clone the repo
   ```
   git clone https://github.com/naishu_vytla/cooked.git
   cd cooked
   ```

2. Install dependencies

   * Frontend:
     ```
     cd client
     npm install
     ```

   * Backend:
     ```
     cd ../server
     npm install
     ```

3. Add environment variables

   * Frontend: create `client/.env`
     ```
     VITE\_CLERK\_PUBLISHABLE\_KEY=pk\_test\_...
     VITE\_API\_BASE\_URL=[http://localhost:5000](http://localhost:5000)
     ```

   * Backend: create `server/.env`
     ```
     PORT=5000
     MONGODB\_URI=your\_mongodb\_atlas\_uri
     CLERK\_SECRET\_KEY=sk\_test\_...
     GEMINI\_API\_KEY=your\_gemini\_api\_key
     ```

4. Run the app (use two terminals)

   * Terminal 1 (backend):
     ```
     cd server
     npm start
     ```

   * Terminal 2 (frontend):
     ```
     cd client
     npm run dev
     ```

5. Open http://localhost:5173 in your local browser

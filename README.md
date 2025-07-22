# Celestine
## React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

### Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## Backend (Python + FastAPI + Google ADK)

This project also includes a backend implemented in **Python** using:

- [FastAPI](https://fastapi.tiangolo.com/) – modern async web framework
- [Google Agent Development Kit (ADK)](https://google.github.io/adk-docs/) – for building AI agents
- [Google Generative AI SDK](https://pypi.org/project/google-generativeai/) – integration with Gemini

### Backend setup

1. Navigate to the `backend` folder:
```bash  
  cd backend
  ```

2. Create a virtual environment:
```bash  
   python -m venv .venv 
  ```

3. Activate the virtual environment:
- PowerShell:
```bash  
  .venv\Scripts\Activate.ps1  
 ``` 
- Bash/Mac:
```bash  
  source .venv/bin/activate
  ```

4. Install dependencies:
```bash  
  pip install -r requirements.txt
 ``` 

5. Run the FastAPI server:
```bash  
  uvicorn main:app --reload --port 8080
 ``` 

> To run Google Agent, enter the `adk web` command.
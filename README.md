Notes Application

About the Project

The Notes Application is a simple full-stack web application that allows users to create, view, edit, and delete notes.

Features

- Create new notes
- View saved notes
- Edit existing notes
- Delete notes
- Store notes using an SQLite database

Technologies Used

- Frontend: HTML, CSS, JavaScript
- Backend: Python, FastAPI
- Database: SQLite

Project Structure

- "frontend/" – Contains HTML, CSS, and JavaScript files
- "backend/" – Contains the Python backend application

How to Run

1. Install dependencies

pip install fastapi uvicorn

2. Start the backend

Open a terminal in the backend folder and run:

python -m uvicorn main:app --reload --port 8000

3. Open the frontend

Open "frontend/index.html" using VS Code Live Server.

Purpose

This project was developed to gain practical experience in full-stack web development, API integration, and database operations.

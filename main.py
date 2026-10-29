from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import sqlite3

app = FastAPI(title="Notes Application")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

def connect_db():
    conn = sqlite3.connect("notes.db")
    conn.row_factory = sqlite3.Row
    return conn

with connect_db() as conn:
    conn.execute("""
        CREATE TABLE IF NOT EXISTS notes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            content TEXT NOT NULL
        )
    """)

class Note(BaseModel):
    title: str
    content: str

@app.get("/")
def home():
    return {"message": "Notes API is running"}

@app.get("/notes")
def get_notes():
    with connect_db() as conn:
        rows = conn.execute(
            "SELECT * FROM notes ORDER BY id DESC"
        ).fetchall()
        return [dict(row) for row in rows]

@app.post("/notes")
def add_note(note: Note):
    if not note.title.strip() or not note.content.strip():
        raise HTTPException(400, "Title and content required")

    with connect_db() as conn:
        cursor = conn.execute(
            "INSERT INTO notes (title, content) VALUES (?, ?)",
            (note.title.strip(), note.content.strip())
        )
        return {
            "id": cursor.lastrowid,
            "title": note.title.strip(),
            "content": note.content.strip()
        }

@app.put("/notes/{note_id}")
def update_note(note_id: int, note: Note):
    if not note.title.strip() or not note.content.strip():
        raise HTTPException(400, "Title and content required")

    with connect_db() as conn:
        cursor = conn.execute(
            "UPDATE notes SET title=?, content=? WHERE id=?",
            (note.title.strip(), note.content.strip(), note_id)
        )
        if cursor.rowcount == 0:
            raise HTTPException(404, "Note not found")

    return {"message": "Note updated successfully"}

@app.delete("/notes/{note_id}")
def delete_note(note_id: int):
    with connect_db() as conn:
        cursor = conn.execute(
            "DELETE FROM notes WHERE id=?", (note_id,)
        )
        if cursor.rowcount == 0:
            raise HTTPException(404, "Note not found")

    return {"message": "Note deleted successfully"}
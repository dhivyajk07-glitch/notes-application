const API_URL = "http://127.0.0.1:8000/notes";

const titleInput = document.getElementById("title");
const contentInput = document.getElementById("content");
const saveBtn = document.getElementById("saveBtn");
const searchInput = document.getElementById("search");
const notesList = document.getElementById("notesList");

let notes = [];
let editingId = null;

async function loadNotes() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error("Could not load notes");
        notes = await response.json();
        renderNotes();
    } catch (error) {
        notesList.textContent =
            "Backend connect aagala. Server start pannunga.";
    }
}

function renderNotes() {
    const query = searchInput.value.toLowerCase();
    notesList.replaceChildren();

    const filtered = notes.filter(note =>
        note.title.toLowerCase().includes(query) ||
        note.content.toLowerCase().includes(query)
    );

    if (filtered.length === 0) {
        notesList.textContent = "No notes found.";
        return;
    }

    filtered.forEach(note => {
        const card = document.createElement("article");
        card.className = "note-card";

        const heading = document.createElement("h3");
        heading.textContent = note.title;

        const paragraph = document.createElement("p");
        paragraph.textContent = note.content;

        const editBtn = document.createElement("button");
        editBtn.textContent = "Edit";
        editBtn.onclick = () => {
            titleInput.value = note.title;
            contentInput.value = note.content;
            editingId = note.id;
            saveBtn.textContent = "Update Note";
            titleInput.focus();
        };

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.className = "delete-btn";
        deleteBtn.onclick = () => deleteNote(note.id);

        card.append(heading, paragraph, editBtn, deleteBtn);
        notesList.append(card);
    });
}

saveBtn.addEventListener("click", async () => {
    const title = titleInput.value.trim();
    const content = contentInput.value.trim();

    if (!title || !content) {
        alert("Title and content rendu-me enter pannunga!");
        return;
    }

    const url = editingId === null
        ? API_URL
        : `${API_URL}/${editingId}`;

    try {
        const response = await fetch(url, {
            method: editingId === null ? "POST" : "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title, content })
        });

        if (!response.ok) throw new Error("Save failed");

        titleInput.value = "";
        contentInput.value = "";
        editingId = null;
        saveBtn.textContent = "Add Note";
        await loadNotes();
    } catch (error) {
        alert("Note save aagala. Backend server check pannunga.");
    }
});

async function deleteNote(id) {
    if (!confirm("Indha note-a delete pannalama?")) return;

    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: "DELETE"
        });

        if (!response.ok) throw new Error("Delete failed");
        await loadNotes();
    } catch (error) {
        alert("Delete aagala. Backend server check pannunga.");
    }
}

searchInput.addEventListener("input", renderNotes);

loadNotes();
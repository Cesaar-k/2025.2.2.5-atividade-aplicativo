let db;

const request = indexedDB.open("listaComprasDB", 1);

request.onupgradeneeded = (event) => {
  db = event.target.result;
  db.createObjectStore("itens", { keyPath: "id", autoIncrement: true });
};

request.onsuccess = (event) => {
  db = event.target.result;
  listarItens();
};

const form = document.getElementById("form-item");
const input = document.getElementById("item");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const item = {
    nome: input.value
  };

  const transaction = db.transaction(["itens"], "readwrite");
  const store = transaction.objectStore("itens");

  store.add(item);

  transaction.oncomplete = () => {
    input.value = "";
    listarItens();
  };
});

function listarItens() {
  const lista = document.getElementById("lista");
  lista.innerHTML = "";

  const transaction = db.transaction(["itens"], "readonly");
  const store = transaction.objectStore("itens");

  store.openCursor().onsuccess = (event) => {
    const cursor = event.target.result;

    if (cursor) {
      const li = document.createElement("li");
      li.innerHTML = `
        ${cursor.value.nome}
        <button onclick="removerItem(${cursor.value.id})">X</button>
      `;
      lista.appendChild(li);
      cursor.continue();
    }
  };
}

function removerItem(id) {
  const transaction = db.transaction(["itens"], "readwrite");
  const store = transaction.objectStore("itens");

  store.delete(id);

  transaction.oncomplete = () => {
    listarItens();
  };
}

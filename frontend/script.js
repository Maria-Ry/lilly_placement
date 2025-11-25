const BASE = "http://localhost:8000";

const tbody = document.getElementById("tbody");

const nameInput = document.getElementById("name");
const priceInput = document.getElementById("price");
const avgText = document.getElementById("avg");

const createBtn = document.getElementById("create");
const updateBtn = document.getElementById("update");
const reloadBtn = document.getElementById("reload");

async function loadMedicines() {
    const res = await fetch(`${BASE}/medicines`);
    const data = await res.json();

    const meds = data.medicines || [];
    tbody.innerHTML = "";

    meds.forEach((m) => {
        const tr = document.createElement("tr");

        // name
        const nameTd = document.createElement("td");
        const name = m.name || "N/A";
        nameTd.textContent = name;

        // price
        const priceTd = document.createElement("td");
        if (typeof m.price === "number") {
            priceTd.textContent = `£${m.price}`;
        } else {
            priceTd.textContent = "N/A";
        }

        // actions
        const actionsTd = document.createElement("td");

        const editBtn = document.createElement("button");
        editBtn.textContent = "Edit";
        editBtn.onclick = () => {
            nameInput.value = m.name || "";
            if (typeof m.price === "number") {
                priceInput.value = m.price;
            } else {
                priceInput.value = "";
            }
            priceInput.focus();
        };

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.onclick = () => deleteMed(name);

        actionsTd.appendChild(editBtn);
        actionsTd.appendChild(deleteBtn);

        tr.appendChild(nameTd);
        tr.appendChild(priceTd);
        tr.appendChild(actionsTd);

        tbody.appendChild(tr);
    });
}

async function loadAverage() {
    const res = await fetch(`${BASE}/average-price`);
    const data = await res.json();

    if (data.average_price == null) {
        avgText.textContent = "No valid prices.";
    } else {
        avgText.textContent = `£${data.average_price} (from ${data.count})`;
    }
}

async function createMed() {
    const name = nameInput.value.trim();
    const price = priceInput.value.trim();

    if (!name || !price) {
        alert("Please enter both name and price.");
        return;
    }

    const fd = new FormData();
    fd.append("name", name);
    fd.append("price", price);

    await fetch(`${BASE}/create`, {
        method: "POST",
        body: fd,
    });

    await loadMedicines();
    await loadAverage();
}

async function updateMed() {
    const name = nameInput.value.trim();
    const price = priceInput.value.trim();

    if (!name || !price) {
        alert("Please enter both name and price.");
        return;
    }

    const fd = new FormData();
    fd.append("name", name);
    fd.append("price", price);

    await fetch(`${BASE}/update`, {
        method: "POST",
        body: fd,
    });

    await loadMedicines();
    await loadAverage();
}

async function deleteMed(name) {
    const fd = new FormData();
    fd.append("name", name);

    await fetch(`${BASE}/delete`, {
        method: "DELETE",
        body: fd,
    });

    await loadMedicines();
    await loadAverage();
}

// wire up buttons
createBtn.onclick = createMed;
updateBtn.onclick = updateMed;
reloadBtn.onclick = () => {
    loadMedicines();
    loadAverage();
};

// initial load
loadMedicines();
loadAverage();

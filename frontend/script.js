const BASE = "http://localhost:8000";

const tbody = document.getElementById("tbody");

const nameInput = document.getElementById("name");
const priceInput = document.getElementById("price");
const avgText = document.getElementById("avg");

const createBtn = document.getElementById("create");
const reloadBtn = document.getElementById("reload");

let currentEditRow = null;
let currentEditRestore = null;

async function loadMedicines() {
    const res = await fetch(`${BASE}/medicines`);
    const data = await res.json();

    const meds = data.medicines || [];
    tbody.innerHTML = "";
    currentEditRow = null;

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
        editBtn.onclick = () => openEditRow(m, tr);

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

// INLINE UPDATE POPUP 

function openEditRow(med, row) {
    // if another row is being edited, restore it first
    if (currentEditRow && currentEditRow !== row && typeof currentEditRestore === "function") {
        currentEditRestore();
    }

    // if clicking Edit on the same row that's already in edit mode -> do nothing
    if (currentEditRow === row) {
        return;
    }

    currentEditRow = row;

    const nameCell = row.children[0];
    const priceCell = row.children[1];
    const actionsCell = row.children[2];

    const originalPrice = med.price;

    currentEditRestore = () => {
        // restore price text
        if (typeof originalPrice === "number") {
            priceCell.textContent = `£${originalPrice}`;
        } else {
            priceCell.textContent = "N/A";
        }

        // rebuild actions
        actionsCell.innerHTML = "";

        const editBtn = document.createElement("button");
        editBtn.textContent = "Edit";
        editBtn.onclick = () => openEditRow(med, row);

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.onclick = () => deleteMed(med.name || "");

        actionsCell.appendChild(editBtn);
        actionsCell.appendChild(deleteBtn);

        currentEditRow = null;
        currentEditRestore = null;
    };

    // turn price cell into input
    priceCell.innerHTML = "";
    const input = document.createElement("input");
    input.type = "number";
    input.value = originalPrice != null ? originalPrice : "";
    priceCell.appendChild(input);

    // replace actions with Save / Cancel
    actionsCell.innerHTML = "";

    const saveBtn = document.createElement("button");
    saveBtn.textContent = "Save";
    saveBtn.onclick = async () => {
        const newPrice = input.value.trim();
        if (!newPrice) {
            alert("Enter a price");
            return;
        }
        await updateMed(med.name, newPrice);
    };

    const cancelBtn = document.createElement("button");
    cancelBtn.textContent = "Cancel";
    cancelBtn.onclick = () => {
        if (typeof currentEditRestore === "function") {
            currentEditRestore();
        }
    };

    actionsCell.appendChild(saveBtn);
    actionsCell.appendChild(cancelBtn);
}

// CRUD

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

    nameInput.value = "";
    priceInput.value = "";

    await loadMedicines();
    await loadAverage();
}

async function updateMed(name, price) {
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

// EVENTS

createBtn.onclick = createMed;
reloadBtn.onclick = () => {
    loadMedicines();
    loadAverage();
};

// initial load
loadMedicines();
loadAverage();

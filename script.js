document.getElementById('crud-form').addEventListener('submit', async function(event) {
    event.preventDefault();
    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;
    const email = document.getElementById('email').value;
    const id = document.getElementById('crud-form').dataset.id;

    if (id) {
        await fetch(`/api/contacts/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, phone, email })
        });
    } else {
        await fetch('/api/contacts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, phone, email })
        });
    }

    document.getElementById('crud-form').reset();
    document.getElementById('crud-form').dataset.id = '';
    loadContacts();
});

async function loadContacts() {
    const response = await fetch('/api/contacts');
    const contacts = await response.json();
    const list = document.getElementById('crud-list');
    list.innerHTML = '';
    contacts.forEach(contact => {
        const li = document.createElement('li');
        li.textContent = `${contact.name} - ${contact.phone} - ${contact.email}`;
        
        const updateButton = document.createElement('button');
        updateButton.textContent = 'Update';
        updateButton.addEventListener('click', () => {
            document.getElementById('name').value = contact.name;
            document.getElementById('phone').value = contact.phone;
            document.getElementById('email').value = contact.email;
            document.getElementById('crud-form').dataset.id = contact.id;
        });
        
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', async () => {
            await fetch(`/api/contacts/${contact.id}`, { method: 'DELETE' });
            loadContacts();
        });
        
        li.appendChild(updateButton);
        li.appendChild(deleteButton);
        list.appendChild(li);
    });
}

document.addEventListener('DOMContentLoaded', loadContacts);

const form = document.getElementById('chat-form');
const input = document.getElementById('user-input');
const chatBox = document.getElementById('chat-box');
const sendButton = form.querySelector('button');

form.addEventListener('submit', async function (e) {
  e.preventDefault();

  const userMessage = input.value.trim();
  if (!userMessage) return;

  appendMessage('user', userMessage);
  input.value = '';

  // Nonaktifkan form saat menunggu balasan
  setLoadingState(true);
  try {
    // Kirim pesan pengguna ke backend API kita
    const response = await fetch('http://localhost:3000/api/chat', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userMessage }),
    });

    if (!response.ok) {
        // Jika server mengembalikan error, tampilkan pesan error
        throw new Error(`Server error: ${response.statusText}`);
    }

    const data = await response.json();
    // Tampilkan balasan dari AI
    appendMessage('bot', data.output);

} catch (error) {
    // Jika ada error jaringan atau lainnya, tampilkan juga
    console.error('Fetch Error:', error);
    appendMessage('bot', `Sorry, something went wrong. Please try again. (${error.message})`);
} finally {
    // Aktifkan kembali form setelah mendapatkan balasan atau error
    setLoadingState(false);
}
});

// Fungsi untuk menambahkan pesan ke chat box
function appendMessage(sender, text) {
  const msgDiv = document.createElement('div');
  msgDiv.classList.add('message', sender);
  msgDiv.textContent = text;
  chatBox.appendChild(msgDiv);
  // Auto-scroll ke pesan terbaru
  chatBox.scrollTop = chatBox.scrollHeight;
}

// Fungsi untuk mengatur state loading (menunggu balasan AI)
function setLoadingState(isLoading) {
  input.disabled = isLoading;
  sendButton.disabled = isLoading;
  if (isLoading) {
    input.placeholder = "Gemini is thinking...";
  } else {
    input.placeholder = "Type your message...";
    input.focus(); // Fokus kembali ke input field
  }
}

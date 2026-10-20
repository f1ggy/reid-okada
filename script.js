const copyButton = document.getElementById('copy-email');
copyButton.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText('hello@reidokada.com');
    copyButton.textContent = 'Address copied ✓';
    document.getElementById('copy-status').textContent = 'Email address copied.';
  } catch {
    copyButton.textContent = 'Select and copy the address above';
    document.getElementById('copy-status').textContent = 'Copy unavailable. Select the email address above to copy it.';
  }
});
document.getElementById('year').textContent = new Date().getFullYear();

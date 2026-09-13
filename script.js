const EMAIL = "reid@black.com";

const copyBtn = document.getElementById("copy-email");
const contactForm = document.getElementById("contact-form");

function fallbackCopy() {
  const input = document.createElement("textarea");
  input.value = EMAIL;
  input.setAttribute("readonly", "");
  input.style.position = "fixed";
  input.style.left = "-9999px";
  document.body.appendChild(input);
  input.select();
  const ok = document.execCommand("copy");
  document.body.removeChild(input);
  if (!ok) {
    throw new Error("execCommand copy failed");
  }
}

function showCopyState(label, copied) {
  copyBtn.textContent = label;
  copyBtn.classList.toggle("is-copied", copied);
  window.setTimeout(() => {
    copyBtn.textContent = "Copy";
    copyBtn.classList.remove("is-copied");
  }, 1800);
}

async function copyEmail() {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(EMAIL);
    } else {
      fallbackCopy();
    }
    showCopyState("Copied", true);
  } catch (err) {
    try {
      fallbackCopy();
      showCopyState("Copied", true);
    } catch {
      showCopyState("Copy failed", false);
    }
  }
}

copyBtn.addEventListener("click", copyEmail);

contactForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const name = document.getElementById("visitor-name").value.trim();
  const email = document.getElementById("visitor-email").value.trim();
  const message = document.getElementById("visitor-message").value.trim();

  if (!name || !email || !message) {
    contactForm.reportValidity();
    return;
  }

  const subject = `Hello from ${name}`;
  const submitBtn = contactForm.querySelector(".submit-btn");
  const sentNote = document.getElementById("sent-note");
  const contactBox = document.querySelector(".contact");
  submitBtn.disabled = true;

  fetch("https://formsubmit.co/ajax/" + EMAIL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      name,
      email,
      message,
      _subject: subject,
      _captcha: "false",
      _template: "table",
    }),
  })
    .then(async (res) => {
      let payload = {};
      try {
        payload = await res.json();
      } catch (parseErr) {
        payload = { parseFailed: true };
      }
      const reply = String(payload.message || "");
      const needsActivate = /activat/i.test(reply);
      const blockedFile = /html files|web server/i.test(reply);
      if (blockedFile || payload.success === "false" || payload.success === false) {
        if (!needsActivate) {
          throw new Error(reply || "formsubmit failed");
        }
      }
      contactBox.classList.add("is-sent");
      sentNote.hidden = false;
    })
    .catch(() => {
      submitBtn.disabled = false;
      submitBtn.textContent = "Try again";
    });
});

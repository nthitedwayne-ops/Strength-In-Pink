const menuToggle = document.querySelector(".menu-toggle");
const nav = document.querySelector("#primary-nav");

menuToggle?.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(open));
  menuToggle.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
  menuToggle.textContent = open ? "×" : "☰";
});

nav?.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", () => {
    nav.classList.remove("open");
    menuToggle?.setAttribute("aria-expanded", "false");
    if (menuToggle) {
      menuToggle.textContent = "☰";
      menuToggle.setAttribute("aria-label", "Open navigation");
    }
  });
});

document.querySelector("#year").textContent = new Date().getFullYear();

const eventPopup = document.querySelector("#event-popup");
const eventPopupDismissedKey = "pinkhope_event_popup_dismissed";
const eventEndTime = new Date("2026-10-24T15:00:00+02:00").getTime();

eventPopup?.addEventListener("close", () => {
  sessionStorage.setItem(eventPopupDismissedKey, "true");
});

if (eventPopup && Date.now() < eventEndTime && !sessionStorage.getItem(eventPopupDismissedKey)) {
  window.setTimeout(() => {
    if (Date.now() < eventEndTime && !sessionStorage.getItem(eventPopupDismissedKey) && !eventPopup.open) {
      eventPopup.showModal();
    }
  }, 5000);
}

const cookieBanner = document.querySelector("#cookie-banner");
const acceptCookiesButton = document.querySelector("#cookie-accept");
const declineCookiesButton = document.querySelector("#cookie-decline");

const cookiePreferencesKey = "pinkhope_cookie_consent";

const setCookiePreference = (value) => {
  localStorage.setItem(cookiePreferencesKey, value);
  cookieBanner?.classList.remove("visible");
};

if (!localStorage.getItem(cookiePreferencesKey)) {
  cookieBanner?.classList.add("visible");
}

acceptCookiesButton?.addEventListener("click", () => setCookiePreference("accepted"));
declineCookiesButton?.addEventListener("click", () => setCookiePreference("declined"));

const chatPanel = document.querySelector("#chat-panel");
const chatToggle = document.querySelector("#chat-toggle");
const chatClose = document.querySelector("#chat-close");
const chatForm = document.querySelector("#chat-form");
const chatInput = document.querySelector("#chat-input");
const chatLog = document.querySelector("#chat-log");

const appendChatMessage = (text, sender, link) => {
  const message = document.createElement("p");
  message.className = `chat-message chat-message-${sender}`;

  if (link) {
    message.append(document.createTextNode(text));
    const anchor = document.createElement("a");
    anchor.href = link.href;
    anchor.textContent = link.label;
    message.append(anchor);
  } else {
    message.textContent = text;
  }

  chatLog.append(message);
  chatLog.scrollTop = chatLog.scrollHeight;
};

const getChatResponse = (question) => {
  const normalizedQuestion = question.toLowerCase();

  if (/sign|symptom|lump|nipple|change|pain/.test(normalizedQuestion)) {
    return "Possible changes include a new lump or thickening, a change in breast size or shape, skin dimpling or redness, nipple changes or unusual discharge, or persistent pain in one area. These changes do not always mean cancer, but should be assessed by a healthcare professional.";
  }

  if (/screen|mammogram|test|check|age|risk/.test(normalizedQuestion)) {
    return "Screening advice depends on your age, risk factors, and medical history. A healthcare professional can help you decide what is appropriate. If you notice a new change, arrange an assessment rather than waiting for routine screening.";
  }

  if (/help|support|contact|phone|cansa/.test(normalizedQuestion)) {
    return {
      text: "For support and current services, contact the CANSA toll-free help desk: ",
      link: { href: "tel:0123293036", label: "012 329 3036" }
    };
  }

  if (/event|date|venue|time|real men|wear pink/.test(normalizedQuestion)) {
    return "The Real Men Wear Pink breast cancer awareness drive is on Saturday, 24 October 2026, from 09:00 to 15:00 at Bana Sports Ground, Mabopane.";
  }

  return "I can help with possible signs, screening information, CANSA support, or the Real Men Wear Pink event. For personal medical advice, please speak with a healthcare professional.";
};

const sendChatQuestion = (question) => {
  const trimmedQuestion = question.trim();
  if (!trimmedQuestion) return;

  appendChatMessage(trimmedQuestion, "user");
  const response = getChatResponse(trimmedQuestion);
  if (typeof response === "string") {
    appendChatMessage(response, "bot");
  } else {
    appendChatMessage(response.text, "bot", response.link);
  }
};

chatToggle?.addEventListener("click", () => {
  const isOpening = chatPanel.hidden;
  chatPanel.hidden = !isOpening;
  chatToggle.setAttribute("aria-expanded", String(isOpening));
  if (isOpening) chatInput.focus();
});

chatClose?.addEventListener("click", () => {
  chatPanel.hidden = true;
  chatToggle.setAttribute("aria-expanded", "false");
  chatToggle.focus();
});

chatForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  sendChatQuestion(chatInput.value);
  chatInput.value = "";
  chatInput.focus();
});

document.querySelectorAll("[data-chat-question]").forEach((button) => {
  button.addEventListener("click", () => sendChatQuestion(button.dataset.chatQuestion));
});

const shareButton = document.querySelector("#share-button");
const shareStatus = document.querySelector("#share-status");
shareButton?.addEventListener("click", async () => {
  const shareData = {
    title: "Pink Hope | Breast Cancer Awareness",
    text: "Learn about breast cancer awareness, possible signs, and support resources.",
    url: window.location.href
  };
  try {
    if (navigator.share) {
      await navigator.share(shareData);
      shareStatus.textContent = "Thanks for helping share awareness.";
    } else if (navigator.clipboard) {
      await navigator.clipboard.writeText(shareData.url);
      shareStatus.textContent = "Website link copied. You can now share it with someone.";
    } else {
      shareStatus.textContent = "Copy this page's address from your browser to share it.";
    }
  } catch (error) {
    if (error.name !== "AbortError") {
      shareStatus.textContent = "You can copy this page's address from your browser to share it.";
    }
  }
});

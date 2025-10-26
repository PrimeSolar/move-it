/*
 * Chat Script
 *
 * This script initializes a chat for Move It, leveraging Dexie.js for
 * local database storage. The chat interface allows users to interact with a virtual
 * assistant, Zane, for inquiries related to moving services.
 *
 * Key Features:
 * - Dynamically loads the Dexie library from the CDN if not already loaded.
 * - Creates and manages a local database with tables for chat messages and
 *   user interface state.
 * - Implements a responsive chat interface with a header, scrollable message body,
 *   and input field for user interactions.
 * - Saves and retrieves chat messages and window states to maintain continuity across
 *   sessions.
 * - Includes a visual typing indicator to simulate operator responses.
 * - Provides predefined responses based on user input, including greetings,
 *   thanks, inquiries, and specific about moving services.
 *
 * Copyright © Vladislav Kazantsev
 * All rights reserved.
 * This code is the intellectual property of Vladislav Kazantsev.
 * You are welcome to clone the related repository and use the code for exploratory purposes.
 * However, unauthorized reproduction, modification, or redistribution of this code (including cloning of related repository or altering it for activities beyond exploratory use) is strictly prohibited.
 * Code snippets may be shared only when the original author is explicitly credited and a direct link to the original source of the code is provided alongside the code snippet.
 * Sharing the link to the file is permitted, except when directed toward retrieval purposes.
 * Any form of interaction with this file is strictly prohibited when facilitated by the code, except when such interaction is for discussion or exchange purposes with others.
 * This copyright notice applies globally.
 * For inquiries about collaboration, usage outside exploratory purposes, or permissions, please contact: hypervisor7@pm.me
 */

(function () {
  // Load Dexie from the CDN if not already loaded
  let loadDexie = false;
  if (typeof Dexie === "undefined") {
    loadDexie = true;
    const dexieScript = document.createElement("script");
    dexieScript.type = "text/javascript";
    dexieScript.src = "https://npmcdn.com/dexie@4.0.11/dist/dexie.min.js";
    document.body.insertBefore(dexieScript, document.body.firstChild);
    dexieScript.onload = initApp;
  }

  if (!loadDexie) {
    initApp();
  }

  function initApp() {
    // Create the database (or open an existing one)
    const db = new Dexie("Move It");
    db.version(2).stores({
      themeTable: "theme",
      chatTable: "++id, type, text, timestamp",
      chatWindowState: "state",
    });

    // Initiate the chat application after the DOM is loaded
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", initChat);
    } else {
      initChat();
    }

    // Chat code
    async function initChat() {
      const style = document.createElement("style");
      style.textContent = `
/* Chat */

#chat {
  position: fixed;
  bottom: 0.75rem;
  right: 20px;
  width: 300px;
  background: #ffffff;
  border: 1px solid #cccccc;
  border-radius: 8px;
  z-index: 10000;
  font-family: var(--bs-body-font-family);
  box-shadow: 0 0 10px #0000001a;
}

@keyframes gradientAnimation {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

#chat-header {
  height: 3rem;
  padding: 8px;
  font-size: 1.2em;
  text-align: center;
  background: linear-gradient(to right, #1177ff, #1ab1ff);
  background-size: 200% 100%;
  animation: gradientAnimation 5s ease infinite;
  color: #ffffff;
  border-radius: 8px;
  cursor: pointer;
}

#chat-body {
  max-height: 68vh;
  overflow-x: hidden !important;
  overflow-y: auto;
  padding: 10px;
  display: flex;
  flex-direction: column;
}

#chat-input {
  width: calc(100% - 20px);
  padding: 8px;
  margin: 10px;
  border: 1px solid #cccccc;
  border-radius: 4px;
}

#chat-input:focus {
  border-color: #007bff;
  outline: none;
}

/* Message Styles */
.message {
  display: flex; /* Use flexbox for alignment */
  align-items: flex-end; /* Align the flexbox items */
  opacity: 0;
  transition: opacity 0.5s ease;
  margin: 5px 0;
  padding: 8px;
  border-radius: 5px;
  word-wrap: break-word;
}

.message.visible {
  opacity: 1;
}

.message p {
  margin: 0;
}

.move-it-operator-image {
  width: auto; /* Set the width of the element */
  height: 30px; /* Set the height of the element */
  margin-right: 8px; /* Set the margin for the element */
  border-radius: 50%; /* Set the border radius for the element */
}

.move-it-operator-message-text {
  padding: 5px;
  background-color: #1177ff;
  border-radius: 5px;
  color: #ffffff;
  overflow-wrap: break-word;
  max-width: 90%;
}

.move-it-operator-message-text * {
  color: #ffffff !important;
}

.user-message {
  max-width: 90%;
  margin-left: auto;
  align-self: flex-end;
  background-color: #1ab1ff;
  color: #ffffff;
}

/* Mobile Styles */
@media (max-width: 480px) {
  #chat {
    width: 90%;
    right: 5%;
    bottom: 10px;
  }

  #chat-body {
    max-height: 50vh;
    padding: 8px;
  }

  #chat-input {
    padding: 10px;
    margin: 5px;
  }
}
          `;
      document.head.appendChild(style);

      // Create chat container element
      const chat = document.createElement("div");
      chat.id = "chat";

      // Chat header
      const chatHeader = document.createElement("div");
      chatHeader.id = "chat-header";
      chatHeader.textContent = "Chat with Us";
      chat.appendChild(chatHeader);

      // Chat body for conversation messages
      const chatBodyContainer = document.createElement("div");
      chatBodyContainer.id = "chat-body";
      chat.appendChild(chatBodyContainer);

      // Chat input field for user messages
      const inputField = document.createElement("input");
      inputField.id = "chat-input";
      inputField.placeholder = "Type a message...";
      chat.appendChild(inputField);

      document.querySelector("main").appendChild(chat);

      // Load saved chat state
      const chatState = await loadChatWindowState();
      if (chatState === "wrapped") {
        chatBodyContainer.classList.add("hide");
        inputField.classList.add("hide");
      }

      // Toggle chat body & input visibility on header click
      chatHeader.addEventListener("click", async function () {
        chatBodyContainer.classList.toggle("hide");
        inputField.classList.toggle("hide");
        const newState = chatBodyContainer.classList.contains("hide")
          ? "wrapped"
          : "unwrapped";
        await saveChatWindowState(newState);
      });

      function applyToTopStyles() {
        const chatBody = document.querySelector("#chat-body");
        if (window.matchMedia("(max-height: 500px)").matches) {
          if (chatBody.classList.contains("hide")) {
            toTop.style.bottom = "5.5rem";
            toTop.style.right = "25px";
          } else {
            toTop.style.bottom = "0.75rem";
            toTop.style.right = "321px";
          }
        } else if (window.matchMedia("(max-width: 500px)").matches) {
          if (chatBody.classList.contains("hide")) {
            toTop.style.bottom = "5.5rem";
            toTop.style.right = "25px";
          } else {
            toTop.style.bottom = "37rem";
            toTop.style.right = "25px";
          }
        } else if (
          window.matchMedia("(max-width: 1400px)").matches &&
          window.matchMedia("(max-height: 700px)").matches
        ) {
          if (chatBody.classList.contains("hide")) {
            toTop.style.bottom = "5.5rem";
            toTop.style.right = "25px";
          } else {
            toTop.style.bottom = "34rem";
            toTop.style.right = "25px";
          }
        } else {
          if (chatBody.classList.contains("hide")) {
            toTop.style.bottom = "12.4rem";
            toTop.style.right = "25px";
          } else {
            toTop.style.bottom = "50rem";
            toTop.style.right = "25px";
          }
        }
      }
      applyToTopStyles();
      window.addEventListener("resize", applyToTopStyles);
      document
        .querySelector("#chat-header")
        .addEventListener("click", applyToTopStyles);

      // Load saved chat messages from the database
      loadChatMessages();

      // Listen for the "Enter" key to send a message
      inputField.addEventListener("keydown", async function (e) {
        if (e.key === "Enter" && inputField.value.trim() !== "") {
          const userText = inputField.value.trim();
          // Display user message
          addMessage("You", userText, "user-message");
          // Save user message in the database
          await saveMessage("user-message", userText);
          inputField.value = "";

          // Show typing indicator for the operator
          const typingIndicator = document.createElement("p");
          typingIndicator.className = "typing-indicator";
          typingIndicator.textContent = "Zane is typing...";
          chatBodyContainer.appendChild(typingIndicator);
          chatBodyContainer.scrollTop = chatBodyContainer.scrollHeight;

          // Simulate a delay for the operator's response
          setTimeout(() => {
            // Remove typing indicator
            chatBodyContainer.removeChild(typingIndicator);

            // Generate a response based on user input
            const operatorResponse = generateResponse(userText);
            addMessage("Move It", operatorResponse, "move-it-operator-message");
            saveMessage("move-it-operator-message", operatorResponse);
          }, 1500); // 1 second delay for typing effect
        }
      });

      // Helper function to add messages to the chat body
      function addMessage(sender, text, type) {
        const messageContainer = document.createElement("div");
        messageContainer.classList.add("message", type); // Add the message class and type

        if (type === "move-it-operator-message") {
          // Create an image element for the operator
          const moveItOperatorImage = document.createElement("img");
          moveItOperatorImage.src = "assets/person.jpg"; // Replace with the actual image path
          moveItOperatorImage.title = "Move It Operator"; // Title for clatiry
          moveItOperatorImage.alt = "Move It Operator"; // Alternative text for accessibility
          moveItOperatorImage.classList.add("move-it-operator-image"); // Add class for styling
          messageContainer.appendChild(moveItOperatorImage); // Add image to the message container
          const messageParagraph = document.createElement("p");
          messageParagraph.innerHTML = `${text}`;
          messageParagraph.classList.add("move-it-operator-message-text");
          messageContainer.appendChild(messageParagraph); // Add the text to the message container
        } else {
          const messageParagraph = document.createElement("p");
          messageParagraph.innerHTML = `${text}`;
          messageContainer.appendChild(messageParagraph); // Add the text to the message container
        }

        chatBodyContainer.appendChild(messageContainer);

        // Use requestAnimationFrame to trigger the animation
        requestAnimationFrame(() => {
          messageContainer.classList.add("visible"); // Add the visible class to trigger the animation
        });

        // Auto scroll to the end of the chat
        chatBodyContainer.scrollTop = chatBodyContainer.scrollHeight;
      }

      // Save a new chat message into the database
      async function saveMessage(type, text) {
        try {
          await db.chatTable.add({
            type: type,
            text: text,
            timestamp: Date.now(),
          });
        } catch (error) {
          console.error("Error saving chat message:", error);
        }
      }

      // Load chat messages from the database and display them
      async function loadChatMessages() {
        try {
          const messages = await db.chatTable.orderBy("timestamp").toArray();
          messages.forEach((message) => {
            const sender = message.type === "user-message" ? "You" : "Move It";
            addMessage(sender, message.text, message.type);
          });
        } catch (error) {
          console.error("Error loading chat messages:", error);
        }
      }

      // Load chat window state from the database
      async function loadChatWindowState() {
        try {
          const state = await db.chatWindowState.toArray();
          return state.length > 0 ? state[0].state : "wrapped"; // Default to "wrapped" on success
        } catch (error) {
          console.error("Error loading chat window state:", error);
          return "wrapped"; // Default to "wrapped" on error
        }
      }

      // Save chat window state to the database
      async function saveChatWindowState(state) {
        try {
          await db.chatWindowState.clear(); // Clear existing state to avoid duplicates
          await db.chatWindowState.add({ state: state });
        } catch (error) {
          console.error("Error saving chat window state:", error);
        }
      }

      let userState = {
        inquiringAboutPacking: false,
        inquiringAboutPackingDetailed: false,
        inquiringAboutWhyChooseMoveIt: false,
        inquiringAboutSpecialItems: false,
      };

      // Function to generate a response based on user input
      function generateResponse(userInput) {
        // Normalize user input to lowercase for easier comparison
        const lowerInput = userInput.toLowerCase();

        // English

        // Greeting response
        if (
          lowerInput.includes("hello") ||
          lowerInput === "hi" ||
          lowerInput.includes("hi ") ||
          lowerInput.includes("hi,") ||
          lowerInput.includes("hi.") ||
          lowerInput.includes("hi!") ||
          lowerInput.includes("good morning") ||
          lowerInput.includes("good day") ||
          lowerInput.includes("good evening") ||
          lowerInput.includes("greetings") ||
          lowerInput.includes("hey") ||
          lowerInput.includes("what's up") ||
          lowerInput.includes("howdy") ||
          lowerInput.includes("salutations") ||
          lowerInput.includes("welcome")
        ) {
          return "Hello! Welcome to Move It! How can I assist you with your moving needs today?";
        }

        // Help response
        else if (lowerInput.includes("help")) {
          return "Sure! What do you need help with regarding your move? We offer a range of services to make your relocation seamless.";
        }

        // Thank you response
        else if (
          lowerInput.includes("thank you") ||
          lowerInput.includes("thanks") ||
          lowerInput.includes("appreciate it") ||
          lowerInput.includes("grateful")
        ) {
          return "You're welcome! If you have any more questions about our moving services, feel free to ask.";
        }

        // Additional Thank you response
        else if (
          lowerInput.includes("thanks for your help") ||
          lowerInput.includes("thank you for your assistance") ||
          lowerInput.includes("appreciate your help")
        ) {
          return "I'm glad I could help! If you have any more questions, just let me know.";
        }

        // Response to a compliment
        if (
          lowerInput.includes("that's really nice") ||
          lowerInput.includes("that's beautiful")
        ) {
          return "Thank you! We're glad you like it! If you have any more questions or need help, feel free to reach out.";
        }

        // Response to a compliment about kindness
        if (
          lowerInput.includes("you are kind") ||
          lowerInput.includes("you're kind") ||
          lowerInput.includes("you are very kind") ||
          lowerInput.includes("you're very kind") ||
          lowerInput.includes("you are really kind") ||
          lowerInput.includes("you're really kind") ||
          lowerInput.includes("you are really nice") ||
          lowerInput.includes("you're really nice") ||
          lowerInput.includes("you are so kind") ||
          lowerInput.includes("you're so kind") ||
          lowerInput.includes("you are quite kind") ||
          lowerInput.includes("you're quite kind") ||
          lowerInput.includes("you are truly kind") ||
          lowerInput.includes("you're truly kind") ||
          lowerInput.includes("you are really sweet") ||
          lowerInput.includes("you're really sweet") ||
          lowerInput.includes("you are kind person") ||
          lowerInput.includes("you're kind person") ||
          lowerInput.includes("you are such a nice person") ||
          lowerInput.includes("you're such a nice person") ||
          lowerInput.includes("you are kind-hearted") ||
          lowerInput.includes("you're kind-hearted") ||
          lowerInput.includes("you are really thoughtful") ||
          lowerInput.includes("you're really thoughtful") ||
          lowerInput.includes("you are exceptionally kind") ||
          lowerInput.includes("you're exceptionally kind") ||
          lowerInput.includes("you are the kindest") ||
          lowerInput.includes("you're the kindest") ||
          lowerInput.includes("that is very kind of you") ||
          lowerInput.includes("that's very kind of you") ||
          lowerInput.includes("that is kind of you") ||
          lowerInput.includes("that's kind of you")
        ) {
          return "Thank you! I'm always happy to help! If you have more questions, feel free to ask.";
        }

        // Farewell responses
        else if (
          lowerInput.includes("bye") ||
          lowerInput.includes("goodbye") ||
          lowerInput.includes("see you later") ||
          lowerInput.includes("take care") ||
          lowerInput.includes("farewell") ||
          lowerInput.includes("catch you later")
        ) {
          return "Goodbye! Have a great day, and remember, moving can be joyful with the right help!";
        }

        // Additional Farewell responses
        else if (
          lowerInput.includes("see you soon") ||
          lowerInput.includes("until next time") ||
          lowerInput.includes("good night")
        ) {
          return "See you soon!";
        }

        // Well-being response
        else if (
          lowerInput.includes("how are you") ||
          lowerInput.includes("how's it going") ||
          lowerInput.includes("how are you doing") ||
          lowerInput.includes("what's going on") ||
          lowerInput.includes("how have you been")
        ) {
          return "Everything is great, thank you! How about you?";
        }

        // Response for when the client says they are doing great too
        else if (
          lowerInput.includes("i am doing great") ||
          lowerInput.includes("doing great") ||
          lowerInput.includes("i'm doing well") ||
          lowerInput.includes("doing well") ||
          lowerInput.includes("i feel great") ||
          lowerInput.includes("feeling great") ||
          lowerInput.includes("i'm good") ||
          lowerInput.includes("good too") ||
          lowerInput.includes("i'm fine") ||
          lowerInput.includes("fine too") ||
          lowerInput.includes("everything's good") ||
          lowerInput.includes("everything's great") ||
          lowerInput.includes("i'm happy") ||
          lowerInput.includes("happy too") ||
          lowerInput.includes("i'm doing fantastic") ||
          lowerInput.includes("doing fantastic") ||
          lowerInput.includes("i'm excellent") ||
          lowerInput.includes("excellent too") ||
          lowerInput.includes("i'm all right") ||
          lowerInput.includes("all right too")
        ) {
          return "I'm glad to hear that! If there's anything specific you'd like to know about our moving services or if you have any questions, feel free to ask!";
        }

        // Additional Greeting responses
        else if (
          lowerInput.includes("what's new") ||
          lowerInput.includes("how's everything") ||
          lowerInput.includes("how's life") ||
          lowerInput.includes("what's happening")
        ) {
          return "Not much, just here to help you with your moving needs! What can I assist you with today?";
        }

        // Additional Well-being response
        else if (
          lowerInput.includes("how's your day") ||
          lowerInput.includes("how's your week") ||
          lowerInput.includes("how are things")
        ) {
          return "My day is going well, thank you! How can I assist you today?";
        }

        // Identity response
        else if (
          lowerInput.includes("what is your name") ||
          lowerInput.includes("what's your name") ||
          lowerInput.includes("who are you") ||
          lowerInput.includes("introduce yourself") ||
          lowerInput.includes("tell me your name")
        ) {
          return "My name is Zane. I am a representative of Move It, your assistant for all your moving needs! How can I help you today?";
        }

        // Additional Identity response
        else if (
          lowerInput.includes("what do you do") ||
          lowerInput.includes("what's your role") ||
          lowerInput.includes("what's your purpose")
        ) {
          return "I'm here to assist you with all your moving needs and provide information about our services!";
        }

        // Capabilities response
        else if (
          lowerInput.includes("what can you do") ||
          lowerInput.includes("capabilities") ||
          lowerInput.includes("what services") ||
          lowerInput.includes("services you offer") ||
          lowerInput.includes("what services do you provide")
        ) {
          return "I can assist you with various moving queries, from local to long-distance moves, packing, and more. Just ask!";
        }

        // Additional Capabilities response
        else if (
          lowerInput.includes("what services can you provide") ||
          lowerInput.includes("how can you assist me") ||
          lowerInput.includes("what are your features")
        ) {
          return "I can help with inquiries about moving logistics, packing, storage, and more. Just let me know what you need!";
        }

        // Response for why to choose Move It
        else if (
          lowerInput.includes("why should i choose move it") ||
          lowerInput.includes("why choose move it") ||
          lowerInput.includes("reasons to choose move it")
        ) {
          userState.inquiringAboutWhyChooseMoveIt = true;
          return "Choosing Move It means you get a dedicated team committed to making your move as smooth as possible. We offer personalized service, experienced professionals, and a range of options tailored to your needs. Our transparent pricing, excellent customer support, and commitment to safety ensure that your belongings are in good hands. Would you like to know more about our specific services?";
        }

        // Follow-up response for why to choose Move It
        else if (
          userState.inquiringAboutWhyChooseMoveIt &&
          lowerInput.includes("yes")
        ) {
          return "I can assist you with various moving queries, from local to long-distance moves, packing, and more. Just ask!";
        }

        // Joke response
        else if (lowerInput.includes("tell me a joke")) {
          return "Why do movers make great friends? Because they always know how to lift your spirits!";
        }

        // Weather response
        else if (lowerInput.includes("weather")) {
          return "I can't check the weather right now, but it's always a good idea to plan your move on a clear day!";
        }

        // Additional Weather response
        else if (lowerInput.includes("forecast")) {
          return "I can't provide the forecast, but it's always wise to check the weather before planning your move!";
        }

        // News response
        else if (lowerInput.includes("news")) {
          return "I can't provide news updates, but you can check your favorite news website for the latest!";
        }

        // Additional Help response
        else if (lowerInput.includes("assistance")) {
          return "Of course! What specific assistance do you need with your move? I'm here to help!";
        }

        // Moving services response
        else if (
          lowerInput.includes("moving services") ||
          lowerInput.includes("moving help") ||
          lowerInput.includes("moving options") ||
          lowerInput.includes("relocation services")
        ) {
          return "We offer a range of moving services, including local and long-distance moves, packing, and unpacking. How can I assist you with your move?";
        }

        // Moving options response
        else if (
          lowerInput.includes("options for moving") ||
          lowerInput.includes("moving options") ||
          lowerInput.includes("what can i choose") ||
          lowerInput.includes("what are my choices") ||
          lowerInput.includes("what services do you offer")
        ) {
          return "We offer a full range of moving solutions, including <a href='https://primesolar.github.io/move-it/local-moving.html' rel='noopener noreferrer'><strong>local moves</strong></a>, <a href='https://primesolar.github.io/move-it/long-distance-moving.html' rel='noopener noreferrer'><strong>long‑distance relocations</strong></a>, <a href='https://primesolar.github.io/move-it/professional-packing.html' rel='noopener noreferrer'><strong>packing</strong></a>, <a href='https://primesolar.github.io/move-it/faqs.html' rel='noopener noreferrer'><strong>storage</strong></a>, <a href='https://primesolar.github.io/move-it/faqs.html' rel='noopener noreferrer'><strong>furniture disassembly/re‑assembly</strong></a>, and <a href='https://primesolar.github.io/move-it/commercial-moving.html' rel='noopener noreferrer'><strong>commercial/office moves</strong></a>.";
        }

        // Local moving response
        if (
          lowerInput.includes(
            "what can you tell me about the moving within a city"
          ) ||
          lowerInput.includes("can you tell me about moving in the city") ||
          lowerInput.includes("tell me about local moving") ||
          lowerInput.includes("what services do you offer for city moves") ||
          lowerInput.includes("what can you tell me about urban moving") ||
          lowerInput.includes("info about moving within a city") ||
          lowerInput.includes("moving services in the city") ||
          lowerInput.includes("details about local moving") ||
          lowerInput.includes("what do you provide for city relocations") ||
          lowerInput.includes("about moving in my city") ||
          lowerInput.includes("how do you handle local moves") ||
          lowerInput.includes("what's included in local moving services") ||
          lowerInput.includes("explain moving within a city") ||
          lowerInput.includes("what are your local moving options") ||
          lowerInput.includes("how does local moving work") ||
          lowerInput.includes("can you provide details on city moves") ||
          lowerInput.includes("describe your services for local moves")
        ) {
          return "We provide various local moving services tailored to your needs. This includes <a href='https://primesolar.github.io/move-it/professional-packing.html' rel='noopener noreferrer'><strong>professional packing</strong></a>, <a href='https://primesolar.github.io/move-it/faqs.html' rel='noopener noreferrer'><strong>furniture disassembly/re-assembly</strong></a>, and <a href='https://primesolar.github.io/move-it/contact.html' rel='noopener noreferrer'><strong>flexible scheduling options</strong></a> to make your move as smooth as possible. If you have specific questions or need more information, feel free to ask!";
        }

        // Storage options response
        else if (lowerInput.includes("storage options")) {
          return "We provide secure storage solutions for items you may not need immediately at your new location. Would you like to know more?";
        }

        // Additional Storage options response
        else if (lowerInput.includes("temporary storage")) {
          return "We offer temporary storage solutions for your belongings during the moving process. Would you like more details?";
        }

        // Packing response
        else if (
          lowerInput === "packing" ||
          lowerInput.includes(" packing") ||
          lowerInput.includes("packaging")
        ) {
          userState.inquiringAboutPacking = true;
          return "Our team offers comprehensive packing services to ensure your belongings are safe and organized during the move. Would you like to learn more?";
        }

        // Follow-up response for packing services
        else if (
          userState.inquiringAboutPacking &&
          !userState.inquiringAboutPackingDetailed &&
          lowerInput.includes("yes")
        ) {
          userState.inquiringAboutPackingDetailed = true;
          return "Great! Our packing services include professional packing of your belongings, providing high-quality packing materials, and ensuring everything is securely packed for transport. We can also assist with unpacking at your new location. Would you like to schedule a consultation or get a quote?";
        }

        // Follow-up response for packing services
        else if (
          userState.inquiringAboutPacking &&
          userState.inquiringAboutPackingDetailed &&
          lowerInput.includes("yes")
        ) {
          return "You can schedule a consultation or get a quote by contacting us via the email address <a href='mailto:contact@move-it.com' rel='noopener noreferrer'>contact@move-it.com</a> or the phone number <a href='tel:+442012345678' rel='noopener noreferrer'>+44 20 1234 5678</a>. Our office is located at 123 Victoria St, London SW1E 6DE, United Kingdom. We're here to assist you with any questions!";
        }

        // Follow-up response for packing services
        else if (
          /\bno\b/.test(lowerInput) ||
          lowerInput.includes("not interested")
        ) {
          userState.inquiringAboutPacking = false;
          userState.inquiringAboutPackingDetailed = false;
          userState.inquiringAboutWhyChooseMoveIt = false;
          userState.inquiringAboutSpecialItems = false;
          return "No problem! If you have any other questions or need assistance with something else, feel free to ask.";
        }

        // Additional Packing response
        else if (lowerInput.includes("packing help")) {
          return "We can provide packing help to ensure your items are secure and organized. Would you like to know more about this service?";
        }

        // Commercial moving response
        else if (lowerInput.includes("commercial moving")) {
          return "We specialize in commercial moving services tailored to businesses. Let us know if you need assistance with your office relocation!";
        }

        // Additional Commercial moving response
        else if (lowerInput.includes("business relocation")) {
          return "We specialize in business relocations and can help ensure a smooth transition for your company. How can we assist you?";
        }

        // Booking response
        else if (lowerInput.includes("book")) {
          return "Booking a move with us is easy! Just contact our customer service team with details about your move, and we'll provide a quote and schedule it at your convenience.";
        }

        // Additional Booking response
        else if (lowerInput.includes("schedule a move")) {
          return "Scheduling a move with us is simple! Just provide your details to our customer service team, and we'll take care of the rest.";
        }

        // Additional Preparation response
        else if (lowerInput.includes("checklist")) {
          return "Using a moving checklist is a great way to stay organized. You can find it on our <a href='https://primesolar.github.io/move-it/checklist.html' rel='noreferrer noopener'>Moving Checklist</a> webpage.";
        }

        // Preparation response
        else if (
          lowerInput.includes("prepare for") ||
          lowerInput.includes("how to prepare")
        ) {
          return "To prepare for your move, start by decluttering and packing an essentials box. Schedule your move with us in advance to ensure availability.";
        }

        // Cost response
        else if (
          lowerInput.includes("how much") ||
          lowerInput.includes("pricing") ||
          lowerInput.includes("cost")
        ) {
          return "The cost of a move varies based on factors like service type, distance, and property size. Contact us for a free, no-obligation quote!";
        }

        // Additional Cost response
        else if (lowerInput.includes("estimate")) {
          return "For an accurate estimate, please provide details about your move, and we'll get back to you with a quote!";
        }

        // Discounts response
        else if (
          lowerInput.includes("discount") ||
          lowerInput.includes("promotion")
        ) {
          return "Yes, we offer various discounts and promotions to make your move more affordable, including seasonal offers and referral discounts. Be sure to ask about any ongoing promotions when you get a quote!";
        }

        // Additional Discounts response
        else if (lowerInput.includes("special offers")) {
          return "We often have special offers available. Be sure to ask about any current promotions when you contact us!";
        }

        // Contact response
        else if (
          lowerInput.includes("contact") ||
          lowerInput.includes("email") ||
          lowerInput.includes("phone")
        ) {
          return "You can reach us via email at <a href='mailto:contact@move-it.com' rel='noopener noreferrer'>contact@move-it.com</a> or call us at <a href='tel:+442012345678' rel='noopener noreferrer'>+44 20 1234 5678</a>. Our office is located at 123 Victoria St, London SW1E 6DE, United Kingdom. We're here to help!";
        }

        // Additional Contact response
        else if (lowerInput.includes("reach out")) {
          return "You can reach out to us via the email address <a href='mailto:contact@move-it.com' rel='noopener noreferrer'>contact@move-it.com</a> or the phone number <a href='tel:+442012345678' rel='noopener noreferrer'>+44 20 1234 5678</a>. Our office is located at 123 Victoria St, London SW1E 6DE, United Kingdom. We're here to assist you with any questions!";
        }

        // Moving timeline response
        else if (
          lowerInput.includes("how long does it take") ||
          lowerInput.includes("moving timeline") ||
          lowerInput.includes("moving duration")
        ) {
          return "The duration of a move can vary based on distance and the amount of belongings. Typically, local moves can be completed in a day, while long-distance moves may take several days. Would you like a more specific estimate?";
        }

        // Insurance response
        else if (lowerInput.includes("insurance")) {
          return "We offer various insurance options to protect your belongings during the move. It's important to discuss these options with our team to find the best coverage for your needs.";
        }

        // Moving supplies response
        else if (
          lowerInput.includes("moving supplies") ||
          lowerInput.includes("boxes") ||
          lowerInput.includes("packing materials")
        ) {
          return "We provide a range of moving supplies, including boxes, tape, and packing materials. Would you like to know more about our supply options?";
        }

        // Special items response
        else if (
          lowerInput.includes("special items") ||
          lowerInput.includes("fragile") ||
          lowerInput.includes("musical instrument") ||
          lowerInput.includes("guitar") ||
          lowerInput.includes("violin") ||
          lowerInput.includes("trumpet") ||
          lowerInput.includes("drum") ||
          lowerInput.includes("piano") ||
          lowerInput.includes("artwork") ||
          lowerInput.includes("work of art") ||
          lowerInput.includes("works of art") ||
          lowerInput.includes("piece of art") ||
          lowerInput.includes("pieces of art") ||
          lowerInput.includes("antiques")
        ) {
          userState.inquiringAboutSpecialItems = true;
          return "We have experience handling special items like musical instruments, artwork, and antiques. Our team takes extra care to ensure these items are safely transported. Would you like to learn more?";
        }

        // Response for handling special items
        else if (
          (userState.inquiringAboutSpecialItems &&
            lowerInput.includes("yes")) ||
          lowerInput.includes("i have") ||
          lowerInput.includes("specific items")
        ) {
          return "That's great! I can provide more details on how we handle special items. For example, we have special packing techniques for pianos and artwork to ensure they arrive safely.";
        }

        // Response for asking about handling processes
        else if (
          (userState.inquiringAboutSpecialItems &&
            lowerInput.includes("how do you handle")) ||
          lowerInput.includes("what's your process")
        ) {
          return "We use specialized packing materials and techniques to protect special items during transport. Our team is trained to handle fragile and valuable items with care, ensuring they are securely packed and transported.";
        }

        // Response for no special items
        else if (
          userState.inquiringAboutSpecialItems &&
          lowerInput.includes("i don't have any")
        ) {
          userState.inquiringAboutSpecialItems = false;
          return "No problem! If you have any other questions about our moving services or need assistance with your move, feel free to ask!";
        }

        // Moving tips response
        else if (lowerInput.includes("moving tips")) {
          return "Here are some quick moving tips: start packing early, label your boxes, and keep important documents separate. Would you like more detailed advice?";
        }

        // Service areas response
        else if (
          lowerInput.includes("service areas") ||
          lowerInput.includes("locations")
        ) {
          return "We serve a wide range of areas! Please let us know your current location and destination, and we can confirm if we can assist you.";
        }

        // Payment options response
        else if (
          lowerInput.includes("payment options") ||
          lowerInput.includes("pay")
        ) {
          return "We accept various payment methods, including credit cards, bank transfers, and cash. Please ask our team for more details during the booking process.";
        }

        // Cancellation policy response
        else if (
          lowerInput.includes("cancellation policy") ||
          lowerInput.includes("cancel")
        ) {
          return "We understand that plans can change. Our cancellation policy allows you to cancel or reschedule your move with a notice period. Please contact us for specific details.";
        }

        // Moving day procedures response
        else if (
          lowerInput.includes("moving day") ||
          lowerInput.includes("what to expect")
        ) {
          return "On moving day, our team will arrive on time, ready to pack and load your belongings. We'll keep you informed throughout the process. Do you have any specific concerns about moving day?";
        }

        // Eco-friendly options response
        else if (
          lowerInput.includes("eco-friendly") ||
          lowerInput.includes("sustainable")
        ) {
          return "We offer eco-friendly moving options, including reusable packing materials and sustainable practices. Let us know if you're interested in our green moving solutions!";
        }

        // International moving response
        else if (
          lowerInput.includes("international moving") ||
          lowerInput.includes("overseas")
        ) {
          return "We can assist with international moves as well! Our team is experienced in handling customs and logistics for overseas relocations. Would you like more information?";
        }

        // Additional International moving response
        else if (
          lowerInput.includes("move abroad") ||
          lowerInput.includes("moving abroad") ||
          lowerInput.includes("relocate internationally") ||
          lowerInput.includes("relocating internationally") ||
          lowerInput.includes("overseas move")
        ) {
          return "Moving abroad can be an exciting adventure! We can help you navigate the logistics and paperwork involved. What specific information do you need?";
        }

        // Customs response
        else if (lowerInput.includes("customs regulations")) {
          return "Understanding customs regulations is important for international moves. We can provide guidance on what items are allowed and any necessary documentation.";
        }

        // Visa response
        else if (
          lowerInput.includes("visa requirements") ||
          lowerInput.includes("information about visa") ||
          lowerInput.includes("visa information") ||
          lowerInput.includes("learn about visa") ||
          lowerInput.includes("tell me about visa") ||
          lowerInput.includes("tell about visa") ||
          lowerInput.includes("talk about visa") ||
          lowerInput.includes("question about visa") ||
          lowerInput.includes("questions about visa") ||
          lowerInput.includes("visa question") ||
          lowerInput.includes("conversation about visa") ||
          lowerInput.includes("get visa")
        ) {
          return "Visa requirements vary by country. It's important to check the specific regulations for your destination. Would you like assistance with this?";
        }

        // International shipping response
        else if (lowerInput.includes("international shipping")) {
          return "We offer international shipping services to ensure your belongings arrive safely at your new home. Would you like to know more about our shipping options?";
        }

        // Language support response
        else if (lowerInput.includes("language assistance")) {
          return "Moving to a new country often involves language barriers. We can provide resources or recommendations for language assistance services.";
        }

        // Cultural adjustment response
        else if (lowerInput.includes("cultural adjustment")) {
          return "We can offer tips and resources to help you settle in smoothly. Would you like more information?";
        }

        // International insurance response
        else if (lowerInput.includes("international insurance")) {
          return "We recommend looking into international insurance options to protect your belongings during the move. Would you like assistance in finding the right coverage?";
        }

        // Packing for international move response
        else if (lowerInput.includes("packing for international move")) {
          return "Packing for an international move requires special considerations. We can provide tips on how to pack efficiently and securely for long-distance transport.";
        }

        // Moving with pets response
        else if (
          lowerInput.includes("pets") ||
          lowerInput.includes("moving with pets")
        ) {
          return "Moving with pets requires special considerations. We can provide tips and resources to help ensure a smooth transition for your furry friends. Would you like to know more?";
        }

        // Moving for seniors response
        else if (
          lowerInput.includes("seniors") ||
          lowerInput.includes("senior moving")
        ) {
          return "We understand that moving can be particularly challenging for seniors. Our team is trained to provide compassionate and respectful assistance. How can we help with your senior move?";
        }

        // Corporate relocation response
        else if (
          lowerInput.includes("corporate relocation") ||
          lowerInput.includes("employee moving")
        ) {
          return "We specialize in corporate relocations and can assist with employee moves, ensuring a smooth transition for your staff. Let us know how we can help!";
        }

        // Last-minute moving tips response
        else if (
          lowerInput.includes("last minute tips") ||
          lowerInput.includes("emergency move")
        ) {
          return "For last-minute moves, focus on essentials: pack a suitcase with clothes, gather important documents, and ensure you have a plan for your moving day. Need more specific advice?";
        }

        // Moving with plants response
        else if (lowerInput.includes("plants")) {
          return "Moving plants requires special care. Consider how to protect them during transport. Would you like tips on specific types of plants?";
        }

        // Moving furniture response
        else if (
          lowerInput.includes("furniture") ||
          lowerInput.includes("heavy items") ||
          lowerInput.includes("large items")
        ) {
          return "We have the right equipment and trained staff to handle heavy furniture and large items safely. Do you have specific pieces in mind that you need help with?";
        }

        // Unpacking services response
        else if (lowerInput.includes("unpacking")) {
          return "Our team can assist with unpacking your belongings and setting up your new space. Would you like to know more about this service?";
        }

        // Moving during peak season response
        else if (
          lowerInput.includes("peak season") ||
          lowerInput.includes("busy season")
        ) {
          return "Moving during peak season can be more challenging due to higher demand. It's best to book your move well in advance. Do you have specific dates in mind?";
        }

        // Moving for students response
        else if (
          lowerInput.includes("student") ||
          lowerInput.includes("college")
        ) {
          return "We offer special services for student moves, including flexible scheduling and affordable rates. How can I assist you with your relocation?";
        }

        // Moving contracts response
        else if (
          lowerInput.includes("contract") ||
          lowerInput.includes("moving agreement")
        ) {
          return "Before your move, we provide a detailed contract outlining services, costs, and terms. It's important to read this carefully. Do you have questions about any specific terms?";
        }

        // Moving equipment response
        else if (
          lowerInput.includes("moving equipment") ||
          lowerInput.includes("tools")
        ) {
          return "We use specialized moving equipment to ensure your belongings are transported safely. Would you like to know more about our equipment?";
        }

        // Local moving regulations response
        else if (
          lowerInput.includes("local regulations") ||
          lowerInput.includes("local laws") ||
          lowerInput.includes("moving regulations") ||
          lowerInput.includes("moving laws")
        ) {
          return "Different areas may have specific regulations regarding moving. It's best to check with local authorities.";
        }

        // Français

        // Réponse de salutation
        if (
          lowerInput.includes("bonjour") ||
          lowerInput === "salut" ||
          lowerInput.includes("salut ") ||
          lowerInput.includes("salut,") ||
          lowerInput.includes("salut.") ||
          lowerInput.includes("salut!") ||
          lowerInput.includes("bonjour matin") ||
          lowerInput.includes("bonne journée") ||
          lowerInput.includes("bonne journee") ||
          lowerInput.includes("bonsoir") ||
          lowerInput.includes("hé") ||
          lowerInput.includes("quoi de neuf") ||
          lowerInput.includes("bienvenue")
        ) {
          return "Bonjour ! Bienvenue chez Move It ! Comment puis-je vous aider avec vos besoins de déménagement aujourd'hui ?";
        }

        // Réponse d'aide
        else if (lowerInput.includes("aide")) {
          return "Bien sûr ! De quoi avez-vous besoin d'aide concernant votre déménagement ? Nous offrons une gamme de services pour rendre votre déménagement sans tracas.";
        }

        // Réponse de remerciement
        else if (
          lowerInput.includes("merci") ||
          lowerInput.includes("je vous remercie") ||
          lowerInput.includes("je l'apprécie") ||
          lowerInput.includes("reconnaissant")
        ) {
          return "De rien ! Si vous avez d'autres questions sur nos services de déménagement, n'hésitez pas à demander.";
        }

        // Réponse de remerciement supplémentaire
        else if (
          lowerInput.includes("merci pour votre aide") ||
          lowerInput.includes("je vous remercie pour votre assistance") ||
          lowerInput.includes("j'apprécie votre aide") ||
          lowerInput.includes("j'apprecie votre aide")
        ) {
          return "Je suis heureux d'avoir pu vous aider ! Si vous avez d'autres questions, faites-le moi savoir.";
        }

        // Réponse à un compliment
        if (
          lowerInput.includes("c'est vraiment beau") ||
          lowerInput.includes("c'est vraiment joli")
        ) {
          return "Merci! Nous sommes ravis que cela vous plaise! Si vous avez d'autres questions ou besoin d'aide, n'hésitez pas à nous contacter.";
        }

        // Réponse à un compliment sur la gentillesse
        if (
          lowerInput.includes("vous êtes gentils") ||
          lowerInput.includes("vous êtes très gentils") ||
          lowerInput.includes("vous êtes vraiment gentils") ||
          lowerInput.includes("vous êtes adorables") ||
          lowerInput.includes("tu es gentil") ||
          lowerInput.includes("tu es vraiment gentil") ||
          lowerInput.includes("tu es très gentil")
        ) {
          return "Merci beaucoup! Je suis toujours content d'aider! Si vous avez d'autres questions, n'hésitez pas à demander.";
        }

        // Réponses d'adieu
        else if (
          lowerInput.includes("au revoir") ||
          lowerInput.includes("adieu") ||
          lowerInput.includes("à bientôt") ||
          lowerInput.includes("a bientôt") ||
          lowerInput.includes("prenez soin de vous") ||
          lowerInput.includes("au revoir") ||
          lowerInput.includes("à la prochaine") ||
          lowerInput.includes("a la prochaine")
        ) {
          return "Au revoir ! Passez une excellente journée, et rappelez-vous, déménager peut être joyeux avec la bonne aide !";
        }

        // Réponses d'adieu supplémentaires
        else if (
          lowerInput.includes("à bientôt") ||
          lowerInput.includes("a bientot") ||
          lowerInput.includes("jusqu'à la prochaine fois") ||
          lowerInput.includes("jusqu'a la prochaine fois") ||
          lowerInput.includes("bonne nuit")
        ) {
          return "À bientôt !";
        }

        // Réponse de bien-être
        else if (
          lowerInput.includes("ça va?") ||
          lowerInput.includes("ca va?") ||
          lowerInput.includes("comment ça va") ||
          lowerInput.includes("comment ca va") ||
          lowerInput.includes("comment ça se passe") ||
          lowerInput.includes("comment ca se passe") ||
          lowerInput.includes("comment allez-vous") ||
          lowerInput.includes("quoi de neuf") ||
          lowerInput.includes("comment avez-vous été") ||
          lowerInput.includes("comment avez-vous ete")
        ) {
          return "Tout va bien, merci ! Et vous ?";
        }

        // Réponse pour quand le client dit qu'il va bien aussi
        else if (
          lowerInput.includes("ça va") ||
          lowerInput.includes("ca va") ||
          lowerInput.includes("ça va bien") ||
          lowerInput.includes("ca va bien") ||
          lowerInput.includes("je vais bien aussi") ||
          lowerInput.includes("je vais bien") ||
          lowerInput.includes("je me sens bien") ||
          lowerInput.includes("je me sens super") ||
          lowerInput.includes("je suis content") ||
          lowerInput.includes("tout va bien") ||
          lowerInput.includes("je suis heureux") ||
          lowerInput.includes("je vais très bien") ||
          lowerInput.includes("je vais tres bien") ||
          lowerInput.includes("je suis excellent") ||
          lowerInput.includes("je vais bien aussi")
        ) {
          return "Je suis content de l'entendre ! Si vous avez des questions spécifiques sur nos services de déménagement ou si vous avez des questions, n'hésitez pas à demander !";
        }

        // Réponses de salutation supplémentaires
        else if (
          lowerInput.includes("quoi de neuf") ||
          lowerInput.includes("comment ça va") ||
          lowerInput.includes("comment ca va") ||
          lowerInput.includes("comment va la vie") ||
          lowerInput.includes("qu'est-ce qui se passe")
        ) {
          return "Pas grand-chose, je suis juste ici pour vous aider avec vos besoins de déménagement ! Comment puis-je vous aider aujourd'hui ?";
        }

        // Réponse de bien-être supplémentaire
        else if (
          lowerInput.includes("comment se passe votre journée") ||
          lowerInput.includes("comment se passe votre journee") ||
          lowerInput.includes("comment se passe votre semaine") ||
          lowerInput.includes("comment ça va") ||
          lowerInput.includes("comment ca va")
        ) {
          return "Ma journée se passe bien, merci ! Comment puis-je vous aider aujourd'hui ?";
        }

        // Réponse d'identité
        else if (
          lowerInput.includes("quel est votre nom") ||
          lowerInput.includes("quel est ton nom") ||
          lowerInput.includes("comment t'appelles-tu") ||
          lowerInput.includes("qui êtes-vous") ||
          lowerInput.includes("qui etes-vous") ||
          lowerInput.includes("qui es-tu") ||
          lowerInput.includes("présentez-vous") ||
          lowerInput.includes("presentez-vous") ||
          lowerInput.includes("présente-toi") ||
          lowerInput.includes("presente-toi") ||
          lowerInput.includes("dis-moi ton nom") ||
          lowerInput.includes("répéter votre nom") ||
          lowerInput.includes("repeter votre nom") ||
          lowerInput.includes("répéter ton nom") ||
          lowerInput.includes("repeter ton nom")
        ) {
          return "Je m'appelle Zane. Je suis un représentant de Move It, votre assistant pour tous vos besoins de déménagement ! Comment puis-je vous aider aujourd'hui ?";
        }

        // Réponse d'identité supplémentaire
        else if (
          lowerInput.includes("que fais-tu") ||
          lowerInput.includes("quel est ton rôle") ||
          lowerInput.includes("quel est ton role") ||
          lowerInput.includes("quel est ton but")
        ) {
          return "Je suis ici pour vous aider avec tous vos besoins de déménagement et fournir des informations sur nos services !";
        }

        // Réponse sur les capacités
        else if (
          lowerInput.includes("que peux-tu faire") ||
          lowerInput.includes("capacités") ||
          lowerInput.includes("capacites") ||
          lowerInput.includes("quels services") ||
          lowerInput.includes("services que tu offres") ||
          lowerInput.includes("quels services proposes-tu")
        ) {
          return "Je peux vous aider avec diverses questions sur le déménagement, des déménagements locaux aux déménagements longue distance, en passant par l'emballage et plus encore. Il suffit de demander !";
        }

        // Réponse supplémentaire sur les capacités
        else if (
          lowerInput.includes("quels services peux-tu fournir") ||
          lowerInput.includes("comment peux-tu m'aider") ||
          lowerInput.includes("quelles sont tes fonctionnalités") ||
          lowerInput.includes("quelles sont tes fonctionnalites")
        ) {
          return "Je peux vous aider avec des questions sur la logistique de déménagement, l'emballage, le stockage et plus encore. Faites-moi savoir ce dont vous avez besoin !";
        }

        // Réponse sur pourquoi choisir Move It
        else if (
          lowerInput.includes("pourquoi devrais-je choisir move it") ||
          lowerInput.includes("pourquoi choisir move it") ||
          lowerInput.includes("raisons de choisir move it")
        ) {
          userState.inquiringAboutWhyChooseMoveIt = true;
          return "Choisir Move It signifie que vous bénéficiez d'une équipe dédiée à rendre votre déménagement aussi fluide que possible. Nous offrons un service personnalisé, des professionnels expérimentés et une gamme d'options adaptées à vos besoins. Nos prix transparents, notre excellent service client et notre engagement envers la sécurité garantissent que vos biens sont entre de bonnes mains. Souhaitez-vous en savoir plus sur nos services spécifiques ?";
        }

        // Réponse de suivi sur pourquoi choisir Move It
        else if (
          userState.inquiringAboutWhyChooseMoveIt &&
          lowerInput.includes("oui")
        ) {
          return "Je peux vous aider avec diverses questions sur le déménagement, des déménagements locaux aux déménagements longue distance, en passant par l'emballage et plus encore. Il suffit de demander !";
        }

        // Réponse de blague
        else if (lowerInput.includes("raconte-moi une blague")) {
          return "Pourquoi les déménageurs sont-ils de grands amis ? Parce qu'ils savent toujours comment remonter le moral !";
        }

        // Réponse météo
        else if (lowerInput.includes("météo") || lowerInput.includes("meteo")) {
          return "Je ne peux pas vérifier la météo en ce moment, mais il est toujours bon de planifier votre déménagement par temps clair !";
        }

        // Réponse météo supplémentaire
        else if (
          lowerInput.includes("prévisions") ||
          lowerInput.includes("previsions")
        ) {
          return "Je ne peux pas fournir les prévisions, mais il est toujours sage de vérifier la météo avant de planifier votre déménagement !";
        }

        // Réponse d'actualités
        else if (
          lowerInput.includes("actualités") ||
          lowerInput.includes("actualites")
        ) {
          return "Je ne peux pas fournir de mises à jour d'actualités, mais vous pouvez consulter votre site d'actualités préféré pour les dernières nouvelles !";
        }

        // Réponse d'aide supplémentaire
        else if (lowerInput.includes("assistance")) {
          return "Bien sûr ! Quelle assistance spécifique avez-vous besoin pour votre déménagement ? Je suis là pour aider !";
        }

        // Réponse sur les services de déménagement
        else if (
          lowerInput.includes("services de déménagement") ||
          lowerInput.includes("services de demenagement") ||
          lowerInput.includes("aide au déménagement") ||
          lowerInput.includes("aide au demenagement") ||
          lowerInput.includes("options de déménagement") ||
          lowerInput.includes("options de demenagement") ||
          lowerInput.includes("services de relocalisation")
        ) {
          return "Nous offrons une gamme de services de déménagement, y compris des déménagements locaux et longue distance, l'emballage et le déballage. Comment puis-je vous aider avec votre déménagement ?";
        }

        // Réponse sur les options de stockage
        else if (lowerInput.includes("options de stockage")) {
          return "Nous proposons des solutions de stockage sécurisées pour les articles dont vous pourriez ne pas avoir besoin immédiatement à votre nouvelle adresse. Souhaitez-vous en savoir plus ?";
        }

        // Réponse supplémentaire sur les options de stockage
        else if (lowerInput.includes("stockage temporaire")) {
          return "Nous offrons des solutions de stockage temporaire pour vos biens pendant le processus de déménagement. Souhaitez-vous plus de détails ?";
        }

        // Réponse sur l'emballage
        else if (
          lowerInput === "emballage" ||
          lowerInput.includes(" emballage") ||
          lowerInput.includes("conditionnement")
        ) {
          userState.inquiringAboutPacking = true;
          return "Notre équipe propose des services d'emballage complets pour garantir que vos biens sont en sécurité et bien organisés pendant le déménagement. Souhaitez-vous en savoir plus ?";
        }

        // Réponse de suivi pour les services d'emballage
        else if (
          userState.inquiringAboutPacking &&
          !userState.inquiringAboutPackingDetailed &&
          lowerInput.includes("oui")
        ) {
          userState.inquiringAboutPackingDetailed = true;
          return "Super ! Nos services d'emballage incluent l'emballage professionnel de vos biens, la fourniture de matériaux d'emballage de haute qualité et l'assurance que tout est bien emballé pour le transport. Nous pouvons également vous aider à déballer à votre nouvelle adresse. Souhaitez-vous planifier une consultation ou obtenir un devis ?";
        }

        // Réponse de suivi pour les services d'emballage
        else if (
          userState.inquiringAboutPacking &&
          userState.inquiringAboutPackingDetailed &&
          lowerInput.includes("oui")
        ) {
          return "Vous pouvez planifier une consultation ou obtenir un devis en nous contactant par e-mail à l'adresse <a href='mailto:contact@move-it.com' rel='noopener noreferrer'>contact@move-it.com</a> ou par téléphone au <a href='tel:+442012345678' rel='noopener noreferrer'>+44 20 1234 5678</a>. Notre bureau est situé au 123 Victoria St, Londres SW1E 6DE, Royaume-Uni. Nous sommes là pour vous aider avec toutes vos questions !";
        }

        // Réponse de suivi pour les services d'emballage
        else if (
          lowerInput.includes("non") ||
          lowerInput.includes("pas intéressé") ||
          lowerInput.includes("pas interesse")
        ) {
          userState.inquiringAboutPacking = false;
          userState.inquiringAboutPackingDetailed = false;
          userState.inquiringAboutWhyChooseMoveIt = false;
          userState.inquiringAboutSpecialItems = false;
          return "Pas de problème ! Si vous avez d'autres questions ou avez besoin d'aide pour autre chose, n'hésitez pas à demander.";
        }

        // Réponse supplémentaire sur l'emballage
        else if (
          lowerInput.includes("aide à l'emballage") ||
          lowerInput.includes("aide a l'emballage")
        ) {
          return "Nous pouvons vous fournir de l'aide pour l'emballage afin de garantir que vos articles sont sécurisés et organisés. Souhaitez-vous en savoir plus sur ce service ?";
        }

        // Réponse sur le déménagement local
        if (
          lowerInput.includes(
            "que pouvez-vous me dire sur le déménagement en ville"
          ) ||
          lowerInput.includes(
            "pouvez-vous me parler des déménagements en ville"
          ) ||
          lowerInput.includes("parlez-moi du déménagement local") ||
          lowerInput.includes(
            "quels services offrez-vous pour les déménagements en ville"
          ) ||
          lowerInput.includes(
            "que pouvez-vous me dire sur le déménagement urbain"
          ) ||
          lowerInput.includes("info sur le déménagement en ville") ||
          lowerInput.includes("services de déménagement en ville") ||
          lowerInput.includes("détails sur le déménagement local") ||
          lowerInput.includes(
            "que fournissez-vous pour les déménagements en ville"
          ) ||
          lowerInput.includes("concernant le déménagement dans ma ville") ||
          lowerInput.includes("comment gérez-vous les déménagements locaux") ||
          lowerInput.includes(
            "qu'est-ce qui est inclus dans les services de déménagement local"
          ) ||
          lowerInput.includes("expliquez le déménagement en ville") ||
          lowerInput.includes(
            "quelles sont vos options de déménagement local"
          ) ||
          lowerInput.includes("comment fonctionne le déménagement local") ||
          lowerInput.includes(
            "pouvez-vous fournir des détails sur les déménagements en ville"
          ) ||
          lowerInput.includes(
            "décrivez vos services pour les déménagements locaux"
          )
        ) {
          return "Nous proposons divers services de déménagement locaux adaptés à vos besoins. Cela inclut <a href='https://primesolar.github.io/move-it/professional-packing.html' rel='noopener noreferrer'><strong>l'emballage professionnel</strong></a>, <a href='https://primesolar.github.io/move-it/faqs.html' rel='noopener noreferrer'><strong>le démontage/remontage de meubles</strong></a>, et <a href='https://primesolar.github.io/move-it/contact.html' rel='noopener noreferrer'><strong>des options de planification flexibles</strong></a> pour rendre votre déménagement aussi fluide que possible. Si vous avez des questions spécifiques ou besoin de plus d'informations, n'hésitez pas à demander!";
        }

        // Réponse sur le déménagement commercial
        else if (
          lowerInput.includes("déménagement commercial") ||
          lowerInput.includes("demenagement commercial")
        ) {
          return "Nous sommes spécialisés dans les services de déménagement commercial adaptés aux entreprises. Faites-nous savoir si vous avez besoin d'aide pour la relocalisation de votre bureau !";
        }

        // Réponse supplémentaire sur le déménagement commercial
        else if (lowerInput.includes("relocalisation d'entreprise")) {
          return "Nous sommes spécialisés dans les relocalisations d'entreprise et pouvons aider à garantir une transition en douceur pour votre société. Comment pouvons-nous vous aider ?";
        }

        // Réponse de réservation
        else if (
          lowerInput.includes("réserver") ||
          lowerInput.includes("réserver")
        ) {
          return "Réserver un déménagement avec nous est facile ! Il vous suffit de contacter notre équipe de service client avec les détails de votre déménagement, et nous vous fournirons un devis et le programmerons à votre convenance.";
        }

        // Réponse supplémentaire sur la réservation
        else if (
          lowerInput.includes("planifier un déménagement") ||
          lowerInput.includes("planifier un demenagement")
        ) {
          return "Planifier un déménagement avec nous est simple ! Il vous suffit de fournir vos détails à notre équipe de service client, et nous nous occuperons du reste.";
        }

        // Réponse supplémentaire sur la préparation
        else if (
          lowerInput.includes("liste de contrôle") ||
          lowerInput.includes("liste de controle")
        ) {
          return "Utiliser une liste de contrôle pour déménagement est un excellent moyen de rester organisé. Vous pouvez la trouver sur notre <a href='https://primesolar.github.io/move-it/checklist.html' rel='noreferrer noopener'>page de liste de contrôle de déménagement</a>.";
        }

        // Réponse sur la préparation
        else if (
          lowerInput.includes("préparer pour") ||
          lowerInput.includes("preparer pour") ||
          lowerInput.includes("comment se préparer") ||
          lowerInput.includes("comment se preparer")
        ) {
          return "Pour vous préparer à votre déménagement, commencez par désencombrer et emballer une boîte d'essentiels. Planifiez votre déménagement avec nous à l'avance pour garantir la disponibilité.";
        }

        // Réponse sur le coût
        else if (
          lowerInput.includes("combien ça coûte") ||
          lowerInput.includes("combien ca coute") ||
          lowerInput.includes("tarification") ||
          lowerInput.includes("coût") ||
          lowerInput.includes("cout")
        ) {
          return "Le coût d'un déménagement varie en fonction de facteurs tels que le type de service, la distance et la taille de la propriété. Contactez-nous pour un devis gratuit et sans engagement !";
        }

        // Réponse supplémentaire sur le coût
        else if (lowerInput.includes("estimation")) {
          return "Pour une estimation précise, veuillez fournir des détails sur votre déménagement, et nous vous contacterons avec un devis !";
        }

        // Réponse sur les réductions
        else if (
          lowerInput.includes("réduction") ||
          lowerInput.includes("reduction") ||
          lowerInput.includes("promotion")
        ) {
          return "Oui, nous offrons diverses réductions et promotions pour rendre votre déménagement plus abordable, y compris des offres saisonnières et des réductions pour parrainage. N'oubliez pas de demander des promotions en cours lorsque vous demandez un devis !";
        }

        // Réponse supplémentaire sur les réductions
        else if (
          lowerInput.includes("offres spéciales") ||
          lowerInput.includes("offres speciales")
        ) {
          return "Nous avons souvent des offres spéciales disponibles. N'oubliez pas de demander les promotions en cours lorsque vous nous contactez !";
        }

        // Réponse de contact
        else if (
          lowerInput.includes("contacter") ||
          lowerInput.includes("email") ||
          lowerInput.includes("téléphone")
        ) {
          return "Vous pouvez nous joindre par e-mail à l'adresse <a href='mailto:contact@move-it.com' rel='noopener noreferrer'>contact@move-it.com</a> ou par téléphone au <a href='tel:+442012345678' rel='noopener noreferrer'>+44 20 1234 5678</a>. Notre bureau est situé au 123 Victoria St, Londres SW1E 6DE, Royaume-Uni. Nous sommes là pour vous aider !";
        }

        // Réponse supplémentaire de contact
        else if (lowerInput.includes("contacter")) {
          return "Vous pouvez nous contacter à l'adresse e-mail <a href='mailto:contact@move-it.com' rel='noopener noreferrer'>contact@move-it.com</a> ou au numéro de téléphone <a href='tel:+442012345678' rel='noopener noreferrer'>+44 20 1234 5678</a>. Notre bureau est situé au 123 Victoria St, Londres SW1E 6DE, Royaume-Uni. Nous sommes là pour vous aider avec toutes vos questions !";
        }

        // Réponse sur le délai de déménagement
        else if (
          lowerInput.includes("combien de temps cela prend") ||
          lowerInput.includes("chronologie du déménagement") ||
          lowerInput.includes("chronologie du demenagement") ||
          lowerInput.includes("durée du déménagement") ||
          lowerInput.includes("duree du demenagement")
        ) {
          return "La durée d'un déménagement peut varier en fonction de la distance et de la quantité de biens. En général, les déménagements locaux peuvent être complétés en une journée, tandis que les déménagements longue distance peuvent prendre plusieurs jours. Souhaitez-vous une estimation plus précise ?";
        }

        // Réponse sur l'assurance
        else if (lowerInput.includes("assurance")) {
          return "Nous proposons diverses options d'assurance pour protéger vos biens pendant le déménagement. Il est important de discuter de ces options avec notre équipe pour trouver la meilleure couverture pour vos besoins.";
        }

        // Réponse sur les fournitures de déménagement
        else if (
          lowerInput.includes("fournitures de déménagement") ||
          lowerInput.includes("fournitures de demenagement") ||
          lowerInput.includes("boîtes") ||
          lowerInput.includes("boites") ||
          lowerInput.includes("matériaux d'emballage") ||
          lowerInput.includes("materiaux d'emballage")
        ) {
          return "Nous fournissons une gamme de fournitures de déménagement, y compris des boîtes, du ruban adhésif et des matériaux d'emballage. Souhaitez-vous en savoir plus sur nos options de fournitures ?";
        }

        // Réponse sur les articles spéciaux
        else if (
          lowerInput.includes("articles spéciaux") ||
          lowerInput.includes("articles speciaux") ||
          lowerInput.includes("fragile") ||
          lowerInput.includes("instrument de musique") ||
          lowerInput.includes("guitare") ||
          lowerInput.includes("violon") ||
          lowerInput.includes("trompette") ||
          lowerInput.includes("tambour") ||
          lowerInput.includes("piano") ||
          lowerInput.includes("œuvre d'art") ||
          lowerInput.includes("pièce d'art") ||
          lowerInput.includes("piece d'art") ||
          lowerInput.includes("antiquités")
        ) {
          userState.inquiringAboutSpecialItems = true;
          return "Nous avons de l'expérience dans la manipulation d'articles spéciaux comme les instruments de musique, les œuvres d'art et les antiquités. Notre équipe prend des précautions supplémentaires pour garantir que ces articles sont transportés en toute sécurité. Souhaitez-vous en savoir plus ?";
        }

        // Réponse pour le traitement des articles spéciaux
        else if (
          (userState.inquiringAboutSpecialItems &&
            lowerInput.includes("oui")) ||
          lowerInput.includes("j'ai") ||
          lowerInput.includes("articles spécifiques") ||
          lowerInput.includes("articles specifiques")
        ) {
          return "C'est super ! Je peux vous donner plus de détails sur la façon dont nous traitons les articles spéciaux. Par exemple, nous avons des techniques d'emballage spéciales pour les pianos et les œuvres d'art afin de garantir qu'ils arrivent en toute sécurité.";
        }

        // Réponse pour demander des processus de traitement
        else if (
          (userState.inquiringAboutSpecialItems &&
            lowerInput.includes("comment gérez-vous")) ||
          lowerInput.includes("comment gerez-vous") ||
          lowerInput.includes("quel est votre processus")
        ) {
          return "Nous utilisons des matériaux et des techniques d'emballage spécialisés pour protéger les articles spéciaux pendant le transport. Notre équipe est formée pour manipuler des objets fragiles et précieux avec soin, en veillant à ce qu'ils soient correctement emballés et transportés.";
        }

        // Réponse pour les articles spéciaux non présents
        else if (
          userState.inquiringAboutSpecialItems &&
          lowerInput.includes("je n'en ai pas")
        ) {
          userState.inquiringAboutSpecialItems = false;
          return "Pas de problème ! Si vous avez d'autres questions sur nos services de déménagement ou avez besoin d'aide pour votre déménagement, n'hésitez pas à demander !";
        }

        // Réponse sur les conseils de déménagement
        else if (
          lowerInput.includes("conseils de déménagement") ||
          lowerInput.includes("conseils de demenagement")
        ) {
          return "Voici quelques conseils rapides pour déménager : commencez à emballer tôt, étiquetez vos boîtes et gardez les documents importants séparés. Souhaitez-vous des conseils plus détaillés ?";
        }

        // Options de déménagement
        else if (
          lowerInput.includes("options pour déménager") ||
          lowerInput.includes("options de déménagement") ||
          lowerInput.includes("qu'est-ce que je peux choisir") ||
          lowerInput.includes("quelles sont mes options") ||
          lowerInput.includes("quels services offrez-vous")
        ) {
          return "Nous offrons une gamme complète de solutions de déménagement, y compris <a href='https://primesolar.github.io/move-it/local-moving.html' rel='noopener noreferrer'><strong>déménagements locaux</strong></a>, <a href='https://primesolar.github.io/move-it/long-distance-moving.html' rel='noopener noreferrer'><strong>déménagements longue distance</strong></a>, <a href='https://primesolar.github.io/move-it/professional-packing.html' rel='noopener noreferrer'><strong>emballage</strong></a>, <a href='https://primesolar.github.io/move-it/faqs.html' rel='noopener noreferrer'><strong>stockage</strong></a>, <a href='https://primesolar.github.io/move-it/faqs.html' rel='noopener noreferrer'><strong>démontage/remontage de meubles</strong></a>, et <a href='https://primesolar.github.io/move-it/commercial-moving.html' rel='noopener noreferrer'><strong>déménagements commerciaux/bureaux</strong></a>.";
        }

        // Réponse sur les zones de service
        else if (
          lowerInput.includes("zones de service") ||
          lowerInput.includes("localisations")
        ) {
          return "Nous desservons une large gamme de zones ! Veuillez nous indiquer votre emplacement actuel et votre destination, et nous pourrons confirmer si nous pouvons vous aider.";
        }

        // Réponse sur les options de paiement
        else if (
          lowerInput.includes("options de paiement") ||
          lowerInput.includes("payer")
        ) {
          return "Nous acceptons divers modes de paiement, y compris les cartes de crédit, les virements bancaires et les espèces. Veuillez demander à notre équipe plus de détails lors du processus de réservation.";
        }

        // Réponse sur la politique d'annulation
        else if (
          lowerInput.includes("politique d'annulation") ||
          lowerInput.includes("annuler")
        ) {
          return "Nous comprenons que les plans peuvent changer. Notre politique d'annulation vous permet d'annuler ou de reprogrammer votre déménagement avec un préavis. Veuillez nous contacter pour des détails spécifiques.";
        }

        // Réponse sur les procédures du jour du déménagement
        else if (
          lowerInput.includes("jour du déménagement") ||
          lowerInput.includes("jour du demenagement") ||
          lowerInput.includes("à quoi s'attendre") ||
          lowerInput.includes("a quoi s'attendre")
        ) {
          return "Le jour du déménagement, notre équipe arrivera à l'heure, prête à emballer et charger vos biens. Nous vous tiendrons informé tout au long du processus. Avez-vous des préoccupations spécifiques concernant le jour du déménagement ?";
        }

        // Réponse sur les options écologiques
        else if (
          lowerInput.includes("écologique") ||
          lowerInput.includes("ecologique") ||
          lowerInput.includes("durable")
        ) {
          return "Nous proposons des options de déménagement écologiques, y compris des matériaux d'emballage réutilisables et des pratiques durables. Faites-nous savoir si vous êtes intéressé par nos solutions de déménagement vertes !";
        }

        // Réponse sur le déménagement international
        else if (
          lowerInput.includes("déménagement international") ||
          lowerInput.includes("demenagement international") ||
          lowerInput.includes("outre-mer")
        ) {
          return "Nous pouvons également vous aider avec des déménagements internationaux ! Notre équipe est expérimentée dans la gestion des douanes et de la logistique pour les relocalisations à l'étranger. Souhaitez-vous plus d'informations ?";
        }

        // Réponse supplémentaire sur le déménagement international
        else if (
          lowerInput.includes("déménager à l'étranger") ||
          lowerInput.includes("demenager a l'etranger") ||
          lowerInput.includes("déménagement à l'étranger") ||
          lowerInput.includes("demenagement a l'etranger") ||
          lowerInput.includes("relocaliser à l'international") ||
          lowerInput.includes("relocaliser a l'international") ||
          lowerInput.includes("relocalisation internationale") ||
          lowerInput.includes("déménagement outre-mer") ||
          lowerInput.includes("demenagement outre-mer")
        ) {
          return "Déménager à l'étranger peut être une aventure passionnante ! Nous pouvons vous aider à naviguer dans la logistique et la paperasse impliquées. Quelles informations spécifiques avez-vous besoin ?";
        }

        // Réponse sur les réglementations douanières
        else if (
          lowerInput.includes("réglementations douanières") ||
          lowerInput.includes("reglementations douanieres")
        ) {
          return "Comprendre les réglementations douanières est important pour les déménagements internationaux. Nous pouvons vous fournir des conseils sur les articles autorisés et la documentation nécessaire.";
        }

        // Réponse sur le visa
        else if (
          lowerInput.includes("exigences de visa") ||
          lowerInput.includes("informations sur le visa") ||
          lowerInput.includes("informations sur le visa") ||
          lowerInput.includes("en savoir plus sur le visa") ||
          lowerInput.includes("parle-moi du visa") ||
          lowerInput.includes("parle du visa") ||
          lowerInput.includes("discute du visa") ||
          lowerInput.includes("question sur le visa") ||
          lowerInput.includes("questions sur le visa") ||
          lowerInput.includes("question de visa") ||
          lowerInput.includes("conversation sur le visa") ||
          lowerInput.includes("obtenir un visa")
        ) {
          return "Les exigences de visa varient selon les pays. Il est important de vérifier les réglementations spécifiques pour votre destination. Souhaitez-vous de l'aide à ce sujet ?";
        }

        // Réponse sur l'expédition internationale
        else if (
          lowerInput.includes("expédition internationale") ||
          lowerInput.includes("expedition internationale")
        ) {
          return "Nous proposons des services d'expédition internationale pour garantir que vos biens arrivent en toute sécurité à votre nouveau domicile. Souhaitez-vous en savoir plus sur nos options d'expédition ?";
        }

        // Réponse sur l'assistance linguistique
        else if (lowerInput.includes("assistance linguistique")) {
          return "Déménager dans un nouveau pays implique souvent des barrières linguistiques. Nous pouvons fournir des ressources ou des recommandations pour des services d'assistance linguistique.";
        }

        // Réponse sur l'ajustement culturel
        else if (lowerInput.includes("ajustement culturel")) {
          return "Nous pouvons offrir des conseils et des ressources pour vous aider à vous installer en douceur. Souhaitez-vous plus d'informations ?";
        }

        // Réponse sur l'assurance internationale
        else if (lowerInput.includes("assurance internationale")) {
          return "Nous vous recommandons d'examiner les options d'assurance internationale pour protéger vos biens pendant le déménagement. Souhaitez-vous de l'aide pour trouver la bonne couverture ?";
        }

        // Réponse sur l'emballage pour un déménagement international
        else if (
          lowerInput.includes("emballage pour déménagement international") ||
          lowerInput.includes("emballage pour demenagement international")
        ) {
          return "L'emballage pour un déménagement international nécessite des considérations spéciales. Nous pouvons vous donner des conseils sur la façon d'emballer efficacement et en toute sécurité pour le transport longue distance.";
        }

        // Réponse sur le déménagement avec des animaux de compagnie
        else if (
          lowerInput.includes("animaux de compagnie") ||
          lowerInput.includes("déménagement avec des animaux de compagnie") ||
          lowerInput.includes("demenagement avec des animaux de compagnie")
        ) {
          return "Déménager avec des animaux de compagnie nécessite des considérations spéciales. Nous pouvons fournir des conseils et des ressources pour garantir une transition en douceur pour vos amis à fourrure. Souhaitez-vous en savoir plus ?";
        }

        // Réponse sur le déménagement pour les seniors
        else if (
          lowerInput.includes("seniors") ||
          lowerInput.includes("déménagement senior") ||
          lowerInput.includes("demenagement senior")
        ) {
          return "Nous comprenons que déménager peut être particulièrement difficile pour les seniors. Notre équipe est formée pour fournir une assistance compatissante et respectueuse. Comment pouvons-nous vous aider avec votre déménagement senior ?";
        }

        // Réponse sur la relocalisation d'entreprise
        else if (
          lowerInput.includes("relocalisation d'entreprise") ||
          lowerInput.includes("déménagement d'employé") ||
          lowerInput.includes("demenagement d'employe")
        ) {
          return "Nous sommes spécialisés dans les relocalisations d'entreprise et pouvons aider avec les déménagements d'employés, garantissant une transition en douceur pour votre personnel. Faites-nous savoir comment nous pouvons vous aider !";
        }

        // Réponse sur les conseils de déménagement de dernière minute
        else if (
          lowerInput.includes("conseils de dernière minute") ||
          lowerInput.includes("conseils de derniere minute") ||
          lowerInput.includes("déménagement d'urgence") ||
          lowerInput.includes("demenagement d'urgence")
        ) {
          return "Pour les déménagements de dernière minute, concentrez-vous sur les essentiels : emballez une valise avec des vêtements, rassemblez des documents importants et assurez-vous d'avoir un plan pour votre jour de déménagement. Avez-vous besoin de conseils plus spécifiques ?";
        }

        // Réponse sur le déménagement avec des plantes
        else if (lowerInput.includes("plantes")) {
          return "Déménager des plantes nécessite des soins particuliers. Pensez à comment les protéger pendant le transport. Souhaitez-vous des conseils sur des types spécifiques de plantes ?";
        }

        // Réponse sur le déménagement de meubles
        else if (
          lowerInput.includes("meubles") ||
          lowerInput.includes("objets lourds") ||
          lowerInput.includes("grands objets")
        ) {
          return "Nous avons le bon équipement et le personnel formé pour manipuler en toute sécurité des meubles lourds et des grands objets. Avez-vous des pièces spécifiques en tête pour lesquelles vous avez besoin d'aide ?";
        }

        // Réponse sur les services de déballage
        else if (
          lowerInput.includes("déballage") ||
          lowerInput.includes("deballage")
        ) {
          return "Notre équipe peut vous aider à déballer vos biens et à aménager votre nouvel espace. Souhaitez-vous en savoir plus sur ce service ?";
        }

        // Réponse sur le déménagement pendant la haute saison
        else if (
          lowerInput.includes("haute saison") ||
          lowerInput.includes("saison chargée")
        ) {
          return "Déménager pendant la haute saison peut être plus difficile en raison de la demande accrue. Il est préférable de réserver votre déménagement bien à l'avance. Avez-vous des dates spécifiques en tête ?";
        }

        // Réponse sur le déménagement pour les étudiants
        else if (
          lowerInput.includes("étudiant") ||
          lowerInput.includes("etudiant") ||
          lowerInput.includes("université") ||
          lowerInput.includes("universite")
        ) {
          return "Nous proposons des services spéciaux pour les déménagements d'étudiants, y compris des horaires flexibles et des tarifs abordables. Comment puis-je vous aider avec votre relocalisation ?";
        }

        // Réponse sur les contrats de déménagement
        else if (
          lowerInput.includes("contrat") ||
          lowerInput.includes("accord de déménagement") ||
          lowerInput.includes("accord de demenagement")
        ) {
          return "Avant votre déménagement, nous fournissons un contrat détaillé décrivant les services, les coûts et les conditions. Il est important de le lire attentivement. Avez-vous des questions sur des termes spécifiques ?";
        }

        // Réponse sur l'équipement de déménagement
        else if (
          lowerInput.includes("équipement de déménagement") ||
          lowerInput.includes("equipement de demenagement") ||
          lowerInput.includes("outils")
        ) {
          return "Nous utilisons un équipement de déménagement spécialisé pour garantir que vos biens sont transportés en toute sécurité. Souhaitez-vous en savoir plus sur notre équipement ?";
        }

        // Réponse sur les réglementations locales de déménagement
        else if (
          lowerInput.includes("réglementations locales") ||
          lowerInput.includes("reglementations locales") ||
          lowerInput.includes("lois locales") ||
          lowerInput.includes("réglementations de déménagement") ||
          lowerInput.includes("reglementations de demenagement") ||
          lowerInput.includes("lois de déménagement")
        ) {
          return "Différentes zones peuvent avoir des réglementations spécifiques concernant le déménagement. Il est préférable de vérifier auprès des autorités locales.";
        }

        // Español

        // Respuesta de saludo
        if (
          lowerInput.includes("hola") ||
          lowerInput === "saludo" ||
          lowerInput.includes("saludo ") ||
          lowerInput.includes("saludo,") ||
          lowerInput.includes("saludo.") ||
          lowerInput.includes("saludo!") ||
          lowerInput.includes("saludos") ||
          lowerInput.includes("buenos días") ||
          lowerInput.includes("buenos dias") ||
          lowerInput.includes("buen día") ||
          lowerInput.includes("buen dia") ||
          lowerInput.includes("buenas tardes") ||
          lowerInput.includes("buenas noches") ||
          lowerInput.includes("hey") ||
          lowerInput.includes("qué hay de nuevo") ||
          lowerInput.includes("que hay de nuevo") ||
          lowerInput.includes("bienvenido")
        ) {
          return "¡Hola! ¡Bienvenido a Move It! ¿Cómo puedo ayudarte con tus necesidades de mudanza hoy?";
        }

        // Respuesta de ayuda
        else if (lowerInput.includes("ayuda")) {
          return "¡Claro! ¿De qué necesitas ayuda con respecto a tu mudanza? Ofrecemos una variedad de servicios para hacer que tu mudanza sea sin complicaciones.";
        }

        // Respuesta de agradecimiento
        else if (
          lowerInput.includes("gracias") ||
          lowerInput.includes("te agradezco") ||
          lowerInput.includes("lo aprecio") ||
          lowerInput.includes("agradecido")
        ) {
          return "¡De nada! Si tienes más preguntas sobre nuestros servicios de mudanza, no dudes en preguntar.";
        }

        // Respuesta de agradecimiento adicional
        else if (
          lowerInput.includes("gracias por tu ayuda") ||
          lowerInput.includes("te agradezco por tu asistencia") ||
          lowerInput.includes("aprecio tu ayuda") ||
          lowerInput.includes("aprecio tu ayuda")
        ) {
          return "¡Me alegra haber podido ayudarte! Si tienes más preguntas, házmelo saber.";
        }

        // Respuesta a un cumplido
        if (
          lowerInput.includes("eso es muy bonito") ||
          lowerInput.includes("eso es realmente lindo")
        ) {
          return "¡Gracias! Nos alegra que te guste. Si tienes más preguntas o necesitas ayuda, no dudes en contactarnos.";
        }

        // Respuesta a un cumplido sobre la amabilidad
        if (
          lowerInput.includes("ustedes son amables") ||
          lowerInput.includes("son muy amables") ||
          lowerInput.includes("ustedes son realmente amables") ||
          lowerInput.includes("tú eres amable") ||
          lowerInput.includes("eres muy amable") ||
          lowerInput.includes("tú eres realmente amable")
        ) {
          return "¡Muchas gracias! ¡Siempre estoy feliz de ayudar! Si tienes más preguntas, no dudes en preguntar.";
        }

        // Respuestas de despedida
        else if (
          lowerInput.includes("adiós") ||
          lowerInput.includes("adios") ||
          lowerInput.includes("hasta luego") ||
          lowerInput.includes("hasta pronto") ||
          lowerInput.includes("cuídate") ||
          lowerInput.includes("cuidate") ||
          lowerInput.includes("hasta la próxima") ||
          lowerInput.includes("hasta la proxima")
        ) {
          return "¡Adiós! ¡Que tengas un excelente día, y recuerda, mudarse puede ser alegre con la ayuda adecuada!";
        }

        // Respuestas de despedida adicionales
        else if (
          lowerInput.includes("hasta pronto") ||
          lowerInput.includes("hasta luego") ||
          lowerInput.includes("hasta la próxima vez") ||
          lowerInput.includes("hasta la proxima vez") ||
          lowerInput.includes("buenas noches")
        ) {
          return "¡Hasta pronto!";
        }

        // Respuesta de bienestar
        else if (
          lowerInput.includes("cómo estás") ||
          lowerInput.includes("como estas") ||
          lowerInput.includes("cómo va") ||
          lowerInput.includes("como va") ||
          lowerInput.includes("cómo te va") ||
          lowerInput.includes("como te va") ||
          lowerInput.includes("cómo va la vida") ||
          lowerInput.includes("como va la vida") ||
          lowerInput.includes("qué pasa") ||
          lowerInput.includes("que pasa")
        ) {
          return "¡Todo bien, gracias! ¿Y tú?";
        }

        // Respuesta para cuando el cliente dice que también está bien
        else if (
          lowerInput.includes("estoy bien") ||
          lowerInput.includes("me va bien") ||
          lowerInput.includes("todo bien") ||
          lowerInput.includes("me siento bien") ||
          lowerInput.includes("me siento genial") ||
          lowerInput.includes("estoy contento") ||
          lowerInput.includes("estoy feliz") ||
          lowerInput.includes("estoy excelente")
        ) {
          return "¡Me alegra escuchar eso! Si tienes preguntas específicas sobre nuestros servicios de mudanza o cualquier otra cosa, no dudes en preguntar.";
        }

        // Respuestas de saludo adicionales
        else if (
          lowerInput.includes("qué hay de nuevo") ||
          lowerInput.includes("que hay de nuevo") ||
          lowerInput.includes("cómo va") ||
          lowerInput.includes("como va") ||
          lowerInput.includes("cómo va la vida") ||
          lowerInput.includes("como va la vida") ||
          lowerInput.includes("qué pasa") ||
          lowerInput.includes("que pasa")
        ) {
          return "No mucho, solo estoy aquí para ayudarte con tus necesidades de mudanza. ¿Cómo puedo ayudarte hoy?";
        }

        // Respuesta de bienestar adicional
        else if (
          lowerInput.includes("cómo va tu día") ||
          lowerInput.includes("como va tu dia") ||
          lowerInput.includes("cómo va tu jornada") ||
          lowerInput.includes("como va tu jornada") ||
          lowerInput.includes("cómo va tu semana") ||
          lowerInput.includes("como va tu semana")
        ) {
          return "¡Mi día va bien, gracias! ¿Cómo puedo ayudarte hoy?";
        }

        // Respuesta de identidad
        else if (
          lowerInput.includes("cuál es tu nombre") ||
          lowerInput.includes("cual es tu nombre") ||
          lowerInput.includes("cómo te llamas") ||
          lowerInput.includes("como te llamas") ||
          lowerInput.includes("quién eres") ||
          lowerInput.includes("quien eres") ||
          lowerInput.includes("preséntate") ||
          lowerInput.includes("presentate") ||
          lowerInput.includes("dime tu nombre") ||
          lowerInput.includes("repite tu nombre")
        ) {
          return "Me llamo Zane. Soy un representante de Move It, ¡tu asistente para todas tus necesidades de mudanza! ¿Cómo puedo ayudarte hoy?";
        }

        // Respuesta de identidad adicional
        else if (
          lowerInput.includes("qué haces") ||
          lowerInput.includes("que haces") ||
          lowerInput.includes("cuál es tu rol") ||
          lowerInput.includes("cual es tu rol") ||
          lowerInput.includes("cuál es tu propósito") ||
          lowerInput.includes("cual es tu proposito")
        ) {
          return "Estoy aquí para ayudarte con todas tus necesidades de mudanza y proporcionar información sobre nuestros servicios.";
        }

        // Respuesta sobre las capacidades
        else if (
          lowerInput.includes("qué puedes hacer") ||
          lowerInput.includes("que puedes hacer") ||
          lowerInput.includes("capacidades") ||
          lowerInput.includes("qué servicios") ||
          lowerInput.includes("que servicios") ||
          lowerInput.includes("servicios que ofreces") ||
          lowerInput.includes("qué servicios propones") ||
          lowerInput.includes("que servicios propones")
        ) {
          return "Puedo ayudarte con diversas preguntas sobre mudanzas, desde mudanzas locales hasta mudanzas de larga distancia, embalaje y más. ¡Solo pregúntame!";
        }

        // Respuesta adicional sobre las capacidades
        else if (
          lowerInput.includes("qué servicios puedes proporcionar") ||
          lowerInput.includes("que servicios puedes proporcionar") ||
          lowerInput.includes("cómo puedes ayudarme") ||
          lowerInput.includes("como puedes ayudarme") ||
          lowerInput.includes("cuáles son tus características") ||
          lowerInput.includes("cuales son tus caracteristicas")
        ) {
          return "Puedo ayudarte con preguntas sobre logística de mudanza, embalaje, almacenamiento y más. ¡Déjame saber qué necesitas!";
        }

        // Respuesta sobre por qué elegir Move It
        else if (
          lowerInput.includes("por qué debería elegir Move It") ||
          lowerInput.includes("por que deberia elegir Move It") ||
          lowerInput.includes("por qué elegir Move It") ||
          lowerInput.includes("por que elegir Move It") ||
          lowerInput.includes("razones para elegir Move It")
        ) {
          userState.inquiringAboutWhyChooseMoveIt = true;
          return "Elegir Move It significa que cuentas con un equipo dedicado a hacer que tu mudanza sea lo más fluida posible. Ofrecemos un servicio personalizado, profesionales experimentados y una gama de opciones adaptadas a tus necesidades. Nuestros precios transparentes, excelente atención al cliente y compromiso con la seguridad garantizan que tus pertenencias estén en buenas manos. ¿Te gustaría saber más sobre nuestros servicios específicos?";
        }

        // Respuesta de seguimiento sobre por qué elegir Move It
        else if (
          (userState.inquiringAboutWhyChooseMoveIt &&
            lowerInput.includes("sí")) ||
          (userState.inquiringAboutWhyChooseMoveIt && lowerInput.includes("si"))
        ) {
          return "Puedo ayudarte con diversas preguntas sobre mudanzas, desde mudanzas locales hasta mudanzas de larga distancia, embalaje y más. ¡Solo pregúntame!";
        }

        // Respuesta de broma
        else if (
          lowerInput.includes("cuéntame un chiste") ||
          lowerInput.includes("cuentame un chiste")
        ) {
          return "¿Por qué los mudanceros son grandes amigos? ¡Porque siempre saben cómo levantar tu ánimo!";
        }

        // Respuesta sobre el clima
        else if (
          lowerInput.includes("clima") ||
          lowerInput.includes("tiempo")
        ) {
          return "No puedo verificar el clima en este momento, pero siempre es bueno planificar tu mudanza en un día despejado.";
        }

        // Respuesta adicional sobre el clima
        else if (
          lowerInput.includes("pronóstico") ||
          lowerInput.includes("pronostico") ||
          lowerInput.includes("previsión") ||
          lowerInput.includes("prevision")
        ) {
          return "No puedo proporcionar el pronóstico, pero siempre es sabio verificar el clima antes de planificar tu mudanza.";
        }

        // Respuesta sobre noticias
        else if (
          lowerInput.includes("noticias") ||
          lowerInput.includes("actualidad")
        ) {
          return "No puedo proporcionar actualizaciones de noticias, pero puedes consultar tu sitio de noticias favorito para las últimas novedades.";
        }

        // Respuesta de ayuda adicional
        else if (lowerInput.includes("asistencia")) {
          return "¡Claro! ¿Qué tipo de asistencia específica necesitas para tu mudanza? ¡Estoy aquí para ayudar!";
        }

        // Respuesta sobre servicios de mudanza
        else if (
          lowerInput.includes("servicios de mudanza") ||
          lowerInput.includes("ayuda con la mudanza") ||
          lowerInput.includes("opciones de mudanza") ||
          lowerInput.includes("servicios de reubicación") ||
          lowerInput.includes("servicios de reubicacion")
        ) {
          return "Ofrecemos una gama de servicios de mudanza, incluyendo mudanzas locales y de larga distancia, embalaje y desembalaje. ¿Cómo puedo ayudarte con tu mudanza?";
        }

        // Opciones de mudanza
        else if (
          lowerInput.includes("opciones para mudanza") ||
          lowerInput.includes("opciones de mudanza") ||
          lowerInput.includes("¿qué puedo elegir?") ||
          lowerInput.includes("¿cuáles son mis opciones?") ||
          lowerInput.includes("¿qué servicios ofrecen?")
        ) {
          return "Ofrecemos una gama completa de soluciones de mudanza, incluyendo <a href='https://primesolar.github.io/move-it/local-moving.html' rel='noopener noreferrer'><strong>mudanzas locales</strong></a>, <a href='https://primesolar.github.io/move-it/long-distance-moving.html' rel='noopener noreferrer'><strong>mudanzas de larga distancia</strong></a>, <a href='https://primesolar.github.io/move-it/professional-packing.html' rel='noopener noreferrer'><strong>empaquetado</strong></a>, <a href='https://primesolar.github.io/move-it/faqs.html' rel='noopener noreferrer'><strong>almacenamiento</strong></a>, <a href='https://primesolar.github.io/move-it/faqs.html' rel='noopener noreferrer'><strong>desmontaje/remontaje de muebles</strong></a>, y <a href='https://primesolar.github.io/move-it/commercial-moving.html' rel='noopener noreferrer'><strong>mudanzas comerciales/oficina</strong></a>.";
        }

        // Respuesta sobre opciones de almacenamiento
        else if (lowerInput.includes("opciones de almacenamiento")) {
          return "Ofrecemos soluciones de almacenamiento seguras para los artículos que podrías no necesitar de inmediato en tu nueva dirección. ¿Te gustaría saber más?";
        }

        // Respuesta adicional sobre opciones de almacenamiento
        else if (lowerInput.includes("almacenamiento temporal")) {
          return "Ofrecemos soluciones de almacenamiento temporal para tus pertenencias durante el proceso de mudanza. ¿Te gustaría más detalles?";
        }

        // Respuesta sobre embalaje
        else if (
          lowerInput === "embalaje" ||
          lowerInput.includes(" embalaje") ||
          lowerInput.includes("empaquetado")
        ) {
          userState.inquiringAboutPacking = true;
          return "Nuestro equipo ofrece servicios de embalaje completos para garantizar que tus pertenencias estén seguras y bien organizadas durante la mudanza. ¿Te gustaría saber más?";
        }

        // Respuesta de seguimiento para los servicios de embalaje
        else if (
          (userState.inquiringAboutPacking &&
            !userState.inquiringAboutPackingDetailed &&
            lowerInput.includes("sí")) ||
          (userState.inquiringAboutPacking &&
            !userState.inquiringAboutPackingDetailed &&
            lowerInput.includes("si"))
        ) {
          userState.inquiringAboutPackingDetailed = true;
          return "¡Genial! Nuestros servicios de embalaje incluyen el embalaje profesional de sus bienes, el suministro de materiales de embalaje de alta calidad y la garantía de que todo esté bien embalado para el transporte. También podemos ayudarle a desembalar en su nueva dirección. ¿Le gustaría programar una consulta o recibir un presupuesto?";
        }

        // Respuesta de seguimiento para los servicios de embalaje
        else if (
          (userState.inquiringAboutPacking &&
            userState.inquiringAboutPackingDetailed &&
            lowerInput.includes("sí")) ||
          (userState.inquiringAboutPacking &&
            userState.inquiringAboutPackingDetailed &&
            lowerInput.includes("si"))
        ) {
          return "Puede programar una consulta o recibir un presupuesto contactándonos por correo electrónico a <a href='mailto:contact@move-it.com' rel='noopener noreferrer'>contact@move-it.com</a> o por teléfono al <a href='tel:+442012345678' rel='noopener noreferrer'>+44 20 1234 5678</a>. Nuestra oficina está ubicada en 123 Victoria St, Londres SW1E 6DE, Reino Unido. ¡Estamos aquí para ayudarle con todas sus preguntas!";
        }

        // Respuesta de seguimiento para los servicios de embalaje
        else if (
          /\bno\b/.test(lowerInput) ||
          lowerInput.includes("no interesado") ||
          lowerInput.includes("no interesada")
        ) {
          userState.inquiringAboutPacking = false;
          userState.inquiringAboutPackingDetailed = false;
          userState.inquiringAboutWhyChooseMoveIt = false;
          userState.inquiringAboutSpecialItems = false;
          return "¡No hay problema! Si tiene otras preguntas o necesita ayuda con algo más, no dude en preguntar.";
        }

        // Respuesta adicional sobre el embalaje
        else if (
          lowerInput.includes("ayuda con el embalaje") ||
          lowerInput.includes("ayuda a el embalaje")
        ) {
          return "Podemos proporcionarle ayuda para el embalaje para garantizar que sus artículos estén seguros y organizados. ¿Le gustaría saber más sobre este servicio?";
        }

        // Respuesta sobre mudanza local
        if (
          lowerInput.includes(
            "¿qué me puedes contar sobre la mudanza dentro de una ciudad?"
          ) ||
          lowerInput.includes("¿puedes hablarme de mudanzas en la ciudad?") ||
          lowerInput.includes("cuéntame sobre la mudanza local") ||
          lowerInput.includes(
            "¿qué servicios ofreces para mudanzas en la ciudad?"
          ) ||
          lowerInput.includes("¿qué puedes decirme sobre mudanzas urbanas?") ||
          lowerInput.includes("info sobre mudanza dentro de una ciudad") ||
          lowerInput.includes("servicios de mudanza en la ciudad") ||
          lowerInput.includes("detalles sobre mudanza local") ||
          lowerInput.includes(
            "¿qué proporcionas para reubicaciones en la ciudad?"
          ) ||
          lowerInput.includes("acerca de la mudanza en mi ciudad") ||
          lowerInput.includes("¿cómo manejas las mudanzas locales?") ||
          lowerInput.includes("¿qué incluye el servicio de mudanza local?") ||
          lowerInput.includes(
            "explica cómo funciona la mudanza dentro de una ciudad"
          ) ||
          lowerInput.includes("¿cuáles son tus opciones de mudanza local?") ||
          lowerInput.includes("¿cómo funciona la mudanza local?") ||
          lowerInput.includes(
            "¿puedes proporcionar detalles sobre mudanzas en la ciudad?"
          ) ||
          lowerInput.includes("describe tus servicios para mudanzas locales")
        ) {
          return "Ofrecemos varios servicios de mudanza local adaptados a tus necesidades. Esto incluye <a href='https://primesolar.github.io/move-it/professional-packing.html' rel='noopener noreferrer'><strong>empaquetado profesional</strong></a>, <a href='https://primesolar.github.io/move-it/faqs.html' rel='noopener noreferrer'><strong>desmontaje/montaje de muebles</strong></a>, y <a href='https://primesolar.github.io/move-it/contact.html' rel='noopener noreferrer'><strong>opciones de programación flexibles</strong></a> para que tu mudanza sea lo más fluida posible. Si tienes preguntas específicas o necesitas más información, no dudes en preguntar!";
        }

        // Respuesta sobre el mudanza comercial
        else if (
          lowerInput.includes("mudanza comercial") ||
          lowerInput.includes("mudanza comercial")
        ) {
          return "Nos especializamos en servicios de mudanza comercial adaptados a empresas. ¡Háganos saber si necesita ayuda para la reubicación de su oficina!";
        }

        // Respuesta adicional sobre la mudanza comercial
        else if (
          lowerInput.includes("reubicación de empresa") ||
          lowerInput.includes("reubicacion de empresa")
        ) {
          return "Nos especializamos en reubicaciones de empresas y podemos ayudar a garantizar una transición sin problemas para su compañía. ¿Cómo podemos ayudarle?";
        }

        // Respuesta de reserva
        else if (
          lowerInput.includes("reservar") ||
          lowerInput.includes("reservar")
        ) {
          return "¡Reservar una mudanza con nosotros es fácil! Solo tiene que contactar a nuestro equipo de servicio al cliente con los detalles de su mudanza, y le proporcionaremos un presupuesto y lo programaremos a su conveniencia.";
        }

        // Respuesta adicional sobre la reserva
        else if (
          lowerInput.includes("programar una mudanza") ||
          lowerInput.includes("programar una mudanza")
        ) {
          return "¡Programar una mudanza con nosotros es simple! Solo tiene que proporcionar sus detalles a nuestro equipo de servicio al cliente, y nosotros nos encargaremos del resto.";
        }

        // Respuesta adicional sobre la preparación
        else if (
          lowerInput.includes("lista de verificación") ||
          lowerInput.includes("lista de verificacion") ||
          lowerInput.includes("lista de control")
        ) {
          return "Utilizar una lista de verificación para mudanzas es una excelente manera de mantenerse organizado. Puede encontrarla en nuestra <a href='https://primesolar.github.io/move-it/checklist.html' rel='noreferrer noopener'>página de lista de verificación de mudanza</a>.";
        }

        // Respuesta sobre la preparación
        else if (
          lowerInput.includes("prepararse para") ||
          lowerInput.includes("preparar para") ||
          lowerInput.includes("cómo prepararse") ||
          lowerInput.includes("como prepararse") ||
          lowerInput.includes("cómo se preparar") ||
          lowerInput.includes("como se preparar")
        ) {
          return "Para prepararse para su mudanza, comience por deshacerse de cosas innecesarias y embalar una caja de artículos esenciales. Planifique su mudanza con nosotros con anticipación para garantizar la disponibilidad.";
        }

        // Respuesta sobre el costo
        else if (
          lowerInput.includes("cuánto cuesta") ||
          lowerInput.includes("cuanto cuesta") ||
          lowerInput.includes("tarifas") ||
          lowerInput.includes("costo") ||
          lowerInput.includes("costo")
        ) {
          return "El costo de una mudanza varía según factores como el tipo de servicio, la distancia y el tamaño de la propiedad. ¡Contáctenos para obtener un presupuesto gratuito y sin compromiso!";
        }

        // Respuesta adicional sobre la estimación
        else if (
          lowerInput.includes("estimación") ||
          lowerInput.includes("estimacion")
        ) {
          return "Para una estimación precisa, proporcione detalles sobre su mudanza, ¡y nos pondremos en contacto con usted con un presupuesto!";
        }

        // Respuesta sobre descuentos
        else if (
          lowerInput.includes("descuento") ||
          lowerInput.includes("descuento") ||
          lowerInput.includes("promoción") ||
          lowerInput.includes("promocion")
        ) {
          return "Sí, ofrecemos varios descuentos y promociones para hacer su mudanza más asequible, incluyendo ofertas estacionales y descuentos por recomendación. ¡No olvide preguntar sobre las promociones actuales cuando solicite un presupuesto!";
        }

        // Respuesta adicional sobre ofertas especiales
        else if (
          lowerInput.includes("ofertas especiales") ||
          lowerInput.includes("ofertas especiales")
        ) {
          return "A menudo tenemos ofertas especiales disponibles. ¡No olvide preguntar sobre las promociones actuales cuando nos contacte!";
        }

        // Respuesta de contacto
        else if (
          lowerInput.includes("contactar") ||
          lowerInput.includes("correo electrónico") ||
          lowerInput.includes("correo electronico") ||
          lowerInput.includes("teléfono") ||
          lowerInput.includes("telefono")
        ) {
          return "Puede comunicarse con nosotros por correo electrónico a <a href='mailto:contact@move-it.com' rel='noopener noreferrer'>contact@move-it.com</a> o por teléfono al <a href='tel:+442012345678' rel='noopener noreferrer'>+44 20 1234 5678</a>. Nuestra oficina está ubicada en 123 Victoria St, Londres SW1E 6DE, Reino Unido. ¡Estamos aquí para ayudarle!";
        }

        // Respuesta adicional de contacto
        else if (lowerInput.includes("contactar")) {
          return "Puede contactarnos en la dirección de correo electrónico <a href='mailto:contact@move-it.com' rel='noopener noreferrer'>contact@move-it.com</a> o al número de teléfono <a href='tel:+442012345678' rel='noopener noreferrer'>+44 20 1234 5678</a>. Nuestra oficina está ubicada en 123 Victoria St, Londres SW1E 6DE, Reino Unido. ¡Estamos aquí para ayudarle con todas sus preguntas!";
        }

        // Respuesta sobre el tiempo de mudanza
        else if (
          lowerInput.includes("cuánto tiempo toma") ||
          lowerInput.includes("cuanto tiempo toma") ||
          lowerInput.includes("cronograma de mudanza") ||
          lowerInput.includes("cronograma de mudanza") ||
          lowerInput.includes("duración de la mudanza") ||
          lowerInput.includes("duracion de la mudanza")
        ) {
          return "La duración de una mudanza puede variar según la distancia y la cantidad de bienes. En general, las mudanzas locales pueden completarse en un día, mientras que las mudanzas de larga distancia pueden tardar varios días. ¿Le gustaría una estimación más precisa?";
        }

        // Respuesta sobre el seguro
        else if (lowerInput.includes("seguro")) {
          return "Ofrecemos varias opciones de seguro para proteger sus bienes durante la mudanza. Es importante discutir estas opciones con nuestro equipo para encontrar la mejor cobertura para sus necesidades.";
        }

        // Respuesta sobre suministros de mudanza
        else if (
          lowerInput.includes("suministros de mudanza") ||
          lowerInput.includes("suministros de mudanza") ||
          lowerInput.includes("cajas") ||
          lowerInput.includes("cajas") ||
          lowerInput.includes("materiales de embalaje") ||
          lowerInput.includes("materiales de embalaje")
        ) {
          return "Proporcionamos una gama de suministros de mudanza, incluyendo cajas, cinta adhesiva y materiales de embalaje. ¿Le gustaría saber más sobre nuestras opciones de suministros?";
        }

        // Respuesta sobre artículos especiales
        else if (
          lowerInput.includes("artículos especiales") ||
          lowerInput.includes("artículos especiales") ||
          lowerInput.includes("frágil") ||
          lowerInput.includes("fragil") ||
          lowerInput.includes("instrumento musical") ||
          lowerInput.includes("guitarra") ||
          lowerInput.includes("violín") ||
          lowerInput.includes("violin") ||
          lowerInput.includes("trompeta") ||
          lowerInput.includes("tambor") ||
          lowerInput.includes("piano") ||
          lowerInput.includes("obra de arte") ||
          lowerInput.includes("pieza de arte") ||
          lowerInput.includes("pieza de arte") ||
          lowerInput.includes("antigüedades") ||
          lowerInput.includes("antiguedades")
        ) {
          userState.inquiringAboutSpecialItems = true;
          return "Tenemos experiencia en el manejo de artículos especiales como instrumentos musicales, obras de arte y antigüedades. Nuestro equipo toma precauciones adicionales para garantizar que estos artículos se transporten de manera segura. ¿Le gustaría saber más?";
        }

        // Respuesta para el tratamiento de artículos especiales
        else if (
          (userState.inquiringAboutSpecialItems && lowerInput.includes("sí")) ||
          lowerInput.includes("tengo") ||
          lowerInput.includes("artículos específicos") ||
          lowerInput.includes("articulos especificos")
        ) {
          return "¡Eso es genial! Puedo darle más detalles sobre cómo tratamos los artículos especiales. Por ejemplo, tenemos técnicas de embalaje especiales para pianos y obras de arte para garantizar que lleguen de manera segura.";
        }

        // Respuesta para preguntar sobre procesos de tratamiento
        else if (
          (userState.inquiringAboutSpecialItems &&
            lowerInput.includes("cómo manejan")) ||
          lowerInput.includes("como manejan") ||
          lowerInput.includes("cuál es su proceso?") ||
          lowerInput.includes("cual es su proceso?")
        ) {
          return "Utilizamos materiales y técnicas de embalaje especializados para proteger los artículos especiales durante el transporte. Nuestro equipo está capacitado para manejar objetos frágiles y valiosos con cuidado, asegurando que estén correctamente embalados y transportados.";
        }

        // Respuesta para artículos especiales no presentes
        else if (
          userState.inquiringAboutSpecialItems &&
          lowerInput.includes("no tengo")
        ) {
          userState.inquiringAboutSpecialItems = false;
          return "¡No hay problema! Si tiene otras preguntas sobre nuestros servicios de mudanza o necesita ayuda con su mudanza, no dude en preguntar.";
        }

        // Respuesta sobre consejos de mudanza
        else if (
          lowerInput.includes("consejos de mudanza") ||
          lowerInput.includes("consejos de mudanza")
        ) {
          return "Aquí hay algunos consejos rápidos para mudarse: comience a empacar temprano, etiquete sus cajas y mantenga los documentos importantes separados. ¿Le gustaría consejos más detallados?";
        }

        // Respuesta sobre áreas de servicio
        else if (
          lowerInput.includes("áreas de servicio") ||
          lowerInput.includes("areas de servicio") ||
          lowerInput.includes("localizaciones")
        ) {
          return "¡Servimos a una amplia gama de áreas! Por favor, indíquenos su ubicación actual y su destino, y podremos confirmar si podemos ayudarle.";
        }

        // Respuesta sobre opciones de pago
        else if (
          lowerInput.includes("opciones de pago") ||
          lowerInput.includes("pagar")
        ) {
          return "Aceptamos varios métodos de pago, incluyendo tarjetas de crédito, transferencias bancarias y efectivo. Por favor, pregunte a nuestro equipo más detalles durante el proceso de reserva.";
        }

        // Respuesta sobre la política de cancelación
        else if (
          lowerInput.includes("política de cancelación") ||
          lowerInput.includes("politica de cancelacion") ||
          lowerInput.includes("cancelar")
        ) {
          return "Entendemos que los planes pueden cambiar. Nuestra política de cancelación le permite cancelar o reprogramar su mudanza con previo aviso. Por favor, contáctenos para detalles específicos.";
        }

        // Respuesta sobre los procedimientos del día de la mudanza
        else if (
          lowerInput.includes("día de la mudanza") ||
          lowerInput.includes("dia de la mudanza") ||
          lowerInput.includes("qué esperar") ||
          lowerInput.includes("que esperar")
        ) {
          return "El día de la mudanza, nuestro equipo llegará a tiempo, listo para empacar y cargar sus bienes. Le mantendremos informado durante todo el proceso. ¿Tiene alguna preocupación específica sobre el día de la mudanza?";
        }

        // Respuesta sobre opciones ecológicas
        else if (
          lowerInput.includes("ecológico") ||
          lowerInput.includes("ecologico") ||
          lowerInput.includes("sostenible")
        ) {
          return "Ofrecemos opciones de mudanza ecológicas, incluyendo materiales de embalaje reutilizables y prácticas sostenibles. ¡Háganos saber si está interesado en nuestras soluciones de mudanza verde!";
        }

        // Respuesta sobre mudanzas internacionales
        else if (
          lowerInput.includes("mudanza internacional") ||
          lowerInput.includes("mudanza internacional") ||
          lowerInput.includes("al extranjero")
        ) {
          return "¡También podemos ayudarle con mudanzas internacionales! Nuestro equipo tiene experiencia en la gestión de aduanas y logística para reubicaciones en el extranjero. ¿Le gustaría más información?";
        }

        // Respuesta adicional sobre mudanzas internacionales
        else if (
          lowerInput.includes("mudarse al extranjero") ||
          lowerInput.includes("mudanza al extranjero") ||
          lowerInput.includes("reubicación internacional") ||
          lowerInput.includes("reubicacion internacional") ||
          lowerInput.includes("mudanza al extranjero")
        ) {
          return "¡Mudarse al extranjero puede ser una aventura emocionante! Podemos ayudarle a navegar por la logística y la documentación involucradas. ¿Qué información específica necesita?";
        }

        // Respuesta sobre las regulaciones aduaneras
        else if (
          lowerInput.includes("regulaciones aduaneras") ||
          lowerInput.includes("reglamentaciones aduaneras")
        ) {
          return "Entender las regulaciones aduaneras es importante para las mudanzas internacionales. Podemos proporcionarle consejos sobre los artículos permitidos y la documentación necesaria.";
        }

        // Respuesta sobre el visado
        else if (
          lowerInput.includes("requisitos de visa") ||
          lowerInput.includes("información sobre el visa") ||
          lowerInput.includes("informacion sobre el visa") ||
          lowerInput.includes("más información sobre el visa") ||
          lowerInput.includes("mas informacion sobre el visa") ||
          lowerInput.includes("háblame del visa") ||
          lowerInput.includes("hablame del visa") ||
          lowerInput.includes("habla del visa") ||
          lowerInput.includes("discute el visa") ||
          lowerInput.includes("pregunta sobre el visa") ||
          lowerInput.includes("preguntas sobre el visa") ||
          lowerInput.includes("pregunta de visa") ||
          lowerInput.includes("conversación sobre el visa") ||
          lowerInput.includes("conversacion sobre el visa") ||
          lowerInput.includes("obtener un visa")
        ) {
          return "Los requisitos de visa varían según los países. Es importante verificar las regulaciones específicas para su destino. ¿Necesita ayuda con esto?";
        }

        // Respuesta sobre el envío internacional
        else if (
          lowerInput.includes("envío internacional") ||
          lowerInput.includes("envio internacional") ||
          lowerInput.includes("expedición internacional") ||
          lowerInput.includes("expedicion internacional")
        ) {
          return "Ofrecemos servicios de envío internacional para garantizar que sus bienes lleguen de manera segura a su nuevo hogar. ¿Le gustaría saber más sobre nuestras opciones de envío?";
        }

        // Respuesta sobre asistencia lingüística
        else if (
          lowerInput.includes("asistencia lingüística") ||
          lowerInput.includes("asistencia linguistica")
        ) {
          return "Mudarse a un nuevo país a menudo implica barreras lingüísticas. Podemos proporcionar recursos o recomendaciones para servicios de asistencia lingüística.";
        }

        // Respuesta sobre la adaptación cultural
        else if (
          lowerInput.includes("adaptación cultural") ||
          lowerInput.includes("adaptacion cultural")
        ) {
          return "Podemos ofrecer consejos y recursos para ayudarle a instalarse sin problemas. ¿Le gustaría más información?";
        }

        // Respuesta sobre el seguro internacional
        else if (lowerInput.includes("seguro internacional")) {
          return "Le recomendamos que revise las opciones de seguro internacional para proteger sus bienes durante la mudanza. ¿Necesita ayuda para encontrar la cobertura adecuada?";
        }

        // Respuesta sobre el embalaje para una mudanza internacional
        else if (lowerInput.includes("embalaje para mudanza internacional")) {
          return "El embalaje para una mudanza internacional requiere consideraciones especiales. Podemos darle consejos sobre cómo embalar de manera efectiva y segura para el transporte a larga distancia.";
        }

        // Respuesta sobre mudanza con mascotas
        else if (
          lowerInput.includes("mascotas") ||
          lowerInput.includes("mudanza con mascotas") ||
          lowerInput.includes("mudanza con animales de compañía") ||
          lowerInput.includes("mudanza con animales de compania")
        ) {
          return "Mudarse con mascotas requiere consideraciones especiales. Podemos proporcionar consejos y recursos para garantizar una transición sin problemas para sus amigos peludos. ¿Le gustaría saber más?";
        }

        // Respuesta sobre mudanza para personas mayores
        else if (
          lowerInput.includes("personas mayores") ||
          lowerInput.includes("mudanza para mayores") ||
          lowerInput.includes("mudanza senior")
        ) {
          return "Entendemos que mudarse puede ser especialmente difícil para las personas mayores. Nuestro equipo está capacitado para brindar asistencia compasiva y respetuosa. ¿Cómo podemos ayudarle con su mudanza para mayores?";
        }

        // Respuesta sobre la reubicación de empresas
        else if (
          lowerInput.includes("reubicación de empresa") ||
          lowerInput.includes("reubicacion de empresa") ||
          lowerInput.includes("mudanza de empleados") ||
          lowerInput.includes("mudanza de empleado")
        ) {
          return "Nos especializamos en reubicaciones de empresas y podemos ayudar con las mudanzas de empleados, garantizando una transición sin problemas para su personal. ¡Háganos saber cómo podemos ayudarle!";
        }

        // Respuesta sobre consejos de mudanza de última hora
        else if (
          lowerInput.includes("consejos de última hora") ||
          lowerInput.includes("consejos de ultima hora") ||
          lowerInput.includes("consejos de última minuto") ||
          lowerInput.includes("consejos de ultima minuto") ||
          lowerInput.includes("mudanza de emergencia") ||
          lowerInput.includes("mudanza urgente")
        ) {
          return "Para mudanzas de última hora, concéntrese en lo esencial: empaquete una maleta con ropa, reúna documentos importantes y asegúrese de tener un plan para su día de mudanza. ¿Necesita consejos más específicos?";
        }

        // Respuesta sobre mudanza con plantas
        else if (lowerInput.includes("plantas")) {
          return "Mudarse con plantas requiere cuidados especiales. Piense en cómo protegerlas durante el transporte. ¿Le gustaría consejos sobre tipos específicos de plantas?";
        }

        // Respuesta sobre mudanza de muebles
        else if (
          lowerInput.includes("muebles") ||
          lowerInput.includes("objetos pesados") ||
          lowerInput.includes("grandes objetos")
        ) {
          return "Contamos con el equipo adecuado y personal capacitado para manejar de manera segura muebles pesados y grandes objetos. ¿Tiene piezas específicas en mente para las que necesita ayuda?";
        }

        // Respuesta sobre los servicios de desembalaje
        else if (
          lowerInput.includes("desembalaje") ||
          lowerInput.includes("deembalaje")
        ) {
          return "Nuestro equipo puede ayudarle a desembalar sus bienes y organizar su nuevo espacio. ¿Le gustaría saber más sobre este servicio?";
        }

        // Respuesta sobre mudanza durante la temporada alta
        else if (
          lowerInput.includes("temporada alta") ||
          lowerInput.includes("temporada ocupada")
        ) {
          return "Mudarse durante la temporada alta puede ser más difícil debido a la mayor demanda. Es mejor reservar su mudanza con anticipación. ¿Tiene fechas específicas en mente?";
        }

        // Respuesta sobre mudanza para estudiantes
        else if (
          lowerInput.includes("estudiante") ||
          lowerInput.includes("universidad")
        ) {
          return "Ofrecemos servicios especiales para mudanzas de estudiantes, incluyendo horarios flexibles y tarifas asequibles. ¿Cómo puedo ayudarle con su reubicación?";
        }

        // Respuesta sobre contratos de mudanza
        else if (
          lowerInput.includes("contrato") ||
          lowerInput.includes("acuerdo de mudanza") ||
          lowerInput.includes("acuerdo de mudanza")
        ) {
          return "Antes de su mudanza, proporcionamos un contrato detallado que describe los servicios, costos y condiciones. Es importante leerlo detenidamente. ¿Tiene preguntas sobre términos específicos?";
        }

        // Respuesta sobre el equipo de mudanza
        else if (
          lowerInput.includes("equipo de mudanza") ||
          lowerInput.includes("equipamiento de mudanza") ||
          lowerInput.includes("herramientas")
        ) {
          return "Utilizamos equipo de mudanza especializado para garantizar que sus bienes sean transportados de manera segura. ¿Le gustaría saber más sobre nuestro equipo?";
        }

        // Respuesta sobre las regulaciones locales de mudanza
        else if (
          lowerInput.includes("regulaciones locales") ||
          lowerInput.includes("reglamentaciones locales") ||
          lowerInput.includes("leyes locales") ||
          lowerInput.includes("regulaciones de mudanza") ||
          lowerInput.includes("reglamentaciones de mudanza") ||
          lowerInput.includes("leyes de mudanza")
        ) {
          return "Diferentes áreas pueden tener regulaciones específicas sobre mudanzas. Es mejor verificar con las autoridades locales.";
        }

        // Português

        // Resposta de saudação
        if (
          lowerInput.includes("olá") ||
          lowerInput.includes("ola") ||
          lowerInput === "saudação" ||
          lowerInput === "saudacao" ||
          lowerInput.includes("saudação ") ||
          lowerInput.includes("saudacao ") ||
          lowerInput.includes("saudação,") ||
          lowerInput.includes("saudacao,") ||
          lowerInput.includes("saudação.") ||
          lowerInput.includes("saudacao.") ||
          lowerInput.includes("saudação!") ||
          lowerInput.includes("saudacao!") ||
          lowerInput.includes("saudações") ||
          lowerInput.includes("saudacoes") ||
          lowerInput.includes("bom dia") ||
          lowerInput.includes("boa tarde") ||
          lowerInput.includes("boa noite") ||
          lowerInput.includes("ei") ||
          lowerInput.includes("o que há de novo") ||
          lowerInput.includes("o que ha de novo") ||
          lowerInput.includes("bem-vindo")
        ) {
          return "¡Olá! ¡Bem-vindo à Move It! Como posso ajudá-lo com suas necessidades de mudança hoje?";
        }

        // Resposta de ajuda
        else if (lowerInput.includes("ajuda")) {
          return "¡Claro! Do que você precisa de ajuda em relação à sua mudança? Oferecemos uma variedade de serviços para tornar sua mudança sem complicações.";
        }

        // Resposta de agradecimento
        else if (
          lowerInput.includes("obrigado") ||
          lowerInput.includes("agradeço") ||
          lowerInput.includes("aprecio") ||
          lowerInput.includes("grato")
        ) {
          return "¡De nada! Se você tiver mais perguntas sobre nossos serviços de mudança, não hesite em perguntar.";
        }

        // Resposta de agradecimento adicional
        else if (
          lowerInput.includes("obrigado pela sua ajuda") ||
          lowerInput.includes("agradeço pela sua assistência") ||
          lowerInput.includes("aprecio sua ajuda") ||
          lowerInput.includes("aprecio sua ajuda")
        ) {
          return "¡Fico feliz em poder ajudar! Se você tiver mais perguntas, me avise.";
        }

        // Resposta a um elogio
        if (
          lowerInput.includes("isso é realmente bonito") ||
          lowerInput.includes("isso é bem legal")
        ) {
          return "Obrigado! Estamos felizes que você gostou! Se você tiver mais perguntas ou precisar de ajuda, fique à vontade para nos contatar.";
        }

        // Resposta a um elogio sobre a bondade
        if (
          lowerInput.includes("vocês são gentis") ||
          lowerInput.includes("são muito gentis") ||
          lowerInput.includes("vocês são realmente gentis") ||
          lowerInput.includes("você é gentil") ||
          lowerInput.includes("você é muito gentil") ||
          lowerInput.includes("você é realmente gentil")
        ) {
          return "Muito obrigado! Estou sempre feliz em ajudar! Se você tiver mais perguntas, fique à vontade para perguntar.";
        }

        // Respostas de despedida
        else if (
          lowerInput.includes("adeus") ||
          lowerInput.includes("tchau") ||
          lowerInput.includes("até logo") ||
          lowerInput.includes("ate logo") ||
          lowerInput.includes("até breve") ||
          lowerInput.includes("ate breve") ||
          lowerInput.includes("cuide-se") ||
          lowerInput.includes("até a próxima") ||
          lowerInput.includes("ate a proxima")
        ) {
          return "¡Adeus! ¡Tenha um excelente dia, e lembre-se, mudar pode ser alegre com a ajuda certa!";
        }

        // Respostas de despedida adicionais
        else if (
          lowerInput.includes("até breve") ||
          lowerInput.includes("ate breve") ||
          lowerInput.includes("até logo") ||
          lowerInput.includes("ate logo") ||
          lowerInput.includes("até a próxima vez") ||
          lowerInput.includes("ate a proxima vez") ||
          lowerInput.includes("boa noite")
        ) {
          return "¡Até breve!";
        }

        // Resposta de bem-estar
        else if (
          lowerInput.includes("como você está") ||
          lowerInput.includes("como voce esta") ||
          lowerInput.includes("como estas") ||
          lowerInput.includes("como vai") ||
          lowerInput.includes("como te vai") ||
          lowerInput.includes("como vai a vida") ||
          lowerInput.includes("o que está acontecendo") ||
          lowerInput.includes("o que esta acontecendo") ||
          lowerInput.includes("que está acontecendo") ||
          lowerInput.includes("que esta acontecendo")
        ) {
          return "¡Tudo bem, obrigado! E você?";
        }

        // Resposta para quando o cliente diz que também está bem
        else if (
          lowerInput.includes("estou bem") ||
          lowerInput.includes("estou indo bem") ||
          lowerInput.includes("tudo bem") ||
          lowerInput.includes("me sinto bem") ||
          lowerInput.includes("me sinto ótimo") ||
          lowerInput.includes("estou feliz") ||
          lowerInput.includes("estou contente") ||
          lowerInput.includes("estou excelente")
        ) {
          return "¡Fico feliz em ouvir isso! Se você tiver perguntas específicas sobre nossos serviços de mudança ou qualquer outra coisa, não hesite em perguntar.";
        }

        // Respostas de saudação adicionais
        else if (
          lowerInput.includes("o que há de novo") ||
          lowerInput.includes("o que ha de novo") ||
          lowerInput.includes("como vai") ||
          lowerInput.includes("como vai a vida") ||
          lowerInput.includes("o que está acontecendo") ||
          lowerInput.includes("o que esta acontecendo") ||
          lowerInput.includes("que está acontecendo") ||
          lowerInput.includes("que esta acontecendo")
        ) {
          return "Não muito, só estou aqui para ajudá-lo com suas necessidades de mudança. Como posso ajudá-lo hoje?";
        }

        // Resposta de bem-estar adicional
        else if (
          lowerInput.includes("como vai seu dia") ||
          lowerInput.includes("como vai seu dia") ||
          lowerInput.includes("como vai sua jornada") ||
          lowerInput.includes("como vai sua semana")
        ) {
          return "¡Meu dia está indo bem, obrigado! Como posso ajudá-lo hoje?";
        }

        // Resposta de identidade
        else if (
          lowerInput.includes("qual é o seu nome") ||
          lowerInput.includes("qual e o seu nome") ||
          lowerInput.includes("como você se chama") ||
          lowerInput.includes("como voce se chama") ||
          lowerInput.includes("quem é você") ||
          lowerInput.includes("quem e voce") ||
          lowerInput.includes("apresente-se") ||
          lowerInput.includes("diga seu nome") ||
          lowerInput.includes("repita seu nome")
        ) {
          return "Meu nome é Zane. Sou um representante da Move It, ¡seu assistente para todas as suas necessidades de mudança! Como posso ajudá-lo hoje?";
        }

        // Resposta de identidade adicional
        else if (
          lowerInput.includes("o que você faz") ||
          lowerInput.includes("o que voce faz") ||
          lowerInput.includes("qual é o seu papel") ||
          lowerInput.includes("qual e o seu papel") ||
          lowerInput.includes("qual é o seu propósito") ||
          lowerInput.includes("qual e o seu proposito")
        ) {
          return "Estou aqui para ajudá-lo com todas as suas necessidades de mudança e fornecer informações sobre nossos serviços.";
        }

        // Resposta sobre as capacidades
        else if (
          lowerInput.includes("o que você pode fazer") ||
          lowerInput.includes("o que voce pode fazer") ||
          lowerInput.includes("quais são suas capacidades") ||
          lowerInput.includes("quais sao suas capacidades") ||
          lowerInput.includes("quais serviços você oferece") ||
          lowerInput.includes("quais servicos voce oferece") ||
          lowerInput.includes("que serviços você propõe") ||
          lowerInput.includes("que servicos voce propoe")
        ) {
          return "Posso ajudá-lo com diversas perguntas sobre mudanças, desde mudanças locais até mudanças de longa distância, embalagem e mais. ¡Basta perguntar!";
        }

        // Resposta adicional sobre as capacidades
        else if (
          lowerInput.includes("quais serviços você pode fornecer") ||
          lowerInput.includes("quais servicos voce pode fornecer") ||
          lowerInput.includes("como você pode me ajudar") ||
          lowerInput.includes("como voce pode me ajudar") ||
          lowerInput.includes("quais são suas características") ||
          lowerInput.includes("quais sao suas caracteristicas")
        ) {
          return "Posso ajudá-lo com perguntas sobre logística de mudança, embalagem, armazenamento e mais. ¡Deixe-me saber o que você precisa!";
        }

        // Resposta sobre por que escolher a Move It
        else if (
          lowerInput.includes("por que eu deveria escolher a Move It") ||
          lowerInput.includes("razões para escolher a Move It") ||
          lowerInput.includes("razoes para escolher a Move It")
        ) {
          userState.inquiringAboutWhyChooseMoveIt = true;
          return "Escolher a Move It significa que você conta com uma equipe dedicada para tornar sua mudança o mais tranquila possível. Oferecemos um serviço personalizado, profissionais experientes e uma gama de opções adaptadas às suas necessidades. Nossos preços transparentes, excelente atendimento ao cliente e compromisso com a segurança garantem que seus pertences estejam em boas mãos. Você gostaria de saber mais sobre nossos serviços específicos?";
        }

        // Resposta de acompanhamento sobre por que escolher a Move It
        else if (
          (userState.inquiringAboutWhyChooseMoveIt &&
            lowerInput.includes("sim")) ||
          (userState.inquiringAboutWhyChooseMoveIt && lowerInput.includes("se"))
        ) {
          return "Posso ajudá-lo com diversas perguntas sobre mudanças, desde mudanças locais até mudanças de longa distância, embalagem e mais. ¡Basta perguntar!";
        }

        // Resposta de piada
        else if (
          lowerInput.includes("me conte uma piada") ||
          lowerInput.includes("conte-me uma piada")
        ) {
          return "Por que os mudadores são grandes amigos? ¡Porque eles sempre sabem como levantar seu ânimo!";
        }

        // Resposta sobre o clima
        else if (lowerInput.includes("clima") || lowerInput.includes("tempo")) {
          return "Não posso verificar o clima neste momento, mas sempre é bom planejar sua mudança em um dia ensolarado.";
        }

        // Resposta adicional sobre o clima
        else if (
          lowerInput.includes("previsão") ||
          lowerInput.includes("previsao") ||
          lowerInput.includes("previsão do tempo") ||
          lowerInput.includes("previsao do tempo")
        ) {
          return "Não posso fornecer a previsão, mas sempre é sábio verificar o clima antes de planejar sua mudança.";
        }

        // Resposta sobre notícias
        else if (
          lowerInput.includes("notícias") ||
          lowerInput.includes("noticias") ||
          lowerInput.includes("atualidades")
        ) {
          return "Não posso fornecer atualizações de notícias, mas você pode consultar seu site de notícias favorito para as últimas novidades.";
        }

        // Resposta de ajuda adicional
        else if (
          lowerInput.includes("assistência") ||
          lowerInput.includes("assistencia")
        ) {
          return "¡Claro! Que tipo de assistência específica você precisa para sua mudança? ¡Estou aqui para ajudar!";
        }

        // Resposta sobre serviços de mudança
        else if (
          lowerInput.includes("serviços de mudança") ||
          lowerInput.includes("servicos de mudanca") ||
          lowerInput.includes("ajuda com a mudança") ||
          lowerInput.includes("ajuda com a mudanca") ||
          lowerInput.includes("opções de mudança") ||
          lowerInput.includes("opcoes de mudanca") ||
          lowerInput.includes("serviços de realocação") ||
          lowerInput.includes("servicos de realocacao")
        ) {
          return "Oferecemos uma gama de serviços de mudança, incluindo mudanças locais e de longa distância, embalagem e desembalagem. Como posso ajudá-lo com sua mudança?";
        }

        // Opções de mudança
        else if (
          lowerInput.includes("opções para mudança") ||
          lowerInput.includes("opções de mudança") ||
          lowerInput.includes("o que posso escolher") ||
          lowerInput.includes("quais são as minhas opções") ||
          lowerInput.includes("quais serviços você oferece")
        ) {
          return "Oferecemos uma gama completa de soluções para mudança, incluindo <a href='https://primesolar.github.io/move-it/local-moving.html' rel='noopener noreferrer'><strong>mudanças locais</strong></a>, <a href='https://primesolar.github.io/move-it/long-distance-moving.html' rel='noopener noreferrer'><strong>mudanças de longa distância</strong></a>, <a href='https://primesolar.github.io/move-it/professional-packing.html' rel='noopener noreferrer'><strong>embalagem</strong></a>, <a href='https://primesolar.github.io/move-it/faqs.html' rel='noopener noreferrer'><strong>armazenamento</strong></a>, <a href='https://primesolar.github.io/move-it/faqs.html' rel='noopener noreferrer'><strong>desmontagem/montagem de móveis</strong></a>, e <a href='https://primesolar.github.io/move-it/commercial-moving.html' rel='noopener noreferrer'><strong>mudanças comerciais/escritórios</strong></a>.";
        }

        // Resposta sobre opções de armazenamento
        else if (
          lowerInput.includes("opções de armazenamento") ||
          lowerInput.includes("opcoes de armazenamento")
        ) {
          return "Oferecemos soluções de armazenamento seguras para os itens que você pode não precisar imediatamente em seu novo endereço. Você gostaria de saber mais?";
        }

        // Resposta adicional sobre opções de armazenamento
        else if (
          lowerInput.includes("armazenamento temporário") ||
          lowerInput.includes("armazenamento temporario")
        ) {
          return "Oferecemos soluções de armazenamento temporário para seus pertences durante o processo de mudança. Você gostaria de mais detalhes?";
        }

        // Resposta sobre embalagem
        else if (
          lowerInput === "embalagem" ||
          lowerInput.includes("embalagem") ||
          lowerInput.includes("empacotamento")
        ) {
          userState.inquiringAboutPacking = true;
          return "Nossa equipe oferece serviços de embalagem completos para garantir que seus pertences estejam seguros e bem organizados durante a mudança. Você gostaria de saber mais?";
        }

        // Resposta de acompanhamento para os serviços de embalagem
        else if (
          (userState.inquiringAboutPacking &&
            !userState.inquiringAboutPackingDetailed &&
            lowerInput.includes("sim")) ||
          (userState.inquiringAboutPacking &&
            !userState.inquiringAboutPackingDetailed &&
            lowerInput.includes("se"))
        ) {
          userState.inquiringAboutPackingDetailed = true;
          return "¡Ótimo! Nossos serviços de embalagem incluem o embalamento profissional de seus bens, o fornecimento de materiais de embalagem de alta qualidade e a garantia de que tudo esteja bem embalado para o transporte. Também podemos ajudá-lo a desembalar em seu novo endereço. Você gostaria de agendar uma consulta ou receber um orçamento?";
        }

        // Resposta de acompanhamento para os serviços de embalagem
        else if (
          (userState.inquiringAboutPacking &&
            userState.inquiringAboutPackingDetailed &&
            lowerInput.includes("sim")) ||
          (userState.inquiringAboutPacking &&
            userState.inquiringAboutPackingDetailed &&
            lowerInput.includes("se"))
        ) {
          return "Você pode agendar uma consulta ou receber um orçamento entrando em contato conosco por e-mail em <a href='mailto:contact@move-it.com' rel='noopener noreferrer'>contact@move-it.com</a> ou por telefone em <a href='tel:+442012345678' rel='noopener noreferrer'>+44 20 1234 5678</a>. Nosso escritório está localizado na 123 Victoria St, Londres SW1E 6DE, Reino Unido. Estamos aqui para ajudar com todas as suas perguntas!";
        }

        // Resposta de acompanhamento para os serviços de embalagem
        else if (
          lowerInput.includes("não") ||
          lowerInput.includes("nao") ||
          lowerInput.includes("não interessado") ||
          lowerInput.includes("nao interessado") ||
          lowerInput.includes("não interessada") ||
          lowerInput.includes("nao interessada")
        ) {
          userState.inquiringAboutPacking = false;
          userState.inquiringAboutPackingDetailed = false;
          userState.inquiringAboutWhyChooseMoveIt = false;
          userState.inquiringAboutSpecialItems = false;
          return "Sem problemas! Se você tiver outras perguntas ou precisar de ajuda com algo mais, não hesite em perguntar.";
        }

        // Resposta adicional sobre o embalamento
        else if (
          lowerInput.includes("ajuda com o embalamento") ||
          lowerInput.includes("ajuda ao embalamento")
        ) {
          return "Podemos fornecer ajuda para o embalamento para garantir que seus itens estejam seguros e organizados. Você gostaria de saber mais sobre este serviço?";
        }

        // Resposta sobre mudança local
        if (
          lowerInput.includes(
            "o que você pode me dizer sobre mudanças na cidade"
          ) ||
          lowerInput.includes("pode me falar sobre mudanças na cidade") ||
          lowerInput.includes("fale-me sobre mudança local") ||
          lowerInput.includes(
            "quais serviços você oferece para mudanças na cidade"
          ) ||
          lowerInput.includes(
            "o que você pode me dizer sobre mudanças urbanas"
          ) ||
          lowerInput.includes("info sobre mudanças na cidade") ||
          lowerInput.includes("serviços de mudança na cidade") ||
          lowerInput.includes("detalhes sobre mudança local") ||
          lowerInput.includes(
            "o que você fornece para realocações na cidade"
          ) ||
          lowerInput.includes("sobre mudanças na minha cidade") ||
          lowerInput.includes("como você lida com mudanças locais") ||
          lowerInput.includes(
            "o que está incluído nos serviços de mudança local"
          ) ||
          lowerInput.includes("explique mudanças na cidade") ||
          lowerInput.includes("quais são suas opções de mudança local") ||
          lowerInput.includes("como funcionam as mudanças locais") ||
          lowerInput.includes(
            "você pode fornecer detalhes sobre mudanças na cidade"
          ) ||
          lowerInput.includes("descreva seus serviços para mudanças locais")
        ) {
          return "Oferecemos vários serviços de mudança local adaptados às suas necessidades. Isso inclui <a href='https://primesolar.github.io/move-it/professional-packing.html' rel='noopener noreferrer'><strong>embalagem profissional</strong></a>, <a href='https://primesolar.github.io/move-it/faqs.html' rel='noopener noreferrer'><strong>desmontagem/montagem de móveis</strong></a>, e <a href='https://primesolar.github.io/move-it/contact.html' rel='noopener noreferrer'><strong>opções de agendamento flexíveis</strong></a> para tornar sua mudança o mais tranquila possível. Se você tiver perguntas específicas ou precisar de mais informações, sinta-se à vontade para perguntar!";
        }

        // Resposta sobre a mudança comercial
        else if (
          lowerInput.includes("mudança comercial") ||
          lowerInput.includes("mudanca comercial")
        ) {
          return "Nos especializamos em serviços de mudança comercial adaptados a empresas. Informe-nos se precisar de ajuda para a realocação do seu escritório!";
        }

        // Resposta adicional sobre a mudança comercial
        else if (
          lowerInput.includes("realocação de empresa") ||
          lowerInput.includes("realocacao de empresa")
        ) {
          return "Nos especializamos em realocações de empresas e podemos ajudar a garantir uma transição tranquila para sua companhia. Como podemos ajudar?";
        }

        // Resposta de reserva
        else if (lowerInput.includes("reservar")) {
          return "Reservar uma mudança conosco é fácil! Basta entrar em contato com nossa equipe de atendimento ao cliente com os detalhes da sua mudança, e forneceremos um orçamento e agendaremos conforme sua conveniência.";
        }

        // Resposta adicional sobre a reserva
        else if (
          lowerInput.includes("agendar uma mudança") ||
          lowerInput.includes("agendar uma mudanca")
        ) {
          return "Agendar uma mudança conosco é simples! Basta fornecer seus detalhes à nossa equipe de atendimento ao cliente, e nós cuidaremos do resto.";
        }

        // Resposta adicional sobre a preparação
        else if (
          lowerInput.includes("lista de verificação") ||
          lowerInput.includes("lista de verificacao") ||
          lowerInput.includes("lista de controle")
        ) {
          return "Usar uma lista de verificação para mudanças é uma excelente maneira de se manter organizado. Você pode encontrá-la em nossa <a href='https://primesolar.github.io/move-it/checklist.html' rel='noreferrer noopener'>página de lista de verificação de mudança</a>.";
        }

        // Resposta sobre a preparação
        else if (
          lowerInput.includes("preparar para") ||
          lowerInput.includes("como se preparar")
        ) {
          return "Para se preparar para sua mudança, comece se desfazendo de coisas desnecessárias e embalando uma caixa de itens essenciais. Planeje sua mudança conosco com antecedência para garantir a disponibilidade.";
        }

        // Resposta sobre o custo
        else if (
          lowerInput.includes("quanto custa") ||
          lowerInput.includes("quanto custa") ||
          lowerInput.includes("taxas") ||
          lowerInput.includes("custo") ||
          lowerInput.includes("custo")
        ) {
          return "O custo de uma mudança varia de acordo com fatores como o tipo de serviço, a distância e o tamanho da propriedade. Entre em contato conosco para obter um orçamento gratuito e sem compromisso!";
        }

        // Resposta adicional sobre a estimativa
        else if (
          lowerInput.includes("estimativa") ||
          lowerInput.includes("estimativa")
        ) {
          return "Para uma estimativa precisa, forneça detalhes sobre sua mudança, e entraremos em contato com você com um orçamento!";
        }

        // Resposta sobre descontos
        else if (
          lowerInput.includes("desconto") ||
          lowerInput.includes("promoção") ||
          lowerInput.includes("promocao")
        ) {
          return "Sim, oferecemos vários descontos e promoções para tornar sua mudança mais acessível, incluindo ofertas sazonais e descontos por indicação. Não se esqueça de perguntar sobre as promoções atuais ao solicitar um orçamento!";
        }

        // Resposta adicional sobre ofertas especiais
        else if (lowerInput.includes("ofertas especiais")) {
          return "Frequentemente temos ofertas especiais disponíveis. Não se esqueça de perguntar sobre as promoções atuais quando nos contatar!";
        }

        // Resposta de contato
        else if (
          lowerInput.includes("contatar") ||
          lowerInput.includes("e-mail") ||
          lowerInput.includes("email") ||
          lowerInput.includes("telefone")
        ) {
          return "Você pode entrar em contato conosco por e-mail em <a href='mailto:contact@move-it.com' rel='noopener noreferrer'>contact@move-it.com</a> ou por telefone em <a href='tel:+442012345678' rel='noopener noreferrer'>+44 20 1234 5678</a>. Nosso escritório está localizado na 123 Victoria St, Londres SW1E 6DE, Reino Unido. Estamos aqui para ajudar!";
        }

        // Resposta adicional de contato
        else if (lowerInput.includes("contatar")) {
          return "Você pode nos contatar pelo endereço de e-mail <a href='mailto:contact@move-it.com' rel='noopener noreferrer'>contact@move-it.com</a> ou pelo número de telefone <a href='tel:+442012345678' rel='noopener noreferrer'>+44 20 1234 5678</a>. Nosso escritório está localizado na 123 Victoria St, Londres SW1E 6DE, Reino Unido. Estamos aqui para ajudar com todas as suas perguntas!";
        }

        // Resposta sobre o tempo de mudança
        else if (
          lowerInput.includes("quanto tempo leva") ||
          lowerInput.includes("cronograma de mudança") ||
          lowerInput.includes("cronograma de mudanca") ||
          lowerInput.includes("duração da mudança") ||
          lowerInput.includes("duracao da mudanca")
        ) {
          return "A duração de uma mudança pode variar dependendo da distância e da quantidade de bens. Em geral, mudanças locais podem ser concluídas em um dia, enquanto mudanças de longa distância podem levar vários dias. Você gostaria de uma estimativa mais precisa?";
        }

        // Resposta sobre o seguro
        else if (lowerInput.includes("seguro")) {
          return "Oferecemos várias opções de seguro para proteger seus bens durante a mudança. É importante discutir essas opções com nossa equipe para encontrar a melhor cobertura para suas necessidades.";
        }

        // Resposta sobre suprimentos de mudança
        else if (
          lowerInput.includes("suprimentos de mudança") ||
          lowerInput.includes("suprimentos de mudanca") ||
          lowerInput.includes("caixas") ||
          lowerInput.includes("materiais de embalagem")
        ) {
          return "Fornecemos uma variedade de suprimentos de mudança, incluindo caixas, fita adesiva e materiais de embalagem. Você gostaria de saber mais sobre nossas opções de suprimentos?";
        }

        // Resposta sobre itens especiais
        else if (
          lowerInput.includes("itens especiais") ||
          lowerInput.includes("itens especiais") ||
          lowerInput.includes("frágil") ||
          lowerInput.includes("fragil") ||
          lowerInput.includes("instrumento musical") ||
          lowerInput.includes("guitarra") ||
          lowerInput.includes("violino") ||
          lowerInput.includes("violin") ||
          lowerInput.includes("trompete") ||
          lowerInput.includes("tambor") ||
          lowerInput.includes("piano") ||
          lowerInput.includes("obra de arte") ||
          lowerInput.includes("peça de arte") ||
          lowerInput.includes("peca de arte") ||
          lowerInput.includes("antiguidades")
        ) {
          userState.inquiringAboutSpecialItems = true;
          return "Temos experiência no manuseio de itens especiais como instrumentos musicais, obras de arte e antiguidades. Nossa equipe toma precauções adicionais para garantir que esses itens sejam transportados com segurança. Você gostaria de saber mais?";
        }

        // Resposta para o tratamento de itens especiais
        else if (
          (userState.inquiringAboutSpecialItems &&
            lowerInput.includes("sim")) ||
          lowerInput.includes("tenho") ||
          lowerInput.includes("itens específicos") ||
          lowerInput.includes("itens especificos")
        ) {
          return "Ótimo! Posso lhe dar mais detalhes sobre como tratamos os itens especiais. Por exemplo, temos técnicas de embalagem especiais para pianos e obras de arte para garantir que cheguem com segurança.";
        }

        // Resposta para perguntar sobre processos de tratamento
        else if (
          (userState.inquiringAboutSpecialItems &&
            lowerInput.includes("como vocês manuseiam")) ||
          lowerInput.includes("como voces manuseiam") ||
          lowerInput.includes("como manuseiam") ||
          lowerInput.includes("qual é o seu processo?") ||
          lowerInput.includes("qual e o seu processo?") ||
          lowerInput.includes("qual é seu processo?") ||
          lowerInput.includes("qual e seu processo?")
        ) {
          return "Utilizamos materiais e técnicas de embalagem especializadas para proteger os itens especiais durante o transporte. Nossa equipe é treinada para manusear objetos frágeis e valiosos com cuidado, garantindo que estejam devidamente embalados e transportados.";
        }

        // Resposta para itens especiais não presentes
        else if (
          (userState.inquiringAboutSpecialItems &&
            lowerInput.includes("não tenho")) ||
          lowerInput.includes("nao tenho")
        ) {
          userState.inquiringAboutSpecialItems = false;
          return "Sem problemas! Se você tiver outras perguntas sobre nossos serviços de mudança ou precisar de ajuda com sua mudança, não hesite em perguntar.";
        }

        // Resposta sobre dicas de mudança
        else if (
          lowerInput.includes("dicas de mudança") ||
          lowerInput.includes("dicas de mudanca")
        ) {
          return "Aqui estão algumas dicas rápidas para mudar: comece a embalar cedo, rotule suas caixas e mantenha documentos importantes separados. Você gostaria de dicas mais detalhadas?";
        }

        // Resposta sobre áreas de serviço
        else if (
          lowerInput.includes("áreas de serviço") ||
          lowerInput.includes("areas de servico") ||
          lowerInput.includes("localizações") ||
          lowerInput.includes("localizacoes")
        ) {
          return "Atendemos a uma ampla gama de áreas! Por favor, informe-nos sua localização atual e seu destino, e poderemos confirmar se podemos ajudar.";
        }

        // Resposta sobre opções de pagamento
        else if (
          lowerInput.includes("opções de pagamento") ||
          lowerInput.includes("opcoes de pagamento") ||
          lowerInput.includes("pagar")
        ) {
          return "Aceitamos vários métodos de pagamento, incluindo cartões de crédito, transferências bancárias e dinheiro. Por favor, pergunte à nossa equipe mais detalhes durante o processo de reserva.";
        }

        // Resposta sobre a política de cancelamento
        else if (
          lowerInput.includes("política de cancelamento") ||
          lowerInput.includes("politica de cancelamento") ||
          lowerInput.includes("cancelar")
        ) {
          return "Entendemos que os planos podem mudar. Nossa política de cancelamento permite que você cancele ou reprograma sua mudança com aviso prévio. Por favor, entre em contato conosco para detalhes específicos.";
        }

        // Resposta sobre os procedimentos do dia da mudança
        else if (
          lowerInput.includes("dia da mudança") ||
          lowerInput.includes("dia da mudanca") ||
          lowerInput.includes("o que esperar") ||
          lowerInput.includes("que esperar")
        ) {
          return "No dia da mudança, nossa equipe chegará pontualmente, pronta para embalar e carregar seus bens. Manteremos você informado durante todo o processo. Você tem alguma preocupação específica sobre o dia da mudança?";
        }

        // Resposta sobre opções ecológicas
        else if (
          lowerInput.includes("ecológico") ||
          lowerInput.includes("ecologico") ||
          lowerInput.includes("sustentável") ||
          lowerInput.includes("sustentavel")
        ) {
          return "Oferecemos opções de mudança ecológicas, incluindo materiais de embalagem reutilizáveis e práticas sustentáveis. Informe-nos se você está interessado em nossas soluções de mudança verde!";
        }

        // Resposta sobre mudanças internacionais
        else if (
          lowerInput.includes("mudança internacional") ||
          lowerInput.includes("mudanca internacional") ||
          lowerInput.includes("para o exterior")
        ) {
          return "Também podemos ajudá-lo com mudanças internacionais! Nossa equipe tem experiência em gerenciar alfândega e logística para realocações no exterior. Você gostaria de mais informações?";
        }

        // Resposta adicional sobre mudanças internacionais
        else if (
          lowerInput.includes("mudar para o exterior") ||
          lowerInput.includes("mudança para o exterior") ||
          lowerInput.includes("mudanca para o exterior") ||
          lowerInput.includes("realocação internacional") ||
          lowerInput.includes("realocacao internacional")
        ) {
          return "Mudar para o exterior pode ser uma aventura emocionante! Podemos ajudá-lo a navegar pela logística e documentação envolvidas. Que informações específicas você precisa?";
        }

        // Resposta sobre as regulamentações aduaneiras
        else if (
          lowerInput.includes("regulamentações aduaneiras") ||
          lowerInput.includes("regulamentacoes aduaneiras")
        ) {
          return "Entender as regulamentações aduaneiras é importante para mudanças internacionais. Podemos fornecer dicas sobre os itens permitidos e a documentação necessária.";
        }

        // Resposta sobre a documentação necessária
        else if (
          lowerInput.includes("documentação necessária") ||
          lowerInput.includes("documentacao necessaria")
        ) {
          return "Para mudanças internacionais, você precisará de documentos como passaporte, visto e, em alguns casos, uma lista de inventário dos itens que está levando. Nossa equipe pode ajudá-lo a entender quais documentos são necessários para sua situação específica.";
        }

        // Resposta sobre o rastreamento da mudança
        else if (
          lowerInput.includes("rastrear mudança") ||
          lowerInput.includes("rastrear mudanca")
        ) {
          return "Oferecemos opções de rastreamento para que você possa acompanhar o progresso da sua mudança. Entre em contato com nossa equipe para obter mais informações sobre como rastrear sua mudança.";
        }

        // Resposta sobre a experiência da equipe
        else if (
          lowerInput.includes("experiência da equipe") ||
          lowerInput.includes("experiencia da equipe")
        ) {
          return "Nossa equipe é altamente treinada e possui anos de experiência em mudanças. Estamos comprometidos em garantir que sua mudança seja realizada de forma eficiente e segura.";
        }

        // Resposta sobre a preparação para mudanças de última hora
        else if (
          lowerInput.includes("mudança de última hora") ||
          lowerInput.includes("mudanca de ultima hora")
        ) {
          return "Entendemos que mudanças de última hora podem ser estressantes. Nossa equipe está pronta para ajudar a organizar sua mudança rapidamente. Entre em contato para discutir suas necessidades específicas.";
        }

        // Resposta sobre a limpeza após a mudança
        else if (
          lowerInput.includes("limpeza após a mudança") ||
          lowerInput.includes("limpeza apos a mudanca")
        ) {
          return "Oferecemos serviços de limpeza após a mudança para garantir que seu novo espaço esteja pronto para ser habitado. Informe-nos se você gostaria de incluir esse serviço em sua mudança.";
        }

        // Resposta sobre a montagem de móveis
        else if (
          lowerInput.includes("montagem de móveis") ||
          lowerInput.includes("montagem de moveis")
        ) {
          return "Nossa equipe pode ajudar com a montagem de móveis após a mudança. Se você precisar desse serviço, basta nos informar ao agendar sua mudança.";
        }

        // Resposta sobre a política de responsabilidade
        else if (
          lowerInput.includes("política de responsabilidade") ||
          lowerInput.includes("politica de responsabilidade")
        ) {
          return "Temos uma política de responsabilidade que cobre danos a seus bens durante o transporte. É importante discutir isso com nossa equipe para entender a cobertura disponível.";
        }

        // Resposta sobre a experiência do cliente
        else if (
          lowerInput.includes("experiência do cliente") ||
          lowerInput.includes("experiencia do cliente")
        ) {
          return "Valorizamos a experiência do cliente e estamos sempre buscando maneiras de melhorar nossos serviços. Se você tiver feedback ou sugestões, adoraríamos ouvir!";
        }

        // Resposta sobre a flexibilidade de agendamento
        else if (lowerInput.includes("flexibilidade de agendamento")) {
          return "Oferecemos flexibilidade de agendamento para atender às suas necessidades. Entre em contato conosco para discutir as opções disponíveis para sua mudança.";
        }

        // Resposta sobre a segurança dos bens
        else if (
          lowerInput.includes("segurança dos bens") ||
          lowerInput.includes("seguranca dos bens")
        ) {
          return "A segurança dos seus bens é nossa prioridade. Utilizamos técnicas de embalagem seguras e transportamos seus itens com cuidado para garantir que cheguem ao seu destino em perfeitas condições.";
        }

        // Resposta sobre os requisitos de visto
        else if (
          lowerInput.includes("requisitos de visto") ||
          lowerInput.includes("informação sobre o visto") ||
          lowerInput.includes("informacao sobre o visto") ||
          lowerInput.includes("mais informações sobre o visto") ||
          lowerInput.includes("mais informacoes sobre o visto") ||
          lowerInput.includes("mas informacao sobre o visto") ||
          lowerInput.includes("fale-me sobre o visto") ||
          lowerInput.includes("fale-me do visto") ||
          lowerInput.includes("fale sobre o visto") ||
          lowerInput.includes("discuta o visto") ||
          lowerInput.includes("pergunte sobre o visto") ||
          lowerInput.includes("perguntas sobre o visto") ||
          lowerInput.includes("pergunta de visto") ||
          lowerInput.includes("conversa sobre o visto") ||
          lowerInput.includes("conversacao sobre o visto") ||
          lowerInput.includes("obter um visto")
        ) {
          return "Os requisitos de visto variam de acordo com os países. É importante verificar as regulamentações específicas para o seu destino. Você precisa de ajuda com isso?";
        }

        // Resposta sobre envio internacional
        else if (
          lowerInput.includes("envio internacional") ||
          lowerInput.includes("expedição internacional") ||
          lowerInput.includes("expedicao internacional")
        ) {
          return "Oferecemos serviços de envio internacional para garantir que seus bens cheguem com segurança ao seu novo lar. Você gostaria de saber mais sobre nossas opções de envio?";
        }

        // Resposta sobre assistência linguística
        else if (
          lowerInput.includes("assistência linguística") ||
          lowerInput.includes("assistencia linguistica")
        ) {
          return "Mudar para um novo país muitas vezes envolve barreiras linguísticas. Podemos fornecer recursos ou recomendações para serviços de assistência linguística.";
        }

        // Resposta sobre adaptação cultural
        else if (
          lowerInput.includes("adaptação cultural") ||
          lowerInput.includes("adaptacao cultural")
        ) {
          return "Podemos oferecer dicas e recursos para ajudá-lo a se instalar sem problemas. Você gostaria de mais informações?";
        }

        // Resposta sobre seguro internacional
        else if (lowerInput.includes("seguro internacional")) {
          return "Recomendamos que você revise as opções de seguro internacional para proteger seus bens durante a mudança. Você precisa de ajuda para encontrar a cobertura adequada?";
        }

        // Resposta sobre embalagem para uma mudança internacional
        else if (
          lowerInput.includes("embalagem para mudança internacional") ||
          lowerInput.includes("embalagem para mudanca internacional")
        ) {
          return "A embalagem para uma mudança internacional requer considerações especiais. Podemos lhe dar dicas sobre como embalar de forma eficaz e segura para o transporte de longa distância.";
        }

        // Resposta sobre mudança com animais de estimação
        else if (
          lowerInput.includes("animais de estimação") ||
          lowerInput.includes("animais de estimacao") ||
          lowerInput.includes("mudança com animais de estimação") ||
          lowerInput.includes("mudanca com animais de estimacao") ||
          lowerInput.includes("mudança com bichos de estimação") ||
          lowerInput.includes("mudanca com bichos de estimacao") ||
          lowerInput.includes("mudança com animais de compania") ||
          lowerInput.includes("mudanca com animais de compania")
        ) {
          return "Mudar com animais de estimação requer considerações especiais. Podemos fornecer dicas e recursos para garantir uma transição tranquila para seus amigos peludos. Você gostaria de saber mais?";
        }

        // Resposta sobre mudança para idosos
        else if (
          lowerInput.includes("idosos") ||
          lowerInput.includes("mudança para idosos") ||
          lowerInput.includes("mudanca para idosos") ||
          lowerInput.includes("mudança sênior") ||
          lowerInput.includes("mudanca senior")
        ) {
          return "Entendemos que mudar pode ser especialmente difícil para os idosos. Nossa equipe está treinada para oferecer assistência compassiva e respeitosa. Como podemos ajudá-lo com sua mudança para idosos?";
        }

        // Resposta sobre realocação de empresas
        else if (
          lowerInput.includes("realocação de empresa") ||
          lowerInput.includes("realocacao de empresa") ||
          lowerInput.includes("mudança de funcionários") ||
          lowerInput.includes("mudanca de funcionarios") ||
          lowerInput.includes("mudança de empregado") ||
          lowerInput.includes("mudanca de empregado")
        ) {
          return "Nos especializamos em realocações de empresas e podemos ajudar com as mudanças de funcionários, garantindo uma transição tranquila para seu pessoal. Informe-nos como podemos ajudar!";
        }

        // Resposta sobre dicas de mudança de última hora
        else if (
          lowerInput.includes("dicas de última hora") ||
          lowerInput.includes("dicas de ultima hora") ||
          lowerInput.includes("dicas de último minuto") ||
          lowerInput.includes("dicas de ultimo minuto") ||
          lowerInput.includes("mudança de emergência") ||
          lowerInput.includes("mudanca de emergencia") ||
          lowerInput.includes("mudança urgente") ||
          lowerInput.includes("mudanca urgente")
        ) {
          return "Para mudanças de última hora, concentre-se no essencial: embale uma mala com roupas, reúna documentos importantes e tenha um plano para o seu dia de mudança. Você precisa de dicas mais específicas?";
        }

        // Resposta sobre mudança com plantas
        else if (lowerInput.includes("plantas")) {
          return "Mudar com plantas requer cuidados especiais. Pense em como protegê-las durante o transporte. Você gostaria de dicas sobre tipos específicos de plantas?";
        }

        // Resposta sobre mudança de móveis
        else if (
          lowerInput.includes("móveis") ||
          lowerInput.includes("moveis") ||
          lowerInput.includes("objetos pesados") ||
          lowerInput.includes("grandes objetos")
        ) {
          return "Temos a equipe adequada e o pessoal treinado para manusear com segurança móveis pesados e grandes objetos. Você tem peças específicas em mente para as quais precisa de ajuda?";
        }

        // Resposta sobre os serviços de desembalagem
        else if (
          lowerInput.includes("desembalagem") ||
          lowerInput.includes("deembalagem")
        ) {
          return "Nossa equipe pode ajudá-lo a desembalar seus bens e organizar seu novo espaço. Você gostaria de saber mais sobre este serviço?";
        }

        // Resposta sobre mudança durante a alta temporada
        else if (
          lowerInput.includes("alta temporada") ||
          lowerInput.includes("temporada ocupada")
        ) {
          return "Mudar durante a alta temporada pode ser mais difícil devido à maior demanda. É melhor reservar sua mudança com antecedência. Você tem datas específicas em mente?";
        }

        // Resposta sobre mudança para estudantes
        else if (
          lowerInput.includes("estudante") ||
          lowerInput.includes("universidade")
        ) {
          return "Oferecemos serviços especiais para mudanças de estudantes, incluindo horários flexíveis e tarifas acessíveis. Como posso ajudá-lo com sua realocação?";
        }

        // Resposta sobre contratos de mudança
        else if (
          lowerInput.includes("contrato") ||
          lowerInput.includes("acordo de mudança") ||
          lowerInput.includes("acordo de mudança")
        ) {
          return "Antes da sua mudança, fornecemos um contrato detalhado que descreve os serviços, custos e condições. É importante lê-lo atentamente. Você tem perguntas sobre termos específicos?";
        }

        // Resposta sobre a equipe de mudança
        else if (
          lowerInput.includes("equipe de mudança") ||
          lowerInput.includes("equipe de mudanca") ||
          lowerInput.includes("equipamento de mudança") ||
          lowerInput.includes("equipamento de mudanca") ||
          lowerInput.includes("ferramentas")
        ) {
          return "Utilizamos equipamentos de mudança especializados para garantir que seus bens sejam transportados com segurança. Você gostaria de saber mais sobre nosso equipamento?";
        }

        // Resposta sobre as regulamentações locais de mudança
        else if (
          lowerInput.includes("regulamentações locais") ||
          lowerInput.includes("regulamentacoes locais") ||
          lowerInput.includes("leis locais") ||
          lowerInput.includes("regulamentações de mudança") ||
          lowerInput.includes("regulamentacoes de mudanca") ||
          lowerInput.includes("leis de mudança") ||
          lowerInput.includes("leis de mudanca")
        ) {
          return "Diferentes áreas podem ter regulamentações específicas sobre mudanças. É melhor verificar com as autoridades locais.";
        }

        // عربي

        // رد تحية
        if (
          lowerInput.includes("مرحبًا") ||
          lowerInput.includes("مرحبا") ||
          lowerInput.includes("اهلا") ||
          lowerInput === "تحية" ||
          lowerInput === "تحيه" ||
          lowerInput.includes("تحية ") ||
          lowerInput.includes("تحيه ") ||
          lowerInput.includes("تحية،") ||
          lowerInput.includes("تحيه،") ||
          lowerInput.includes("تحية.") ||
          lowerInput.includes("تحيه.") ||
          lowerInput.includes("تحية!") ||
          lowerInput.includes("تحيه!") ||
          lowerInput.includes("تحيات") ||
          lowerInput.includes("تحيات") ||
          lowerInput.includes("صباح الخير") ||
          lowerInput.includes("مساء الخير") ||
          lowerInput.includes("تصبح على خير") ||
          lowerInput.includes("هاي") ||
          lowerInput.includes("ما الجديد") ||
          lowerInput.includes("ما هو الجديد") ||
          lowerInput.includes("مرحبًا بك")
        ) {
          return "مرحبًا! مرحبًا بك في Move It! كيف يمكنني مساعدتك في احتياجاتك للانتقال اليوم؟";
        }

        // رد مساعدة
        else if (lowerInput.includes("مساعدة")) {
          return "بالطبع! ماذا تحتاج من مساعدة بخصوص انتقالك؟ نحن نقدم مجموعة متنوعة من الخدمات لجعل انتقالك خاليًا من المتاعب.";
        }

        // رد على مجاملة
        if (
          lowerInput.includes("هذا جميل جداً") ||
          lowerInput.includes("هذا بالفعل لطيف")
        ) {
          return "شكراً! نحن سعداء لأنه أعجبك! إذا كان لديك المزيد من الأسئلة أو تحتاج إلى مساعدة، فلا تتردد في التواصل معنا.";
        }

        // رد على مجاملة حول اللطف
        if (
          lowerInput.includes("أنتم لطفاء") ||
          lowerInput.includes("أنتم لطيفون جداً") ||
          lowerInput.includes("أنتم حقًا لطفاء") ||
          lowerInput.includes("أنت لطيف") ||
          lowerInput.includes("أنت لطيف جدًا") ||
          lowerInput.includes("أنت حقًا لطيف")
        ) {
          return "شكراً جزيلاً! أنا دائماً سعيد بمساعدتك! إذا كان لديك المزيد من الأسئلة، فلا تتردد في السؤال.";
        }

        // رد شكر
        else if (
          lowerInput.includes("شكرًا") ||
          lowerInput.includes("أشكر") ||
          lowerInput.includes("أقدر") ||
          lowerInput.includes("ممتن")
        ) {
          return "على الرحب والسعة! إذا كان لديك المزيد من الأسئلة حول خدماتنا للانتقال، فلا تتردد في السؤال.";
        }

        // رد شكر إضافي
        else if (
          lowerInput.includes("شكرًا على مساعدتك") ||
          lowerInput.includes("أشكر على مساعدتك") ||
          lowerInput.includes("أقدر مساعدتك") ||
          lowerInput.includes("أقدر مساعدتك")
        ) {
          return "سعيد لأنني استطعت المساعدة! إذا كان لديك المزيد من الأسئلة، فأخبرني.";
        }

        // ردود وداع
        else if (
          lowerInput.includes("وداعًا") ||
          lowerInput.includes("إلى اللقاء") ||
          lowerInput.includes("أراك لاحقًا") ||
          lowerInput.includes("إلى اللقاء") ||
          lowerInput.includes("أراك قريبًا") ||
          lowerInput.includes("اعتن بنفسك") ||
          lowerInput.includes("إلى اللقاء في المرة القادمة") ||
          lowerInput.includes("إلى اللقاء في المرة القادمة")
        ) {
          return "وداعًا! أتمنى لك يومًا رائعًا، وتذكر، الانتقال يمكن أن يكون ممتعًا مع المساعدة الصحيحة!";
        }

        // ردود وداع إضافية
        else if (
          lowerInput.includes("أراك قريبًا") ||
          lowerInput.includes("إلى اللقاء") ||
          lowerInput.includes("أراك لاحقًا") ||
          lowerInput.includes("إلى اللقاء") ||
          lowerInput.includes("إلى اللقاء في المرة القادمة") ||
          lowerInput.includes("أراك في المرة القادمة") ||
          lowerInput.includes("تصبح على خير")
        ) {
          return "أراك قريبًا!";
        }

        // رد عن الحالة
        else if (
          lowerInput.includes("كيف حالك") ||
          lowerInput.includes("كيف حالك") ||
          lowerInput.includes("كيف حالك") ||
          lowerInput.includes("كيف تسير الأمور") ||
          lowerInput.includes("كيف تسير الحياة") ||
          lowerInput.includes("ما الذي يحدث") ||
          lowerInput.includes("ما الذي يحدث") ||
          lowerInput.includes("ما الذي يحدث") ||
          lowerInput.includes("ما الذي يحدث")
        ) {
          return "أنا بخير، شكرًا! وأنت؟";
        }

        // رد عندما يقول العميل إنه بخير أيضًا
        else if (
          lowerInput.includes("أنا بخير") ||
          lowerInput.includes("أنا بخير") ||
          lowerInput.includes("كل شيء على ما يرام") ||
          lowerInput.includes("أشعر بخير") ||
          lowerInput.includes("أشعر رائعًا") ||
          lowerInput.includes("أنا سعيد") ||
          lowerInput.includes("أنا راضٍ") ||
          lowerInput.includes("أنا ممتاز")
        ) {
          return "سعيد لسماع ذلك! إذا كان لديك أسئلة محددة حول خدماتنا للانتقال أو أي شيء آخر، فلا تتردد في السؤال.";
        }

        // ردود تحية إضافية
        else if (
          lowerInput.includes("ما الجديد") ||
          lowerInput.includes("ما هو الجديد") ||
          lowerInput.includes("كيف تسير الأمور") ||
          lowerInput.includes("كيف تسير الحياة") ||
          lowerInput.includes("ما الذي يحدث") ||
          lowerInput.includes("ما الذي يحدث") ||
          lowerInput.includes("ما الذي يحدث") ||
          lowerInput.includes("ما الذي يحدث")
        ) {
          return "ليس كثيرًا، أنا هنا فقط لمساعدتك في احتياجاتك للانتقال. كيف يمكنني مساعدتك اليوم؟";
        }

        // رد عن الحالة الإضافية
        else if (
          lowerInput.includes("كيف كان يومك") ||
          lowerInput.includes("كيف كان يومك") ||
          lowerInput.includes("كيف تسير رحلتك") ||
          lowerInput.includes("كيف تسير أسبوعك")
        ) {
          return "يومي يسير بشكل جيد، شكرًا! كيف يمكنني مساعدتك اليوم؟";
        }

        // رد عن الهوية
        else if (
          lowerInput.includes("ما اسمك") ||
          lowerInput.includes("ما هو اسمك") ||
          lowerInput.includes("كيف تُدعى") ||
          lowerInput.includes("كيف تُدعى") ||
          lowerInput.includes("من أنت") ||
          lowerInput.includes("من أنت") ||
          lowerInput.includes("قدّم نفسك") ||
          lowerInput.includes("قل اسمك") ||
          lowerInput.includes("كرر اسمك")
        ) {
          return "اسمي زين. أنا ممثل من Move It، مساعدك في جميع احتياجاتك للانتقال! كيف يمكنني مساعدتك اليوم؟";
        }

        // رد عن الهوية الإضافية
        else if (
          lowerInput.includes("ماذا تفعل") ||
          lowerInput.includes("ماذا تفعل") ||
          lowerInput.includes("ما هو دورك") ||
          lowerInput.includes("ما هو دورك") ||
          lowerInput.includes("ما هو هدفك") ||
          lowerInput.includes("ما هو هدفك")
        ) {
          return "أنا هنا لمساعدتك في جميع احتياجاتك للانتقال وتقديم المعلومات حول خدماتنا.";
        }

        // رد حول القدرات
        else if (
          lowerInput.includes("ماذا يمكنك أن تفعل") ||
          lowerInput.includes("ماذا يمكنك أن تفعل") ||
          lowerInput.includes("ما هي قدراتك") ||
          lowerInput.includes("ما هي قدراتك") ||
          lowerInput.includes("ما هي الخدمات التي تقدمها") ||
          lowerInput.includes("ما هي الخدمات التي تقدمها") ||
          lowerInput.includes("ما هي الخدمات التي تقترحها") ||
          lowerInput.includes("ما هي الخدمات التي تقترحها")
        ) {
          return "يمكنني مساعدتك في مجموعة متنوعة من الأسئلة حول الانتقال، من الانتقالات المحلية إلى الانتقالات الطويلة، التعبئة والمزيد. فقط اسأل!";
        }

        // رد إضافي حول القدرات
        else if (
          lowerInput.includes("ما هي الخدمات التي يمكنك تقديمها") ||
          lowerInput.includes("ما هي الخدمات التي يمكنك تقديمها") ||
          lowerInput.includes("كيف يمكنك مساعدتي") ||
          lowerInput.includes("كيف يمكنك مساعدتي") ||
          lowerInput.includes("ما هي ميزاتك") ||
          lowerInput.includes("ما هي ميزاتك")
        ) {
          return "يمكنني مساعدتك في الأسئلة حول لوجستيات الانتقال، التعبئة، التخزين والمزيد. دعني أعرف ما تحتاجه!";
        }

        // رد حول لماذا تختار Move It
        else if (
          lowerInput.includes("لماذا يجب أن أختار Move It") ||
          lowerInput.includes("أسباب لاختيار Move It") ||
          lowerInput.includes("أسباب لاختيار Move It")
        ) {
          userState.inquiringAboutWhyChooseMoveIt = true;
          return "اختيار Move It يعني أنك تحصل على فريق مخصص لجعل انتقالك سلسًا قدر الإمكان. نحن نقدم خدمة مخصصة، محترفين ذوي خبرة، ومجموعة من الخيارات التي تناسب احتياجاتك. أسعارنا الشفافة، خدمة العملاء الممتازة، والالتزام بالأمان يضمن أن ممتلكاتك في أيدٍ أمينة. هل ترغب في معرفة المزيد عن خدماتنا المحددة؟";
        }

        // رد متابعة حول لماذا تختار Move It
        else if (
          (userState.inquiringAboutWhyChooseMoveIt &&
            lowerInput.includes("نعم")) ||
          lowerInput.includes("نعم")
        ) {
          return "يمكنني مساعدتك في مجموعة متنوعة من الأسئلة حول الانتقالات، من الانتقالات المحلية إلى الانتقالات الطويلة، التعبئة والمزيد. فقط اسأل!";
        }

        // رد عن نكتة
        else if (
          lowerInput.includes("أخبرني بنكتة") ||
          lowerInput.includes("احكي لي نكتة")
        ) {
          return "لماذا يعتبر الناقلون أصدقاء عظماء؟ لأنهم دائمًا يعرفون كيف يرفعون معنوياتك!";
        }

        // رد حول الطقس
        else if (lowerInput.includes("الطقس") || lowerInput.includes("الجو")) {
          return "لا أستطيع التحقق من الطقس في هذه اللحظة، لكن من الجيد دائمًا التخطيط لانتقالك في يوم مشمس.";
        }

        // رد إضافي حول الطقس
        else if (
          lowerInput.includes("توقعات") ||
          lowerInput.includes("توقعات") ||
          lowerInput.includes("توقعات الطقس") ||
          lowerInput.includes("توقعات الطقس")
        ) {
          return "لا أستطيع تقديم التوقعات، لكن من الحكمة دائمًا التحقق من الطقس قبل التخطيط لانتقالك.";
        }

        // رد حول الأخبار
        else if (
          lowerInput.includes("الأخبار") ||
          lowerInput.includes("أخبار") ||
          lowerInput.includes("التحديثات")
        ) {
          return "لا أستطيع تقديم تحديثات الأخبار، لكن يمكنك التحقق من موقع الأخبار المفضل لديك لأحدث الأخبار.";
        }

        // رد المساعدة الإضافية
        else if (
          lowerInput.includes("مساعدة") ||
          lowerInput.includes("مساعده")
        ) {
          return "بالطبع! ما نوع المساعدة المحددة التي تحتاجها لانتقالك؟ أنا هنا للمساعدة!";
        }

        // رد حول خدمات الانتقال
        else if (
          lowerInput.includes("خدمات الانتقال") ||
          lowerInput.includes("خدمات النقل") ||
          lowerInput.includes("مساعدة في الانتقال") ||
          lowerInput.includes("مساعدة في النقل") ||
          lowerInput.includes("خيارات الانتقال") ||
          lowerInput.includes("خيارات النقل") ||
          lowerInput.includes("خدمات إعادة التوطين") ||
          lowerInput.includes("خدمات إعادة التوطين")
        ) {
          return "نقدم مجموعة من خدمات الانتقال، بما في ذلك الانتقالات المحلية وطويلة المدى، التعبئة والتفريغ. كيف يمكنني مساعدتك في انتقالك؟";
        }

        // رد حول خيارات التخزين
        else if (
          lowerInput.includes("خيارات التخزين") ||
          lowerInput.includes("خيارات التخزين")
        ) {
          return "نقدم حلول تخزين آمنة للأشياء التي قد لا تحتاجها على الفور في عنوانك الجديد. هل ترغب في معرفة المزيد؟";
        }

        // رد إضافي حول خيارات التخزين
        else if (
          lowerInput.includes("تخزين مؤقت") ||
          lowerInput.includes("تخزين مؤقت")
        ) {
          return "نقدم حلول تخزين مؤقت لممتلكاتك خلال عملية الانتقال. هل ترغب في المزيد من التفاصيل؟";
        }

        // رد حول التعبئة
        else if (
          lowerInput === "تعبئة" ||
          lowerInput.includes("تعبئة") ||
          lowerInput.includes("تغليف")
        ) {
          userState.inquiringAboutPacking = true;
          return "يقدم فريقنا خدمات تعبئة شاملة لضمان أن تكون ممتلكاتك آمنة ومنظمة جيدًا خلال الانتقال. هل ترغب في معرفة المزيد؟";
        }

        // رد متابعة لخدمات التعبئة
        else if (
          (userState.inquiringAboutPacking &&
            !userState.inquiringAboutPackingDetailed &&
            lowerInput.includes("نعم")) ||
          lowerInput.includes("إذاً")
        ) {
          userState.inquiringAboutPackingDetailed = true;
          return "رائع! تشمل خدمات التعبئة لدينا التعبئة الاحترافية لممتلكاتك، وتوفير مواد التعبئة عالية الجودة، وضمان أن كل شيء مُعبأ بشكل جيد للنقل. يمكننا أيضًا مساعدتك في التفريغ في عنوانك الجديد. هل ترغب في تحديد موعد أو الحصول على عرض أسعار؟";
        }

        // رد متابعة لخدمات التعبئة
        else if (
          (userState.inquiringAboutPacking &&
            userState.inquiringAboutPackingDetailed &&
            lowerInput.includes("نعم")) ||
          lowerInput.includes("إذاً")
        ) {
          return "يمكنك تحديد موعد أو الحصول على عرض أسعار من خلال الاتصال بنا عبر البريد الإلكتروني على <a href='mailto:contact@move-it.com' rel='noopener noreferrer'>contact@move-it.com</a> أو عبر الهاتف على <a href='tel:+442012345678' rel='noopener noreferrer'>+44 20 1234 5678</a>. مكتبنا يقع في 123 Victoria St, لندن SW1E 6DE، المملكة المتحدة. نحن هنا للمساعدة في جميع أسئلتك!";
        }

        // رد متابعة لخدمات التعبئة
        else if (
          lowerInput.includes("لا") ||
          lowerInput.includes("لا") ||
          lowerInput.includes("غير مهتم") ||
          lowerInput.includes("غير مهتمة") ||
          lowerInput.includes("غير مهتمة") ||
          lowerInput.includes("غير مهتمة")
        ) {
          userState.inquiringAboutPacking = false;
          userState.inquiringAboutPackingDetailed = false;
          userState.inquiringAboutWhyChooseMoveIt = false;
          userState.inquiringAboutSpecialItems = false;
          return "لا توجد مشكلة! إذا كان لديك أي أسئلة أخرى أو تحتاج إلى مساعدة في شيء آخر، فلا تتردد في السؤال.";
        }

        // رد إضافي حول التعبئة
        else if (
          lowerInput.includes("مساعدة في التعبئة") ||
          lowerInput.includes("مساعدة في التغليف")
        ) {
          return "يمكننا تقديم المساعدة في التعبئة لضمان أن تكون عناصر لديك آمنة ومنظمة. هل ترغب في معرفة المزيد عن هذه الخدمة؟";
        }

        // رد حول الانتقال التجاري
        else if (
          lowerInput.includes("انتقال تجاري") ||
          lowerInput.includes("انتقال تجاري")
        ) {
          return "نحن متخصصون في خدمات الانتقال التجاري المخصصة للشركات. أخبرنا إذا كنت بحاجة إلى مساعدة في إعادة توطين مكتبك!";
        }

        // رد إضافي حول الانتقال التجاري
        else if (
          lowerInput.includes("إعادة توطين الشركة") ||
          lowerInput.includes("إعادة توطين الشركة")
        ) {
          return "نحن متخصصون في إعادة توطين الشركات ويمكننا المساعدة في ضمان انتقال سلس لشركتك. كيف يمكننا المساعدة؟";
        }

        // رد الحجز
        else if (lowerInput.includes("حجز")) {
          return "حجز انتقال معنا سهل! ما عليك سوى الاتصال بفريق خدمة العملاء لدينا مع تفاصيل انتقالك، وسنقدم لك عرض أسعار ونحدد موعدًا حسب راحتك.";
        }

        // رد إضافي حول الحجز
        else if (
          lowerInput.includes("جدولة انتقال") ||
          lowerInput.includes("جدولة نقل")
        ) {
          return "جدولة انتقال معنا بسيطة! ما عليك سوى تقديم تفاصيلك لفريق خدمة العملاء لدينا، وسنتولى الباقي.";
        }

        // رد إضافي حول التحضير
        else if (
          lowerInput.includes("قائمة التحقق") ||
          lowerInput.includes("قائمة التحقق") ||
          lowerInput.includes("قائمة التحكم")
        ) {
          return "استخدام قائمة التحقق للانتقال هو وسيلة ممتازة للبقاء منظمًا. يمكنك العثور عليها في <a href='https://primesolar.github.io/move-it/checklist.html' rel='noreferrer noopener'>صفحة قائمة التحقق للانتقال</a>.";
        }

        // رد حول التحضير
        else if (
          lowerInput.includes("التحضير لـ") ||
          lowerInput.includes("كيف أستعد")
        ) {
          return "للتحضير لانتقالك، ابدأ بالتخلص من الأشياء غير الضرورية وتعبئة صندوق من العناصر الأساسية. خطط لانتقالك معنا مسبقًا لضمان التوفر.";
        }

        // رد حول التكلفة
        else if (
          lowerInput.includes("كم يكلف") ||
          lowerInput.includes("كم يكلف") ||
          lowerInput.includes("الرسوم") ||
          lowerInput.includes("التكلفة") ||
          lowerInput.includes("التكلفة")
        ) {
          return "تختلف تكلفة الانتقال حسب عوامل مثل نوع الخدمة، المسافة، وحجم الملكية. اتصل بنا للحصول على عرض أسعار مجاني وبدون التزام!";
        }

        // رد إضافي حول التقدير
        else if (lowerInput.includes("تقدير") || lowerInput.includes("تقدير")) {
          return "للحصول على تقدير دقيق، يرجى تقديم تفاصيل حول انتقالك، وسنتواصل معك بعرض أسعار!";
        }

        // رد حول الخصومات
        else if (
          lowerInput.includes("خصم") ||
          lowerInput.includes("عرض") ||
          lowerInput.includes("عرض ترويجي")
        ) {
          return "نعم، نقدم العديد من الخصومات والعروض الترويجية لجعل انتقالك أكثر سهولة، بما في ذلك العروض الموسمية وخصومات الإحالة. لا تنسَ أن تسأل عن العروض الحالية عند طلب عرض أسعار!";
        }

        // رد إضافي حول العروض الخاصة
        else if (lowerInput.includes("عروض خاصة")) {
          return "لدينا غالبًا عروض خاصة متاحة. لا تنسَ أن تسأل عن العروض الحالية عند الاتصال بنا!";
        }

        // رد الاتصال
        else if (
          lowerInput.includes("الاتصال") ||
          lowerInput.includes("البريد الإلكتروني") ||
          lowerInput.includes("البريد الالكتروني") ||
          lowerInput.includes("الهاتف")
        ) {
          return "يمكنك الاتصال بنا عبر البريد الإلكتروني على <a href='mailto:contact@move-it.com' rel='noopener noreferrer'>contact@move-it.com</a> أو عبر الهاتف على <a href='tel:+442012345678' rel='noopener noreferrer'>+44 20 1234 5678</a>. مكتبنا يقع في 123 Victoria St, لندن SW1E 6DE، المملكة المتحدة. نحن هنا للمساعدة!";
        }

        // رد إضافي حول الاتصال
        else if (lowerInput.includes("الاتصال")) {
          return "يمكنك الاتصال بنا عبر البريد الإلكتروني على <a href='mailto:contact@move-it.com' rel='noopener noreferrer'>contact@move-it.com</a> أو عبر الهاتف على <a href='tel:+442012345678' rel='noopener noreferrer'>+44 20 1234 5678</a>. مكتبنا يقع في 123 Victoria St, لندن SW1E 6DE، المملكة المتحدة. نحن هنا للمساعدة في جميع أسئلتك!";
        }

        // رد حول مدة الانتقال
        else if (
          lowerInput.includes("كم من الوقت يستغرق") ||
          lowerInput.includes("جدول الانتقال") ||
          lowerInput.includes("جدول النقل") ||
          lowerInput.includes("مدة الانتقال") ||
          lowerInput.includes("مدة النقل")
        ) {
          return "يمكن أن تختلف مدة الانتقال حسب المسافة وكمية الممتلكات. بشكل عام، يمكن إكمال الانتقالات المحلية في يوم واحد، بينما قد تستغرق الانتقالات طويلة المدى عدة أيام. هل ترغب في تقدير أكثر دقة؟";
        }

        // رد حول التأمين
        else if (lowerInput.includes("تأمين")) {
          return "نقدم خيارات تأمين متعددة لحماية ممتلكاتك خلال الانتقال. من المهم مناقشة هذه الخيارات مع فريقنا للعثور على أفضل تغطية تناسب احتياجاتك.";
        }

        // رد حول مستلزمات الانتقال
        else if (
          lowerInput.includes("مستلزمات الانتقال") ||
          lowerInput.includes("مستلزمات النقل") ||
          lowerInput.includes("صناديق") ||
          lowerInput.includes("مواد التعبئة")
        ) {
          return "نقدم مجموعة متنوعة من مستلزمات الانتقال، بما في ذلك الصناديق، الشريط اللاصق ومواد التعبئة. هل ترغب في معرفة المزيد عن خيارات مستلزماتنا؟";
        }

        // رد حول العناصر الخاصة
        else if (
          lowerInput.includes("عناصر خاصة") ||
          lowerInput.includes("عناصر خاصة") ||
          lowerInput.includes("هش") ||
          lowerInput.includes("هش") ||
          lowerInput.includes("آلة موسيقية") ||
          lowerInput.includes("غيتار") ||
          lowerInput.includes("كمان") ||
          lowerInput.includes("كمان") ||
          lowerInput.includes("بوق") ||
          lowerInput.includes("طبلة") ||
          lowerInput.includes("بيانو") ||
          lowerInput.includes("عمل فني") ||
          lowerInput.includes("قطعة فنية") ||
          lowerInput.includes("قطعة فنية") ||
          lowerInput.includes("تحف")
        ) {
          userState.inquiringAboutSpecialItems = true;
          return "لدينا خبرة في التعامل مع العناصر الخاصة مثل الآلات الموسيقية، الأعمال الفنية والتحف. يتخذ فريقنا احتياطات إضافية لضمان نقل هذه العناصر بأمان. هل ترغب في معرفة المزيد؟";
        }

        // رد لمعالجة العناصر الخاصة
        else if (
          (userState.inquiringAboutSpecialItems &&
            lowerInput.includes("نعم")) ||
          lowerInput.includes("لدي") ||
          lowerInput.includes("عناصر محددة") ||
          lowerInput.includes("عناصر محددة")
        ) {
          return "رائع! يمكنني إعطائك المزيد من التفاصيل حول كيفية تعاملنا مع العناصر الخاصة. على سبيل المثال، لدينا تقنيات تعبئة خاصة للبيانو والأعمال الفنية لضمان وصولها بأمان.";
        }

        // رد للسؤال عن عمليات المعالجة
        else if (
          (userState.inquiringAboutSpecialItems &&
            lowerInput.includes("كيف تتعاملون")) ||
          lowerInput.includes("كيف تتعاملون") ||
          lowerInput.includes("كيف تتعاملون") ||
          lowerInput.includes("ما هي عمليتكم؟") ||
          lowerInput.includes("ما هي عمليتكم؟") ||
          lowerInput.includes("ما هي عمليتك؟") ||
          lowerInput.includes("ما هي عمليتك؟")
        ) {
          return "نستخدم مواد وتقنيات تعبئة متخصصة لحماية العناصر الخاصة أثناء النقل. فريقنا مدرب على التعامل مع الأشياء الهشة والقيمة بعناية، مما يضمن أنها مُعبأة ومُحملة بشكل صحيح.";
        }

        // رد حول عدم وجود عناصر خاصة
        else if (
          (userState.inquiringAboutSpecialItems &&
            lowerInput.includes("لا أملك")) ||
          lowerInput.includes("لا أملك")
        ) {
          userState.inquiringAboutSpecialItems = false;
          return "لا توجد مشكلة! إذا كان لديك أي أسئلة أخرى حول خدماتنا للانتقال أو تحتاج إلى مساعدة في انتقالك، فلا تتردد في السؤال.";
        }

        // رد حول نصائح الانتقال
        else if (
          lowerInput.includes("نصائح الانتقال") ||
          lowerInput.includes("نصائح النقل")
        ) {
          return "إليك بعض النصائح السريعة للانتقال: ابدأ بالتعبئة مبكرًا، ضع علامات على صناديقك واحتفظ بالمستندات المهمة منفصلة. هل ترغب في نصائح أكثر تفصيلًا؟";
        }

        // رد حول مناطق الخدمة
        else if (
          lowerInput.includes("مناطق الخدمة") ||
          lowerInput.includes("مناطق الخدمة") ||
          lowerInput.includes("مواقع") ||
          lowerInput.includes("مواقع")
        ) {
          return "نخدم مجموعة واسعة من المناطق! يرجى إخبارنا بموقعك الحالي ووجهتك، وسنتمكن من تأكيد ما إذا كان بإمكاننا المساعدة.";
        }

        // رد حول خيارات الدفع
        else if (
          lowerInput.includes("خيارات الدفع") ||
          lowerInput.includes("خيارات الدفع") ||
          lowerInput.includes("الدفع")
        ) {
          return "نقبل عدة طرق للدفع، بما في ذلك بطاقات الائتمان، التحويلات البنكية والنقد. يرجى سؤال فريقنا عن المزيد من التفاصيل خلال عملية الحجز.";
        }

        // رد حول سياسة الإلغاء
        else if (
          lowerInput.includes("سياسة الإلغاء") ||
          lowerInput.includes("سياسة الإلغاء") ||
          lowerInput.includes("إلغاء")
        ) {
          return "نفهم أن الخطط قد تتغير. تسمح لك سياستنا بالإلغاء أو إعادة جدولة انتقالك مع إشعار مسبق. يرجى الاتصال بنا للحصول على تفاصيل محددة.";
        }

        // رد حول إجراءات يوم الانتقال
        else if (
          lowerInput.includes("يوم الانتقال") ||
          lowerInput.includes("يوم النقل") ||
          lowerInput.includes("ماذا تتوقع") ||
          lowerInput.includes("ماذا تتوقع")
        ) {
          return "في يوم الانتقال، سيصل فريقنا في الوقت المحدد، جاهزًا لتعبئة وتحميل ممتلكاتك. سنبقيك على اطلاع طوال العملية. هل لديك أي مخاوف محددة حول يوم الانتقال؟";
        }

        // رد حول الخيارات البيئية
        else if (
          lowerInput.includes("بيئي") ||
          lowerInput.includes("بيئي") ||
          lowerInput.includes("مستدام") ||
          lowerInput.includes("مستدام")
        ) {
          return "نقدم خيارات انتقال بيئية، بما في ذلك مواد تعبئة قابلة لإعادة الاستخدام وممارسات مستدامة. أخبرنا إذا كنت مهتمًا بحلول الانتقال الخضراء لدينا!";
        }

        // رد حول الانتقالات الدولية
        else if (
          lowerInput.includes("انتقال دولي") ||
          lowerInput.includes("انتقال دولي") ||
          lowerInput.includes("إلى الخارج")
        ) {
          return "يمكننا أيضًا مساعدتك في الانتقالات الدولية! يتمتع فريقنا بخبرة في إدارة الجمارك واللوجستيات لإعادة التوطين في الخارج. هل ترغب في مزيد من المعلومات؟";
        }

        // خيارات النقل
        else if (
          lowerInput.includes("خيارات النقل") ||
          lowerInput.includes("خيارات الانتقال") ||
          lowerInput.includes("ماذا يمكنني أن أختار") ||
          lowerInput.includes("ما هي خياراتي") ||
          lowerInput.includes("ما الخدمات التي تقدمونها؟")
        ) {
          return "نحن نقدم مجموعة كاملة من حلول النقل، بما في ذلك <a href='https://primesolar.github.io/move-it/local-moving.html' rel='noopener noreferrer'><strong>النقل المحلي</strong></a>، <a href='https://primesolar.github.io/move-it/long-distance-moving.html' rel='noopener noreferrer'><strong>النقل لمسافات طويلة</strong></a>، <a href='https://primesolar.github.io/move-it/professional-packing.html' rel='noopener noreferrer'><strong>التعبئة</strong></a>، <a href='https://primesolar.github.io/move-it/faqs.html' rel='noopener noreferrer'><strong>التخزين</strong></a>، <a href='https://primesolar.github.io/move-it/faqs.html' rel='noopener noreferrer'><strong>تفكيك وتجميع الأثاث</strong></a>، و <a href='https://primesolar.github.io/move-it/commercial-moving.html' rel='noopener noreferrer'><strong>النقل التجاري/المكاتب</strong></a>.";
        }

        // رد إضافي حول الانتقالات الدولية
        else if (
          lowerInput.includes("الانتقال إلى الخارج") ||
          lowerInput.includes("انتقال إلى الخارج") ||
          lowerInput.includes("انتقال إلى الخارج") ||
          lowerInput.includes("إعادة توطين دولي") ||
          lowerInput.includes("إعادة توطين دولي")
        ) {
          return "الانتقال إلى الخارج يمكن أن يكون مغامرة مثيرة! يمكننا مساعدتك في التنقل عبر اللوجستيات والوثائق المعنية. ما المعلومات المحددة التي تحتاجها؟";
        }

        // رد حول اللوائح الجمركية
        else if (
          lowerInput.includes("اللوائح الجمركية") ||
          lowerInput.includes("اللوائح الجمركية")
        ) {
          return "فهم اللوائح الجمركية مهم للانتقالات الدولية. يمكننا تقديم نصائح حول العناصر المسموح بها والوثائق المطلوبة.";
        }

        // رد حول الوثائق المطلوبة
        else if (
          lowerInput.includes("الوثائق المطلوبة") ||
          lowerInput.includes("الوثائق المطلوبة")
        ) {
          return "لإجراء انتقال دولي، ستحتاج إلى مستندات مثل جواز السفر، التأشيرة، وفي بعض الحالات، قائمة جرد بالعناصر التي تأخذها. يمكن لفريقنا مساعدتك في فهم المستندات المطلوبة لوضعك المحدد.";
        }

        // رد حول تتبع الانتقال
        else if (
          lowerInput.includes("تتبع الانتقال") ||
          lowerInput.includes("تتبع النقل")
        ) {
          return "نقدم خيارات تتبع حتى تتمكن من متابعة تقدم انتقالك. اتصل بفريقنا للحصول على مزيد من المعلومات حول كيفية تتبع انتقالك.";
        }

        // رد حول خبرة الفريق
        else if (
          lowerInput.includes("خبرة الفريق") ||
          lowerInput.includes("خبرة الفريق")
        ) {
          return "فريقنا مدرب تدريباً عالياً ولديه سنوات من الخبرة في الانتقالات. نحن ملتزمون بضمان أن يتم انتقالك بكفاءة وأمان.";
        }

        // رد حول التحضير للانتقالات في اللحظة الأخيرة
        else if (
          lowerInput.includes("انتقال في اللحظة الأخيرة") ||
          lowerInput.includes("انتقال في اللحظة الأخيرة")
        ) {
          return "نفهم أن الانتقالات في اللحظة الأخيرة يمكن أن تكون مرهقة. فريقنا جاهز للمساعدة في تنظيم انتقالك بسرعة. اتصل بنا لمناقشة احتياجاتك المحددة.";
        }

        // رد حول التنظيف بعد الانتقال
        else if (
          lowerInput.includes("تنظيف بعد الانتقال") ||
          lowerInput.includes("تنظيف بعد النقل")
        ) {
          return "نقدم خدمات تنظيف بعد الانتقال لضمان أن يكون مساحتك الجديدة جاهزة للسكن. أخبرنا إذا كنت ترغب في تضمين هذه الخدمة في انتقالك.";
        }

        // رد حول تجميع الأثاث
        else if (
          lowerInput.includes("تجميع الأثاث") ||
          lowerInput.includes("تجميع الأثاث")
        ) {
          return "يمكن لفريقنا المساعدة في تجميع الأثاث بعد الانتقال. إذا كنت بحاجة إلى هذه الخدمة، فقط أخبرنا عند جدولة انتقالك.";
        }

        // رد حول سياسة المسؤولية
        else if (
          lowerInput.includes("سياسة المسؤولية") ||
          lowerInput.includes("سياسة المسؤولية")
        ) {
          return "لدينا سياسة مسؤولية تغطي الأضرار التي تلحق بممتلكاتك أثناء النقل. من المهم مناقشة ذلك مع فريقنا لفهم التغطية المتاحة.";
        }

        // رد حول تجربة العملاء
        else if (
          lowerInput.includes("تجربة العملاء") ||
          lowerInput.includes("تجربة العملاء")
        ) {
          return "نحن نقدر تجربة العملاء ونسعى دائمًا لتحسين خدماتنا. إذا كان لديك أي ملاحظات أو اقتراحات، سنكون سعداء بسماعها!";
        }

        // رد حول مرونة الجدولة
        else if (lowerInput.includes("مرونة الجدولة")) {
          return "نقدم مرونة في الجدولة لتلبية احتياجاتك. اتصل بنا لمناقشة الخيارات المتاحة لانتقالك.";
        }

        // رد حول أمان الممتلكات
        else if (
          lowerInput.includes("أمان الممتلكات") ||
          lowerInput.includes("أمان الممتلكات")
        ) {
          return "أمان ممتلكاتك هو أولويتنا. نستخدم تقنيات تعبئة آمنة وننقل أغراضك بعناية لضمان وصولها إلى وجهتها في حالة ممتازة.";
        }

        // رد حول متطلبات التأشيرة
        else if (
          lowerInput.includes("متطلبات التأشيرة") ||
          lowerInput.includes("معلومات حول التأشيرة") ||
          lowerInput.includes("معلومات حول التأشيرة") ||
          lowerInput.includes("مزيد من المعلومات حول التأشيرة") ||
          lowerInput.includes("معلومات حول التأشيرة") ||
          lowerInput.includes("تحدث عن التأشيرة") ||
          lowerInput.includes("ناقش التأشيرة") ||
          lowerInput.includes("اسأل عن التأشيرة") ||
          lowerInput.includes("أسئلة حول التأشيرة") ||
          lowerInput.includes("سؤال عن التأشيرة") ||
          lowerInput.includes("حديث حول التأشيرة") ||
          lowerInput.includes("الحصول على تأشيرة")
        ) {
          return "تختلف متطلبات التأشيرة حسب البلدان. من المهم التحقق من اللوائح المحددة لوجهتك. هل تحتاج إلى مساعدة في ذلك؟";
        }

        // رد حول الشحن الدولي
        else if (
          lowerInput.includes("شحن دولي") ||
          lowerInput.includes("شحن دولي") ||
          lowerInput.includes("شحن دولي")
        ) {
          return "نقدم خدمات الشحن الدولي لضمان وصول ممتلكاتك بأمان إلى منزلك الجديد. هل ترغب في معرفة المزيد عن خيارات الشحن لدينا؟";
        }

        // رد حول المساعدة اللغوية
        else if (
          lowerInput.includes("مساعدة لغوية") ||
          lowerInput.includes("مساعدة لغوية")
        ) {
          return "الانتقال إلى بلد جديد غالبًا ما يتضمن حواجز لغوية. يمكننا توفير موارد أو توصيات لخدمات المساعدة اللغوية.";
        }

        // رد حول التكيف الثقافي
        else if (
          lowerInput.includes("التكيف الثقافي") ||
          lowerInput.includes("التكيف الثقافي")
        ) {
          return "يمكننا تقديم نصائح وموارد لمساعدتك على الاستقرار بسلاسة. هل ترغب في مزيد من المعلومات؟";
        }

        // رد على الاستفسار حول النقل المحلي
        if (
          lowerInput.includes("ماذا يمكنك أن تخبرني عن النقل في المدينة") ||
          lowerInput.includes("هل يمكنك أن تخبرني عن النقل في المدينة؟") ||
          lowerInput.includes("أخبرني عن النقل المحلي") ||
          lowerInput.includes(
            "ما هي الخدمات التي تقدمونها للنقل داخل المدينة؟"
          ) ||
          lowerInput.includes("ماذا يمكنك أن تخبرني عن النقل الحضري") ||
          lowerInput.includes("معلومات عن النقل داخل المدينة") ||
          lowerInput.includes("خدمات النقل في المدينة") ||
          lowerInput.includes("تفاصيل حول النقل المحلي") ||
          lowerInput.includes("ماذا تقدمون للنقل في المدينة؟") ||
          lowerInput.includes("حول النقل في مدينتي") ||
          lowerInput.includes("كيف تتعاملون مع النقل المحلي؟") ||
          lowerInput.includes("ما الذي يتضمنه خدمات النقل المحلي؟") ||
          lowerInput.includes("اشرح لي عن النقل في المدينة") ||
          lowerInput.includes("ما هي خيارات النقل المحلي لديك؟") ||
          lowerInput.includes("كيف يعمل النقل المحلي؟") ||
          lowerInput.includes("هل يمكنك تقديم تفاصيل حول النقل في المدينة؟") ||
          lowerInput.includes("صف خدماتك للنقل المحلي")
        ) {
          return "نحن نقدم مجموعة متنوعة من خدمات النقل المحلي المصممة وفقاً لاحتياجاتك. وهذا يشمل <a href='https://primesolar.github.io/move-it/professional-packing.html' rel='noopener noreferrer'><strong>التعبئة الاحترافية</strong></a>، <a href='https://primesolar.github.io/move-it/faqs.html' rel='noopener noreferrer'><strong>تفكيك/تجميع الأثاث</strong></a>، و <a href='https://primesolar.github.io/move-it/contact.html' rel='noopener noreferrer'><strong>خيارات مرنة للجدولة</strong></a> لجعل انتقالك سلساً قدر الإمكان. إذا كان لديك أسئلة محددة أو تحتاج إلى مزيد من المعلومات، فلا تتردد في السؤال!";
        }

        // رد حول التأمين الدولي
        else if (lowerInput.includes("تأمين دولي")) {
          return "نوصي بمراجعة خيارات التأمين الدولي لحماية ممتلكاتك أثناء الانتقال. هل تحتاج إلى مساعدة في العثور على التغطية المناسبة؟";
        }

        // رد حول التعبئة لانتقال دولي
        else if (
          lowerInput.includes("تعبئة لانتقال دولي") ||
          lowerInput.includes("تعبئة لانتقال دولي")
        ) {
          return "تتطلب التعبئة لانتقال دولي اعتبارات خاصة. يمكننا إعطائك نصائح حول كيفية التعبئة بشكل فعال وآمن للنقل لمسافات طويلة.";
        }

        // رد حول الانتقال مع الحيوانات الأليفة
        else if (
          lowerInput.includes("حيوانات أليفة") ||
          lowerInput.includes("حيوانات أليفة") ||
          lowerInput.includes("انتقال مع حيوانات أليفة") ||
          lowerInput.includes("انتقال مع حيوانات أليفة") ||
          lowerInput.includes("انتقال مع حيوانات أليفة")
        ) {
          return "يتطلب الانتقال مع الحيوانات الأليفة اعتبارات خاصة. يمكننا تقديم نصائح وموارد لضمان انتقال سلس لأصدقائك الفرويين. هل ترغب في معرفة المزيد؟";
        }

        // رد حول الانتقال لكبار السن
        else if (
          lowerInput.includes("كبار السن") ||
          lowerInput.includes("انتقال لكبار السن") ||
          lowerInput.includes("انتقال لكبار السن") ||
          lowerInput.includes("انتقال لكبار السن") ||
          lowerInput.includes("انتقال لكبار السن")
        ) {
          return "نفهم أن الانتقال قد يكون صعبًا بشكل خاص لكبار السن. فريقنا مدرب لتقديم المساعدة برحمة واحترام. كيف يمكننا مساعدتك في انتقالك لكبار السن؟";
        }

        // رد حول إعادة توطين الشركات
        else if (
          lowerInput.includes("إعادة توطين الشركات") ||
          lowerInput.includes("انتقال الموظفين") ||
          lowerInput.includes("انتقال الموظفين") ||
          lowerInput.includes("انتقال الموظف") ||
          lowerInput.includes("انتقال الموظف")
        ) {
          return "نحن متخصصون في إعادة توطين الشركات ويمكننا المساعدة في انتقال الموظفين، مما يضمن انتقالًا سلسًا لفريقك. أخبرنا كيف يمكننا المساعدة!";
        }

        // رد حول نصائح الانتقال في اللحظة الأخيرة
        else if (
          lowerInput.includes("نصائح في اللحظة الأخيرة") ||
          lowerInput.includes("نصائح في آخر دقيقة") ||
          lowerInput.includes("انتقال طارئ") ||
          lowerInput.includes("انتقال عاجل")
        ) {
          return "لانتقالات اللحظة الأخيرة، ركز على الأساسيات: احزم حقيبة ملابس، اجمع المستندات المهمة، وضع خطة ليوم الانتقال. هل تحتاج إلى نصائح أكثر تحديدًا؟";
        }

        // رد حول الانتقال مع النباتات
        else if (lowerInput.includes("نباتات")) {
          return "يتطلب الانتقال مع النباتات رعاية خاصة. فكر في كيفية حمايتها أثناء النقل. هل ترغب في نصائح حول أنواع معينة من النباتات؟";
        }

        // رد حول الانتقال مع الأثاث
        else if (
          lowerInput.includes("أثاث") ||
          lowerInput.includes("أثاث") ||
          lowerInput.includes("أشياء ثقيلة") ||
          lowerInput.includes("أشياء كبيرة")
        ) {
          return "لدينا الفريق المناسب والموظفين المدربين للتعامل مع الأثاث الثقيل والأشياء الكبيرة بأمان. هل لديك قطع معينة في ذهنك تحتاج إلى مساعدة بشأنها؟";
        }

        // رد حول خدمات التفريغ
        else if (lowerInput.includes("تفريغ") || lowerInput.includes("تفريغ")) {
          return "يمكن لفريقنا مساعدتك في تفريغ ممتلكاتك وتنظيم مساحتك الجديدة. هل ترغب في معرفة المزيد عن هذه الخدمة؟";
        }

        // رد حول الانتقال خلال ذروة الموسم
        else if (
          lowerInput.includes("ذروة الموسم") ||
          lowerInput.includes("الموسم المزدحم")
        ) {
          return "يمكن أن يكون الانتقال خلال ذروة الموسم أكثر صعوبة بسبب الطلب المتزايد. من الأفضل حجز انتقالك مسبقًا. هل لديك تواريخ محددة في ذهنك؟";
        }

        // رد حول الانتقال للطلاب
        else if (lowerInput.includes("طالب") || lowerInput.includes("جامعة")) {
          return "نقدم خدمات خاصة لانتقالات الطلاب، بما في ذلك جداول مرنة وأسعار معقولة. كيف يمكنني مساعدتك في إعادة توطينك؟";
        }

        // رد حول عقود الانتقال
        else if (
          lowerInput.includes("عقد") ||
          lowerInput.includes("اتفاقية الانتقال") ||
          lowerInput.includes("اتفاقية الانتقال")
        ) {
          return "قبل انتقالك، نقدم عقدًا مفصلًا يصف الخدمات والتكاليف والشروط. من المهم قراءته بعناية. هل لديك أسئلة حول شروط معينة؟";
        }

        // رد حول فريق الانتقال
        else if (
          lowerInput.includes("فريق الانتقال") ||
          lowerInput.includes("فريق الانتقال") ||
          lowerInput.includes("معدات الانتقال") ||
          lowerInput.includes("معدات الانتقال") ||
          lowerInput.includes("أدوات")
        ) {
          return "نستخدم معدات متخصصة في الانتقال لضمان نقل ممتلكاتك بأمان. هل ترغب في معرفة المزيد عن معداتنا؟";
        }

        // رد حول اللوائح المحلية للانتقال
        else if (
          lowerInput.includes("اللوائح المحلية") ||
          lowerInput.includes("القوانين المحلية") ||
          lowerInput.includes("اللوائح الخاصة بالانتقال") ||
          lowerInput.includes("قوانين الانتقال") ||
          lowerInput.includes("قوانين الانتقال")
        ) {
          return "يمكن أن تكون هناك لوائح محددة حول الانتقالات في مناطق مختلفة. من الأفضل التحقق مع السلطات المحلية.";
        }

        // Srpski

        // Odgovor na pozdrav
        if (
          lowerInput.includes("zdravo") ||
          lowerInput === "ćao" ||
          lowerInput === "cao" ||
          lowerInput.includes("ćao ") ||
          lowerInput.includes("cao ") ||
          lowerInput.includes("ćao,") ||
          lowerInput.includes("cao,") ||
          lowerInput.includes("ćao.") ||
          lowerInput.includes("cao.") ||
          lowerInput.includes("ćao!") ||
          lowerInput.includes("cao!") ||
          lowerInput.includes("dobro jutro") ||
          lowerInput.includes("dobar dan") ||
          lowerInput.includes("dobro veče") ||
          lowerInput.includes("dobro vece") ||
          lowerInput.includes("pozdrav") ||
          lowerInput.includes("hej") ||
          lowerInput.includes("salutacije") ||
          lowerInput.includes("dobrodošli") ||
          lowerInput.includes("dobrodosli") ||
          lowerInput.includes("dobrodošao") ||
          lowerInput.includes("dobrodosao")
        ) {
          return "Zdravo! Dobrodošli u Move It! Kako mogu da vam pomognem sa vašim potrebama za selidbu danas?";
        }

        // Odgovor na pomoć
        else if (lowerInput.includes("pomoć") || lowerInput.includes("pomoc")) {
          return "Naravno! Šta vam je potrebno u vezi sa vašom selidbom? Nudimo niz usluga kako bismo vašu selidbu učinili lakšom.";
        }

        // Odgovor na zahvalnost
        else if (
          lowerInput.includes("hvala") ||
          lowerInput.includes("hvala vam") ||
          lowerInput.includes("hvala tebi") ||
          lowerInput.includes("cenim to") ||
          lowerInput.includes("zahvalan")
        ) {
          return "Nema na čemu! Ako imate još pitanja o našim uslugama selidbe, slobodno pitajte.";
        }

        // Dodatni odgovor na zahvalnost
        else if (
          lowerInput.includes("hvala na pomoći") ||
          lowerInput.includes("hvala na pomoci") ||
          lowerInput.includes("hvala na vašoj pomoći") ||
          lowerInput.includes("hvala na vasoj pomoci") ||
          lowerInput.includes("hvala na tvojoj pomoći") ||
          lowerInput.includes("hvala na tvojoj pomoci") ||
          lowerInput.includes("cenim vašu pomoć") ||
          lowerInput.includes("cenim vasu pomoc") ||
          lowerInput.includes("cenim tvoju pomoć") ||
          lowerInput.includes("cenim tvoju pomoc")
        ) {
          return "Drago mi je da sam mogao da pomognem! Ako imate još pitanja, samo mi javite.";
        }

        // Odgovor na kompliment
        if (
          lowerInput.includes("to je baš lepo") ||
          lowerInput.includes("to je bas lepo")
        ) {
          return "Hvala! Drago nam je da vam se sviđa! Ako imate još pitanja ili vam treba pomoć, slobodno se javite.";
        }

        // Odgovor na kompliment o ljubaznosti
        if (
          lowerInput.includes("vi ste ljubazni") ||
          lowerInput.includes("ljubazni ste") ||
          lowerInput.includes("vi ste veoma ljubazni") ||
          lowerInput.includes("veoma ste ljubazni") ||
          lowerInput.includes("vi ste baš ljubazni") ||
          lowerInput.includes("vi ste bas ljubazni") ||
          lowerInput.includes("baš ste ljubazni") ||
          lowerInput.includes("bas ste ljubazni") ||
          lowerInput.includes("ti si ljubazan") ||
          lowerInput.includes("ljubazan si") ||
          lowerInput.includes("ti si veoma ljubazan") ||
          lowerInput.includes("veoma si ljubazan") ||
          lowerInput.includes("ti si baš ljubazan") ||
          lowerInput.includes("ti si bas ljubazan") ||
          lowerInput.includes("baš si ljubazan") ||
          lowerInput.includes("bas si ljubazan")
        ) {
          return "Hvala vam! Uvek mi je drago da pomognem! Ako imate još pitanja, slobodno pitajte.";
        }

        // Odgovori na pozdrav
        else if (
          lowerInput.includes("prijatno") ||
          lowerInput.includes("doviđenja") ||
          lowerInput.includes("dovidenja") ||
          lowerInput.includes("zbogom") ||
          lowerInput.includes("vidimo se kasnije") ||
          lowerInput.includes("čuvajte se") ||
          lowerInput.includes("cuvajte se") ||
          lowerInput.includes("čuvaj se") ||
          lowerInput.includes("cuvaj se") ||
          lowerInput.includes("vidimo se") ||
          lowerInput.includes("čujemo se") ||
          lowerInput.includes("cujemo se")
        ) {
          return "Doviđenja! Želim vam divan dan, i zapamtite, selidba može biti radost sa pravom pomoći!";
        }

        // Dodatni odgovori na pozdrav
        else if (
          lowerInput.includes("vidimo se uskoro") ||
          lowerInput.includes("do sledećeg puta") ||
          lowerInput.includes("do sledeceg puta") ||
          lowerInput.includes("laku noć") ||
          lowerInput.includes("laku noc")
        ) {
          return "Vidimo se uskoro!";
        }

        // Odgovor o dobrobiti
        else if (
          lowerInput.includes("kako ste") ||
          lowerInput.includes("kako si") ||
          lowerInput.includes("kako ste vi") ||
          lowerInput.includes("kako si ti") ||
          lowerInput.includes("kako ste bili") ||
          lowerInput.includes("kako si bio") ||
          lowerInput.includes("kako vama je dan") ||
          lowerInput.includes("kako tebi je dan") ||
          lowerInput.includes("kako ti je dan") ||
          lowerInput.includes("kako vama ide dan") ||
          lowerInput.includes("kako tebi ide dan") ||
          lowerInput.includes("kako ti ide dan") ||
          lowerInput.includes("kakav je bio vaš dan") ||
          lowerInput.includes("kakav je bio vas dan") ||
          lowerInput.includes("kakav je bio tvoj dan") ||
          lowerInput.includes("kako ste proveli dan") ||
          lowerInput.includes("kako si proveo dan") ||
          lowerInput.includes("kako ste proveli vaš dan") ||
          lowerInput.includes("kako ste proveli vas dan") ||
          lowerInput.includes("kako si proveo tvoj dan") ||
          lowerInput.includes("kako ste proveli svoj dan") ||
          lowerInput.includes("kako si proveo svoj dan") ||
          lowerInput.includes("kako je bilo kod vama danas") ||
          lowerInput.includes("kako je bilo kod tebe danas") ||
          lowerInput.includes("kako ste proveli nedelju") ||
          lowerInput.includes("kako si proveo nedelju") ||
          lowerInput.includes("kako ste proveli vašu nedelju") ||
          lowerInput.includes("kako ste proveli vasu nedelju") ||
          lowerInput.includes("kako si proveo tvoju nedelju") ||
          lowerInput.includes("kako ste proveli svoju nedelju") ||
          lowerInput.includes("kako si proveo svoju nedelju") ||
          lowerInput.includes("kako ide") ||
          lowerInput.includes("šta ima") ||
          lowerInput.includes("sta ima") ||
          lowerInput.includes("šta se dešava") ||
          lowerInput.includes("sta se desava")
        ) {
          return "Sve je odlično, hvala! A kako ste vi?";
        }

        // Odgovor kada klijent kaže da je i on dobro
        else if (
          lowerInput.includes("ja sam dobro") ||
          lowerInput.includes("dobro sam") ||
          lowerInput.includes("ja sam odlično") ||
          lowerInput.includes("ja sam odlicno") ||
          lowerInput.includes("odlicno sam") ||
          lowerInput.includes("super sam") ||
          lowerInput.includes("osećam se odlično") ||
          lowerInput.includes("osecam se odlicno") ||
          lowerInput.includes("odlično") ||
          lowerInput.includes("odlicno") ||
          lowerInput.includes("ja sam sjajno") ||
          lowerInput.includes("sjajno sam") ||
          lowerInput.includes("osećam se sjajno") ||
          lowerInput.includes("osecam se sjajno") ||
          lowerInput.includes("dobro takođe") ||
          lowerInput.includes("dobro takode") ||
          lowerInput.includes("ja sam u redu") ||
          lowerInput.includes("u redu sam") ||
          lowerInput.includes("u redu takođe") ||
          lowerInput.includes("u redu takode") ||
          lowerInput.includes("sve je u redu") ||
          lowerInput.includes("sve je dobro") ||
          lowerInput.includes("sve je odlično") ||
          lowerInput.includes("sve je odlicno") ||
          lowerInput.includes("sve je super") ||
          lowerInput.includes("sve je fantastično") ||
          lowerInput.includes("sve je fantasticno") ||
          lowerInput.includes("sve je sjajno") ||
          lowerInput.includes("ja sam srećan") ||
          lowerInput.includes("ja sam srecan") ||
          lowerInput.includes("srećan sam") ||
          lowerInput.includes("srecan sam") ||
          lowerInput.includes("srećan takođe") ||
          lowerInput.includes("srecan takode") ||
          lowerInput.includes("ja sam fantastičan") ||
          lowerInput.includes("ja sam fantastican") ||
          lowerInput.includes("fantastičan") ||
          lowerInput.includes("fantastican") ||
          lowerInput.includes("ja sam odličan") ||
          lowerInput.includes("ja sam odlican") ||
          lowerInput.includes("odličan takođe") ||
          lowerInput.includes("odlican takode") ||
          lowerInput.includes("u redu takođe") ||
          lowerInput.includes("u redu takode") ||
          lowerInput.includes("cenim vas") ||
          lowerInput.includes("cenim te")
        ) {
          return "Drago mi je da to čujem! Ako postoji nešto specifično što želite da znate o našim uslugama selidbe ili imate bilo kakva pitanja, slobodno pitajte!";
        }

        // Dodatni odgovori na pozdrav
        else if (
          lowerInput.includes("šta ima novo") ||
          lowerInput.includes("sta ima novo") ||
          lowerInput.includes("kako je sve") ||
          lowerInput.includes("kako ide život") ||
          lowerInput.includes("kako ide zivot") ||
          lowerInput.includes("šta se dešava") ||
          lowerInput.includes("sta se desava")
        ) {
          return "Nije mnogo, samo sam ovde da vam pomognem sa vašim potrebama za selidbu! Kako mogu da vam pomognem danas?";
        }

        // Dodatni odgovor o dobrobiti
        else if (
          lowerInput.includes("kako ti je dan") ||
          lowerInput.includes("kako ti je nedelja") ||
          lowerInput.includes("kako su stvari")
        ) {
          return "Moj dan ide dobro, hvala! Kako mogu da vam pomognem danas?";
        }

        // Odgovor o identitetu
        else if (
          lowerInput.includes("kako se zoveš") ||
          lowerInput.includes("kako se zoves") ||
          lowerInput.includes("ko si ti") ||
          lowerInput.includes("predstavi se") ||
          lowerInput.includes("reci mi svoje ime")
        ) {
          return "Zovem se Zane. Ja sam predstavnik Move It, vaš asistent za sve vaše potrebe za selidbom! Kako mogu da vam pomognem danas?";
        }

        // Dodatni odgovor o identitetu
        else if (
          lowerInput.includes("šta radiš") ||
          lowerInput.includes("sta radis") ||
          lowerInput.includes("koja je tvoja uloga") ||
          lowerInput.includes("koja je tvoja svrha")
        ) {
          return "Ovde sam da vam pomognem sa svim vašim potrebama za selidbom i da pružim informacije o našim uslugama!";
        }

        // Odgovor o sposobnostima
        else if (
          lowerInput.includes("šta možeš da uradiš") ||
          lowerInput.includes("sta mozes da uradis") ||
          lowerInput.includes("sposobnosti") ||
          lowerInput.includes("koje usluge") ||
          lowerInput.includes("koje usluge nudiš") ||
          lowerInput.includes("koje usluge nudis") ||
          lowerInput.includes("koje usluge pružaš") ||
          lowerInput.includes("koje usluge pruzas")
        ) {
          return "Mogu da vam pomognem sa raznim pitanjima o selidbi, od lokalnih do dugih selidbi, pakovanja i još mnogo toga. Samo pitajte!";
        }

        // Opcije za selidbu
        else if (
          lowerInput.includes("opcije za selidbu") ||
          lowerInput.includes("mogućnosti selidbe") ||
          lowerInput.includes("mogucnosti selidbe") ||
          lowerInput.includes("šta mogu da izaberem") ||
          lowerInput.includes("sta mogu da izaberem") ||
          lowerInput.includes("koje su moje opcije") ||
          lowerInput.includes("koje usluge nudite")
        ) {
          return "Nudimo kompletnu paletu rešenja za selidbu, uključujući <a href='https://primesolar.github.io/move-it/local-moving.html' rel='noopener noreferrer'><strong>lokalne selidbe</strong></a>, <a href='https://primesolar.github.io/move-it/long-distance-moving.html' rel='noopener noreferrer'><strong>selidbe na velike udaljenosti</strong></a>, <a href='https://primesolar.github.io/move-it/professional-packing.html' rel='noopener noreferrer'><strong>pakovanje</strong></a>, <a href='https://primesolar.github.io/move-it/faqs.html' rel='noopener noreferrer'><strong>skladištenje</strong></a>, <a href='https://primesolar.github.io/move-it/faqs.html' rel='noopener noreferrer'><strong>rastavljanje/montaža nameštaja</strong></a>, i <a href='https://primesolar.github.io/move-it/commercial-moving.html' rel='noopener noreferrer'><strong>komercijalne/uredske selidbe</strong></a>.";
        }

        // Dodatni odgovor o sposobnostima
        else if (
          lowerInput.includes("koje usluge možeš da pružiš") ||
          lowerInput.includes("koje usluge mozes da pruzis") ||
          lowerInput.includes("kako možeš da mi pomogneš") ||
          lowerInput.includes("kako mozes da mi pomognes") ||
          lowerInput.includes("koje su tvoje karakteristike")
        ) {
          return "Mogu da pomognem sa pitanjima o logistici selidbe, pakovanju, skladištenju i još mnogo toga. Samo mi recite šta vam treba!";
        }

        // Odgovor na pitanje zašto izabrati Move It
        else if (
          lowerInput.includes("zašto da izaberem move it") ||
          lowerInput.includes("zasto da izaberem move it") ||
          lowerInput.includes("zašto izabrati move it") ||
          lowerInput.includes("zasto izabrati move it") ||
          lowerInput.includes("razlozi za izbor move it")
        ) {
          userState.inquiringAboutWhyChooseMoveIt = true;
          return "Izborom Move It dobijate posvećen tim koji je posvećen tome da vaša selidba prođe što je moguće lakše. Nudimo personalizovanu uslugu, iskusne profesionalce i niz opcija prilagođenih vašim potrebama. Naša transparentna cena, odlična korisnička podrška i posvećenost bezbednosti osiguravaju da su vaši predmeti u sigurnim rukama. Da li želite da saznate više o našim specifičnim uslugama?";
        }

        // Odgovor na pitanje zašto izabrati Move It (nastavak)
        else if (
          userState.inquiringAboutWhyChooseMoveIt &&
          lowerInput.includes("da")
        ) {
          return "Mogu da vam pomognem sa raznim pitanjima o selidbi, od lokalnih do dugih selidbi, pakovanja i još mnogo toga. Samo pitajte!";
        }

        // Odgovor na šalu
        else if (
          lowerInput.includes("reci mi šalu") ||
          lowerInput.includes("reci mi salu")
        ) {
          return "Zašto su selidbe odlični prijatelji? Zato što uvek znaju kako da vam podignu raspoloženje!";
        }

        // Odgovor na vreme
        else if (lowerInput.includes("vreme")) {
          return "Ne mogu da proverim vreme trenutno, ali uvek je dobra ideja planirati selidbu na sunčan dan!";
        }

        // Dodatni odgovor na vreme
        else if (lowerInput.includes("prognoza")) {
          return "Ne mogu da pružim prognozu, ali uvek je mudro proveriti vreme pre planiranja selidbe!";
        }

        // Odgovor na vesti
        else if (lowerInput.includes("vesti")) {
          return "Ne mogu da pružim ažuriranja vesti, ali možete proveriti omiljenu vesti sajt za najnovije!";
        }

        // Dodatni odgovor na pomoć
        else if (lowerInput.includes("pomoć") || lowerInput.includes("pomoc")) {
          return "Naravno! Koju specifičnu pomoć vam treba sa vašom selidbom? Ovde sam da pomognem!";
        }

        // Odgovor na usluge selidbe
        else if (
          lowerInput.includes("usluge selidbe") ||
          lowerInput.includes("pomoć pri selidbi") ||
          lowerInput.includes("pomoc pri selidbi") ||
          lowerInput.includes("opcije selidbe") ||
          lowerInput.includes("usluge preseljenja")
        ) {
          return "Nudimo niz usluga selidbe, uključujući lokalne i dugoročne selidbe, pakovanje i raspakivanje. Kako mogu da vam pomognem sa vašom selidbom?";
        }

        // Odgovor na opcije skladištenja
        else if (
          lowerInput.includes("opcije skladištenja") ||
          lowerInput.includes("opcije skladistenja")
        ) {
          return "Nudimo sigurna skladišna rešenja za predmete koje možda nećete odmah trebati na novoj lokaciji. Da li želite da saznate više?";
        }

        // Dodatni odgovor na opcije skladištenja
        else if (
          lowerInput.includes("privremeno skladištenje") ||
          lowerInput.includes("privremeno skladistenje")
        ) {
          return "Nudimo privremena skladišna rešenja za vaše stvari tokom procesa selidbe. Da li želite više detalja?";
        }

        // Odgovor na pakovanje
        else if (
          lowerInput === "pakovanje" ||
          lowerInput.includes(" pakovanje") ||
          lowerInput.includes("pakovanje materijala")
        ) {
          userState.inquiringAboutPacking = true;
          return "Naš tim nudi sveobuhvatne usluge pakovanja kako bi osigurao da su vaši predmeti sigurni i organizovani tokom selidbe. Da li želite da saznate više?";
        }

        // Odgovor na usluge pakovanja (nastavak)
        else if (
          userState.inquiringAboutPacking &&
          !userState.inquiringAboutPackingDetailed &&
          lowerInput.includes("da")
        ) {
          userState.inquiringAboutPackingDetailed = true;
          return "Odlično! Naše usluge pakovanja uključuju profesionalno pakovanje vaših stvari, pružanje visokokvalitetnih pakovnih materijala i osiguranje da je sve sigurno upakovano za transport. Takođe možemo pomoći sa raspakivanjem na vašoj novoj lokaciji. Da li želite da zakažete konsultaciju ili dobijete ponudu?";
        }

        // Odgovor na usluge pakovanja (nastavak)
        else if (
          userState.inquiringAboutPacking &&
          userState.inquiringAboutPackingDetailed &&
          lowerInput.includes("da")
        ) {
          return "Možete zakazati konsultaciju ili dobiti ponudu kontaktiranjem nas putem email adrese <a href='mailto:contact@move-it.com' rel='noopener noreferrer'>contact@move-it.com</a> ili telefonskog broja <a href='tel:+442012345678' rel='noopener noreferrer'>+44 20 1234 5678</a>. Naša kancelarija se nalazi na adresi 123 Victoria St, London SW1E 6DE, Ujedinjeno Kraljevstvo. Ovde smo da vam pomognemo sa svim pitanjima!";
        }

        // Odgovor na usluge pakovanja (nastavak)
        else if (
          /\bne\b/.test(lowerInput) ||
          lowerInput.includes("nisam zainteresovan")
        ) {
          userState.inquiringAboutPacking = false;
          userState.inquiringAboutPackingDetailed = false;
          userState.inquiringAboutWhyChooseMoveIt = false;
          userState.inquiringAboutSpecialItems = false;
          return "Nema problema! Ako imate bilo kakva druga pitanja ili vam je potrebna pomoć oko nečega drugog, slobodno pitajte.";
        }

        // Dodatni odgovor na pakovanje
        else if (
          lowerInput.includes("pomoć pri pakovanju") ||
          lowerInput.includes("pomoc pri pakovanju")
        ) {
          return "Možemo pružiti pomoć pri pakovanju kako bismo osigurali da su vaši predmeti sigurni i organizovani. Da li želite da saznate više o ovoj usluzi?";
        }

        // Odgovor na upit o lokalnoj selidbi
        if (
          lowerInput.includes("šta možete reći o selidbi unutar grada") ||
          lowerInput.includes("sta mozete reci o selidbi unutar grada") ||
          lowerInput.includes("možete li mi reći nešto o selidbi u gradu") ||
          lowerInput.includes("mozete li mi reci nesto o selidbi u gradu") ||
          lowerInput.includes("pričajte mi o lokalnoj selidbi") ||
          lowerInput.includes("pricajte mi o lokalnoj selidbi") ||
          lowerInput.includes("koje usluge nudite za selidbe u gradu") ||
          lowerInput.includes("šta možete reći o gradskim selidbama") ||
          lowerInput.includes("sta mozete reci o gradskim selidbama") ||
          lowerInput.includes("informacije o selidbi unutar grada") ||
          lowerInput.includes("usluge selidbe u gradu") ||
          lowerInput.includes("detalji o lokalnim selidbama") ||
          lowerInput.includes("šta pružate za selidbe u gradu") ||
          lowerInput.includes("sta pruzate za selidbe u gradu") ||
          lowerInput.includes("o selidbi u mom gradu") ||
          lowerInput.includes("kako se nosite sa lokalnim selidbama") ||
          lowerInput.includes("šta je uključeno u usluge lokalne selidbe") ||
          lowerInput.includes("sta je ukljuceno u usluge lokalne selidbe") ||
          lowerInput.includes("objasnite mi selidbu unutar grada") ||
          lowerInput.includes("koje su vaše opcije za lokalne selidbe") ||
          lowerInput.includes("koje su vase opcije za lokalne selidbe") ||
          lowerInput.includes("kako funkcionišu lokalne selidbe") ||
          lowerInput.includes("kako funkcionisu lokalne selidbe") ||
          lowerInput.includes(
            "možete li pružiti detalje o selidbama u gradu"
          ) ||
          lowerInput.includes(
            "mozete li pruziti detalje o selidbama u gradu"
          ) ||
          lowerInput.includes("opišite svoje usluge za lokalne selidbe") ||
          lowerInput.includes("opisite svoje usluge za lokalne selidbe")
        ) {
          return "Nudimo razne usluge lokalne selidbe prilagođene vašim potrebama. To uključuje <a href='https://primesolar.github.io/move-it/professional-packing.html' rel='noopener noreferrer'><strong>profesionalno pakovanje</strong></a>, <a href='https://primesolar.github.io/move-it/faqs.html' rel='noopener noreferrer'><strong>rastavljanje/montažu nameštaja</strong></a>, i <a href='https://primesolar.github.io/move-it/contact.html' rel='noopener noreferrer'><strong>fleksibilne opcije zakazivanja</strong></a> kako bi vaša selidba bila što lakša. Ako imate konkretna pitanja ili vam treba više informacija, slobodno pitajte!";
        }

        // Odgovor na komercijalne selidbe
        else if (lowerInput.includes("komercijalne selidbe")) {
          return "Specijalizujemo se za komercijalne usluge selidbe prilagođene preduzećima. Javite nam ako vam je potrebna pomoć sa preseljenjem kancelarije!";
        }

        // Dodatni odgovor na komercijalne selidbe
        else if (
          lowerInput.includes("preseljenje preduzeća") ||
          lowerInput.includes("preseljenje preduzeca")
        ) {
          return "Specijalizujemo se za preseljenje preduzeća i možemo pomoći da vaša tranzicija prođe glatko. Kako možemo da vam pomognemo?";
        }

        // Odgovor na rezervaciju
        else if (
          lowerInput.includes("rezerviši") ||
          lowerInput.includes("rezervisi")
        ) {
          return "Rezervacija selidbe sa nama je jednostavna! Samo kontaktirajte naš tim za korisničku podršku sa detaljima o vašoj selidbi, i pružićemo vam ponudu i zakazati je u vreme koje vam odgovara.";
        }

        // Dodatni odgovor na rezervaciju
        else if (lowerInput.includes("zakazati selidbu")) {
          return "Zakazivanje selidbe sa nama je jednostavno! Samo pružite svoje podatke našem timu za korisničku podršku, i mi ćemo se pobrinuti za sve ostalo.";
        }

        // Dodatni odgovor na pripremu
        else if (lowerInput.includes("checklist")) {
          return "Korišćenje liste za selidbu je odličan način da ostanete organizovani. Možete je pronaći na našoj <a href='https://primesolar.github.io/move-it/checklist.html' rel='noreferrer noopener'>stranici sa listom za selidbu</a>.";
        }

        // Odgovor na pripremu
        else if (
          lowerInput.includes("pripremiti se za") ||
          lowerInput.includes("kako se pripremiti")
        ) {
          return "Da biste se pripremili za selidbu, počnite sa smanjenjem stvari i pakovanjem kutije sa osnovnim stvarima. Zakazujte selidbu sa nama unapred kako biste osigurali dostupnost.";
        }

        // Odgovor na troškove
        else if (
          lowerInput.includes("koliko košta") ||
          lowerInput.includes("koliko kosta") ||
          lowerInput.includes("cena") ||
          lowerInput.includes("trošak") ||
          lowerInput.includes("trosak")
        ) {
          return "Trošak selidbe varira u zavisnosti od faktora kao što su tip usluge, udaljenost i veličina nekretnine. Kontaktirajte nas za besplatnu, neobavezujuću ponudu!";
        }

        // Dodatni odgovor na troškove
        else if (lowerInput.includes("procena")) {
          return "Za tačnu procenu, molimo vas da pružite detalje o vašoj selidbi, i mi ćemo vam se javiti sa ponudom!";
        }

        // Odgovor na popuste
        else if (
          lowerInput.includes("popust") ||
          lowerInput.includes("akcija")
        ) {
          return "Da, nudimo razne popuste i akcije kako bismo vašu selidbu učinili pristupačnijom, uključujući sezonske ponude i popuste za preporuke. Obavezno pitajte o trenutnim promocijama kada dobijete ponudu!";
        }

        // Dodatni odgovor na popuste
        else if (lowerInput.includes("posebne ponude")) {
          return "Često imamo dostupne posebne ponude. Obavezno pitajte o trenutnim promocijama kada nas kontaktirate!";
        }

        // Odgovor na kontakt
        else if (
          lowerInput.includes("kontakt") ||
          lowerInput.includes("email") ||
          lowerInput.includes("telefon")
        ) {
          return "Možete nas kontaktirati putem emaila na <a href='mailto:contact@move-it.com' rel='noopener noreferrer'>contact@move-it.com</a> ili nas pozvati na <a href='tel:+442012345678' rel='noopener noreferrer'>+44 20 1234 5678</a>. Naša kancelarija se nalazi na adresi 123 Victoria St, London SW1E 6DE, Ujedinjeno Kraljevstvo. Ovde smo da pomognemo!";
        }

        // Dodatni odgovor na kontakt
        else if (lowerInput.includes("obratiti se")) {
          return "Možete nam se obratiti putem email adrese <a href='mailto:contact@move-it.com' rel='noopener noreferrer'>contact@move-it.com</a> ili telefonskog broja <a href='tel:+442012345678' rel='noopener noreferrer'>+44 20 1234 5678</a>. Naša kancelarija se nalazi na adresi 123 Victoria St, London SW1E 6DE, Ujedinjeno Kraljevstvo. Ovde smo da vam pomognemo sa svim pitanjima!";
        }

        // Odgovor na vremenski okvir selidbe
        else if (
          lowerInput.includes("koliko traje") ||
          lowerInput.includes("vremenski okvir selidbe") ||
          lowerInput.includes("trajanje selidbe")
        ) {
          return "Trajanje selidbe može varirati u zavisnosti od udaljenosti i količine stvari. Obično, lokalne selidbe mogu se završiti za jedan dan, dok dugoročne selidbe mogu trajati nekoliko dana. Da li želite konkretniju procenu?";
        }

        // Odgovor na osiguranje
        else if (lowerInput.includes("osiguranje")) {
          return "Nudimo razne opcije osiguranja kako bismo zaštitili vaše stvari tokom selidbe. Važno je razgovarati o ovim opcijama sa našim timom kako bismo pronašli najbolju pokrivenost za vaše potrebe.";
        }

        // Odgovor na materijale za selidbu
        else if (
          lowerInput.includes("materijali za selidbu") ||
          lowerInput.includes("kutije") ||
          lowerInput.includes("pakovni materijali")
        ) {
          return "Nudimo razne materijale za selidbu, uključujući kutije, traku i pakovne materijale. Da li želite da saznate više o našim opcijama snabdevanja?";
        }

        // Odgovor na posebne predmete
        else if (
          lowerInput.includes("posebni predmeti") ||
          lowerInput.includes("krhko") ||
          lowerInput.includes("muzički instrument") ||
          lowerInput.includes("muzicki instrument") ||
          lowerInput.includes("gitara") ||
          lowerInput.includes("violina") ||
          lowerInput.includes("truba") ||
          lowerInput.includes("bubnjevi") ||
          lowerInput.includes("klavir") ||
          lowerInput.includes("umetničko delo") ||
          lowerInput.includes("umetnicko delo") ||
          lowerInput.includes("umetnički rad") ||
          lowerInput.includes("umetnicki rad") ||
          lowerInput.includes("komad umetnosti") ||
          lowerInput.includes("komadi umetnosti") ||
          lowerInput.includes("antiques")
        ) {
          userState.inquiringAboutSpecialItems = true;
          return "Imamo iskustva u rukovanju posebnim predmetima kao što su muzički instrumenti, umetnička dela i antikviteti. Naš tim posebno pazi da se ovi predmeti sigurno transportuju. Da li želite da saznate više?";
        }

        // Odgovor na rukovanje posebnim predmetima
        else if (
          (userState.inquiringAboutSpecialItems && lowerInput.includes("da")) ||
          lowerInput.includes("imam") ||
          lowerInput.includes("specifične predmete") ||
          lowerInput.includes("specificne predmete")
        ) {
          return "Odlično! Mogu vam pružiti više detalja o tome kako rukujemo posebnim predmetima. Na primer, imamo posebne tehnike pakovanja za klavire i umetnička dela kako bismo osigurali da stignu sigurno.";
        }

        // Odgovor na proces rukovanja
        else if (
          (userState.inquiringAboutSpecialItems &&
            lowerInput.includes("kako rukujete")) ||
          lowerInput.includes("koji je vaš proces") ||
          lowerInput.includes("koji je vas proces")
        ) {
          return "Koristimo specijalizovane pakovne materijale i tehnike kako bismo zaštitili posebne predmete tokom transporta. Naš tim je obučen da rukuje krhkim i vrednim predmetima sa pažnjom, osiguravajući da budu sigurno upakovani i transportovani.";
        }

        // Odgovor na nedostatak posebnih predmeta
        else if (
          userState.inquiringAboutSpecialItems &&
          lowerInput.includes("nemam nijedan")
        ) {
          userState.inquiringAboutSpecialItems = false;
          return "Nema problema! Ako imate bilo kakva druga pitanja o našim uslugama selidbe ili vam je potrebna pomoć oko selidbe, slobodno pitajte!";
        }

        // Odgovor na savete za selidbu
        else if (lowerInput.includes("saveti za selidbu")) {
          return "Evo nekoliko brzih saveta za selidbu: počnite sa pakovanjem unapred, označite svoje kutije i čuvajte važne dokumente odvojeno. Da li želite detaljnije savete?";
        }

        // Odgovor na oblasti usluga
        else if (
          lowerInput.includes("oblasti usluga") ||
          lowerInput.includes("lokacije")
        ) {
          return "Služimo širokom spektru područja! Molimo vas da nam kažete vašu trenutnu lokaciju i odredište, i možemo potvrditi da li možemo da vam pomognemo.";
        }

        // Odgovor na opcije plaćanja
        else if (
          lowerInput.includes("opcije plaćanja") ||
          lowerInput.includes("opcije placanja") ||
          lowerInput.includes("platiti")
        ) {
          return "Prihvatamo različite metode plaćanja, uključujući kreditne kartice, bankovne transfere i gotovinu. Molimo vas da pitate naš tim za više detalja tokom procesa rezervacije.";
        }

        // Odgovor na politiku otkazivanja
        else if (
          lowerInput.includes("politika otkazivanja") ||
          lowerInput.includes("otkazati")
        ) {
          return "Razumemo da se planovi mogu promeniti. Naša politika otkazivanja vam omogućava da otkažete ili prebacite vašu selidbu uz obaveštenje. Molimo vas da nas kontaktirate za specifične detalje.";
        }

        // Odgovor na procedure na dan selidbe
        else if (
          lowerInput.includes("dan selidbe") ||
          lowerInput.includes("šta očekivati") ||
          lowerInput.includes("sta ocekivati")
        ) {
          return "Na dan selidbe, naš tim će doći na vreme, spreman da upakuje i utovari vaše stvari. Održavaćemo vas informisanim tokom celog procesa. Imate li specifične brige u vezi sa danom selidbe?";
        }

        // Odgovor na ekološke opcije
        else if (
          lowerInput.includes("ekološki") ||
          lowerInput.includes("ekoloski") ||
          lowerInput.includes("održivo") ||
          lowerInput.includes("odrzivo")
        ) {
          return "Nudimo ekološke opcije selidbe, uključujući ponovo upotrebljive pakovne materijale i održive prakse. Javite nam ako ste zainteresovani za naša zelena rešenja za selidbu!";
        }

        // Odgovor na međunarodne selidbe
        else if (
          lowerInput.includes("međunarodne selidbe") ||
          lowerInput.includes("medunarodne selidbe") ||
          lowerInput.includes("preko mora")
        ) {
          return "Možemo pomoći i sa međunarodnim selidbama! Naš tim ima iskustva u rukovanju carinskim i logističkim pitanjima za selidbe u inostranstvo. Da li želite više informacija?";
        }

        // Dodatni odgovor na međunarodne selidbe
        else if (
          lowerInput.includes("selidba u inostranstvo") ||
          lowerInput.includes("selidba u stranu zemlju") ||
          lowerInput.includes("međunarodna selidba") ||
          lowerInput.includes("medunarodna selidba") ||
          lowerInput.includes("preseljenje u inostranstvo") ||
          lowerInput.includes("selidba preko mora")
        ) {
          return "Selidba u inostranstvo može biti uzbudljiva avantura! Možemo vam pomoći da se snađete u logistici i papirologiji. Koje specifične informacije vam trebaju?";
        }

        // Odgovor na carinske propise
        else if (lowerInput.includes("carinski propisi")) {
          return "Razumevanje carinskih propisa je važno za međunarodne selidbe. Možemo pružiti smernice o tome koji su predmeti dozvoljeni i koja je potrebna dokumentacija.";
        }

        // Odgovor na vizu
        else if (
          lowerInput.includes("zahtevi za vizu") ||
          lowerInput.includes("informacije o vizama") ||
          lowerInput.includes("saznati o vizama") ||
          lowerInput.includes("reci mi o vizama") ||
          lowerInput.includes("pričaj o vizama") ||
          lowerInput.includes("pricaj o vizama") ||
          lowerInput.includes("pitanje o vizama") ||
          lowerInput.includes("pitanja o vizama") ||
          lowerInput.includes("vizna pitanja") ||
          lowerInput.includes("razgovor o vizama") ||
          lowerInput.includes("dobiti vizu")
        ) {
          return "Zahtevi za vizu variraju od zemlje do zemlje. Važno je proveriti specifične propise za vašu destinaciju. Da li želite pomoć u vezi s tim?";
        }

        // Odgovor na međunarodnu dostavu
        else if (lowerInput.includes("međunarodna dostava")) {
          return "Nudimo usluge međunarodne dostave kako bismo osigurali da vaši predmeti stignu sigurno na vašu novu adresu. Da li želite da saznate više o našim opcijama dostave?";
        }

        // Odgovor na jezičku podršku
        else if (
          lowerInput.includes("jezička pomoć") ||
          lowerInput.includes("jezicka pomoc")
        ) {
          return "Selidba u novu zemlju često uključuje jezičke barijere. Možemo pružiti resurse ili preporuke za usluge jezičke pomoći.";
        }

        // Odgovor na kulturnu prilagodbu
        else if (lowerInput.includes("kulturna prilagodba")) {
          return "Možemo ponuditi savete i resurse koji će vam pomoći da se lako prilagodite. Da li želite više informacija?";
        }

        // Odgovor na međunarodno osiguranje
        else if (
          lowerInput.includes("međunarodno osiguranje") ||
          lowerInput.includes("medunarodno osiguranje")
        ) {
          return "Preporučujemo da razmotrite opcije međunarodnog osiguranja kako biste zaštitili svoje stvari tokom selidbe. Da li želite pomoć u pronalaženju odgovarajuće pokrivenosti?";
        }

        // Odgovor na pakovanje za međunarodnu selidbu
        else if (
          lowerInput.includes("pakovanje za međunarodnu selidbu") ||
          lowerInput.includes("pakovanje za medunarodnu selidbu")
        ) {
          return "Pakovanje za međunarodnu selidbu zahteva posebne razmatranja. Možemo pružiti savete o tome kako efikasno i sigurno pakovati za dugotrajni transport.";
        }

        // Odgovor na selidbu sa ljubimcima
        else if (
          lowerInput.includes("ljubimci") ||
          lowerInput.includes("selidba sa ljubimcima")
        ) {
          return "Selidba sa ljubimcima zahteva posebnu pažnju. Možemo pružiti savete i resurse kako bismo osigurali glatku tranziciju za vaše krznene prijatelje. Da li želite da saznate više?";
        }

        // Odgovor na selidbu za starije osobe
        else if (
          lowerInput.includes("stariji") ||
          lowerInput.includes("selidba za starije osobe")
        ) {
          return "Razumemo da selidba može biti posebno izazovna za starije osobe. Naš tim je obučen da pruži saosećajnu i poštovanu pomoć. Kako možemo pomoći sa vašom selidbom?";
        }

        // Odgovor na korporativno preseljenje
        else if (
          lowerInput.includes("korporativno preseljenje") ||
          lowerInput.includes("selidba zaposlenih")
        ) {
          return "Specijalizujemo se za korporativna preseljenja i možemo pomoći sa selidbama zaposlenih, osiguravajući glatku tranziciju za vaš tim. Javite nam kako možemo pomoći!";
        }

        // Odgovor na savete za hitne selidbe
        else if (
          lowerInput.includes("hitni saveti") ||
          lowerInput.includes("hitna selidba")
        ) {
          return "Za hitne selidbe, fokusirajte se na osnovne stvari: spakujte kofer sa odećom, prikupite važne dokumente i osigurajte da imate plan za dan selidbe. Trebate li više specifičnih saveta?";
        }

        // Odgovor na selidbu biljaka
        else if (lowerInput.includes("biljke")) {
          return "Selidba biljaka zahteva posebnu pažnju. Razmislite o tome kako ih zaštititi tokom transporta. Da li želite savete o specifičnim vrstama biljaka?";
        }

        // Odgovor na selidbu nameštaja
        else if (
          lowerInput.includes("nameštaj") ||
          lowerInput.includes("namestaj") ||
          lowerInput.includes("teški predmeti") ||
          lowerInput.includes("teski predmeti") ||
          lowerInput.includes("veliki predmeti")
        ) {
          return "Imamo pravu opremu i obučeno osoblje da sigurno rukuje teškim nameštajem i velikim predmetima. Imate li specifične komade na umu kojima vam je potrebna pomoć?";
        }

        // Odgovor na usluge raspakivanja
        else if (lowerInput.includes("raspakivanje")) {
          return "Naš tim može pomoći sa raspakivanjem vaših stvari i postavljanjem vašeg novog prostora. Da li želite da saznate više o ovoj usluzi?";
        }

        // Odgovor na selidbu tokom vrhunca sezone
        else if (
          lowerInput.includes("vrhunac sezone") ||
          lowerInput.includes("zauzeta sezona")
        ) {
          return "Selidba tokom vrhunca sezone može biti izazovnija zbog veće potražnje. Najbolje je rezervisati vašu selidbu unapred. Imate li specifične datume na umu?";
        }

        // Odgovor na selidbu za studente
        else if (
          lowerInput.includes("student") ||
          lowerInput.includes("fakultet")
        ) {
          return "Nudimo posebne usluge za selidbe studenata, uključujući fleksibilno zakazivanje i pristupačne cene. Kako mogu da vam pomognem sa vašim preseljenjem?";
        }

        // Odgovor na ugovore o selidbi
        else if (
          lowerInput.includes("ugovor") ||
          lowerInput.includes("sporazum o selidbi")
        ) {
          return "Pre nego što se selite, pružamo detaljan ugovor koji opisuje usluge, troškove i uslove. Važno je pažljivo pročitati ovo. Imate li pitanja o nekim specifičnim uslovima?";
        }

        // Odgovor na opremu za selidbu
        else if (
          lowerInput.includes("oprema za selidbu") ||
          lowerInput.includes("alat")
        ) {
          return "Koristimo specijalizovanu opremu za selidbu kako bismo osigurali da vaši predmeti budu sigurno transportovani. Da li želite da saznate više o našoj opremi?";
        }

        // Odgovor na lokalne propise o selidbi
        else if (
          lowerInput.includes("lokalni propisi") ||
          lowerInput.includes("lokalni zakoni") ||
          lowerInput.includes("propisi o selidbi") ||
          lowerInput.includes("zakoni o selidbi")
        ) {
          return "Različita područja mogu imati specifične propise u vezi sa selidbom. Najbolje je proveriti sa lokalnim vlastima.";
        }

        // Unrecognized input
        else {
          return "I'm sorry, I didn't quite catch that. Could you please rephrase your question or let me know how I can assist you with your move?";
        }
      }

      // Initial welcome message
      addMessage(
        "Move It",
        "Welcome to our chat! How can I assist you today?",
        "move-it-operator-message"
      );
    }
  }
})();

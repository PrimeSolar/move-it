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
  color: #ffffff;
  border-radius: 5px;
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
        console.log(innerWidth);
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

      // Function to generate a response based on user input
      function generateResponse(userInput) {
        // Normalize user input to lowercase for easier comparison
        const lowerInput = userInput.toLowerCase();

        //English

        // Greeting response
        if (
          lowerInput.includes("hello") ||
          lowerInput === "hi" ||
          lowerInput.includes("hi ") ||
          lowerInput.includes("hi,") ||
          lowerInput.includes("hi.") ||
          lowerInput.includes("hi!") ||
          lowerInput.includes("good evening") ||
          lowerInput.includes("good morning") ||
          lowerInput.includes("greetings")
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

        // Farewell responses
        else if (lowerInput.includes("bye") || lowerInput.includes("goodbye")) {
          return "Goodbye! Have a great day, and remember, moving can be joyful with the right help!";
        }

        // Цell-being response
        else if (
          lowerInput.includes("how are you") ||
          lowerInput.includes("how's it going")
        ) {
          return "Everything is great, thank you! How about you?";
        }

        // Identity response
        else if (
          lowerInput.includes("what is your name") ||
          lowerInput.includes("what's your name") ||
          lowerInput.includes("who are you")
        ) {
          return "My name is Zane. I am a representative of Move It, your assistant for all your moving needs! How can I help you today?";
        }

        // Capabilities response
        else if (
          lowerInput.includes("what can you do") ||
          lowerInput.includes("capabilities")
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

        // News response
        else if (lowerInput.includes("news")) {
          return "I can't provide news updates, but you can check your favorite news website for the latest!";
        }

        // Moving services response
        else if (
          lowerInput.includes("moving services") ||
          lowerInput.includes("moving help")
        ) {
          return "We offer a range of moving services, including local and long-distance moves, packing, and unpacking. How can I assist you with your move?";
        }

        // Storage options response
        else if (lowerInput.includes("storage options")) {
          return "We provide secure storage solutions for items you may not need immediately at your new location. Would you like to know more?";
        }

        // Packing response
        else if (lowerInput === "packing" || lowerInput.includes(" packing")) {
          return "Our team offers comprehensive packing services to ensure your belongings are safe and organized during the move. Would you like to learn more?";
        }

        // Commercial moving response
        else if (lowerInput.includes("commercial moving")) {
          return "We specialize in commercial moving services tailored to businesses. Let us know if you need assistance with your office relocation!";
        }

        // Booking response
        else if (lowerInput.includes("book")) {
          return "Booking a move with us is easy! Just contact our customer service team with details about your move, and we'll provide a quote and schedule it at your convenience.";
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

        // Discounts response
        else if (
          lowerInput.includes("discount") ||
          lowerInput.includes("promotion")
        ) {
          return "Yes, we offer various discounts and promotions to make your move more affordable, including seasonal offers and referral discounts. Be sure to ask about any ongoing promotions when you get a quote!";
        }

        // Contact response
        else if (
          lowerInput.includes("contact") ||
          lowerInput.includes("email") ||
          lowerInput.includes("phone")
        ) {
          return "You can reach us via email at contact@move-it.com or call us at +44 20 1234 5678. Our office is located at 123 Victoria St, London SW1E 6DE, United Kingdom. We're here to help!";
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
          return "We have experience handling special items like musical instruments, artwork, and antiques. Our team takes extra care to ensure these items are safely transported. Do you have specific items in mind?";
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

        //French

        // Réponse sur la salutation
        else if (
          lowerInput.includes("bonjour") ||
          lowerInput.includes("salut") ||
          lowerInput.includes("bonsoir") ||
          lowerInput.includes("bonne matinée") ||
          lowerInput.includes("bonne matinee") ||
          lowerInput.includes("salutations")
        ) {
          return "Bonjour ! Bienvenue chez Move It ! Comment puis-je vous aider avec vos besoins de déménagement aujourd'hui ?";
        }

        // Réponse sur l'aide
        else if (lowerInput.includes("aide")) {
          return "Bien sûr ! De quoi avez-vous besoin d'aide concernant votre déménagement ? Nous offrons une gamme de services pour rendre votre déménagement sans tracas.";
        }

        // Réponse sur le remerciement
        else if (
          lowerInput.includes("merci") ||
          lowerInput.includes("je vous remercie") ||
          lowerInput.includes("je l'apprécie") ||
          lowerInput.includes("je l'apprecie") ||
          lowerInput.includes("reconnaissant")
        ) {
          return "De rien ! Si vous avez d'autres questions sur nos services de déménagement, n'hésitez pas à demander.";
        }

        // Réponse sur l'adieu
        else if (
          lowerInput.includes("au revoir") ||
          lowerInput.includes("adieu")
        ) {
          return "Au revoir ! Passez une excellente journée, et rappelez-vous, déménager peut être joyeux avec la bonne aide !";
        }

        // Réponse sur le bien-être
        else if (
          lowerInput.includes("ça va") ||
          lowerInput.includes("ca va") ||
          lowerInput.includes("comment ça se passe") ||
          lowerInput.includes("comment ca se passe")
        ) {
          return "Ca va bien, merci ! Et vous ?";
        }

        // Réponse sur l'identité
        else if (
          lowerInput.includes("quel est votre nom") ||
          lowerInput.includes("qui êtes-vous") ||
          lowerInput.includes("qui etes-vous")
        ) {
          return "Je suis un représentant de Move It, votre assistant pour tous vos besoins de déménagement ! Comment puis-je vous aider aujourd'hui ?";
        }

        // Réponse sur les capacités
        else if (
          lowerInput.includes("que pouvez-vous faire") ||
          lowerInput.includes("capacités")
        ) {
          return "Je peux vous aider avec diverses questions sur le déménagement, des déménagements locaux aux déménagements longue distance, en passant par l'emballage et plus encore. Demandez simplement !";
        }

        // Réponse sur la blague
        else if (lowerInput.includes("raconte-moi une blague")) {
          return "Pourquoi les déménageurs font-ils de grands amis ? Parce qu'ils savent toujours comment remonter le moral !";
        }

        // Réponse sur la météo
        else if (lowerInput.includes("météo") || lowerInput.includes("meteo")) {
          return "Je ne peux pas vérifier la météo en ce moment, mais c'est toujours une bonne idée de planifier votre déménagement par temps clair !";
        }

        // Réponse sur les nouvelles
        else if (lowerInput.includes("nouvelles")) {
          return "Je ne peux pas fournir de mises à jour d'actualités, mais vous pouvez consulter votre site d'actualités préféré pour les dernières nouvelles !";
        }

        // Réponse sur les services de déménagement
        else if (
          lowerInput.includes("services de déménagement") ||
          lowerInput.includes("services de demenagement") ||
          lowerInput.includes("aide au déménagement") ||
          lowerInput.includes("aide au demenagement")
        ) {
          return "Nous offrons une gamme de services de déménagement, y compris des déménagements locaux et longue distance, l'emballage et le déballage. Comment pouvons-nous vous aider avec votre déménagement ?";
        }

        // Réponse sur les options de stockage
        else if (lowerInput.includes("options de stockage")) {
          return "Nous proposons des solutions de stockage sécurisées pour les articles dont vous pourriez ne pas avoir besoin immédiatement à votre nouvelle adresse. Souhaitez-vous en savoir plus ?";
        }

        // Réponse sur l'emballage
        else if (lowerInput.includes("emballage")) {
          return "Notre équipe propose des services d'emballage complets pour garantir que vos biens sont en sécurité et bien organisés pendant le déménagement. Souhaitez-vous en savoir plus ?";
        }

        // Réponse sur le déménagement commercial
        else if (
          lowerInput.includes("déménagement commercial") ||
          lowerInput.includes("demenagement commercial")
        ) {
          return "Nous sommes spécialisés dans les services de déménagement commercial adaptés aux entreprises. Faites-nous savoir si vous avez besoin d'aide pour votre déménagement de bureau !";
        }

        // Réponse sur la réservation
        else if (
          lowerInput.includes("réserver") ||
          lowerInput.includes("reserver")
        ) {
          return "Réserver un déménagement avec nous est facile ! Il vous suffit de contacter notre équipe de service client avec les détails de votre déménagement, et nous vous fournirons un devis et le programmerons à votre convenance.";
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

        // Réponse sur les réductions
        else if (
          lowerInput.includes("réduction") ||
          lowerInput.includes("reduction") ||
          lowerInput.includes("promotion")
        ) {
          return "Oui, nous offrons diverses réductions et promotions pour rendre votre déménagement plus abordable, y compris des offres saisonnières et des réductions pour parrainage. N'oubliez pas de demander les promotions en cours lorsque vous demandez un devis !";
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

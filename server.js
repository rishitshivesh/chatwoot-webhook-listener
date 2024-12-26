const express = require("express");

const app = express();

// Middleware to parse incoming JSON
app.use(express.json());

// Webhook route
app.post("/webhook/message", (req, res) => {
    const payload = req.body;

    // Handle only outgoing messages
    if (payload.message_type !== "outgoing") {
      console.log("Message type is not 'outgoing'. Ignoring...");
      return res.status(200).json({ success: true, message: "Ignored non-outgoing message" });
    }

    console.log("Processing outgoing message...");

    const {
      conversation: {
        id: chatwootConversationId,
        inbox_id: inboxId,
        contact_inbox: { source_id: contactIdentifier },
      },
      content: messageContent,
      id: chatwootMessageId,
      sender: { name: senderName },
    } = payload;

    // Log incoming payload
    console.log("Parsed Payload:", {
      chatwootConversationId,
      inboxId,
      contactIdentifier,
      messageContent,
      chatwootMessageId,
      senderName,
    });

  res.status(200).json({ success: true, message: "Data processed and logged successfully!" });
});


app.get("/", (req, res) => {
    res.send("Hello, friend");
});

// Start the server
const PORT = process.env.PORT || 4040;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

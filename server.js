const express = require("express");

const app = express();

// Middleware to parse incoming JSON
app.use(express.json());

// Webhook route
app.post("/webhook/message", (req, res) => {
  const { contact_identifier, chatwoot_data, message } = req.body;

  // Validate payload
  if (!contact_identifier || !chatwoot_data || !message) {
    console.error("Invalid payload received:", req.body);
    return res.status(400).json({ success: false, message: "Invalid payload" });
  }

  // Log received payload
  console.log("Received webhook data:");
  console.log(`Contact Identifier: ${contact_identifier}`);
  console.log(`Chatwoot Data: ${JSON.stringify(chatwoot_data, null, 2)}`);
  console.log(`Message: ${JSON.stringify(message, null, 2)}`);

  // Simulate searching for a conversation in a database
  console.log("\nSimulating database search...");
  const conversation = {
    contact_identifier: "user-123",
    chatwoot_data: { id: "chatwoot-id", inbox_id: "inbox-id" },
    messages: [
      { sender: "user", message: "Hello!", chatwootId: "msg-1", timestamp: new Date() },
    ],
  };

  console.log("Existing conversation found in the database:");
  console.log(JSON.stringify(conversation, null, 2));

  // Simulate updating the conversation
  console.log("\nUpdating conversation with the new message...");
  conversation.messages.push({
    sender: message.sender,
    message: message.content,
    chatwootId: message.id,
    timestamp: new Date(),
  });

  // Update last activity time
  conversation.last_activity_time = new Date();

  console.log("Updated conversation:");
  console.log(JSON.stringify(conversation, null, 2));

  // Respond with success
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

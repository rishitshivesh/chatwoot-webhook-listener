const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();

// Middleware to parse incoming JSON
app.use(express.json());

// File to store POST request logs
const LOG_FILE = path.join(__dirname, "postRequests.json");

// Initialize the log file if it doesn't exist
if (!fs.existsSync(LOG_FILE)) {
  fs.writeFileSync(LOG_FILE, JSON.stringify([]), "utf8");
}

// Function to save the last 5 POST requests
const savePostRequest = (requestData) => {
  const logs = JSON.parse(fs.readFileSync(LOG_FILE, "utf8"));

  // Add the new request data
  logs.push(requestData);

  // Keep only the last 5 requests
  const lastFiveLogs = logs.slice(-5);

  // Save to the file
  fs.writeFileSync(LOG_FILE, JSON.stringify(lastFiveLogs, null, 2), "utf8");
};

// Webhook route
app.post("/webhook/message", (req, res) => {
  const payload = req.body;
  const headers = req.headers;

  console.log("Incoming Payload:", JSON.stringify(payload, null, 2));

  // Save the request data
  savePostRequest({
    headers,
    body: payload,
    timestamp: new Date().toISOString(),
  });

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

  // Log parsed payload
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

// Route to get the last 5 POST requests
app.get("/webhook/logs", (req, res) => {
  const logs = JSON.parse(fs.readFileSync(LOG_FILE, "utf8"));
  res.status(200).json(logs);
});

app.get("/", (req, res) => {
  res.send("Hello, friend");
});

// Start the server
const PORT = process.env.PORT || 4040;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

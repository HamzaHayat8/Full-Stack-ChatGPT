import Openai from "../config/openAi.js";
import Chat from "../models/chatModel.js";
import User from "../models/userModel.js";
import imagekit from "../config/imagekit.js";
import axios from "axios";

// Text-base AI // Text-base AI // Text-base AI
export const messageController = async (req, res) => {
  try {
    const userId = req.user._id;
    const { chatId, message } = req.body;

    if (req.user.credits < 1)
      return res.status(400).json({ message: "Not enough credits" });

    const chat = await Chat.findOne({ _id: chatId, userId });
    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    chat.messages.push({
      role: "user",
      content: message,
      timestamp: Date.now(),
      isImage: false,
    });

    const { choices } = await Openai.chat.completions.create({
      model: "gemini-2.0-flash",
      messages: [{ role: "assistant", content: message }],
    });

    const response = {
      ...choices[0].message,
      timestamp: Date.now(),
      isImage: false,
    };

    chat.messages.push(response);

    await chat.save();
    await User.updateOne({ _id: userId }, { $inc: { credits: -1 } });

    return res.status(201).json({ message: "Message sent successfully", chat });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Api to Make Img
export const imageController = async (req, res) => {
  try {
    const userId = req.user._id;

    // 1. Check user credits
    if (req.user.credits < 2) {
      return res.status(400).json({ message: "Not enough credits" });
    }

    // 2. Destructure and validate input
    const { chatId, message, isPublished } = req.body;

    if (!chatId || !message) {
      return res
        .status(400)
        .json({ message: "chatId and message are required" });
    }

    // 3. Find the chat belonging to the user
    const chat = await Chat.findOne({ _id: chatId, userId });

    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    // 4. Add user message to chat
    const timestamp = Date.now();

    chat.messages.push({
      role: "user",
      content: message,
      timestamp,
      isImage: false,
    });

    // 5. Encode the message
    const encodedPrompt = encodeURIComponent(message);

    // 6. Check for missing endpoint
    if (!process.env.URL_ENDPOINT) {
      return res
        .status(500)
        .json({ message: "Missing image generation endpoint" });
    }

    // 7. Generate image URL
    const generatedImageUrl = `${process.env.URL_ENDPOINT}?prompt=${encodedPrompt}&size=512x512`;

    const base64Image = Buffer.from(generatedImageUrl, "binary").toString(
      "base64"
    );

    // 9. Upload to ImageKit
    const uploadResponse = await imagekit.upload({
      file: base64Image,
      fileName: `${timestamp}.png`,
      folder: "quickgpt",
    });

    if (!uploadResponse || !uploadResponse.url) {
      return res.status(500).json({ message: "Image upload failed" });
    }

    // 10. Create assistant reply
    const reply = {
      role: "assistant",
      content: uploadResponse.url,
      timestamp,
      isImage: true,
      isPublished: Boolean(isPublished),
    };

    chat.messages.push(reply);

    // 11. Save chat and update credits
    const aireplay = await chat.save();
    await User.updateOne({ _id: userId }, { $inc: { credits: -2 } });

    // 12. Return success
    return res
      .status(201)
      .json({ message: "Message sent successfully", aireplay });
  } catch (error) {
    console.error("Image generation error:", error);
    return res
      .status(500)
      .json({ message: error.message || "Internal server error" });
  }
};

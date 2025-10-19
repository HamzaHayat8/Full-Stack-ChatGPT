import Chat from "../models/chatModel.js";

// Create a new Chat
export const createChat = async (req, res) => {
  try {
    const userId = req.user._id;

    const ChatData = {
      userId,
      userName: req.user.name,
      name: "New Chat",
      messages: [],
    };

    const chat = await Chat.create(ChatData);
    return res.status(201).json({ message: "Chat created successfully", chat });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Get All Chat // Get All Chat  // Get All Chat
export const getChat = async (req, res) => {
  try {
    const userId = req.user._id;

    const chat = await Chat.find({ userId }).sort({ updatedAt: -1 });
    return res
      .status(201)
      .json({ success: true, message: "Chat created successfully", chat });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Delete Chat // Delete Chat // Delete Chat
export const deleteChat = async (req, res) => {
  try {
    const userId = req.user._id;
    const { chatId } = req.body;

    const chat = await Chat.deleteOne({ _id: chatId, userId });
    return res
      .status(201)
      .json({ success: true, message: "Chat created successfully", chat });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import { getReceiverSockerId, io } from "../socket/socket.js";

export const sendMessage = async (req, res) => {
    try {
        const { message } = req.body;
        const { id: receiverId } = req.params;
        const senderId = req.user._id;

        let conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] }
        })

        if (!conversation) {
            // create a new conversation
            conversation = await Conversation.create({
                participants: [senderId, receiverId],
            })
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            message
        })

        if (newMessage) {
            conversation.messages.push(newMessage._id);
        }

        // Time consuming

        // await conversation.save();
        // await newMessage.save();

        // this will run parallely
        await Promise.all([conversation.save(), newMessage.save()]);

        // socket io functionality 
        const receiverSocketID = getReceiverSockerId(receiverId);
        if (receiverSocketID) {
            // io.emit = send message to all receivers
            // io.to(<socketID>).emit = used to send events to specific user
            io.to(receiverSocketID).emit("newMessage", newMessage);
        }

        res.status(201).json(newMessage);

    } catch (error) {
        console.log("Error in sendMessage controller :", error.message);
    }
}

export const getMessage = async (req, res) => {
    try {
        const { id: userToChat } = req.params;
        const senderId = req.user._id;

        const conversation = await Conversation.findOne({
            participants: { $all: [senderId, userToChat] },
        }).populate("messages");

        if (!conversation) {
            return res.status(200).json([]);
        }

        res.status(200).json(conversation.messages);

    } catch (error) {
        console.log("error in getMessage controller :", error.message);
    }
}
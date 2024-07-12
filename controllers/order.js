import { response } from "express";
import { FoodItem } from "../models/food-item.js";
import { Order } from "../models/order.js";

export const addOrder = async (req, res) => {
  try {
    const {
      customerName,
      customerPhoneNo,
      customerAddress,
      items,
      totalAmount,
      customization,
    } = req.body;

    if (
      !customerName ||
      !customerPhoneNo ||
      !customerAddress ||
      !items ||
      !totalAmount
    ) {
      return res
        .status(400)
        .json({ message: "All required fields must be provided." });
    }
    for (const item of items) {
      if (!item.foodItem || !item.quantity) {
        return res
          .status(400)
          .json({ message: "Each item must have a foodItem and quantity." });
      }

      // Check if food item exists in the database
      const foodItemExists = await FoodItem.findById(item.foodItem);
      if (!foodItemExists) {
        return res
          .status(404)
          .json({ message: `Food item with ID ${item.foodItem} not found.` });
      }
    }
    const newOrder = new Order({
      customerName,
      customerPhoneNo,
      customerAddress,
      items,
      totalAmount,
      customization,
    });

    // Save order to the database
    const savedOrder = await newOrder.save();

    // Return success response
    res.status(201).json(savedOrder);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred while adding the order." });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;

    // Validate input
    if (!orderId || !status) {
      return res
        .status(400)
        .json({ message: "Order ID and status are required" });
    }

    // Validate status
    const validStatuses = ["PLACED", "ACCEPTED", "DELIVERED", "CANCELLED"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    // Find the order
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Update the status
    order.status = status;
    const updatedOrder = await order.save();

    // Respond with the updated order
    return res
      .status(200)
      .json({ message: "Order status has been updated", updatedOrder });
  } catch (error) {
    // Log the error and respond with a generic message
    console.error(error);
    return res
      .status(500)
      .json({ message: "An error occurred while updating the order status" });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const allOrders = await Order.find();
    return res.status(200).json({ message: "All orders", allOrders });
  } catch (error) {
    // Log the error and respond with a generic message
    console.error(error);
    return res.status(500).json({ message: "can't get all orders" });
  }
};

export const getTodayActiveOrders = async (req, res) => {
  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0); // Set time to 00:00:00

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999); // Set time to 23:59:59.999

    const orders = await Order.find({
      createdAt: {
        $gte: startOfDay,
        $lt: endOfDay,
      },
      status: "PLACED",
    });

    // Send the orders in the response
    res.status(200).json(orders);
  } catch (error) {
    // Handle errors
    console.error("Error getting today's orders:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getTodayAcceptedOrders = async (req, res) => {
  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0); // Set time to 00:00:00

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999); // Set time to 23:59:59.999

    const orders = await Order.find({
      createdAt: {
        $gte: startOfDay,
        $lt: endOfDay,
      },
      status: "ACCEPTED",
    });

    // Send the orders in the response
    res.status(200).json(orders);
  } catch (error) {
    // Handle errors
    console.error("Error getting today's orders:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getTodayDeliveredOrders = async (req, res) => {
  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0); // Set time to 00:00:00

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999); // Set time to 23:59:59.999

    const orders = await Order.find({
      createdAt: {
        $gte: startOfDay,
        $lt: endOfDay,
      },
      status: "DELIVERED",
    });

    // Send the orders in the response
    res.status(200).json(orders);
  } catch (error) {
    // Handle errors
    console.error("Error getting today's orders:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getTodayCancelledOrders = async (req, res) => {
  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0); // Set time to 00:00:00

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999); // Set time to 23:59:59.999

    const orders = await Order.find({
      createdAt: {
        $gte: startOfDay,
        $lt: endOfDay,
      },
      status: "CANCELLED",
    });

    // Send the orders in the response
    res.status(200).json(orders);
  } catch (error) {
    // Handle errors
    console.error("Error getting today's orders:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
"use server";

import { revalidatePath } from "next/cache";
import dbConnect from "@/lib/db";
import Notification from "@/models/Notification";
import { verifyAdmin } from "@/lib/authUtils";

/**
 * Fetch all notifications
 */
export async function getNotifications() {
    await verifyAdmin();
    await dbConnect();

    try {
        const notifications = await Notification.find({})
            .sort({ createdAt: -1 })
            .limit(20);
        
        return { 
            success: true, 
            notifications: JSON.parse(JSON.stringify(notifications)) 
        };
    } catch (error: any) {
        console.error("Error fetching notifications:", error);
        return { success: false, error: error.message };
    }
}

/**
 * Mark a notification as read
 */
export async function markAsRead(id: string) {
    await verifyAdmin();
    await dbConnect();

    try {
        await Notification.findByIdAndUpdate(id, { read: true });
        revalidatePath("/admin");
        return { success: true };
    } catch (error: any) {
        console.error("Error marking notification as read:", error);
        return { success: false, error: error.message };
    }
}

/**
 * Mark all notifications as read
 */
export async function markAllAsRead() {
    await verifyAdmin();
    await dbConnect();

    try {
        await Notification.updateMany({ read: false }, { read: true });
        revalidatePath("/admin");
        return { success: true };
    } catch (error: any) {
        console.error("Error marking all notifications as read:", error);
        return { success: false, error: error.message };
    }
}

/**
 * Delete a notification
 */
export async function deleteNotification(id: string) {
    await verifyAdmin();
    await dbConnect();

    try {
        await Notification.findByIdAndDelete(id);
        revalidatePath("/admin");
        return { success: true };
    } catch (error: any) {
        console.error("Error deleting notification:", error);
        return { success: false, error: error.message };
    }
}

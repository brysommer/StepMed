import { bot, sendMainMenu } from "../app.js";
import { dataBot } from "../values.js";
import { SERVICE_NAMES, formatBookingConfirmation, formatBookingFormSubmission } from "../config/messages.js";
import { MESSAGES } from "../config/messages.js";

const pendingForms = {};

export const startBookingForm = async (userChatId, serviceCallbackData, userName, originalMessageId) => {
    const serviceName = SERVICE_NAMES[serviceCallbackData] || '';

    pendingForms[userChatId] = {
        serviceName,
        serviceCallbackData,
        userName,
        startedAt: Date.now()
    };

    await bot.sendMessage(
        userChatId,
        formatBookingConfirmation(serviceName),
        { reply_to_message_id: originalMessageId }
    );
};

export const processBookingFormResponse = async (msg) => {
    const chatId = msg.chat.id;
    const pending = pendingForms[chatId];

    if (!pending) {
        return false;
    }

    const text = msg.text?.trim();
    if (!text) {
        await bot.sendMessage(chatId, MESSAGES.BOOKING_FORM_REQUIRE_TEXT);
        return true;
    }

    if (!dataBot.supportId) {
        await bot.sendMessage(chatId, MESSAGES.BOOKING_SUPPORT_NOT_CONFIGURED);
        delete pendingForms[chatId];
        sendMainMenu(chatId);
        return true;
    }

    const userDisplayName = msg.from.username
        ? `@${msg.from.username}`
        : [msg.from.first_name, msg.from.last_name].filter(Boolean).join(' ') || 'Користувач';

    const supportMessage = formatBookingFormSubmission({
        serviceName: pending.serviceName,
        userName: userDisplayName,
        userId: chatId,
        userMessage: text
    });

    try {
        await bot.sendMessage(dataBot.supportId, supportMessage);
        await bot.sendMessage(chatId, MESSAGES.BOOKING_FORM_SUBMITTED);
        sendMainMenu(chatId);
    } catch (error) {
        console.error(`Помилка відправки форми в групу підтримки (ID: ${dataBot.supportId}): ${error.message}`);
        await bot.sendMessage(chatId, MESSAGES.BOOKING_TECHNICAL_ERROR);
    } finally {
        delete pendingForms[chatId];
    }

    return true;
};

export const resetBookingForm = (chatId) => {
    delete pendingForms[chatId];
};

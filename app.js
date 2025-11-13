import TelegramBot from "node-telegram-bot-api";
import { dataBot } from "./values.js";
import { startBookingForm, processBookingFormResponse } from "./modules.js/bookingForm.js";
import { MESSAGES } from "./config/messages.js";
import { KEYBOARDS } from "./config/keyboards.js";

export const bot = new TelegramBot(dataBot.token, { polling: true });

export const sendMainMenu = (chatId) => {
    bot.sendMessage(chatId, MESSAGES.MAIN_MENU_QUESTION, KEYBOARDS.MAIN_MENU);
}

const sendServicesMenu = (chatId) => {
    bot.sendMessage(chatId, MESSAGES.SERVICES_CATEGORY_SELECTION, KEYBOARDS.SERVICES_MENU);
}

const sendConsultationsInfo = (chatId) => {
    bot.sendMessage(chatId, MESSAGES.CONSULTATIONS_INFO, KEYBOARDS.BACK_TO_SERVICES);
}

const sendExaminationsInfo = (chatId) => {
    bot.sendMessage(chatId, MESSAGES.EXAMINATIONS_INFO, KEYBOARDS.BACK_TO_SERVICES);
}

// Функція для надсилання інформації про реабілітацію
const sendRehabilitationInfo = (chatId) => {
    bot.sendMessage(chatId, MESSAGES.REHABILITATION_INFO, KEYBOARDS.BACK_TO_SERVICES);
}

const sendBookingServiceMenu = async (chatId) => {
    bot.sendMessage(chatId, MESSAGES.BOOKING_SERVICE_SELECTION, KEYBOARDS.BOOKING_SERVICE_MENU);
}


bot.onText(/\/start/, async (msg) => {

    const chatId = msg.chat.id;

    const welcomeMessage = `Привіт! 👋 Вітаємо у Telegram-боті медичного центру StepMed – вашого надійного партнера у діагностиці, лікуванні та реабілітації.

    Тут ви можете:
    * Дізнатися про наші послуги та спеціалістів.
    * Записатися на консультацію або обстеження.
    * Отримати відповіді на поширені запитання.
    
    Ми використовуємо сучасне обладнання та маємо багаторічний досвід, щоб дбати про ваше здоров'я!`;
    
        // Надсилаємо вітальне повідомлення, а потім головне меню
        bot.sendMessage(chatId, MESSAGES.WELCOME).then(() => {
            sendMainMenu(chatId);
        });

});

// Обробник натискань на кнопки Inline Keyboard
bot.on('callback_query', async (query) => {
    const chatId = query.message.chat.id;
    const data = query.data;
    const from = query.from; 

    const userName = from.username ? `@${from.username}` : (from.first_name || 'Користувач') + (from.last_name ? ` ${from.last_name}` : '');


    bot.answerCallbackQuery(query.id);


    switch (data) {
        case 'services_menu':
            sendServicesMenu(chatId);
            break;
        case 'consultations':
            sendConsultationsInfo(chatId);
            break;
        case 'examinations':
            sendExaminationsInfo(chatId);
            break;
        case 'rehabilitation':
            sendRehabilitationInfo(chatId);
            break;
        case 'book_appointment':
            // Замість реальної логіки запису - просте повідомлення з контактами
            sendBookingServiceMenu(chatId);
            break;
        case 'contacts':
            bot.sendMessage(chatId, MESSAGES.CONTACTS, { parse_mode: 'Markdown' });
            bot.sendMessage(chatId, MESSAGES.MAPS_LINK, { parse_mode: 'Markdown' }).then(() => sendMainMenu(chatId));

            break;
        case 'about_clinic':
            bot.sendMessage(chatId, MESSAGES.ABOUT_CLINIC).then(() => sendMainMenu(chatId));
            break;
        case 'back_to_main':
            sendMainMenu(chatId);
            break;
        case 'back_to_services':
            sendServicesMenu(chatId);
            break;
        case 'book_primary_consultation':
        case 'book_ultrasound':
        case 'book_endoscopy':
        case 'book_physical_therapy':
            await startBookingForm(chatId, data, userName, query.message.message_id);
            break;

        default:

            bot.sendMessage(chatId, MESSAGES.ERROR_UNKNOWN_REQUEST);
            sendMainMenu(chatId);
            break;
    }
});

// --- Обробка всіх вхідних текстових повідомлень для маршрутизації чату ---
bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;

    if (msg.chat.type !== 'private') {
        return;
    }

    // Ігноруємо команди (починаються з /), оскільки вони обробляються окремими onText або callback_query
    if (text && text.startsWith('/')) {
        return;
    }

    const handled = await processBookingFormResponse(msg);

    if (!handled) {
        sendMainMenu(chatId);
    }
});
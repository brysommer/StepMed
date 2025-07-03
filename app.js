import TelegramBot from "node-telegram-bot-api";
import { dataBot } from "./values.js";
import { handleBookingRequest } from "./modules.js/support.js";

export const bot = new TelegramBot(dataBot.token, { polling: true });

const activeConsultations = {};
// Об'єкт для зворотного зв'язку: { consultantChatId: userChatId }
const consultantToUserMap = {};

const sendMainMenu = (chatId) => {
    const opts = {
        reply_markup: {
            inline_keyboard: [
                [{ text: 'Наші послуги 🏥', callback_data: 'services_menu' }],
                [{ text: 'Записатися на прийом 📝', callback_data: 'book_appointment' }],
                [{ text: 'Контакти 📞', callback_data: 'contacts' }],
                [{ text: 'Про клініку ✨', callback_data: 'about_clinic' }]
            ]
        }
    };
    bot.sendMessage(chatId, 'Чим можемо бути корисні?', opts);
}

const sendServicesMenu = (chatId) => {
    const opts = {
        reply_markup: {
            inline_keyboard: [
                [{ text: 'Консультації спеціалістів 👩‍⚕️👨‍⚕️', callback_data: 'consultations' }],
                [{ text: 'Види обстежень 🔬', callback_data: 'examinations' }],
                [{ text: 'Фізична реабілітація 💪', callback_data: 'rehabilitation' }],
                [{ text: '🔙 Назад до головного', callback_data: 'back_to_main' }]
            ]
        }
    };
    bot.sendMessage(chatId, 'Оберіть категорію послуг:', opts);
}

const sendConsultationsInfo = (chatId) => {
    const message = `У StepMed консультують фахові спеціалісти:
- Невролог
- Кардіолог
- Травматолог
- Терапевт / Гастроентеролог
- Сімейний лікар
- Ендокринолог
- Акушер-гінеколог
- Реабілітолог

Для запису оберіть "Записатися на прийом" у головному меню.`;
    const opts = {
        reply_markup: {
            inline_keyboard: [
                [{ text: '🔙 До послуг', callback_data: 'back_to_services' }]
            ]
        }
    };
    bot.sendMessage(chatId, message, opts);
}

const sendExaminationsInfo = (chatId) => {
    const message = `Доступні види обстежень у StepMed:
- ЕКГ
- Ехокардіографія (ехо серця)
- УЗД внутрішніх органів
- УЗД судин (ультразвукова доплерографія)
- Гастроскопія
- Колоноскопія
- Лабораторні дослідження

Для запису оберіть "Записатися на прийом" у головному меню.`;
    const opts = {
        reply_markup: {
            inline_keyboard: [
                [{ text: '🔙 До послуг', callback_data: 'back_to_services' }]
            ]
        }
    };
    bot.sendMessage(chatId, message, opts);
}

// Функція для надсилання інформації про реабілітацію
const sendRehabilitationInfo = (chatId) => {
    const message = `У StepMed надаються послуги кваліфікованої фізичної реабілітації, а також сучасна ударно-хвильова терапія.

Для запису оберіть "Записатися на прийом" у головному меню.`;
    const opts = {
        reply_markup: {
            inline_keyboard: [
                [{ text: '🔙 До послуг', callback_data: 'back_to_services' }]
            ]
        }
    };
    bot.sendMessage(chatId, message, opts);
}

const sendBookingServiceMenu = async (chatId) => {
    const opts = {
        reply_markup: {
            inline_keyboard: [
                [{ text: 'Первинна консультація 👨‍⚕️', callback_data: 'book_primary_consultation' }],
                [{ text: 'УЗД окремих органів 🔬', callback_data: 'book_ultrasound' }],
                [{ text: 'Ендоскопічні дослідження 🏥', callback_data: 'book_endoscopy' }],
                [{ text: 'Фізична терапія 💪', callback_data: 'book_physical_therapy' }],
                [{ text: '🔙 Повернутися до головного', callback_data: 'back_to_main' }]
            ]
        }
    };
    bot.sendMessage(chatId, 'Оберіть тип послуги для запису:', opts);
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
        bot.sendMessage(chatId, welcomeMessage).then(() => {
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
            bot.sendMessage(chatId, '📍 **Наша адреса:** вул. Бабія 7 м. Пустомити\n📞 **Телефон:** +38(098) 168-00-88\n🌐 **Вебсайт:** https://stepmed.com.ua/ \n https://maps.app.goo.gl/gxqgPYfw6vwQ4aQ8A', { parse_mode: 'Markdown' });
            bot.sendMessage(chatId, 'https://maps.app.goo.gl/gxqgPYfw6vwQ4aQ8A', { parse_mode: 'Markdown' }).then(() => sendMainMenu(chatId));

            break;
        case 'about_clinic':
            bot.sendMessage(chatId, 'Медичний центр StepMed – це сучасний центр діагностики, лікування та реабілітації. Ми пишаємося багаторічним досвідом наших спеціалістів та сучасним обладнанням, що дозволяє надавати якісні послуги з індивідуальним підходом. Ми співпрацюємо з НСЗУ. \nЛіцензія МОЗ України №2746 від 27.11.2020р, Ліцензія МОЗ України №5 від 11.03.2021 року. ').then(() => sendMainMenu(chatId));
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
            console.log(chatId, data, userName, query.message.message_id)
            await handleBookingRequest(chatId, data, userName, query.message.message_id);
            break;
            case 'end_consultation':
                const consultantChatId = chatId; // Тут chatId - це ID консультанта
                const userInConsultationId = consultantToUserMap[consultantChatId]; // Знаходимо ID користувача
    
                if (userInConsultationId) {
                    // Повідомляємо користувача, що чат завершено
                    await bot.sendMessage(userInConsultationId, 'Чат з консультантом завершено. Якщо у вас є інші питання, можете обрати опції в головному меню.');
                    sendMainMenu(userInConsultationId); // Повертаємо користувача до головного меню
    
                    // Повідомляємо консультанта
                    await bot.sendMessage(consultantChatId, `Консультація з користувачем (ID: ${userInConsultationId}) завершена.`);
    
                    // Видаляємо записи про консультацію зі стану
                    delete activeConsultations[userInConsultationId];
                    delete consultantToUserMap[consultantChatId];
                } else {
                    await bot.sendMessage(consultantChatId, 'Не вдалося завершити консультацію: активний чат не знайдено.');
                }
                break;
    
            // --- НОВИЙ ОБРОБНИК: Прийняття консультації консультантом ---
            case 'accept_consultation':
                const requestMsgId = query.message.message_id; // ID повідомлення із запитом у групі
                // Витягуємо ID користувача з тексту повідомлення
                const targetUserChatIdMatch = query.message.text.match(/ID:\s*(\d+)/);
                console.log(targetUserChatIdMatch)
                if (!targetUserChatIdMatch || !targetUserChatIdMatch[1]) {
                    await bot.sendMessage(chatId, 'Помилка: Не вдалося визначити ID користувача для консультації. Спробуйте оновити групу або перевірте формат повідомлення.');
                    return;
                }
                const userToConsultId = parseInt(targetUserChatIdMatch[1]);
    
                // Перевіряємо, чи цей користувач вже не в активній консультації
                if (activeConsultations[userToConsultId]) {
                    // Редагуємо повідомлення в групі, щоб показати, що запит вже прийнято
                    await bot.editMessageReplyMarkup(
                        {
                          chat_id: query.message.chat.id,
                          message_id: query.message.message_id,
                          reply_markup: {
                            inline_keyboard: [[{ text: 'Запит вже прийнято ✅', callback_data: 'accepted_already' }]]
                          }
                        }
                      );
                      
                    return await bot.sendMessage(chatId, 'Цей запит вже прийнято іншим консультантом або знаходиться в активній консультації.');
                }
    
                // Зберігаємо, хто з ким консультує
                activeConsultations[userToConsultId] = chatId; // Користувач -> Консультант
                consultantToUserMap[chatId] = userToConsultId; // Консультант -> Користувач
    
                // Редагуємо повідомлення в групі, щоб показати, що запит прийнято цим консультантом
                await bot.editMessageReplyMarkup({
                    inline_keyboard: [
                      [{ text: `Прийнято: ${userName} ✅`, callback_data: 'accepted_placeholder' }]
                    ]
                  }, {
                    chat_id: query.message.chat.id,
                    message_id: requestMsgId,
                  });
                  
    
                // Повідомляємо користувача, що консультант підключився
                await bot.sendMessage(userToConsultId, `Консультант підключився до вашого чату! Ви можете надсилати свої запитання. Коли консультація буде завершена, консультант повідомить вас.`);
                // sendMainMenu(userToConsultId); // Не повертаємо головне меню, поки чат активний
    
                // Повідомляємо консультанта
                await bot.sendMessage(chatId, `Ви почали консультацію з користувачем (ID: ${userToConsultId}, ${userToConsultId > 0 ? `[Перейти до чату](tg://user?id=${userToConsultId})` : 'не може бути посилання на групу/канал'}).
    Всі ваші повідомлення, надіслані в *цей бот*, будуть пересилатися йому.
    Щоб завершити консультацію, натисніть кнопку нижче:`, {
                    parse_mode: 'Markdown',
                    reply_markup: {
                        inline_keyboard: [[{ text: 'Завершити консультацію 🔚', callback_data: 'end_consultation' }]]
                    }
                });
                break;
    
        default:

            bot.sendMessage(chatId, 'Вибачте, сталася помилка або запит невідомий. Повертаюся до головного меню.');
            sendMainMenu(chatId);
            break;
    }
});

// --- Обробка всіх вхідних текстових повідомлень для маршрутизації чату ---
bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;

    // Ігноруємо повідомлення з групи, якщо це не відповідь на наш запит
    // Або просто ігноруємо, якщо це не приватний чат з ботом
    if (msg.chat.type !== 'private' && chatId !== parseInt(dataBot.supportId)) {
        return;
    }

    // Ігноруємо команди (починаються з /), оскільки вони обробляються окремими onText або callback_query
    if (text && text.startsWith('/')) {
        return;
    }

    // Якщо повідомлення від КОРИСТУВАЧА, який в активній консультації
    if (activeConsultations[chatId]) {
        const consultantId = activeConsultations[chatId];
        try {
            await bot.sendMessage(consultantId, `*Клієнт (${msg.from.first_name || 'Користувач'}):*\n${text}`, { parse_mode: 'Markdown' });
        } catch (error) {
            console.error(`Помилка пересилання повідомлення від користувача ${chatId} до консультанта ${consultantId}: ${error.message}`);
            await bot.sendMessage(chatId, 'Вибачте, не вдалося переслати ваше повідомлення консультанту. Можливо, консультація вже завершена або виникла помилка.');
            // Можливо, тут варто завершити консультацію для користувача, якщо вона неактивна з боку консультанта
            if (!consultantToUserMap[consultantId]) { // Якщо у консультанта немає зворотнього зв'язку
                delete activeConsultations[chatId];
                sendMainMenu(chatId);
            }
        }
    }
    // Якщо повідомлення від КОНСУЛЬТАНТА, який в активній консультації
    else if (consultantToUserMap[chatId]) { // chatId тут - це ID консультанта
        const userId = consultantToUserMap[chatId];
        try {
            await bot.sendMessage(userId, `*Консультант:* ${text}`, { parse_mode: 'Markdown' });
        } catch (error) {
            console.error(`Помилка пересилання повідомлення від консультанта ${chatId} до користувача ${userId}: ${error.message}`);
            await bot.sendMessage(chatId, 'Вибачте, не вдалося переслати ваше повідомлення клієнту. Можливо, чат з ним вже неактивний.');
            // Можливо, варто завершити консультацію для консультанта
            if (!activeConsultations[userId]) { // Якщо у користувача немає зворотнього зв'язку
                 delete consultantToUserMap[chatId];
            }
        }
    }
    // Якщо повідомлення не є частиною активної консультації, повертаємо головне меню
    else if (msg.chat.type === 'private') { // Тільки для приватних чатів з ботом
        sendMainMenu(chatId);
    }
});
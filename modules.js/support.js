import { bot } from "../app.js";
import { dataBot } from "../values.js";

const handleBookingRequest = async (userChatId, serviceCallbackData, userName, originalMessageId) => {
    let serviceName = '';
    // Визначаємо назву послуги за її callback_data
    switch (serviceCallbackData) {
        case 'book_primary_consultation':
            serviceName = 'Первинна консультація';
            break;
        case 'book_ultrasound':
            serviceName = 'УЗД окремих органів';
            break;
        case 'book_endoscopy':
            serviceName = 'Ендоскопічні дослідження';
            break;
        case 'book_physical_therapy':
            serviceName = 'Фізична терапія';
            break;
    }

    // Повідомлення, яке буде надіслано консультанту в групу підтримки
    const consultantMessage = `🔔 *ЗАПИС!*
Користувач ${userName} (ID: \`${userChatId}\`) бажає записатися на:
*${serviceName}*
`;

    const opts = {
        parse_mode: 'Markdown',
        reply_markup: {
            inline_keyboard: [
                [{ text: 'Розпочати консультацію ✅', callback_data: 'accept_consultation' }]
            ]
        }
    };

    // Відправляємо повідомлення в групу підтримки
    if (dataBot.supportId) {
        try {
            await bot.sendMessage(dataBot.supportId, consultantMessage, opts);
            // Повідомляємо користувача, що запит відправлено і чекаємо консультанта
            const userConfirmationMessage = `Дякуємо! Ваш запит на "${serviceName}" відправлено консультантам.
Будь ласка, зачекайте, консультант незабаром зв'яжеться з вами в цьому чаті.`;
            await bot.sendMessage(userChatId, userConfirmationMessage, { reply_to_message_id: originalMessageId });
            // Не повертаємо до головного меню, бо користувач чекає на зв'язок
        } catch (error) {
            console.error(`Помилка відправки повідомлення в групу підтримки (ID: ${dataBot.supportId}): ${error.message}`);
            await bot.sendMessage(userChatId, 'Вибачте, сталася технічна помилка при відправці вашого запиту консультанту. Будь ласка, спробуйте пізніше або зателефонуйте нам.');
            sendMainMenu(userChatId); // Повертаємо до головного меню у випадку помилки
        }
    } else {
        await bot.sendMessage(userChatId, 'Вибачте, не вдалося відправити запит, оскільки не налаштовано чат консультанта. Будь ласка, зателефонуйте нам для запису.');
        console.error('ПОМИЛКА: SUPPORT_GROUP_ID не встановлено! Повідомлення консультанту не відправлено.');
        sendMainMenu(userChatId); // Повертаємо до головного меню
    }
};



export {handleBookingRequest}
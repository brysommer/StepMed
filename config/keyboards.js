// Keyboard layouts for the StepMed bot
import { MESSAGES } from './messages.js';

export const KEYBOARDS = {
    // Main menu keyboard
    MAIN_MENU: {
        reply_markup: {
            inline_keyboard: [
                [{ text: MESSAGES.BUTTONS.SERVICES_MENU, callback_data: 'services_menu' }],
                [{ text: MESSAGES.BUTTONS.BOOK_APPOINTMENT, callback_data: 'book_appointment' }],
                [{ text: MESSAGES.BUTTONS.CONTACTS, callback_data: 'contacts' }],
                [{ text: MESSAGES.BUTTONS.ABOUT_CLINIC, callback_data: 'about_clinic' }]
            ]
        }
    },

    // Services menu keyboard
    SERVICES_MENU: {
        reply_markup: {
            inline_keyboard: [
                [{ text: 'Консультації спеціалістів 👩‍⚕️👨‍⚕️', callback_data: 'consultations' }],
                [{ text: 'Види обстежень 🔬', callback_data: 'examinations' }],
                [{ text: 'Фізична реабілітація 💪', callback_data: 'rehabilitation' }],
                [{ text: MESSAGES.BUTTONS.BACK_TO_MAIN, callback_data: 'back_to_main' }]
            ]
        }
    },

    // Back to services keyboard
    BACK_TO_SERVICES: {
        reply_markup: {
            inline_keyboard: [
                [{ text: MESSAGES.BUTTONS.BACK_TO_SERVICES, callback_data: 'back_to_services' }]
            ]
        }
    },

    // Booking service menu keyboard
    BOOKING_SERVICE_MENU: {
        reply_markup: {
            inline_keyboard: [
                [{ text: MESSAGES.BUTTONS.BOOK_PRIMARY_CONSULTATION, callback_data: 'book_primary_consultation' }],
                [{ text: MESSAGES.BUTTONS.BOOK_ULTRASOUND, callback_data: 'book_ultrasound' }],
                [{ text: MESSAGES.BUTTONS.BOOK_ENDOSCOPY, callback_data: 'book_endoscopy' }],
                [{ text: MESSAGES.BUTTONS.BOOK_PHYSICAL_THERAPY, callback_data: 'book_physical_therapy' }],
                [{ text: '🔙 Повернутися до головного', callback_data: 'back_to_main' }]
            ]
        }
    }
};

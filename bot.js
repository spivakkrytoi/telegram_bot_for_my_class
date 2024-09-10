const TelegramBot = require("node-telegram-bot-api");
const path = require("path");  // Імпортуємо бібліотеку для роботи з шляхами

// Токен, отриманий від BotFather
const token = "7299434500:AAEyzGTSmU9E63qi_oqv95qlS3CQQGYBAEc";

// Створення бота
const bot = new TelegramBot(token, { polling: true });

// Масив фото з шансами та кількістю поінтів
const photos = [
    { path: path.join(__dirname, "fotki", "defoult.jpg"), probability: 10, points: 10, description: "дефолт", extraDescription: "Ну шо сказать, дефолт вот і всьо" }, 
    { path: path.join(__dirname, "fotki", "epic.jpg"), probability: 15, points: 20, description: "епік", extraDescription: "Мені чота страшно від того як вони дивляться" }, 
    { path: path.join(__dirname, "fotki", "redka.jpg"), probability: 20, points: 30, description: "редка", extraDescription: "пікмі" }, 
    { path: path.join(__dirname, "fotki", "legendary.jpg"), probability: 15, points: 50, description: "Легендарна", extraDescription: "ешкееееееееееереееее" },  
    { path: path.join(__dirname, "fotki", "MEGALEGENDARY.jpg"), probability: 10, points: 100, description: "МЄГАЛЄГЄНДАРНА", extraDescription: "Злодей Бо Синн в ролі бойко" },
    { path: path.join(__dirname, "fotki", "basic.jpg"), probability: 10, points: 10, description: "дефолт", extraDescription: "Ну шо сказать, дефолт вот і всьо" },
    { path: path.join(__dirname, "fotki", "legendary_2.jpg"), probability: 10, points: 50, description: "Легендарна", extraDescription: "злодей бо синн 2.0" },
    { path: path.join(__dirname, "fotki", "mific.jpg"), probability: 5, points: 70, description: "міфіческа", extraDescription: "цей бро слішком ешкере" },
    { path: path.join(__dirname, "fotki", "sverxredka.jpg"), probability: 5, points: 80, description: "свєрхредка", extraDescription: "Дядя педофил, отойди от меня..." },
    { path: path.join(__dirname, "fotki", "legendary_3.jpg"), probability: 5, points: 50, description: "легендарна", extraDescription: "Ще одна легенда!" },
    { path: path.join(__dirname, "fotki", "redka_2.jpg"), probability: 5, points: 30, description: "редка", extraDescription: "блять ну..." },
    { path: path.join(__dirname, "fotki", "megalegendary_2.jpg"), probability: 5, points: 100, description: "МЄГАЛЄГЄНДАРНА", extraDescription: "Ярік в нас наглажений.... АХАХАХХАХАХ" }
];

// Об'єкт для зберігання часу останнього використання команди для кожного користувача
const userCooldowns = {};

// Об'єкт для зберігання поінтів кожного користувача
const userPoints = {};

// Функція для вибору фото на основі шансів
function getRandomPhoto() {
    const random = Math.random() * 100;  // Випадкове число від 0 до 100
    let cumulativeProbability = 0;
  
    for (const photo of photos) {
      cumulativeProbability += photo.probability;
      if (random <= cumulativeProbability) {
        return photo;
      }
    }
    
    // У випадку, якщо жодне фото не вибрано (не має відбутись, але на всякий випадок)
    return photos[0];
}

// Функція для перевірки часу
function getTimeRemaining(lastUsed) {
    const now = Date.now();
    const halfHour = 30 * 60 * 1000;  // 30 хвилин в мілісекундах
    const remainingTime = halfHour - (now - lastUsed);
  
    if (remainingTime > 0) {
      const minutes = Math.floor(remainingTime / 60000);
      const seconds = Math.floor((remainingTime % 60000) / 1000);
      return `${minutes} хвилин і ${seconds} секунд`;
    } else {
      return null;  // Півгодини вже минуло
    }
}

// Обробка команди /start
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, "Півєт! цього бота розробив @dumb_programmer май повагу до цього бота, не спам і не пиши погані слова, тому-що я відслідковую кожне повідомлення напиши слово /rulesss і ознайомся з правилами");
});

// Пасхалка
bot.onText(/комару/i, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, `КОМАРУ УЄБААААААН`);
});

// Обробка текстових команд "камару атзавісь"
bot.onText(/камару атзавісь/i, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, `динахй`);
});

// Обробка команди /rulesss
bot.onText(/\/rulesss/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, `команди: 
        VERSION:1.1
        1. шо випаде: показує фотки/і шанси
        2. камару атзавісь: пасхалачка))))
        3. /start: вже всі поняли
        4. напишеш в чат саша хуярь, я буду додавати ще команди)))
        5. команда поінти виводь твою кількість поінтів`);
});

// Обробка команди "шо випаде"
bot.onText(/шо випаде/i, (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;

    // Перевіряємо, чи є користувач у списку з часу останнього використання команди
    const lastUsed = userCooldowns[userId];
    
    if (lastUsed) {
        const timeRemaining = getTimeRemaining(lastUsed);
        
        if (timeRemaining) {
            // Якщо півгодини не минуло, повідомляємо про залишок часу
            bot.sendMessage(chatId, `Жди ше: ${timeRemaining}.`);
            return;
        }
    }
    

    // Якщо півгодини минуло або користувач вперше використовує команду
    const selectedPhoto = getRandomPhoto();
    
    // Створення підпису з рідкістю, кількістю поінтів та індивідуальним описом
    const caption = `🎲 Рідкість цієї карточки: ${selectedPhoto.description}.\n` + 
                    `Опис: ${selectedPhoto.extraDescription}\n` +
                    `💯 Поінтів отримано: ${selectedPhoto.points}`;
    
    // Відправляємо фото
    bot.sendPhoto(chatId, selectedPhoto.path, { caption: caption })
    .catch((error) => {
        console.error('Помилка при відправці фото:', error);
    });
    
    // Додаємо поінти для цього користувача
    if (!userPoints[userId]) {
        userPoints[userId] = 0;  // Ініціалізуємо поінти, якщо немає
    }
    userPoints[userId] += selectedPhoto.points;
    
    // Виводимо баланс поінтів користувача
    bot.sendMessage(chatId, `🌟 Всього у тебе ${userPoints[userId]} поінтів.`);
    
    // Зберігаємо поточний час для цього користувача
    userCooldowns[userId] = Date.now();
});

// Заміни на свій юзернейм
const myUsername = "dumb_programmer";

// Об'єкт для зберігання поінтів користувачів
const points = {};

// Обробка команди "поінти"
bot.onText(/поінти/, (msg) => {
  const chatId = msg.chat.id;
  const username = msg.from.username;

  // Логування для діагностики
  console.log(`Юзернейм: ${username}`);

  // Перевірка, чи є в користувача юзернейм
  if (!username) {
    bot.sendMessage(chatId, "У тебе немає юзернейму. Будь ласка, встанови його в налаштуваннях.");
    return;
  }

  // Якщо це твій юзернейм, встановлюємо спеціальну кількість поінтів
  if (username === myUsername) {
    points[username] = 1000;  // Наприклад, 10000 поінтів для тебе
  }

  const userPoints = points[username] || 0;
  bot.sendMessage(chatId, `Твої поінти: ${userPoints}`);
});


// Обробка команди /тест
bot.onText(/тест/i, (msg) => {
    const chatId = msg.chat.id;
    
    // Вибір фото на основі шансів
    const selectedPhoto = getRandomPhoto();
    
    // Створення підпису з рідкістю, кількістю поінтів та індивідуальним описом
    const caption = `Рідкість цих амьоб: ${selectedPhoto.description}.\n` + 
                    `Опис: ${selectedPhoto.extraDescription}\n` +
                    `Поінтів отримано: ${selectedPhoto.points}`;  // Індивідуальний опис
    
    bot.sendPhoto(chatId, selectedPhoto.path, {
      caption: caption,
    }).catch((error) => {
      console.error('Помилка при відправці фото:', error);
    });
});

// Обробка всіх повідомлень
bot.on("message", (msg) => {
  const chatId = msg.chat.id;
  console.log(`Отримано повідомлення від користувача ${chatId}: ${msg.text}`);
});

console.log("Bot started!");

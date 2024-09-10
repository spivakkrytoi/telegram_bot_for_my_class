const TelegramBot = require("node-telegram-bot-api");
const path = require("path");  // Імпортуємо бібліотеку для роботи з шляхами

// Токен, отриманий від BotFather
const token = "7299434500:AAEyzGTSmU9E63qi_oqv95qlS3CQQGYBAEc";

// Створення бота
const bot = new TelegramBot(token, { polling: true });

// Масив фото з шансами
const photos = [
    { path: path.join(__dirname, "fotki", "defoult.jpg"), probability: 10, description: "дефолт", extraDescription: "Ну шо сказать, дефолт вот і всьо" }, 
    { path: path.join(__dirname, "fotki", "epic.jpg"), probability: 15, description: "епік", extraDescription: "Мені чота страшно від того як вони дивляться" }, 
    { path: path.join(__dirname, "fotki", "redka.jpg"), probability: 20, description: "редка", extraDescription: "пікмі" }, 
    { path: path.join(__dirname, "fotki", "legendary.jpg"), probability: 15, description: "Легендарна", extraDescription: "ешкееееееееееереееее" },  
    { path: path.join(__dirname, "fotki", "MEGALEGENDARY.jpg"), probability: 10, description: "МЄГАЛЄГЄНДАРНА", extraDescription: "Злодей Бо Синн в ролі бойко" },
    { path: path.join(__dirname, "fotki", "basic.jpg"), probability: 10, description: "дефолт", extraDescription: "Ну шо сказать, дефолт вот і всьо" },
    { path: path.join(__dirname, "fotki", "legendary_2.jpg"), probability: 10, description: "Легендарна", extraDescription: "злодей бо синн 2.0" },
    { path: path.join(__dirname, "fotki", "mific.jpg"), probability: 5, description: "міфіческа", extraDescription: "цей бро слішком ешкере" },
    { path: path.join(__dirname, "fotki", "sverxredka.jpg"), probability: 5, description: "свєрхредка", extraDescription: "Дядя педофил, отойди от меня..." },
    { path: path.join(__dirname, "fotki", "legendary_3.jpg"), probability: 5, description: "легендарна", extraDescription: "Ще одна легенда!" },
    { path: path.join(__dirname, "fotki", "redka_2.jpg"), probability: 5, description: "редка", extraDescription: "блять ну..." },
    { path: path.join(__dirname, "fotki", "megalegendary_2.jpg"), probability: 5, description: "МЄГАЛЄГЄНДАРНА", extraDescription: "Ярік в нас наглажений.... АХАХАХХАХАХ" }
];

  

// Об'єкт для зберігання часу останнього використання команди для кожного користувача
const userCooldowns = {};

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
    const oneHour = 60 * 60 * 1000;  // 1 година в мілісекундах
    const remainingTime = oneHour - (now - lastUsed);
  
    if (remainingTime > 0) {
      const minutes = Math.floor(remainingTime / 60000);
      const seconds = Math.floor((remainingTime % 60000) / 1000);
      return `${minutes} хвилин і ${seconds} секунд`;
    } else {
      return "0 хвилин і 0 секунд";
    }
  }

// Обробка команди /start
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, "Півєт! цього бота розробив @dumb_programmer май повагу до цього бота, не спам і не пиши погані слова, тому-що я відслідковую кожне повідомлення напиши слово /rulesss і ознайомся з правилами");
});


bot.onText(/комару/i, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, `КОМАРУ УЄБААААААН`);
  });

// Обробка текстових команд "камару атзавісь" та варіацій
bot.onText(/камару атзавісь/i, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, `динахй`);
});

bot.onText(/\/rulesss/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, `команди: 
        1. шо випаде: показує фотки/і шанси
        2. камару атзавісь: пасхалачка))))
        3. /start: вже всі поняли
        4. напишеш в чат саша хуярь, я буду додавати ще команди)))`);
  });

// Обробка команди /photo
bot.onText(/тест/i, (msg) => {
    const chatId = msg.chat.id;
    
    // Вибір фото на основі шансів
    const selectedPhoto = getRandomPhoto();
    
    // Створення підпису з рідкістю та індивідуальним описом
    const caption = `Рідкість цих амьоб: ${selectedPhoto.description}.\n` + 
                    `${selectedPhoto.extraDescription}`;  // Індивідуальний опис
    
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

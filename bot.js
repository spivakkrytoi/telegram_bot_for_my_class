const TelegramBot = require("node-telegram-bot-api");
const path = require("path");  // Імпортуємо бібліотеку для роботи з шляхами

// Токен, отриманий від BotFather
const token = "7299434500:AAEyzGTSmU9E63qi_oqv95qlS3CQQGYBAEc";

// Створення бота
const bot = new TelegramBot(token, { polling: true });

// Масив фото з шансами
const photos = [
  { path: path.join(__dirname, "fotki", "defoult.jpg"), probability: 70, description: "дефолт" }, // 30% шанс
  { path: path.join(__dirname, "fotki", "epic.jpg"), probability: 20, description: "епік" }, // 50% шанс
  { path: path.join(__dirname, "fotki", "redka.jpg"), probability: 50, description: "редка" }, // 20% шанс
  { path: path.join(__dirname, "fotki", "legendary.jpg"), probability: 10, description: "Легендарна" },  // 20% шанс
  { path: path.join(__dirname, "fotki", "MEGALEGENDARY.jpg"), probability: 1, description: "МЄГАЛЄГЄНДАРНА НАХУЙ" }  // 20% шанс
];

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
  return photos[0]; // Якщо щось пішло не так, вибираємо перше фото за замовчуванням
}

// Обробка команди /start
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, "Привіт! Я ваш бот на JavaScript.");
});

// Обробка текстових команд "камару атзавісь" та варіацій
bot.onText(/камару атзавісь/i, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, `Ви сказали: ${msg.text}`);
});

// Обробка команди /photo
bot.onText(/\/photo/, (msg) => {
  const chatId = msg.chat.id;
  
  // Вибір фото на основі шансів
  const selectedPhoto = getRandomPhoto();
  
  bot.sendPhoto(chatId, selectedPhoto.path, {
    caption: `Рідкість цих амьоб: ${selectedPhoto.description}.`,
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

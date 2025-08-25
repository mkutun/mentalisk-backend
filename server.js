const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const port = 3001;

// Gelen isteklerin JSON formatında işlenmesini sağlar
app.use(express.json());

// Frontend uygulamamızın backend'e erişebilmesine izin verir
app.use(cors());

// Google AI API anahtarınızı .env dosyasından okur
const apiKey = process.env.GOOGLE_API_KEY;

if (!apiKey) {
  console.error("API Anahtarı bulunamadı. Lütfen .env dosyasını kontrol edin.");
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);

// Chat AI için endpoint oluşturur
app.post('/api/chat-ai', async (req, res) => {
  try {
    const userPrompt = req.body.message;

    if (!userPrompt) {
      return res.status(400).json({ error: 'Mesaj metni eksik.' });
    }

    // YENİ VE MENTALISK ADINA KONUŞAN PROMPT
    const prompt = `Merhaba, ben MENTALISK DANIŞMANLIK LTD.ŞTİ. adına konuşan bir yapay zeka finansal danışmanıyım. Lütfen kullanıcının aşağıdaki sorusuna veya talebine, Mentalisk Danışmanlık'ın vizyon ve uzmanlığına uygun şekilde, profesyonel ve bilgilendirici bir yanıt ver. Yanıtın sonunda, daha detaylı ve kişiselleştirilmiş danışmanlık için Mentalisk'e yönlendirme yap.\r\n\r\nSoru/Talep: "${userPrompt}"`;

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.json({ response: text });
  } catch (error) {
    console.error("API çağrısı hatası:", error);
    res.status(500).json({ error: "Yapay zeka asistanı şu anda müsait değil." });
  }
});

app.listen(port, () => {
  console.log(`Backend sunucusu http://localhost:${port} adresinde çalışıyor`);
});
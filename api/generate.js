export default async function handler(req, res) {
    // อนุญาตเฉพาะการส่งข้อมูลแบบ POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    // ดึง API Key จากตัวแปรลับ (Environment Variable)
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        return res.status(500).json({ error: 'API key is missing' });
    }

    try {
        // รับข้อมูลพรอมต์ที่หน้าเว็บส่งมา
        const promptData = req.body;

        // นำข้อมูลและ API Key ยิงไปหา Google Gemini
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${apiKey}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(promptData)
            }
        );

        const data = await response.json();
        
        // ส่งผลลัพธ์กลับไปให้หน้าเว็บ
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch from Gemini API' });
    }
}
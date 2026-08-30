export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        return res.status(500).json({ error: 'API key is missing' });
    }

    try {
        // รับข้อความที่หน้าเว็บแกะมาให้แล้ว
        const { textData } = req.body;

        const aiPrompt = `
        คุณคือผู้เชี่ยวชาญด้านทรัพยากรบุคคล จงอ่านข้อความที่สกัดมาจากไฟล์ Resume นี้ 
        และจัดกลุ่มข้อมูลออกมาให้อยู่ในรูปแบบ JSON โครงสร้างนี้เท่านั้น (หากไม่มีข้อมูลส่วนไหนให้ปล่อยว่างเป็น ""):
        {
            "name": "ชื่อ-นามสกุล",
            "summary": "สรุปประวัติการทำงานแบบย่อ",
            "phone": "เบอร์โทรศัพท์ (ถ้ามี)",
            "email": "อีเมล (ถ้ามี)",
            "portfolio": "ลิงก์ผลงาน หรือ LinkedIn",
            "education": [
                { "degree": "ระดับการศึกษา (เช่น ปริญญาตรี)", "major": "สาขาวิชา", "school": "ชื่อสถาบัน" }
            ],
            "hardSkills": ["ทักษะที่ 1", "ทักษะที่ 2"],
            "softSkills": ["ทักษะที่ 1", "ทักษะที่ 2"],
            "experience": ["ประสบการณ์ที่ 1", "ประสบการณ์ที่ 2"]
        }

        ข้อความจาก Resume ผู้ใช้:
        ${textData}
        `;

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{
                        parts: [{ text: aiPrompt }]
                    }],
                    // บังคับให้ AI ตอบกลับเป็น JSON เท่านั้น ลดปัญหาข้อมูลขยะ
                    generationConfig: { responseMimeType: "application/json" } 
                })
            }
        );

        const data = await response.json();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to parse resume text' });
    }
}
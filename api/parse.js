export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        return res.status(500).json({ error: 'API key is missing' });
    }

    try {
        const { base64Data, mimeType } = req.body;

        const aiPrompt = `
        คุณคือผู้เชี่ยวชาญด้านทรัพยากรบุคคล จงอ่านข้อมูลจากไฟล์ Resume นี้ และสกัดข้อมูลออกมาให้อยู่ในรูปแบบ JSON โครงสร้างด้านล่างนี้เท่านั้น (หากไม่มีข้อมูลส่วนไหนให้ปล่อยว่างเป็น ""):
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
        }`;

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{
                        parts: [
                            { text: aiPrompt },
                            { inlineData: { mimeType: mimeType, data: base64Data } }
                        ]
                    }],
                    generationConfig: { responseMimeType: "application/json" }
                })
            }
        );

        const data = await response.json();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to parse resume via Gemini API' });
    }
}
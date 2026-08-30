export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });
    
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return res.status(500).json({ error: 'API key is missing' });

    try {
        const { textData, imageBase64 } = req.body;
        
        const aiPrompt = `คุณคือผู้เชี่ยวชาญด้านทรัพยากรบุคคล จงอ่านข้อมูลจาก Resume นี้ 
        และจัดกลุ่มข้อมูลออกมาให้อยู่ในรูปแบบ JSON โครงสร้างนี้เท่านั้น (หากไม่มีข้อมูลให้ปล่อยว่างเป็น ""):
        {
            "name": "ชื่อ-นามสกุล",
            "summary": "สรุปประวัติการทำงานแบบย่อ",
            "phone": "เบอร์โทรศัพท์",
            "email": "อีเมล",
            "portfolio": "ลิงก์ผลงาน",
            "education": [{ "degree": "ระดับการศึกษา", "major": "สาขาวิชา", "school": "ชื่อสถาบัน" }],
            "hardSkills": ["ทักษะที่ 1"],
            "softSkills": ["ทักษะที่ 1"],
            "experience": ["ประสบการณ์ที่ 1"]
        }`;

        let requestBody;
        
        // เลือกว่าจะส่งรูปภาพ หรือส่งข้อความให้ AI
        if (imageBase64) {
            requestBody = {
                contents: [{
                    parts: [
                        { text: aiPrompt },
                        { inlineData: { mimeType: "image/jpeg", data: imageBase64 } }
                    ]
                }],
                generationConfig: { responseMimeType: "application/json" }
            };
        } else {
            requestBody = {
                contents: [{
                    parts: [{ text: aiPrompt + "\n\nข้อความจาก Resume:\n" + textData }]
                }],
                generationConfig: { responseMimeType: "application/json" }
            };
        }

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${apiKey}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestBody)
            }
        );

        const data = await response.json();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to parse data' });
    }
}
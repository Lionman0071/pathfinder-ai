const degrees = ["มัธยมศึกษาปีที่ 3 (ม.3)", "มัธยมศึกษาปีที่ 6 (ม.6)", "ประกาศนียบัตรวิชาชีพ (ปวช.)", "ประกาศนียบัตรวิชาชีพชั้นสูง (ปวส.)", "ปริญญาตรี", "ปริญญาโท", "ปริญญาเอก"];
const institutions = [
    "จุฬาลงกรณ์มหาวิทยาลัย", "มหาวิทยาลัยธรรมศาสตร์", "มหาวิทยาลัยมหิดล", "มหาวิทยาลัยเกษตรศาสตร์", "มหาวิทยาลัยเชียงใหม่", "มหาวิทยาลัยขอนแก่น", "มหาวิทยาลัยสงขลานครินทร์", "มหาวิทยาลัยศิลปากร", "มหาวิทยาลัยศรีนครินทรวิโรฒ", "มหาวิทยาลัยเทคโนโลยีพระจอมเกล้าธนบุรี", "มหาวิทยาลัยเทคโนโลยีพระจอมเกล้าพระนครเหนือ", "สถาบันเทคโนโลยีพระจอมเกล้าเจ้าคุณทหารลาดกระบัง", "มหาวิทยาลัยบูรพา", "มหาวิทยาลัยรามคำแหง", "มหาวิทยาลัยแม่ฟ้าหลวง", "มหาวิทยาลัยราชภัฏสวนสุนันทา", "มหาวิทยาลัยกรุงเทพ", "มหาวิทยาลัยรังสิต", "มหาวิทยาลัยหอการค้าไทย",
    "วิทยาลัยเทคนิคเชียงใหม่", "วิทยาลัยเทคนิคดอนเมือง", "วิทยาลัยเทคนิคมีนบุรี", "วิทยาลัยอาชีวศึกษาเสาวภา", "วิทยาลัยอาชีวศึกษาธนบุรี", "วิทยาลัยพณิชยการเชตุพน", "วิทยาลัยพณิชยการบางนา",
    "โรงเรียนเตรียมอุดมศึกษา", "โรงเรียนสวนกุหลาบวิทยาลัย", "โรงเรียนสามเสนวิทยาลัย", "โรงเรียนสตรีวิทยา", "โรงเรียนบดินทรเดชา (สิงห์ สิงหเสนี)", "โรงเรียนเทพศิรินทร์", "โรงเรียนมหิดลวิทยานุสรณ์"
];

// ฟังก์ชันแจ้งเตือน Custom Modal แบบ Promise
function showCustomConfirm(message, isAlert = false, title = "แจ้งเตือน", icon = "⚠️") {
    return new Promise((resolve) => {
        const modal = document.getElementById('custom-alert-modal');
        const msgEl = document.getElementById('custom-alert-message');
        const titleEl = document.getElementById('custom-alert-title');
        const iconEl = document.getElementById('custom-alert-icon');
        const cancelBtn = document.getElementById('custom-alert-cancel');
        const confirmBtn = document.getElementById('custom-alert-confirm');

        msgEl.innerText = message;
        titleEl.innerText = title;
        iconEl.innerText = icon;
        modal.classList.remove('hidden');

        cancelBtn.style.display = isAlert ? 'none' : 'block';
        confirmBtn.style.background = isAlert ? 'var(--primary-color)' : '#EF4444';
        confirmBtn.innerText = 'ตกลง';

        const handleConfirm = () => { cleanup(); resolve(true); };
        const handleCancel = () => { cleanup(); resolve(false); };

        const cleanup = () => {
            modal.classList.add('hidden');
            confirmBtn.removeEventListener('click', handleConfirm);
            cancelBtn.removeEventListener('click', handleCancel);
        };

        confirmBtn.addEventListener('click', handleConfirm);
        cancelBtn.addEventListener('click', handleCancel);
    });
}

function autocomplete(inp, arr) {
    let currentFocus;
    inp.addEventListener("input", function(e) {
        let a, b, i, val = this.value;
        closeAllLists();
        if (!val) { return false; }
        currentFocus = -1;
        
        a = document.createElement("DIV");
        a.setAttribute("id", this.id + "autocomplete-list");
        a.setAttribute("class", "autocomplete-items");
        a.addEventListener("mousedown", function(e) { e.preventDefault(); });
        this.parentNode.appendChild(a);
        
        let count = 0;
        for (i = 0; i < arr.length; i++) {
            if (arr[i].toUpperCase().includes(val.toUpperCase())) {
                if(count > 15) continue; 
                b = document.createElement("DIV");
                const startIndex = arr[i].toUpperCase().indexOf(val.toUpperCase());
                b.innerHTML = arr[i].substring(0, startIndex);
                b.innerHTML += "<strong>" + arr[i].substring(startIndex, startIndex + val.length) + "</strong>";
                b.innerHTML += arr[i].substring(startIndex + val.length);
                b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
                b.addEventListener("click", function(e) {
                    inp.value = this.getElementsByTagName("input")[0].value;
                    closeAllLists();
                });
                a.appendChild(b);
                count++;
            }
        }
    });
    function closeAllLists(elmnt) {
        const x = document.getElementsByClassName("autocomplete-items");
        for (let i = 0; i < x.length; i++) {
            if (elmnt != x[i] && elmnt != inp) { x[i].parentNode.removeChild(x[i]); }
        }
    }
    document.addEventListener("click", function (e) { closeAllLists(e.target); });
}

document.querySelectorAll('.edu-degree').forEach(el => autocomplete(el, degrees));
document.querySelectorAll('.edu-school').forEach(el => autocomplete(el, institutions));

let profileImageBase64 = "";

function getSavedProfiles() {
    const saved = localStorage.getItem('pathfinderProfilesList');
    return saved ? JSON.parse(saved) : [];
}

function saveProfilesList(profiles) {
    localStorage.setItem('pathfinderProfilesList', JSON.stringify(profiles));
}

function getCurrentFormData() {
    return {
        name: document.getElementById("user-name").value,
        summary: document.getElementById("user-summary").value,
        nationality: document.getElementById("user-nationality").value,
        ethnicity: document.getElementById("user-ethnicity").value,
        phone: document.getElementById("user-phone").value,
        email: document.getElementById("user-email").value,
        portfolio: document.getElementById("user-portfolio").value,
        address: document.getElementById("user-address").value,
        hobby: document.getElementById("user-hobby").value,
        income: document.getElementById("user-income").value,
        education: Array.from(document.querySelectorAll('#list-education .edu-item')).map(item => ({
            degree: item.querySelector('.edu-degree').value,
            major: item.querySelector('.edu-major').value,
            school: item.querySelector('.edu-school').value
        })),
        interests: getListValues("list-interests"),
        hardSkills: getListValues("list-hard-skills"),
        softSkills: getListValues("list-soft-skills"),
        experience: getListValues("list-experience"),
        photo: profileImageBase64
    };
}

function renderProfileList() {
    const listContainer = document.getElementById('saved-profiles-list');
    const profiles = getSavedProfiles();
    
    if (profiles.length === 0) {
        listContainer.innerHTML = '<p style="color: #6B7280; font-size: 14px; text-align: center; padding: 10px;">ยังไม่มีโปรไฟล์ที่บันทึกไว้</p>';
        return;
    }

    listContainer.innerHTML = '';
    profiles.forEach((prof, index) => {
        const div = document.createElement('div');
        div.className = 'profile-item';
        div.innerHTML = `
            <div class="profile-name">${prof.saveName}</div>
            <div class="profile-actions">
                <button class="btn-load-action" onclick="loadProfile(${index})">โหลด</button>
                <button class="btn-del-action" onclick="deleteProfile(${index})">&times;</button>
            </div>
        `;
        listContainer.appendChild(div);
    });
}

window.loadProfile = function(index) {
    const profiles = getSavedProfiles();
    const data = profiles[index].data;
    
    const fields = ['name', 'summary', 'nationality', 'ethnicity', 'phone', 'email', 'portfolio', 'address', 'hobby', 'income'];
    fields.forEach(f => {
        if (data[f] && document.getElementById(`user-${f}`)) {
            document.getElementById(`user-${f}`).value = data[f];
        } else if (document.getElementById(`user-${f}`)) {
            document.getElementById(`user-${f}`).value = "";
        }
    });

    if (data.name || data.phone || data.email) {
        document.getElementById("personal-info-section").classList.remove("hidden");
        document.getElementById("toggle-icon").innerText = "-";
    }

    const populateList = (listId, arr, type) => {
        const list = document.getElementById(listId);
        list.innerHTML = ''; 
        if (!arr || arr.length === 0) {
            if(type === 'edu') document.querySelector(`button[data-target="${listId}"]`).click();
            return;
        }
        arr.forEach(val => {
            const newItem = document.createElement('div');
            newItem.className = 'dynamic-item';
            
            if (type === 'edu') {
                newItem.classList.add('edu-item');
                newItem.innerHTML = `
                    <div class="autocomplete-wrapper edu-col-1"><input type="text" class="edu-degree" value="${val.degree || ''}" placeholder="ระดับการศึกษา" required autocomplete="off"></div>
                    <input type="text" class="edu-major edu-col-2" value="${val.major || ''}" placeholder="สาขาวิชา/แผนการเรียน" required>
                    <div class="autocomplete-wrapper edu-col-3"><input type="text" class="edu-school" value="${val.school || ''}" placeholder="ชื่อสถาบัน" required autocomplete="off"></div>
                    <button type="button" class="remove-btn" onclick="removeItem(this)">&times;</button>
                `;
                list.appendChild(newItem);
                autocomplete(newItem.querySelector('.edu-degree'), degrees);
                autocomplete(newItem.querySelector('.edu-school'), institutions);
            } else {
                newItem.innerHTML = `<input type="text" value="${val}" required><button type="button" class="remove-btn" onclick="removeItem(this)">&times;</button>`;
                list.appendChild(newItem);
            }
        });
    };

    populateList('list-education', data.education, 'edu');
    populateList('list-interests', data.interests);
    populateList('list-hard-skills', data.hardSkills);
    populateList('list-soft-skills', data.softSkills);
    populateList('list-experience', data.experience);

    if(data.photo) {
        profileImageBase64 = data.photo;
        const label = document.getElementById('image-preview-label');
        label.style.backgroundImage = `url(${profileImageBase64})`;
        label.innerHTML = '';
        label.style.borderStyle = 'solid';
    }

    document.getElementById("profile-modal").classList.add("hidden");
};

window.deleteProfile = async function(index) {
    const isConfirm = await showCustomConfirm("ลบโปรไฟล์นี้ทิ้งใช่หรือไม่?");
    if(isConfirm) {
        const profiles = getSavedProfiles();
        profiles.splice(index, 1);
        saveProfilesList(profiles);
        renderProfileList();
    }
};

document.getElementById('manage-profile-btn').addEventListener('click', () => {
    renderProfileList();
    document.getElementById('profile-modal').classList.remove('hidden');
});

document.getElementById('close-profile-modal').addEventListener('click', () => {
    document.getElementById('profile-modal').classList.add('hidden');
});

document.getElementById('btn-save-new').addEventListener('click', async () => {
    const saveName = document.getElementById('new-profile-name').value.trim();
    if (!saveName) {
        await showCustomConfirm("กรุณาตั้งชื่อให้โปรไฟล์ก่อนบันทึก", true);
        return;
    }
    
    const currentData = getCurrentFormData();
    const profiles = getSavedProfiles();
    
    profiles.push({ saveName: saveName, data: currentData });
    saveProfilesList(profiles);
    
    document.getElementById('new-profile-name').value = '';
    renderProfileList();
});

document.getElementById('clear-data-btn').addEventListener('click', async () => {
    const isConfirm = await showCustomConfirm('ต้องการล้างข้อมูลที่กรอกไว้ทั้งหมดใช่หรือไม่?\n(ไม่มีผลกับโปรไฟล์ที่เซฟไว้แล้ว)');
    if(isConfirm) {
        location.reload();
    }
});

let cropper = null;

document.getElementById('user-image').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if(file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            document.getElementById('crop-image').src = event.target.result;
            document.getElementById('crop-modal').classList.remove('hidden');
            
            if(cropper) { cropper.destroy(); }
            cropper = new Cropper(document.getElementById('crop-image'), {
                aspectRatio: 1.5 / 2,
                viewMode: 1
            });
        };
        reader.readAsDataURL(file);
        e.target.value = ''; 
    }
});

document.getElementById('cancel-crop-btn').addEventListener('click', () => {
    document.getElementById('crop-modal').classList.add('hidden');
});

document.getElementById('save-crop-btn').addEventListener('click', () => {
    if(cropper) {
        const canvas = cropper.getCroppedCanvas({ width: 300, height: 400 });
        profileImageBase64 = canvas.toDataURL('image/jpeg');
        
        const label = document.getElementById('image-preview-label');
        label.style.backgroundImage = `url(${profileImageBase64})`;
        label.innerHTML = '';
        label.style.borderStyle = 'solid';
        
        document.getElementById('crop-modal').classList.add('hidden');
    }
});

const phoneInput = document.getElementById('user-phone');
if (phoneInput) {
    phoneInput.addEventListener('input', function (e) {
        let x = e.target.value.replace(/\D/g, '').match(/(\d{0,3})(\d{0,3})(\d{0,4})/);
        e.target.value = !x[2] ? x[1] : x[1] + '-' + x[2] + (x[3] ? '-' + x[3] : '');
    });
}

document.getElementById("toggle-personal-info").addEventListener("click", () => {
    document.getElementById("personal-info-section").classList.toggle("hidden");
    document.getElementById("toggle-icon").innerText = document.getElementById("personal-info-section").classList.contains("hidden") ? "+" : "-";
});

window.removeItem = async function(btn) {
    const item = btn.parentElement;
    const list = item.parentElement;
    if (list.querySelectorAll('.dynamic-item').length > 1) {
        item.remove();
    } else {
        await showCustomConfirm("ข้อมูลส่วนนี้เป็นข้อมูลบังคับ กรุณากรอกไว้อย่างน้อย 1 รายการ", true);
    }
};

document.querySelectorAll('.add-btn').forEach(button => {
    button.addEventListener('click', function() {
        const targetId = this.getAttribute('data-target');
        const list = document.getElementById(targetId);
        const newItem = document.createElement('div');
        newItem.className = 'dynamic-item';
        
        if (this.getAttribute('data-type') === 'edu') {
            newItem.classList.add('edu-item');
            newItem.innerHTML = `
                <div class="autocomplete-wrapper edu-col-1"><input type="text" class="edu-degree" placeholder="ระดับการศึกษา" required autocomplete="off"></div>
                <input type="text" class="edu-major edu-col-2" placeholder="สาขาวิชา/แผนการเรียน" required>
                <div class="autocomplete-wrapper edu-col-3"><input type="text" class="edu-school" placeholder="ชื่อสถาบัน" required autocomplete="off"></div>
                <button type="button" class="remove-btn" onclick="removeItem(this)">&times;</button>
            `;
            list.appendChild(newItem);
            autocomplete(newItem.querySelector('.edu-degree'), degrees);
            autocomplete(newItem.querySelector('.edu-school'), institutions);
        } else {
            const placeholder = this.getAttribute('data-placeholder');
            newItem.innerHTML = `<input type="text" placeholder="${placeholder}" required><button type="button" class="remove-btn" onclick="removeItem(this)">&times;</button>`;
            list.appendChild(newItem);
        }
    });
});

function getListValues(listId) {
    return Array.from(document.querySelectorAll(`#${listId} input`)).map(i => i.value.trim()).filter(v => v !== "");
}

function getEduValues() {
    return Array.from(document.querySelectorAll('#list-education .edu-item')).map(item => {
        const degree = item.querySelector('.edu-degree').value.trim();
        const major = item.querySelector('.edu-major').value.trim();
        const school = item.querySelector('.edu-school').value.trim();
        if (degree && major && school) return `${degree} สาขา ${major} (สถานศึกษา: ${school})`;
        return "";
    }).filter(v => v !== "");
}

const tabs = {
    careerBtn: document.getElementById("tab-career"),
    resumeBtn: document.getElementById("tab-resume"),
    contentCareer: document.getElementById("content-career"),
    contentResume: document.getElementById("content-resume")
};

tabs.careerBtn.addEventListener("click", () => {
    tabs.careerBtn.classList.add("active"); 
    tabs.resumeBtn.classList.remove("active");
    tabs.contentCareer.classList.add("active"); 
    tabs.contentCareer.classList.remove("hidden");
    tabs.contentResume.classList.add("hidden"); 
    tabs.contentResume.classList.remove("active");
});

tabs.resumeBtn.addEventListener("click", () => {
    tabs.resumeBtn.classList.add("active"); 
    tabs.careerBtn.classList.remove("active");
    tabs.contentResume.classList.add("active"); 
    tabs.contentResume.classList.remove("hidden");
    tabs.contentCareer.classList.add("hidden"); 
    tabs.contentCareer.classList.remove("active");
});

document.getElementById("close-btn").addEventListener("click", () => document.getElementById("result-modal").classList.add("hidden"));

document.getElementById("pathfinderForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    const eduValues = getEduValues();
    const intValues = getListValues("list-interests");
    const hardSkillValues = getListValues("list-hard-skills");
    const softSkillValues = getListValues("list-soft-skills");
    const expValues = getListValues("list-experience");
    
    if(eduValues.length === 0 || intValues.length === 0 || hardSkillValues.length === 0 || softSkillValues.length === 0 || expValues.length === 0) {
        await showCustomConfirm("กรุณากรอกข้อมูลในหัวข้อที่ 1-5 อย่างน้อยหัวข้อละ 1 รายการ", true); 
        return;
    }

    const name = document.getElementById("user-name").value.trim() || "ชื่อ นามสกุล";
    const summary = document.getElementById("user-summary").value.trim();
    const nationality = document.getElementById("user-nationality").value.trim();
    const ethnicity = document.getElementById("user-ethnicity").value.trim();
    const phone = document.getElementById("user-phone").value.trim();
    const email = document.getElementById("user-email").value.trim();
    const portfolio = document.getElementById("user-portfolio").value.trim();
    const address = document.getElementById("user-address").value.trim();
    const hobby = document.getElementById("user-hobby").value.trim();
    const income = document.getElementById("user-income").value.trim();

    document.getElementById("loading-overlay").classList.remove("hidden");
    
    let messageIndex = 0;
    const loadingMessages = ["กำลังรวบรวมประวัติ...", "AI กำลังสร้าง Resume แบบมืออาชีพ...", "กำลังวิเคราะห์อาชีพจาก Resume...", "เตรียมข้อมูลนำเสนอ..."];
    document.getElementById("loading-text").innerText = loadingMessages[0];
    const textInterval = setInterval(() => {
        messageIndex++;
        if (messageIndex < loadingMessages.length) document.getElementById("loading-text").innerText = loadingMessages[messageIndex];
    }, 2000);

    let personalDetails = "";
    if (summary || nationality || ethnicity || phone || email || portfolio || address || hobby) {
        personalDetails = `- ข้อมูลส่วนตัวเพิ่มเติม:\n`;
        if (summary) personalDetails += `  * สรุปประวัติย่อ: ${summary}\n`;
        if (nationality || ethnicity) personalDetails += `  * สัญชาติ: ${nationality || '-'} / เชื้อชาติ: ${ethnicity || '-'}\n`;
        if (hobby) personalDetails += `  * งานอดิเรก: ${hobby}\n`;
    }

    const aiPrompt = `
    คุณคือ PathFinder AI วิเคราะห์ข้อมูลผู้ใช้:
    - การศึกษาและสถาบัน: ${eduValues.join(" | ")}
    - ความสนใจ: ${intValues.join(", ")}
    - ทักษะ (Hard Skills): ${hardSkillValues.join(", ")}
    - ทักษะ (Soft Skills): ${softSkillValues.join(", ")}
    - ประสบการณ์: ${expValues.join(" | ")}
    ${personalDetails}
    - เป้าหมายรายได้: ${income} บาท/เดือน

    จงตอบกลับเป็นรูปแบบ JSON โครงสร้างนี้เท่านั้น:
    {
        "careers": [
            { "title": "ชื่ออาชีพ 1", "reason": "...", "study": "..." },
            { "title": "ชื่ออาชีพ 2", "reason": "...", "study": "..." },
            { "title": "ชื่ออาชีพ 3", "reason": "...", "study": "..." }
        ],
        "summary": "บทสรุปคำแนะนำ",
        "resume": {
            "profileHTML": "เขียนสรุปประวัติย่อแบบมืออาชีพ 1-2 ย่อหน้า โดยใช้แท็ก <p>",
            "experienceHTML": "เรียบเรียงประสบการณ์ให้สวยงาม ใช้ <ul> และ <li>",
            "educationHTML": "เรียบเรียงการศึกษาให้สวยงาม ใช้ <ul> และ <li>",
            "skillsHTML": "จัดกลุ่ม Hard Skills, Soft Skills และ งานอดิเรก ใช้ <ul> และ <li>"
        }
    }`;

    try {
        const response = await fetch('/api/generate', {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                contents: [{ parts: [{ text: aiPrompt }] }],
                generationConfig: { responseMimeType: "application/json" }
            })
        });
    
        const data = await response.json();
        if (!response.ok) throw new Error(data.error?.message || "เกิดข้อผิดพลาด");

        const jsonText = data.candidates?.[0]?.content?.parts?.[0]?.text;
        const resultData = JSON.parse(jsonText);

        document.getElementById("cards-container").innerHTML = "";
        resultData.careers.forEach((career, index) => {
            document.getElementById("cards-container").innerHTML += `
                <div class="career-card deal-card-${index + 1}">
                    <h3>${career.title}</h3>
                    <p><strong>เหตุผล:</strong> ${career.reason}</p>
                    <p><strong>ข้อแนะนำเพิ่มเติม:</strong> ${career.study}</p>
                </div>
            `;
        });
        document.getElementById("summary-container").innerHTML = `<strong>บทสรุปผู้บริหาร:</strong> ${resultData.summary}`;

        const imgHtml = profileImageBase64 ? `<img src="${profileImageBase64}" class="resume-photo">` : `<div class="resume-photo" style="background:#E5E7EB; display:flex; align-items:center; justify-content:center; color:#9CA3AF; font-size:12px; text-align:center;">รูปถ่าย<br>1.5 นิ้ว</div>`;
        
        let contactHtml = "";
        if(phone) contactHtml += `📞 ${phone} &nbsp;&nbsp; `;
        if(email) contactHtml += `✉️ ${email} &nbsp;&nbsp; `;
        if(nationality || ethnicity) contactHtml += `<br>👤 สัญชาติ: ${nationality || '-'} / เชื้อชาติ: ${ethnicity || '-'} &nbsp;&nbsp; `;
        if(address) contactHtml += `<br>📍 ${address} &nbsp;&nbsp; `;
        if(portfolio) contactHtml += `<br>🔗 ${portfolio}`;

        const resumeFullHtml = `
            <div style="font-size: 22px; font-weight: bold; letter-spacing: 3px; color: var(--primary-color); margin-bottom: 20px; text-transform: uppercase;">RESUME</div>
            <div class="resume-header">
                ${imgHtml}
                <div class="resume-contact">
                    <h1>${name}</h1>
                    <p>${contactHtml}</p>
                </div>
            </div>
            <div class="resume-body">
                <h2>Profile Summary</h2>
                ${resultData.resume.profileHTML}
                
                <h2>Experience</h2>
                ${resultData.resume.experienceHTML}
                
                <h2>Education</h2>
                ${resultData.resume.educationHTML}
                
                <h2>Skills, Interests & Hobbies</h2>
                ${resultData.resume.skillsHTML}
            </div>
        `;
        
        document.getElementById("resume-document").innerHTML = resumeFullHtml;

        document.getElementById("loading-overlay").classList.add("hidden");
        document.getElementById("result-modal").classList.remove("hidden");
        tabs.careerBtn.click(); 

    } catch (error) {
        await showCustomConfirm("เกิดข้อผิดพลาด: " + error.message, true, "แจ้งเตือนข้อผิดพลาด", "❌");
        document.getElementById("loading-overlay").classList.add("hidden");
    } finally {
        clearInterval(textInterval);
    }
});

document.getElementById("download-pdf-btn").addEventListener("click", () => {
    window.print();
});

pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';

document.getElementById('btn-smart-import').addEventListener('click', async () => {
    const fileInput = document.getElementById('import-resume-file');
    const file = fileInput.files[0];
    
    if (!file) {
        await showCustomConfirm("กรุณาเลือกไฟล์ Resume ก่อน", true);
        return;
    }

    if (file.type !== "application/pdf") {
        await showCustomConfirm("รองรับเฉพาะไฟล์ PDF เท่านั้น", true);
        return;
    }

    document.getElementById("loading-overlay").classList.remove("hidden");
    
    let importMsgIndex = 0;
    const importLoadingMsgs = ["กำลังอ่านไฟล์ PDF...", "กำลังสกัดข้อความ...", "AI กำลังจัดเรียงข้อมูล...", "เตรียมนำข้อมูลลงฟอร์ม..."];
    document.getElementById("loading-text").innerText = importLoadingMsgs[0];
    const importInterval = setInterval(() => {
        importMsgIndex++;
        if (importMsgIndex < importLoadingMsgs.length) {
            document.getElementById("loading-text").innerText = importLoadingMsgs[importMsgIndex];
        }
    }, 2000);

    try {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        let extractedText = "";

        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            const pageText = textContent.items.map(item => item.str).join(" ");
            extractedText += pageText + "\n";
        }

        let requestPayload = {};

        if (extractedText.trim().length < 50) {
            document.getElementById("loading-text").innerText = "ตรวจพบ PDF รูปภาพ กำลังให้ AI สแกนภาพ...";
            
            const page = await pdf.getPage(1);
            const viewport = page.getViewport({ scale: 1.5 });
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");
            
            canvas.width = viewport.width;
            canvas.height = viewport.height;
            await page.render({ canvasContext: ctx, viewport: viewport }).promise;
            
            const base64Img = canvas.toDataURL("image/jpeg", 0.8).split(",")[1];
            requestPayload = { imageBase64: base64Img };
        } else {
            requestPayload = { textData: extractedText };
        }

        const response = await fetch('/api/parse', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestPayload)
        });

        if (!response.ok) throw new Error("ไม่สามารถเชื่อมต่อระบบวิเคราะห์ได้");
        
        const data = await response.json();
        const jsonText = data.candidates?.[0]?.content?.parts?.[0]?.text;
        
        if (!jsonText) throw new Error("วิเคราะห์ข้อมูลไม่สำเร็จ");
        
        const parsedData = JSON.parse(jsonText);

        if(parsedData.name) document.getElementById('user-name').value = parsedData.name;
        if(parsedData.summary) document.getElementById('user-summary').value = parsedData.summary;
        if(parsedData.phone) document.getElementById('user-phone').value = parsedData.phone;
        if(parsedData.email) document.getElementById('user-email').value = parsedData.email;
        if(parsedData.portfolio) document.getElementById('user-portfolio').value = parsedData.portfolio;

        if (document.getElementById("personal-info-section").classList.contains("hidden")) {
            document.getElementById("toggle-personal-info").click();
        }

        const fillDynamicList = (listId, items, type) => {
            if(!items || items.length === 0) return;
            const list = document.getElementById(listId);
            list.innerHTML = ''; 
            items.forEach(val => {
                const newItem = document.createElement('div');
                newItem.className = 'dynamic-item';
                if (type === 'edu') {
                    newItem.classList.add('edu-item');
                    newItem.innerHTML = `
                        <div class="autocomplete-wrapper edu-col-1"><input type="text" class="edu-degree" value="${val.degree || ''}" placeholder="ระดับการศึกษา" required autocomplete="off"></div>
                        <input type="text" class="edu-major edu-col-2" value="${val.major || ''}" placeholder="สาขาวิชา/แผนการเรียน" required>
                        <div class="autocomplete-wrapper edu-col-3"><input type="text" class="edu-school" value="${val.school || ''}" placeholder="ชื่อสถาบัน" required autocomplete="off"></div>
                        <button type="button" class="remove-btn" onclick="removeItem(this)">&times;</button>
                    `;
                    list.appendChild(newItem);
                    autocomplete(newItem.querySelector('.edu-degree'), degrees);
                    autocomplete(newItem.querySelector('.edu-school'), institutions);
                } else {
                    newItem.innerHTML = `<input type="text" value="${val}" required><button type="button" class="remove-btn" onclick="removeItem(this)">&times;</button>`;
                    list.appendChild(newItem);
                }
            });
        };

        fillDynamicList('list-education', parsedData.education, 'edu');
        fillDynamicList('list-hard-skills', parsedData.hardSkills);
        fillDynamicList('list-soft-skills', parsedData.softSkills);
        fillDynamicList('list-experience', parsedData.experience);

        await showCustomConfirm("ดึงข้อมูลสำเร็จ! ลองตรวจสอบและแก้ไขให้สมบูรณ์อีกครั้งนะครับ", true, "สำเร็จ", "✅");
        fileInput.value = '';

    } catch (error) {
        await showCustomConfirm("เกิดข้อผิดพลาด: " + error.message, true, "แจ้งเตือนข้อผิดพลาด", "❌");
    } finally {
        clearInterval(importInterval);
        document.getElementById("loading-overlay").classList.add("hidden");
    }
});
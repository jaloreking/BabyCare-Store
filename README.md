# Jay&Joy वेबसाइट – पूरी गाइड (हिंदी)

## 1. GitHub पर upload (Chrome, Android)
1. ZIP को Files app में Extract करें।
2. github.com/jaloreking/BabyCare-Store खोलें, login करें।
3. पुरानी LITTLE GENT वाली सब फ़ाइलें खोलकर Delete करें।
4. Add file → Upload files → सारी नई फ़ाइलें और `images` फ़ोल्डर चुनें → Commit changes।
5. Settings → Pages → Branch `main`, folder `/ (root)` → Save।
6. 1–2 मिनट बाद साइट: https://jaloreking.github.io/BabyCare-Store/

## 2. नई शर्ट और फोटो जोड़ना
1. फोटो `images` फ़ोल्डर में upload करें (छोटी फोटो, 800x800, 200 KB से कम)।
2. `products.json` खोलें → ✏️ दबाएँ → एक शर्ट का पूरा `{ ... }` हिस्सा copy करके नीचे paste करें।
3. `id` और `sku` नया और अलग रखें। नाम, `price` (बिक्री दाम), `mrp`, `sizes`, `colors`, `desc`, `details` बदलें।
4. `images` में फोटो का नाम लिखें, जैसे `"images/shirt5-1.jpg"`। कई फोटो हों तो comma से अलग करें।
5. `stock` में गिनती लिखें। 0 लिखने पर "Out of stock" दिखेगा। `isNew` और `popular` में true या false लिखें।
6. हर `}` के बाद comma लगाएँ, आखिरी के बाद नहीं। Commit changes करें।
7. दाम बदलना हो तो सिर्फ़ `price` या `mrp` बदलें।

## 3. ऑर्डर कैसे संभालें
- ग्राहक का ऑर्डर आपके WhatsApp पर आता है। उसमें Order Ref, पता, शर्ट और कुल रकम होती है।
- ऑर्डर तभी पक्का मानें जब आप ग्राहक को WhatsApp पर "Confirmed" लिख दें।
- GitHub Pages पर ऑर्डर सेव करने का कोई सुरक्षित डेटाबेस या private admin panel नहीं हो सकता।
- इसलिए ऑर्डर की list के लिए मुफ़्त Google Sheet का तरीका नीचे है।

## 4. Google Sheet में ऑर्डर अपने आप जोड़ना (मुफ़्त, ज़रूरी नहीं)
1. sheets.google.com पर नई खाली Sheet बनाएँ (अपने Google account से)।
2. Extensions → Apps Script → पुराना कोड हटाकर यह paste करें:
```
function doPost(e){
 var d=JSON.parse(e.postData.contents);
 var s=SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
 if(s.getLastRow()==0)s.appendRow(['Time','Order Ref','Name','Mobile','WhatsApp','Address','Items','Total','Status']);
 s.appendRow([new Date(),d.ref,d.name,d.mobile,d.wa,d.address,d.items,d.total,'Pending']);
 return ContentService.createTextOutput('ok');
}
```
3. Deploy → New deployment → Type: Web app → Execute as: Me → Who has access: Anyone → Deploy → permission दें।
4. मिला हुआ Web app URL copy करें।
5. GitHub में `script.js` खोलें, ✏️ दबाएँ, `const SHEET_URL='';` में URL डालें: `const SHEET_URL='आपका-URL';` → Commit।
6. Sheet में Status कॉलम (I) चुनें → Insert → Dropdown → Pending, Confirmed, Shipped, Delivered।
- Sheet सिर्फ़ आपके account से खुलेगी, इसलिए private है।
- Web app का URL किसी को न दें।

## 5. हिंदी / English
ऊपर के बटन से भाषा बदलती है। About, Contact और सभी Policy पेज पूरे हिंदी में हैं। शर्ट का नाम और विवरण वही दिखेंगे जो आपने `products.json` में लिखे हैं।

## 6. Policy की जाँच
Shipping (3–7 दिन) और Return (7 दिन) की बातें सामान्य मानकर लिखी हैं। अपने नियम के हिसाब से `shipping.html` और `returns.html` में बदल लें।

## 7. Testing checklist
- [ ] Home पर शर्ट दिख रही हैं।
- [ ] सारे menu और footer लिंक खुलते हैं।
- [ ] Filter (दाम, साइज़, रंग, नई, लोकप्रिय) चलते हैं।
- [ ] Product page पर फोटो, साइज़, रंग, "Ask about this product" चलते हैं।
- [ ] Cart में जोड़ना, +, −, Remove चलता है। Refresh करने पर cart वैसा ही रहता है।
- [ ] Checkout में खाली फ़ॉर्म पर error आता है।
- [ ] सही फ़ॉर्म भरने पर WhatsApp खुलता है और message में "CASH ON DELIVERY" लिखा है।
- [ ] सिर्फ़ COD दिखता है।
- [ ] हिंदी बटन दबाने पर भाषा बदलती है।
- [ ] फ़ोन और कंप्यूटर दोनों पर देखें।
- [ ] Google Sheet चालू की है तो test ऑर्डर Sheet में दिखता है।

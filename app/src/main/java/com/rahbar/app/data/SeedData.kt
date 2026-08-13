package com.rahbar.app.data

import com.rahbar.app.model.AlertItem
import com.rahbar.app.model.ChatMessage
import com.rahbar.app.model.EmergencyNumber
import com.rahbar.app.model.PredictionCard
import com.rahbar.app.model.StreetReport

object SeedData {

    val initialChatMessages = listOf(
        ChatMessage(
            id = "1",
            sender = "rahbar",
            textUr = "السلام علیکم منال منظور! میں آپ کا رہبر ہوں۔ کیا معلوم کرنا ہے؟",
            textEn = "Assalamualaikum Manal Manzoor! Main aapka Rahbar hoon. Aaj kya maloom karna hai?",
            spokenRomanUrdu = "Assalamualaikum Manal Manzoor! Main aapka Rahbar hoon. Aaj kya maloom karna hai?",
            timestamp = "10:00 AM"
        )
    )

    val initialReports = listOf(
        StreetReport(
            id = "r1",
            street = "Street 12, Soan Garden",
            issueType = "outage",
            reporterName = "Usman Khan",
            timestamp = "15 mins ago",
            pingsCount = 6,
            verifiedStatus = true
        ),
        StreetReport(
            id = "r2",
            street = "Street 12, Soan Garden",
            issueType = "low_voltage",
            reporterName = "Tariq Mahmood",
            timestamp = "1 hour ago",
            pingsCount = 3,
            verifiedStatus = true
        ),
        StreetReport(
            id = "r3",
            street = "Street 4, G-9, Islamabad",
            issueType = "resolved",
            reporterName = "Ahmad Raza",
            timestamp = "2 hours ago",
            pingsCount = 12,
            verifiedStatus = true
        )
    )

    val initialAlerts = listOf(
        AlertItem(
            id = "a1",
            type = "outage",
            icon = "⚡",
            titleUr = "غیر اعلانیہ بندش کا امکان",
            titleEn = "Unannounced Load Shedding Likely",
            descUr = "شدید گرمی اور گریڈ سٹیشن پر بوجھ کی وجہ سے شام 6 سے 9 کے درمیان بجلی جا سکتی ہے۔",
            descEn = "High grid load expected between 06:00 PM and 09:00 PM today.",
            timestamp = "Just now",
            severity = "high"
        ),
        AlertItem(
            id = "a2",
            type = "weather",
            icon = "☀️",
            titleUr = "شدید گرمی کی لہر (40°C)",
            titleEn = "Heatwave Warning (40°C)",
            descUr = "اسلام آباد میں گرمی کی وجہ سے بجلی کے ٹرانسفارمرز پر اضافی بوجھ ہے۔",
            descEn = "High temperatures causing transformer overload across Islamabad.",
            timestamp = "1 hour ago",
            severity = "medium"
        )
    )

    val emergencyNumbers = listOf(
        EmergencyNumber(
            id = "e1",
            titleUr = "ایمرجنسی رسپانس ہیلپ لائن",
            titleEn = "Emergency Response Line",
            number = "112",
            icon = "🚨"
        ),
        EmergencyNumber(
            id = "e2",
            titleUr = "واپڈا / آئیسکو فالٹ لائن",
            titleEn = "WAPDA / IESCO Complaint Line",
            number = "118",
            icon = "⚡"
        ),
        EmergencyNumber(
            id = "e3",
            titleUr = "ریسکیو 1122 ایمرجنسی",
            titleEn = "Rescue 1122 Emergency",
            number = "1500",
            icon = "🚑"
        ),
        EmergencyNumber(
            id = "e4",
            titleUr = "پولیس ایمرجنسی",
            titleEn = "Police Emergency Line",
            number = "15",
            icon = "👮"
        )
    )

    val knownStreets = listOf(
        "Street 12, Soan Garden",
        "Street 4, G-9, Islamabad",
        "Kuri Road Feeder Area",
        "Sector F-10, Islamabad",
        "Gulberg Greens, Islamabad"
    )
}

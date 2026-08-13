package com.rahbar.app.model

enum class Language {
    UR, EN
}

enum class ScreenId {
    SPLASH,
    VOICE_GREETING,
    CHECKING,
    ANSWER,
    MY_STREET,
    ALERTS,
    MAP,
    IMPACT,
    ASK_RAHBAR
}

data class PredictionCard(
    val timeRange: String,
    val probability: String
)

data class ChatMessage(
    val id: String = System.currentTimeMillis().toString(),
    val sender: String, // "user" or "rahbar"
    val textUr: String,
    val textEn: String,
    val spokenRomanUrdu: String? = null,
    val timestamp: String,
    val predictionCard: PredictionCard? = null
)

data class AgentDetail(
    val id: String,
    val icon: String,
    val nameUr: String,
    val nameEn: String,
    val sourceLabel: String,
    val findingUr: String,
    val findingEn: String,
    val status: String = "done"
)

data class PredictionDisplay(
    val headlineUr: String,
    val headlineEn: String,
    val timeRange: String,
    val confidenceUr: String,
    val confidenceEn: String,
    val confidencePercent: Int,
    val reasonsUr: List<String>,
    val reasonsEn: List<String>,
    val actionsUr: List<String>,
    val actionsEn: List<String>
)

data class PredictionResponse(
    val spokenUrdu: String,
    val display: PredictionDisplay,
    val agents: List<AgentDetail>
)

data class StreetReport(
    val id: String,
    val street: String,
    val issueType: String, // "outage", "low_voltage", "resolved"
    val reporterName: String,
    val timestamp: String,
    val pingsCount: Int,
    val verifiedStatus: Boolean
)

data class AlertItem(
    val id: String,
    val type: String, // "outage", "weather", "maintenance"
    val icon: String,
    val titleUr: String,
    val titleEn: String,
    val descUr: String,
    val descEn: String,
    val timestamp: String,
    val severity: String // "high", "medium", "low"
)

data class EmergencyNumber(
    val id: String,
    val titleUr: String,
    val titleEn: String,
    val number: String,
    val icon: String
)

data class MemoryContext(
    val userName: String = "Manal Manzoor",
    val detectedStreet: String = "Street 12, Soan Garden",
    val recentQuestions: List<String> = emptyList(),
    val recentPredictions: List<String> = emptyList()
)

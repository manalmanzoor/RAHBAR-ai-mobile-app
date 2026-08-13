package com.rahbar.app.viewmodel

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import com.rahbar.app.data.MemoryRepository
import com.rahbar.app.data.SeedData
import com.rahbar.app.model.AlertItem
import com.rahbar.app.model.ChatMessage
import com.rahbar.app.model.EmergencyNumber
import com.rahbar.app.model.Language
import com.rahbar.app.model.MemoryContext
import com.rahbar.app.model.PredictionCard
import com.rahbar.app.model.PredictionDisplay
import com.rahbar.app.model.PredictionResponse
import com.rahbar.app.model.ScreenId
import com.rahbar.app.model.StreetReport
import com.rahbar.app.network.ChatRequest
import com.rahbar.app.network.PredictRequest
import com.rahbar.app.network.RetrofitClient
import com.rahbar.app.services.NativeLocationManager
import com.rahbar.app.services.NativeSpeechRecognizerManager
import com.rahbar.app.services.NativeTextToSpeechManager
import com.rahbar.app.services.NotificationHelper
import com.rahbar.app.services.SpeechCallbacks
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

class RahbarViewModel(application: Application) : AndroidViewModel(application) {

    private val memoryRepo = MemoryRepository(application)
    private val speechManager = NativeSpeechRecognizerManager(application)
    private val ttsManager = NativeTextToSpeechManager(application)
    private val locationManager = NativeLocationManager(application)
    private val notificationHelper = NotificationHelper(application)

    // Global States
    private val _currentScreen = MutableStateFlow(ScreenId.SPLASH)
    val currentScreen: StateFlow<ScreenId> = _currentScreen.asStateFlow()

    private val _language = MutableStateFlow(Language.UR)
    val language: StateFlow<Language> = _language.asStateFlow()

    private val _currentStreet = MutableStateFlow("Street 12, Soan Garden")
    val currentStreet: StateFlow<String> = _currentStreet.asStateFlow()

    private val _isGpsLive = MutableStateFlow(false)
    val isGpsLive: StateFlow<Boolean> = _isGpsLive.asStateFlow()

    private val _gpsAccuracyLabel = MutableStateFlow<String?>(null)
    val gpsAccuracyLabel: StateFlow<String?> = _gpsAccuracyLabel.asStateFlow()

    // Speech & Voice
    private val _isListening = MutableStateFlow(false)
    val isListening: StateFlow<Boolean> = _isListening.asStateFlow()

    private val _micVolume = MutableStateFlow(0f)
    val micVolume: StateFlow<Float> = _micVolume.asStateFlow()

    private val _speechError = MutableStateFlow<String?>(null)
    val speechError: StateFlow<String?> = _speechError.asStateFlow()

    private val _isSpeaking = MutableStateFlow(false)
    val isSpeaking: StateFlow<Boolean> = _isSpeaking.asStateFlow()

    // Prediction
    private val _predictionResult = MutableStateFlow<PredictionResponse?>(null)
    val predictionResult: StateFlow<PredictionResponse?> = _predictionResult.asStateFlow()

    private val _isPredicting = MutableStateFlow(false)
    val isPredicting: StateFlow<Boolean> = _isPredicting.asStateFlow()

    // Chat
    private val _chatMessages = MutableStateFlow(SeedData.initialChatMessages)
    val chatMessages: StateFlow<List<ChatMessage>> = _chatMessages.asStateFlow()

    private val _isChatLoading = MutableStateFlow(false)
    val isChatLoading: StateFlow<Boolean> = _isChatLoading.asStateFlow()

    // Community Data
    private val _streetReports = MutableStateFlow(SeedData.initialReports)
    val streetReports: StateFlow<List<StreetReport>> = _streetReports.asStateFlow()

    private val _alerts = MutableStateFlow(SeedData.initialAlerts)
    val alerts: StateFlow<List<AlertItem>> = _alerts.asStateFlow()

    val emergencyNumbers: List<EmergencyNumber> = SeedData.emergencyNumbers

    private val _memoryContext = MutableStateFlow(memoryRepo.getMemory())
    val memoryContext: StateFlow<MemoryContext> = _memoryContext.asStateFlow()

    // Modals
    private val _showEmergencyModal = MutableStateFlow(false)
    val showEmergencyModal: StateFlow<Boolean> = _showEmergencyModal.asStateFlow()

    private val _showProfileDrawer = MutableStateFlow(false)
    val showProfileDrawer: StateFlow<Boolean> = _showProfileDrawer.asStateFlow()

    private val _showReportModal = MutableStateFlow(false)
    val showReportModal: StateFlow<Boolean> = _showReportModal.asStateFlow()

    private val _showMemoryTooltip = MutableStateFlow(false)
    val showMemoryTooltip: StateFlow<Boolean> = _showMemoryTooltip.asStateFlow()

    init {
        // Auto navigate from Splash after 2 seconds
        viewModelScope.launch {
            delay(2000)
            if (_currentScreen.value == ScreenId.SPLASH) {
                _currentScreen.value = ScreenId.VOICE_GREETING
                // Trigger auto-voice greeting
                speakText("Assalamualaikum Manal Manzoor! Aaj kis gali ki bijli ka maloom karna hai?")
            }
        }
    }

    fun navigateTo(screen: ScreenId) {
        stopSpeech()
        _currentScreen.value = screen
    }

    fun toggleLanguage() {
        _language.value = if (_language.value == Language.UR) Language.EN else Language.UR
    }

    fun updateStreet(street: String) {
        _currentStreet.value = street
        memoryRepo.updateStreet(street)
        _memoryContext.value = memoryRepo.getMemory()
    }

    fun fetchLiveGpsLocation() {
        viewModelScope.launch {
            val result = locationManager.getCurrentLocation(_currentStreet.value)
            _currentStreet.value = result.streetName
            _isGpsLive.value = result.isLiveGps
            _gpsAccuracyLabel.value = result.accuracyLabel
            memoryRepo.updateStreet(result.streetName)
            _memoryContext.value = memoryRepo.getMemory()
        }
    }

    // TTS Control
    fun speakText(text: String) {
        if (_isSpeaking.value) {
            ttsManager.stop()
            _isSpeaking.value = false
            return
        }

        ttsManager.speak(
            text = text,
            onStart = { _isSpeaking.value = true },
            onDone = { _isSpeaking.value = false },
            onError = { _isSpeaking.value = false }
        )
    }

    fun stopSpeech() {
        ttsManager.stop()
        _isSpeaking.value = false
    }

    // Speech Recognition
    fun toggleSpeechRecognition(onTranscriptReceived: ((String) -> Unit)? = null) {
        if (_isListening.value) {
            speechManager.stopListening()
            _isListening.value = false
            _micVolume.value = 0f
            return
        }

        _speechError.value = null
        stopSpeech()

        speechManager.startListening(object : SpeechCallbacks {
            override fun onStart() {
                _isListening.value = true
            }

            override fun onRmsChanged(volumeDb: Float) {
                _micVolume.value = volumeDb
            }

            override fun onPartialResult(text: String) {
                // optional partial update
            }

            override fun onFinalResult(text: String) {
                _isListening.value = false
                _micVolume.value = 0f
                memoryRepo.addQuestion(text)
                _memoryContext.value = memoryRepo.getMemory()

                if (onTranscriptReceived != null) {
                    onTranscriptReceived.invoke(text)
                } else {
                    // Start reasoning prediction flow
                    runPredictionFlow(text)
                }
            }

            override fun onError(errorMsg: String, isPermission: Boolean) {
                _isListening.value = false
                _micVolume.value = 0f
                _speechError.value = errorMsg
            }

            override fun onEnd() {
                _isListening.value = false
                _micVolume.value = 0f
            }
        })
    }

    fun runPredictionFlow(userQuery: String? = null) {
        _currentScreen.value = ScreenId.CHECKING
        _isPredicting.value = true

        viewModelScope.launch {
            // Simulate 3-Agent reasoning delay
            delay(1800)

            try {
                val req = PredictRequest(street = _currentStreet.value)
                val res = RetrofitClient.instance.getPredict(req)

                if (res.isSuccessful && res.body() != null) {
                    _predictionResult.value = res.body()
                } else {
                    _predictionResult.value = createFallbackPrediction()
                }
            } catch (e: Exception) {
                _predictionResult.value = createFallbackPrediction()
            } finally {
                _isPredicting.value = false
                _currentScreen.value = ScreenId.ANSWER

                val spoken = _predictionResult.value?.spokenUrdu ?: "Aaj aapki gali mein 06:00 PM se 09:00 PM ke darmiyan bijli jane ka 80 percent imkaan hai."
                speakText(spoken)

                // Trigger proactive push notification
                notificationHelper.showOutageAlert(
                    title = "⚡ Power Outage Alert - ${_currentStreet.value}",
                    message = "06:00 PM – 09:00 PM (80% probability). Charge devices now!"
                )
            }
        }
    }

    fun sendChatMessage(prompt: String) {
        if (prompt.isBlank()) return

        memoryRepo.addQuestion(prompt)
        _memoryContext.value = memoryRepo.getMemory()

        val userMsg = ChatMessage(
            sender = "user",
            textUr = prompt,
            textEn = prompt,
            timestamp = "Just now"
        )

        _chatMessages.value = _chatMessages.value + userMsg
        _isChatLoading.value = true

        viewModelScope.launch {
            try {
                val req = ChatRequest(
                    message = prompt,
                    history = _chatMessages.value,
                    memoryContext = _memoryContext.value,
                    street = _currentStreet.value
                )
                val res = RetrofitClient.instance.sendChat(req)

                if (res.isSuccessful && res.body() != null) {
                    val body = res.body()!!
                    val rahbarMsg = ChatMessage(
                        sender = "rahbar",
                        textUr = body.textUr,
                        textEn = body.textEn,
                        spokenRomanUrdu = body.spokenRomanUrdu,
                        timestamp = "Just now",
                        predictionCard = if (body.hasPrediction && body.timeRange != null) {
                            PredictionCard(body.timeRange, body.probability ?: "80%")
                        } else null
                    )
                    _chatMessages.value = _chatMessages.value + rahbarMsg
                    speakText(body.spokenRomanUrdu)
                } else {
                    addFallbackChatMessage(prompt)
                }
            } catch (e: Exception) {
                addFallbackChatMessage(prompt)
            } finally {
                _isChatLoading.value = false
            }
        }
    }

    private fun addFallbackChatMessage(prompt: String) {
        val fallback = ChatMessage(
            sender = "rahbar",
            textUr = "آج شام 06:00 PM سے 09:00 PM کے درمیان ${_currentStreet.value} میں بجلی جانے کا امکان ہے (80%)۔",
            textEn = "Aaj shaam 06:00 PM – 09:00 PM ke darmiyan ${_currentStreet.value} mein bijli jaane ka imkaan hai (80%).",
            spokenRomanUrdu = "Aaj shaam chhe baje se nau baje ke darmiyan ${_currentStreet.value} mein bijli jane ka imkaan assi percent hai.",
            timestamp = "Just now",
            predictionCard = PredictionCard("06:00 PM – 09:00 PM", "imkaan: 80%")
        )
        _chatMessages.value = _chatMessages.value + fallback
        speakText(fallback.spokenRomanUrdu!!)
    }

    fun addStreetReport(issueType: String) {
        val newReport = StreetReport(
            id = System.currentTimeMillis().toString(),
            street = _currentStreet.value,
            issueType = issueType,
            reporterName = _memoryContext.value.userName,
            timestamp = "Just now",
            pingsCount = 1,
            verifiedStatus = true
        )
        _streetReports.value = listOf(newReport) + _streetReports.value
        _showReportModal.value = false
    }

    fun clearUserData() {
        memoryRepo.clearMemory()
        _memoryContext.value = memoryRepo.getMemory()
    }

    // Modal triggers
    fun setEmergencyModalVisible(visible: Boolean) { _showEmergencyModal.value = visible }
    fun setProfileDrawerVisible(visible: Boolean) { _showProfileDrawer.value = visible }
    fun setReportModalVisible(visible: Boolean) { _showReportModal.value = visible }
    fun toggleMemoryTooltip() { _showMemoryTooltip.value = !_showMemoryTooltip.value }

    private fun createFallbackPrediction(): PredictionResponse {
        return PredictionResponse(
            spokenUrdu = "Manal ji, aaj 06:00 PM se 09:00 PM ke darmiyan bijli jane ka 80 percent imkaan hai.",
            display = PredictionDisplay(
                headlineUr = "آج آپ کی گلی میں بجلی جانے کا امکان ہے۔",
                headlineEn = "Aaj aapki gali mein bijli jaane ka imkaan hai.",
                timeRange = "06:00 PM – 09:00 PM",
                confidenceUr = "امکان: 80%",
                confidenceEn = "imkaan: 80%",
                confidencePercent = 80,
                reasonsUr = listOf("شدید گرمی (40°C)", "لوکل گرڈ پر زیادہ بوجھ", "پڑوسیوں کی حالیہ رپورٹس"),
                reasonsEn = listOf("High temperature (40°C)", "High demand expected", "Neighbors reporting"),
                actionsUr = listOf("پانی سٹور کر لیں", "ڈیوائسز چارج کر لیں", "ضروری کام پہلے کر لیں"),
                actionsEn = listOf("Paani store kar lein", "Devices charge kar lein", "Zaroori kaam pehle kar lein")
            ),
            agents = emptyList()
        )
    }

    override fun onCleared() {
        super.onCleared()
        speechManager.stopListening()
        ttsManager.shutdown()
    }
}

package com.rahbar.app

import android.Manifest
import android.content.pm.PackageManager
import android.os.Build
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.result.contract.ActivityResultContracts
import androidx.activity.viewModels
import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.core.content.ContextCompat
import com.rahbar.app.model.ScreenId
import com.rahbar.app.theme.RahbarTheme
import com.rahbar.app.ui.components.*
import com.rahbar.app.ui.screens.*
import com.rahbar.app.viewmodel.RahbarViewModel

class MainActivity : ComponentActivity() {

    private val viewModel: RahbarViewModel by viewModels()

    private val requestPermissionLauncher = registerForActivityResult(
        ActivityResultContracts.RequestMultiplePermissions()
    ) { permissions ->
        val recordAudioGranted = permissions[Manifest.permission.RECORD_AUDIO] ?: false
        val fineLocationGranted = permissions[Manifest.permission.ACCESS_FINE_LOCATION] ?: false
        
        if (fineLocationGranted) {
            viewModel.fetchLiveGpsLocation()
        }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate()

        checkAndRequestPermissions()

        setContent {
            RahbarTheme {
                val currentScreen by viewModel.currentScreen.collectAsState()
                val language by viewModel.language.collectAsState()
                val currentStreet by viewModel.currentStreet.collectAsState()
                val isGpsLive by viewModel.isGpsLive.collectAsState()
                val gpsAccuracyLabel by viewModel.gpsAccuracyLabel.collectAsState()

                val isListening by viewModel.isListening.collectAsState()
                val micVolume by viewModel.micVolume.collectAsState()
                val speechError by viewModel.speechError.collectAsState()
                val isSpeaking by viewModel.isSpeaking.collectAsState()

                val predictionResult by viewModel.predictionResult.collectAsState()
                val chatMessages by viewModel.chatMessages.collectAsState()
                val isChatLoading by viewModel.isChatLoading.collectAsState()

                val streetReports by viewModel.streetReports.collectAsState()
                val alerts by viewModel.alerts.collectAsState()
                val memoryContext by viewModel.memoryContext.collectAsState()

                val showEmergencyModal by viewModel.showEmergencyModal.collectAsState()
                val showProfileDrawer by viewModel.showProfileDrawer.collectAsState()
                val showReportModal by viewModel.showReportModal.collectAsState()
                val showMemoryTooltip by viewModel.showMemoryTooltip.collectAsState()

                var showLocationModal by remember { mutableStateOf(false) }

                Scaffold(
                    topBar = {
                        if (currentScreen != ScreenId.SPLASH) {
                            Header(
                                language = language,
                                currentStreet = currentStreet,
                                isGpsLive = isGpsLive,
                                gpsAccuracyLabel = gpsAccuracyLabel,
                                onToggleLanguage = { viewModel.toggleLanguage() },
                                onEmergencyClick = { viewModel.setEmergencyModalVisible(true) },
                                onProfileClick = { viewModel.setProfileDrawerVisible(true) },
                                onLocationClick = { showLocationModal = true }
                            )
                        }
                    },
                    bottomBar = {
                        if (currentScreen != ScreenId.SPLASH) {
                            BottomNav(
                                currentScreen = currentScreen,
                                language = language,
                                onTabSelected = { viewModel.navigateTo(it) }
                            )
                        }
                    }
                ) { innerPadding ->
                    Box(
                        modifier = Modifier
                            .fillMaxSize()
                            .padding(innerPadding)
                    ) {
                        when (currentScreen) {
                            ScreenId.SPLASH -> SplashScreen()
                            ScreenId.VOICE_GREETING -> VoiceGreetingScreen(
                                language = language,
                                currentStreet = currentStreet,
                                isListening = isListening,
                                micVolume = micVolume,
                                isSpeaking = isSpeaking,
                                speechError = speechError,
                                onToggleMic = { viewModel.toggleSpeechRecognition() },
                                onSpeakGreeting = { viewModel.speakText("Assalamualaikum Manal Manzoor! Aaj kis gali ki bijli ka maloom karna hai?") },
                                onQuickPromptSelected = { prompt -> viewModel.runPredictionFlow(prompt) }
                            )
                            ScreenId.CHECKING -> CheckingScreen(
                                language = language,
                                currentStreet = currentStreet
                            )
                            ScreenId.ANSWER -> AnswerScreen(
                                language = language,
                                currentStreet = currentStreet,
                                prediction = predictionResult,
                                onSpeakAnswer = {
                                    val spoken = predictionResult?.spokenUrdu ?: "Aaj aapki gali mein 06:00 PM se 09:00 PM ke darmiyan bijli jane ka 80 percent imkaan hai."
                                    viewModel.speakText(spoken)
                                },
                                onReportClick = { viewModel.setReportModalVisible(true) }
                            )
                            ScreenId.MY_STREET -> MyStreetScreen(
                                language = language,
                                currentStreet = currentStreet,
                                reports = streetReports,
                                onAddReportClick = { viewModel.setReportModalVisible(true) }
                            )
                            ScreenId.ASK_RAHBAR -> AskRahbarScreen(
                                language = language,
                                currentStreet = currentStreet,
                                chatMessages = chatMessages,
                                isLoading = isChatLoading,
                                isListening = isListening,
                                micVolume = micVolume,
                                isSpeaking = isSpeaking,
                                onSendMessage = { text -> viewModel.sendChatMessage(text) },
                                onToggleMic = { viewModel.toggleSpeechRecognition { transcript -> viewModel.sendChatMessage(transcript) } },
                                onSpeakMessage = { text -> viewModel.speakText(text) },
                                onToggleMemoryTooltip = { viewModel.toggleMemoryTooltip() },
                                showMemoryTooltip = showMemoryTooltip
                            )
                            ScreenId.ALERTS -> AlertsScreen(language = language, alerts = alerts)
                            ScreenId.MAP -> MapScreen(language = language, currentStreet = currentStreet)
                            ScreenId.IMPACT -> ImpactScreen(language = language)
                        }

                        // Modals
                        if (showLocationModal) {
                            LocationSelectorModal(
                                language = language,
                                currentStreet = currentStreet,
                                onStreetSelected = { viewModel.updateStreet(it) },
                                onFetchLiveGps = { viewModel.fetchLiveGpsLocation() },
                                onDismiss = { showLocationModal = false }
                            )
                        }

                        if (showEmergencyModal) {
                            EmergencyModal(
                                language = language,
                                onDismiss = { viewModel.setEmergencyModalVisible(false) }
                            )
                        }

                        if (showProfileDrawer) {
                            ProfileDrawerModal(
                                language = language,
                                memoryContext = memoryContext,
                                onClearMemory = { viewModel.clearUserData() },
                                onDismiss = { viewModel.setProfileDrawerVisible(false) }
                            )
                        }

                        if (showReportModal) {
                            ReportModal(
                                language = language,
                                currentStreet = currentStreet,
                                onSubmitReport = { issueType -> viewModel.addStreetReport(issueType) },
                                onDismiss = { viewModel.setReportModalVisible(false) }
                            )
                        }
                    }
                }
            }
        }
    }

    private fun checkAndRequestPermissions() {
        val permissionsToRequest = mutableListOf(
            Manifest.permission.RECORD_AUDIO,
            Manifest.permission.ACCESS_FINE_LOCATION,
            Manifest.permission.ACCESS_COARSE_LOCATION
        )

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            permissionsToRequest.add(Manifest.permission.POST_NOTIFICATIONS)
        }

        val missing = permissionsToRequest.filter {
            ContextCompat.checkSelfPermission(this, it) != PackageManager.PERMISSION_GRANTED
        }

        if (missing.isNotEmpty()) {
            requestPermissionLauncher.launch(missing.toTypedArray())
        } else {
            viewModel.fetchLiveGpsLocation()
        }
    }
}

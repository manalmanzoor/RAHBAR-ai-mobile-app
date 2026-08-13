package com.rahbar.app.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Mic
import androidx.compose.material.icons.filled.VolumeUp
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.rahbar.app.model.Language
import com.rahbar.app.theme.EmeraldPrimary
import com.rahbar.app.theme.EmeraldLight
import com.rahbar.app.ui.components.MascotRobot

@Composable
fun VoiceGreetingScreen(
    language: Language,
    currentStreet: String,
    isListening: Boolean,
    micVolume: Float,
    isSpeaking: Boolean,
    speechError: String?,
    onToggleMic: () -> Unit,
    onSpeakGreeting: () -> Unit,
    onQuickPromptSelected: (String) -> Unit
) {
    val isUrdu = language == Language.UR

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.SpaceBetween
    ) {
        // Top Greeting Banner
        Card(
            colors = CardDefaults.cardColors(containerColor = Color.White),
            shape = RoundedCornerShape(20.dp),
            modifier = Modifier.fillMaxWidth()
        ) {
            Column(
                modifier = Modifier.padding(16.dp),
                horizontalAlignment = Alignment.CenterHorizontally,
                verticalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                MascotRobot(isListening = isListening, isSpeaking = isSpeaking)

                Text(
                    text = if (isUrdu) "السلام علیکم منال منظور!" else "Assalamualaikum Manal Manzoor!",
                    fontWeight = FontWeight.Black,
                    fontSize = 20.sp,
                    color = EmeraldPrimary,
                    textAlign = TextAlign.Center
                )

                Text(
                    text = if (isUrdu) "آج آپ کی گلی ($currentStreet) میں بجلی جانے کا کیا امکان ہے؟"
                    else "Aaj aapki gali ($currentStreet) mein bijli jaane ka kya imkaan hai?",
                    fontSize = 13.sp,
                    fontWeight = FontWeight.Bold,
                    color = Color.DarkGray,
                    textAlign = TextAlign.Center
                )

                Button(
                    onClick = onSpeakGreeting,
                    colors = ButtonDefaults.buttonColors(containerColor = EmeraldLight),
                    contentPadding = PaddingValues(horizontal = 12.dp, vertical = 4.dp),
                    shape = RoundedCornerShape(16.dp)
                ) {
                    Icon(imageVector = Icons.Default.VolumeUp, contentDescription = "Listen", tint = EmeraldPrimary, modifier = Modifier.size(16.dp))
                    Spacer(modifier = Modifier.width(4.dp))
                    Text(text = if (isUrdu) "🔊 آواز سنیں" else "🔊 Listen Voice", color = EmeraldPrimary, fontSize = 11.sp, fontWeight = FontWeight.Bold)
                }
            }
        }

        // Error message if mic fails
        if (speechError != null) {
            Card(
                colors = CardDefaults.cardColors(containerColor = Color(0xFFFEF2F2)),
                shape = RoundedCornerShape(12.dp),
                modifier = Modifier.fillMaxWidth()
            ) {
                Text(
                    text = speechError,
                    fontSize = 11.sp,
                    fontWeight = FontWeight.Bold,
                    color = Color(0xFFDC2626),
                    modifier = Modifier.padding(12.dp)
                )
            }
        }

        // Main Mic Hero Button
        Column(
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            Box(
                modifier = Modifier
                    .size(90.dp)
                    .clip(CircleShape)
                    .background(if (isListening) Color(0xFFDC2626) else EmeraldPrimary)
                    .clickable { onToggleMic() },
                contentAlignment = Alignment.Center
            ) {
                Icon(
                    imageVector = Icons.Default.Mic,
                    contentDescription = "Speak",
                    tint = Color.White,
                    modifier = Modifier.size(42.dp)
                )
            }

            Text(
                text = if (isListening) (if (isUrdu) "رہبر سن رہا ہے... بولیں" else "Listening... Speak now")
                else (if (isUrdu) "بٹن دبائیں اور بولیں" else "Tap microphone to speak"),
                fontWeight = FontWeight.Bold,
                fontSize = 13.sp,
                color = if (isListening) Color(0xFFDC2626) else EmeraldPrimary
            )

            // Volume bar visualizer when listening
            if (isListening) {
                LinearProgressIndicator(
                    progress = { micVolume / 100f },
                    modifier = Modifier
                        .width(180.dp)
                        .height(6.dp)
                        .clip(CircleShape),
                    color = Color(0xFFDC2626),
                    trackColor = Color(0xFFFCA5A5)
                )
            }
        }

        // Quick Preset Question Pills
        Column(
            modifier = Modifier.fillMaxWidth(),
            verticalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            Text(
                text = if (isUrdu) "یا ایک سوال کا انتخاب کریں:" else "Or tap a quick question:",
                fontSize = 11.sp,
                fontWeight = FontWeight.Bold,
                color = Color.Gray
            )

            val prompts = listOf(
                "⚡ Aaj bijli kab jaye gi?",
                "💧 Paani kab aaye ga?",
                "📋 IESCO schedule kya hai?"
            )

            prompts.forEach { prompt ->
                Surface(
                    onClick = { onQuickPromptSelected(prompt) },
                    shape = RoundedCornerShape(16.dp),
                    color = Color.White,
                    modifier = Modifier
                        .fillMaxWidth()
                        .border(1.dp, EmeraldPrimary.copy(alpha = 0.3f), RoundedCornerShape(16.dp))
                ) {
                    Text(
                        text = prompt,
                        fontSize = 12.sp,
                        fontWeight = FontWeight.Bold,
                        color = EmeraldPrimary,
                        modifier = Modifier.padding(horizontal = 14.dp, vertical = 10.dp)
                    )
                }
            }
        }
    }
}

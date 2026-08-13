package com.rahbar.app.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardActions
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Brain
import androidx.compose.material.icons.filled.Mic
import androidx.compose.material.icons.filled.Send
import androidx.compose.material.icons.filled.VolumeUp
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.ImeAction
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.rahbar.app.model.ChatMessage
import com.rahbar.app.model.Language
import com.rahbar.app.theme.EmeraldPrimary
import com.rahbar.app.theme.EmeraldLight

@Composable
fun AskRahbarScreen(
    language: Language,
    currentStreet: String,
    chatMessages: List<ChatMessage>,
    isLoading: Boolean,
    isListening: Boolean,
    micVolume: Float,
    isSpeaking: Boolean,
    onSendMessage: (String) -> Unit,
    onToggleMic: () -> Unit,
    onSpeakMessage: (String) -> Unit,
    onToggleMemoryTooltip: () -> Unit,
    showMemoryTooltip: Boolean
) {
    val isUrdu = language == Language.UR
    var inputText by remember { mutableStateOf("") }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(12.dp),
        verticalArrangement = Arrangement.SpaceBetween
    ) {
        // Top Header Row with Memory Context Badge
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text(
                text = if (isUrdu) "رہبر وائس چیٹ بوٹ" else "Ask Rahbar AI Chat",
                fontWeight = FontWeight.Black,
                fontSize = 15.sp,
                color = EmeraldPrimary
            )

            Surface(
                onClick = onToggleMemoryTooltip,
                shape = RoundedCornerShape(16.dp),
                color = EmeraldLight
            ) {
                Row(
                    modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp),
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(4.dp)
                ) {
                    Icon(imageVector = Icons.Default.Brain, contentDescription = "Memory", tint = EmeraldPrimary, modifier = Modifier.size(12.dp))
                    Text(
                        text = if (isUrdu) "رہبر یاد رکھتا ہے" else "Rahbar Remembers",
                        fontSize = 10.sp,
                        fontWeight = FontWeight.Bold,
                        color = EmeraldPrimary
                    )
                }
            }
        }

        // Memory Tooltip Popover Card
        if (showMemoryTooltip) {
            Card(
                colors = CardDefaults.cardColors(containerColor = Color.White),
                shape = RoundedCornerShape(12.dp),
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(vertical = 4.dp)
            ) {
                Column(modifier = Modifier.padding(10.dp), verticalArrangement = Arrangement.spacedBy(2.dp)) {
                    Text(text = "🧠 User Context Memory", fontWeight = FontWeight.Bold, fontSize = 11.sp, color = EmeraldPrimary)
                    Text(text = "Grounded to: $currentStreet & your recent queries.", fontSize = 10.sp, color = Color.Gray)
                }
            }
        }

        // Chat Thread
        LazyColumn(
            modifier = Modifier
                .weight(1f)
                .fillMaxWidth()
                .padding(vertical = 8.dp),
            verticalArrangement = Arrangement.spacedBy(10.dp)
        ) {
            items(chatMessages) { msg ->
                val isUser = msg.sender == "user"

                Column(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalAlignment = if (isUser) Alignment.End else Alignment.Start
                ) {
                    Card(
                        colors = CardDefaults.cardColors(
                            containerColor = if (isUser) EmeraldPrimary else Color.White
                        ),
                        shape = RoundedCornerShape(16.dp),
                        modifier = Modifier.widthIn(max = 280.dp)
                    ) {
                        Column(modifier = Modifier.padding(12.dp), verticalArrangement = Arrangement.spacedBy(4.dp)) {
                            Text(
                                text = msg.textUr,
                                fontSize = 12.sp,
                                fontWeight = FontWeight.Bold,
                                color = if (isUser) Color.White else Color.DarkGray
                            )

                            if (!isUser && msg.textEn.isNotBlank()) {
                                Text(
                                    text = msg.textEn,
                                    fontSize = 11.sp,
                                    color = Color.Gray
                                )
                            }

                            if (msg.predictionCard != null) {
                                Surface(
                                    color = Color(0xFF064E3B),
                                    shape = RoundedCornerShape(8.dp),
                                    modifier = Modifier.fillMaxWidth().padding(top = 4.dp)
                                ) {
                                    Column(modifier = Modifier.padding(8.dp), horizontalAlignment = Alignment.CenterHorizontally) {
                                        Text(text = msg.predictionCard.timeRange, fontWeight = FontWeight.Black, fontSize = 13.sp, color = Color(0xFFFDE047))
                                        Text(text = "(${msg.predictionCard.probability})", fontSize = 10.sp, color = Color.White)
                                    }
                                }
                            }
                        }
                    }

                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(6.dp),
                        modifier = Modifier.padding(top = 2.dp, start = 4.dp, end = 4.dp)
                    ) {
                        Text(text = msg.timestamp, fontSize = 9.sp, color = Color.Gray)
                        if (!isUser && msg.spokenRomanUrdu != null) {
                            Text(
                                text = "🔊 Speak",
                                fontSize = 9.sp,
                                fontWeight = FontWeight.Bold,
                                color = EmeraldPrimary,
                                modifier = Modifier.clickable { onSpeakMessage(msg.spokenRomanUrdu) }
                            )
                        }
                    }
                }
            }

            if (isLoading) {
                item {
                    Text(
                        text = "Rahbar is reasoning...",
                        fontSize = 11.sp,
                        fontWeight = FontWeight.Bold,
                        color = EmeraldPrimary,
                        modifier = Modifier.padding(8.dp)
                    )
                }
            }
        }

        // Preset Prompt Chips
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(bottom = 6.dp),
            horizontalArrangement = Arrangement.spacedBy(6.dp)
        ) {
            Surface(
                onClick = { onSendMessage("Kal hamari gali mein bijli ka kya imkaan hai?") },
                shape = RoundedCornerShape(16.dp),
                color = EmeraldLight
            ) {
                Text(text = "⚡ Kal bijli ka imkaan?", fontSize = 10.sp, fontWeight = FontWeight.Bold, color = EmeraldPrimary, modifier = Modifier.padding(8.dp))
            }

            Surface(
                onClick = { onSendMessage("Paani kab aaye ga?") },
                shape = RoundedCornerShape(16.dp),
                color = EmeraldLight
            ) {
                Text(text = "💧 Paani kab aaye ga?", fontSize = 10.sp, fontWeight = FontWeight.Bold, color = EmeraldPrimary, modifier = Modifier.padding(8.dp))
            }
        }

        // Bottom Input Bar
        Row(
            modifier = Modifier.fillMaxWidth(),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            OutlinedTextField(
                value = inputText,
                onValueChange = { inputText = it },
                placeholder = { Text(if (isListening) "Listening..." else "Type or speak...", fontSize = 12.sp) },
                shape = RoundedCornerShape(24.dp),
                modifier = Modifier.weight(1f),
                keyboardOptions = KeyboardOptions(imeAction = ImeAction.Send),
                keyboardActions = KeyboardActions(onSend = {
                    onSendMessage(inputText)
                    inputText = ""
                })
            )

            IconButton(
                onClick = onToggleMic,
                modifier = Modifier
                    .size(44.dp)
                    .background(if (isListening) Color(0xFFDC2626) else EmeraldPrimary, CircleShape)
            ) {
                Icon(imageVector = Icons.Default.Mic, contentDescription = "Mic", tint = Color.White)
            }

            IconButton(
                onClick = {
                    onSendMessage(inputText)
                    inputText = ""
                },
                modifier = Modifier
                    .size(44.dp)
                    .background(EmeraldPrimary, CircleShape)
            ) {
                Icon(imageVector = Icons.Default.Send, contentDescription = "Send", tint = Color.White)
            }
        }
    }
}

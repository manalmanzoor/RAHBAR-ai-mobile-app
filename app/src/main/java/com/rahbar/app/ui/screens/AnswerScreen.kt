package com.rahbar.app.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.VolumeUp
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.rahbar.app.model.Language
import com.rahbar.app.model.PredictionResponse
import com.rahbar.app.theme.EmeraldPrimary
import com.rahbar.app.theme.EmeraldLight

@Composable
fun AnswerScreen(
    language: Language,
    currentStreet: String,
    prediction: PredictionResponse?,
    onSpeakAnswer: () -> Unit,
    onReportClick: () -> Unit
) {
    val isUrdu = language == Language.UR
    val display = prediction?.display

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(14.dp)
    ) {
        item {
            // Outage Prediction Hero Card
            Card(
                colors = CardDefaults.cardColors(containerColor = EmeraldPrimary),
                shape = RoundedCornerShape(20.dp),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(
                    modifier = Modifier.padding(18.dp),
                    horizontalAlignment = Alignment.CenterHorizontally,
                    verticalArrangement = Arrangement.spacedBy(10.dp)
                ) {
                    Surface(
                        color = Color(0xFFFEF3C7),
                        shape = RoundedCornerShape(12.dp)
                    ) {
                        Text(
                            text = display?.confidenceUr ?: "امکان: 80%",
                            color = Color(0xFFB45309),
                            fontWeight = FontWeight.Black,
                            fontSize = 12.sp,
                            modifier = Modifier.padding(horizontal = 10.dp, vertical = 4.dp)
                        )
                    }

                    Text(
                        text = if (isUrdu) (display?.headlineUr ?: "آج آپ کی گلی میں بجلی جانے کا امکان ہے۔")
                        else (display?.headlineEn ?: "Power outage likely on your street today."),
                        color = Color.White,
                        fontWeight = FontWeight.Black,
                        fontSize = 18.sp,
                        textAlign = TextAlign.Center
                    )

                    Surface(
                        color = Color(0xFF064E3B),
                        shape = RoundedCornerShape(12.dp)
                    ) {
                        Text(
                            text = display?.timeRange ?: "06:00 PM – 09:00 PM",
                            color = Color(0xFFFDE047),
                            fontWeight = FontWeight.Black,
                            fontSize = 20.sp,
                            modifier = Modifier.padding(horizontal = 16.dp, vertical = 6.dp)
                        )
                    }

                    Button(
                        onClick = onSpeakAnswer,
                        colors = ButtonDefaults.buttonColors(containerColor = Color.White),
                        shape = RoundedCornerShape(16.dp)
                    ) {
                        Icon(imageVector = Icons.Default.VolumeUp, contentDescription = "Listen", tint = EmeraldPrimary, modifier = Modifier.size(16.dp))
                        Spacer(modifier = Modifier.width(6.dp))
                        Text(text = if (isUrdu) "🔊 آواز میں سنیں" else "🔊 Listen Voice Reply", color = EmeraldPrimary, fontWeight = FontWeight.Bold)
                    }
                }
            }
        }

        // Reasons Section
        item {
            Card(
                colors = CardDefaults.cardColors(containerColor = Color.White),
                shape = RoundedCornerShape(16.dp),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(modifier = Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    Text(
                        text = if (isUrdu) "💡 وجوہات (Reasons)" else "💡 Key Reasons",
                        fontWeight = FontWeight.Bold,
                        fontSize = 14.sp,
                        color = EmeraldPrimary
                    )

                    val reasons = if (isUrdu) display?.reasonsUr else display?.reasonsEn
                    (reasons ?: listOf("شدید گرمی (40°C)", "لوکل گرڈ پر بوجھ", "پڑوسیوں کی رپورٹس")).forEach { reason ->
                        Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                            Text(text = "•", color = EmeraldPrimary, fontWeight = FontWeight.Bold)
                            Text(text = reason, fontSize = 12.sp, color = Color.DarkGray)
                        }
                    }
                }
            }
        }

        // Action Recommendations
        item {
            Card(
                colors = CardDefaults.cardColors(containerColor = Color.White),
                shape = RoundedCornerShape(16.dp),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(modifier = Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    Text(
                        text = if (isUrdu) "🛡️ کیا کریں؟ (Actions)" else "🛡️ Recommended Actions",
                        fontWeight = FontWeight.Bold,
                        fontSize = 14.sp,
                        color = EmeraldPrimary
                    )

                    val actions = if (isUrdu) display?.actionsUr else display?.actionsEn
                    (actions ?: listOf("پانی سٹور کر لیں", "ڈیوائسز چارج کر لیں", "ضروری کام پہلے کر لیں")).forEach { action ->
                        Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                            Text(text = "✔", color = EmeraldPrimary, fontWeight = FontWeight.Bold)
                            Text(text = action, fontSize = 12.sp, color = Color.DarkGray)
                        }
                    }
                }
            }
        }

        // Community Report Button
        item {
            Button(
                onClick = onReportClick,
                colors = ButtonDefaults.buttonColors(containerColor = EmeraldPrimary),
                shape = RoundedCornerShape(16.dp),
                modifier = Modifier.fillMaxWidth()
            ) {
                Text(text = if (isUrdu) "📡 اپنی گلی کی اطلاع دیں (Report)" else "📡 Submit Community Street Report", color = Color.White)
            }
        }
    }
}

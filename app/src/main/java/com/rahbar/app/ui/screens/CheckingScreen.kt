package com.rahbar.app.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.rahbar.app.model.Language
import com.rahbar.app.theme.EmeraldPrimary
import com.rahbar.app.theme.WarmBackground

data class AgentStep(
    val icon: String,
    val titleUr: String,
    val titleEn: String,
    val status: String
)

@Composable
fun CheckingScreen(
    language: Language,
    currentStreet: String
) {
    val isUrdu = language == Language.UR

    val agentSteps = listOf(
        AgentStep("📡", "گلی ایجنٹ / WhatsApp & Community Reports", "Street Agent (WhatsApp & Community)", "Analysing 6 pings..."),
        AgentStep("📋", "شیڈول ایجنٹ / IESCO Official Feeders", "Schedule Agent (IESCO Schedule)", "Checking official feeders..."),
        AgentStep("☀️", "موسم ایجنٹ / Weather Grid Load", "Weather Agent (Grid Temperature)", "Checking 40°C heat wave..."),
        AgentStep("🔄", "تاریخی پیٹرن ایجنٹ / Past Outages", "History Agent (Past Outages)", "Matching 5-day patterns...")
    )

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(WarmBackground)
            .padding(16.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        Card(
            colors = CardDefaults.cardColors(containerColor = Color.White),
            shape = RoundedCornerShape(20.dp),
            modifier = Modifier.fillMaxWidth()
        ) {
            Column(
                modifier = Modifier.padding(20.dp),
                horizontalAlignment = Alignment.CenterHorizontally,
                verticalArrangement = Arrangement.spacedBy(16.dp)
            ) {
                CircularProgressIndicator(color = EmeraldPrimary, strokeWidth = 4.dp)

                Text(
                    text = if (isUrdu) "رہبر کے 3 ایجنٹس آپ کی گلی کی پڑتال کر رہے ہیں..."
                    else "Rahbar's 3 Reasoning Agents Analyzing Street Data...",
                    fontWeight = FontWeight.Black,
                    fontSize = 15.sp,
                    color = EmeraldPrimary
                )

                Text(
                    text = "Street: $currentStreet",
                    fontSize = 11.sp,
                    color = Color.Gray,
                    fontWeight = FontWeight.Bold
                )

                Divider()

                LazyColumn(
                    verticalArrangement = Arrangement.spacedBy(10.dp),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    items(agentSteps) { step ->
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .background(Color(0xFFF9FAFB), RoundedCornerShape(12.dp))
                                .padding(12.dp),
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.SpaceBetween
                        ) {
                            Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                                Text(text = step.icon, fontSize = 20.sp)
                                Column {
                                    Text(
                                        text = if (isUrdu) step.titleUr else step.titleEn,
                                        fontWeight = FontWeight.Bold,
                                        fontSize = 12.sp
                                    )
                                    Text(text = step.status, fontSize = 10.sp, color = EmeraldPrimary)
                                }
                            }
                            CircularProgressIndicator(modifier = Modifier.size(14.dp), strokeWidth = 2.dp, color = EmeraldPrimary)
                        }
                    }
                }
            }
        }
    }
}

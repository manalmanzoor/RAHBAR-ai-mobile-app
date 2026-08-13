package com.rahbar.app.ui.screens

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
import com.rahbar.app.model.AlertItem
import com.rahbar.app.model.Language
import com.rahbar.app.theme.EmeraldPrimary

@Composable
fun AlertsScreen(
    language: Language,
    alerts: List<AlertItem>
) {
    val isUrdu = language == Language.UR

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        item {
            Text(
                text = if (isUrdu) "اطلاعات و الرٹس (Active Alerts)" else "Active Power & Weather Alerts",
                fontWeight = FontWeight.Black,
                fontSize = 18.sp,
                color = EmeraldPrimary
            )
        }

        items(alerts) { alert ->
            Card(
                colors = CardDefaults.cardColors(
                    containerColor = if (alert.severity == "high") Color(0xFFFEF2F2) else Color.White
                ),
                shape = RoundedCornerShape(16.dp),
                modifier = Modifier.fillMaxWidth()
            ) {
                Row(
                    modifier = Modifier.padding(14.dp),
                    horizontalArrangement = Arrangement.spacedBy(12.dp),
                    verticalAlignment = Alignment.Top
                ) {
                    Text(text = alert.icon, fontSize = 24.sp)
                    Column(verticalArrangement = Arrangement.spacedBy(4.dp)) {
                        Text(
                            text = if (isUrdu) alert.titleUr else alert.titleEn,
                            fontWeight = FontWeight.Bold,
                            fontSize = 13.sp,
                            color = if (alert.severity == "high") Color(0xFF991B1B) else EmeraldPrimary
                        )
                        Text(
                            text = if (isUrdu) alert.descUr else alert.descEn,
                            fontSize = 11.sp,
                            color = Color.DarkGray
                        )
                        Text(
                            text = alert.timestamp,
                            fontSize = 9.sp,
                            color = Color.Gray
                        )
                    }
                }
            }
        }
    }
}

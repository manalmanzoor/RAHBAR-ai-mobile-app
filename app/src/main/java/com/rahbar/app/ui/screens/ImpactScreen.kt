package com.rahbar.app.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
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
import com.rahbar.app.theme.EmeraldLight

@Composable
fun ImpactScreen(
    language: Language
) {
    val isUrdu = language == Language.UR

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(14.dp)
    ) {
        item {
            Text(
                text = if (isUrdu) "رہبر کے اثرات (Community Impact)" else "Community & Household Impact",
                fontWeight = FontWeight.Black,
                fontSize = 18.sp,
                color = EmeraldPrimary
            )
        }

        item {
            Card(
                colors = CardDefaults.cardColors(containerColor = EmeraldPrimary),
                shape = RoundedCornerShape(20.dp),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(
                    modifier = Modifier.padding(20.dp),
                    horizontalAlignment = Alignment.CenterHorizontally,
                    verticalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    Text(text = "⭐ Your Impact Score", color = EmeraldLight, fontSize = 12.sp, fontWeight = FontWeight.Bold)
                    Text(text = "940 pts", color = Color.White, fontSize = 32.sp, fontWeight = FontWeight.Black)
                    Text(text = "Top 5% Contributor in Soan Garden", color = Color.White, fontSize = 11.sp)
                }
            }
        }

        item {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Card(
                    colors = CardDefaults.cardColors(containerColor = Color.White),
                    shape = RoundedCornerShape(16.dp),
                    modifier = Modifier.weight(1f).padding(end = 6.dp)
                ) {
                    Column(modifier = Modifier.padding(14.dp), horizontalAlignment = Alignment.CenterHorizontally) {
                        Text(text = "⏱️ 14.5 hrs", fontWeight = FontWeight.Black, fontSize = 16.sp, color = EmeraldPrimary)
                        Text(text = "Outage Time Saved", fontSize = 10.sp, color = Color.Gray)
                    }
                }

                Card(
                    colors = CardDefaults.cardColors(containerColor = Color.White),
                    shape = RoundedCornerShape(16.dp),
                    modifier = Modifier.weight(1f).padding(start = 6.dp)
                ) {
                    Column(modifier = Modifier.padding(14.dp), horizontalAlignment = Alignment.CenterHorizontally) {
                        Text(text = "📡 12 Reports", fontWeight = FontWeight.Black, fontSize = 16.sp, color = EmeraldPrimary)
                        Text(text = "Street Pings Shared", fontSize = 10.sp, color = Color.Gray)
                    }
                }
            }
        }
    }
}

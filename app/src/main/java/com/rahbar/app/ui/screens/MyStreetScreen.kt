package com.rahbar.app.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.rahbar.app.model.Language
import com.rahbar.app.model.StreetReport
import com.rahbar.app.theme.EmeraldPrimary

@Composable
fun MyStreetScreen(
    language: Language,
    currentStreet: String,
    reports: List<StreetReport>,
    onAddReportClick: () -> Unit
) {
    val isUrdu = language == Language.UR

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(14.dp)
    ) {
        // Community Pulse Header Card
        item {
            Card(
                colors = CardDefaults.cardColors(containerColor = Color.White),
                shape = RoundedCornerShape(20.dp),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(
                    modifier = Modifier.padding(16.dp),
                    verticalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Column {
                            Text(
                                text = if (isUrdu) "گلی کی کمیونٹی رپورٹ" else "Street Community Pulse",
                                fontWeight = FontWeight.Black,
                                fontSize = 16.sp,
                                color = EmeraldPrimary
                            )
                            Text(
                                text = currentStreet,
                                fontSize = 12.sp,
                                color = Color.Gray,
                                fontWeight = FontWeight.Bold
                            )
                        }

                        Button(
                            onClick = onAddReportClick,
                            colors = ButtonDefaults.buttonColors(containerColor = EmeraldPrimary),
                            shape = RoundedCornerShape(20.dp),
                            contentPadding = PaddingValues(horizontal = 10.dp, vertical = 4.dp)
                        ) {
                            Icon(imageVector = Icons.Default.Add, contentDescription = "Add", modifier = Modifier.size(14.dp))
                            Spacer(modifier = Modifier.width(4.dp))
                            Text(text = if (isUrdu) "اطلاع دیں" else "Report", fontSize = 11.sp)
                        }
                    }

                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Surface(
                            color = Color(0xFFE6F4EA),
                            shape = RoundedCornerShape(10.dp),
                            modifier = Modifier.weight(1f).padding(end = 4.dp)
                        ) {
                            Column(modifier = Modifier.padding(8.dp), horizontalAlignment = Alignment.CenterHorizontally) {
                                Text(text = "6", fontWeight = FontWeight.Black, fontSize = 16.sp, color = EmeraldPrimary)
                                Text(text = "Active Pings", fontSize = 10.sp, color = Color.Gray)
                            }
                        }

                        Surface(
                            color = Color(0xFFFEF3C7),
                            shape = RoundedCornerShape(10.dp),
                            modifier = Modifier.weight(1f).padding(start = 4.dp)
                        ) {
                            Column(modifier = Modifier.padding(8.dp), horizontalAlignment = Alignment.CenterHorizontally) {
                                Text(text = "80%", fontWeight = FontWeight.Black, fontSize = 16.sp, color = Color(0xFFB45309))
                                Text(text = "Risk Match", fontSize = 10.sp, color = Color.Gray)
                            }
                        }
                    }
                }
            }
        }

        item {
            Text(
                text = if (isUrdu) "حالیہ رپورٹس (Recent Pings):" else "Recent Street Reports:",
                fontSize = 12.sp,
                fontWeight = FontWeight.Bold,
                color = Color.Gray
            )
        }

        items(reports) { report ->
            Card(
                colors = CardDefaults.cardColors(containerColor = Color.White),
                shape = RoundedCornerShape(14.dp),
                modifier = Modifier.fillMaxWidth()
            ) {
                Row(
                    modifier = Modifier.padding(14.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column(verticalArrangement = Arrangement.spacedBy(4.dp)) {
                        Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                            Text(
                                text = if (report.issueType == "outage") "⚡ Power Outage" else if (report.issueType == "low_voltage") "📉 Low Voltage" else "✅ Restored",
                                fontWeight = FontWeight.Bold,
                                fontSize = 13.sp,
                                color = if (report.issueType == "outage") Color(0xFFDC2626) else EmeraldPrimary
                            )
                            if (report.verifiedStatus) {
                                Icon(imageVector = Icons.Default.CheckCircle, contentDescription = "Verified", tint = EmeraldPrimary, modifier = Modifier.size(14.dp))
                            }
                        }
                        Text(text = "By ${report.reporterName} • ${report.timestamp}", fontSize = 11.sp, color = Color.Gray)
                    }

                    Surface(
                        color = Color(0xFFF3F4F6),
                        shape = RoundedCornerShape(8.dp)
                    ) {
                        Text(
                            text = "${report.pingsCount} pings",
                            fontSize = 10.sp,
                            fontWeight = FontWeight.Bold,
                            modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
                        )
                    }
                }
            }
        }
    }
}

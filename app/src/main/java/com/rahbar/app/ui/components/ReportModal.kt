package com.rahbar.app.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.rahbar.app.model.Language
import com.rahbar.app.theme.EmeraldPrimary

@Composable
fun ReportModal(
    language: Language,
    currentStreet: String,
    onSubmitReport: (String) -> Unit,
    onDismiss: () -> Unit
) {
    val isUrdu = language == Language.UR
    var selectedIssue by remember { mutableStateOf("outage") }

    AlertDialog(
        onDismissRequest = onDismiss,
        title = {
            Text(
                text = if (isUrdu) "گلی رپورٹ جمع کرائیں" else "Submit Community Street Report",
                fontWeight = FontWeight.Bold,
                fontSize = 16.sp
            )
        },
        text = {
            Column(
                modifier = Modifier.fillMaxWidth(),
                verticalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                Text(
                    text = "Street: $currentStreet",
                    fontSize = 12.sp,
                    fontWeight = FontWeight.Bold,
                    color = EmeraldPrimary
                )

                val issues = listOf(
                    Triple("outage", "⚡ بجلی بند ہے / Power Outage", "outage"),
                    Triple("low_voltage", "📉 کم وولٹیج / Low Voltage", "low_voltage"),
                    Triple("resolved", "✅ بجلی بحال ہو گئی / Power Restored", "resolved")
                )

                issues.forEach { (id, label, type) ->
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .background(
                                if (selectedIssue == id) EmeraldPrimary.copy(alpha = 0.1f) else Color(0xFFF9FAFB),
                                RoundedCornerShape(8.dp)
                            )
                            .clickable { selectedIssue = id }
                            .padding(12.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        RadioButton(
                            selected = (selectedIssue == id),
                            onClick = { selectedIssue = id },
                            colors = RadioButtonDefaults.colors(selectedColor = EmeraldPrimary)
                        )
                        Spacer(modifier = Modifier.width(6.dp))
                        Text(text = label, fontSize = 12.sp, fontWeight = FontWeight.Medium)
                    }
                }
            }
        },
        confirmButton = {
            Button(
                onClick = { onSubmitReport(selectedIssue) },
                colors = ButtonDefaults.buttonColors(containerColor = EmeraldPrimary)
            ) {
                Text(if (isUrdu) "رپورٹ کریں" else "Submit Ping", color = Color.White)
            }
        },
        dismissButton = {
            TextButton(onClick = onDismiss) {
                Text(if (isUrdu) "منسوخ" else "Cancel", color = Color.Gray)
            }
        }
    )
}

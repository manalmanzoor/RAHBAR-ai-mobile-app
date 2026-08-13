package com.rahbar.app.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Brain
import androidx.compose.material.icons.filled.Delete
import androidx.compose.material.icons.filled.Person
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.rahbar.app.model.Language
import com.rahbar.app.model.MemoryContext
import com.rahbar.app.theme.EmeraldPrimary

@Composable
fun ProfileDrawerModal(
    language: Language,
    memoryContext: MemoryContext,
    onClearMemory: () -> Unit,
    onDismiss: () -> Unit
) {
    val isUrdu = language == Language.UR

    AlertDialog(
        onDismissRequest = onDismiss,
        title = {
            Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                Icon(imageVector = Icons.Default.Person, contentDescription = "Profile", tint = EmeraldPrimary)
                Text(
                    text = if (isUrdu) "یوزر پروفائل اور حافظہ" else "User Profile & Memory",
                    fontWeight = FontWeight.Bold,
                    fontSize = 16.sp
                )
            }
        },
        text = {
            Column(
                modifier = Modifier.fillMaxWidth(),
                verticalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                Card(
                    colors = CardDefaults.cardColors(containerColor = Color(0xFFF3F4F6)),
                    shape = RoundedCornerShape(12.dp)
                ) {
                    Column(modifier = Modifier.padding(12.dp), verticalArrangement = Arrangement.spacedBy(4.dp)) {
                        Text(text = "Name: ${memoryContext.userName}", fontWeight = FontWeight.Bold, fontSize = 13.sp)
                        Text(text = "Street: ${memoryContext.detectedStreet}", fontSize = 12.sp, color = Color.Gray)
                    }
                }

                Card(
                    colors = CardDefaults.cardColors(containerColor = Color(0xFFE6F4EA)),
                    shape = RoundedCornerShape(12.dp)
                ) {
                    Column(modifier = Modifier.padding(12.dp), verticalArrangement = Arrangement.spacedBy(6.dp)) {
                        Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(4.dp)) {
                            Icon(imageVector = Icons.Default.Brain, contentDescription = "Memory", tint = EmeraldPrimary, modifier = Modifier.size(16.dp))
                            Text(text = if (isUrdu) "رہبر یاد رکھتا ہے" else "Rahbar Context Memory", fontWeight = FontWeight.Bold, fontSize = 12.sp, color = EmeraldPrimary)
                        }
                        if (memoryContext.recentQuestions.isNotEmpty()) {
                            Text(text = "Last Question: \"${memoryContext.recentQuestions.first()}\"", fontSize = 11.sp, color = Color.DarkGray)
                        } else {
                            Text(text = "No stored questions yet.", fontSize = 11.sp, color = Color.Gray)
                        }
                    }
                }

                Button(
                    onClick = {
                        onClearMemory()
                        onDismiss()
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = Color(0xFFEF4444)),
                    shape = RoundedCornerShape(12.dp),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Icon(imageVector = Icons.Default.Delete, contentDescription = "Clear", modifier = Modifier.size(16.dp))
                    Spacer(modifier = Modifier.width(6.dp))
                    Text(text = if (isUrdu) "میرا ڈیٹا مٹائیں" else "Forget My Memory Data", fontSize = 12.sp)
                }
            }
        },
        confirmButton = {
            TextButton(onClick = onDismiss) {
                Text(if (isUrdu) "بند کریں" else "Close", color = EmeraldPrimary)
            }
        }
    )
}

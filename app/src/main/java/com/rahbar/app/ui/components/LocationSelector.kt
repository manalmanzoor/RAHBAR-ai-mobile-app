package com.rahbar.app.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.GpsFixed
import androidx.compose.material.icons.filled.LocationOn
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.rahbar.app.data.SeedData
import com.rahbar.app.model.Language
import com.rahbar.app.theme.EmeraldPrimary

@Composable
fun LocationSelectorModal(
    language: Language,
    currentStreet: String,
    onStreetSelected: (String) -> Unit,
    onFetchLiveGps: () -> Unit,
    onDismiss: () -> Unit
) {
    val isUrdu = language == Language.UR

    AlertDialog(
        onDismissRequest = onDismiss,
        title = {
            Text(
                text = if (isUrdu) "گلی یا علاقہ منتخب کریں" else "Select Street / Area",
                fontWeight = FontWeight.Bold,
                fontSize = 16.sp
            )
        },
        text = {
            Column(
                modifier = Modifier.fillMaxWidth(),
                verticalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                // Fetch Live GPS Button
                Button(
                    onClick = {
                        onFetchLiveGps()
                        onDismiss()
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = EmeraldPrimary),
                    shape = RoundedCornerShape(12.dp),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Icon(
                        imageVector = Icons.Default.GpsFixed,
                        contentDescription = "GPS",
                        modifier = Modifier.size(16.dp)
                    )
                    Spacer(modifier = Modifier.width(6.dp))
                    Text(
                        text = if (isUrdu) "📡 موجودہ GPS لوکیشن حاصل کریں" else "📡 Get Live GPS Location",
                        fontSize = 12.sp,
                        fontWeight = FontWeight.Bold
                    )
                }

                Divider()

                Text(
                    text = if (isUrdu) "معروف علاقے:" else "Known Islamabad Areas:",
                    fontSize = 11.sp,
                    color = Color.Gray,
                    fontWeight = FontWeight.Bold
                )

                LazyColumn(
                    verticalArrangement = Arrangement.spacedBy(6.dp),
                    modifier = Modifier.height(180.dp)
                ) {
                    items(SeedData.knownStreets) { street ->
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .background(
                                    if (street == currentStreet) EmeraldPrimary.copy(alpha = 0.1f) else Color(0xFFF9FAFB),
                                    RoundedCornerShape(8.dp)
                                )
                                .clickable {
                                    onStreetSelected(street)
                                    onDismiss()
                                }
                                .padding(12.dp),
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.SpaceBetween
                        ) {
                            Text(
                                text = street,
                                fontSize = 12.sp,
                                fontWeight = if (street == currentStreet) FontWeight.Bold else FontWeight.Medium,
                                color = if (street == currentStreet) EmeraldPrimary else Color.DarkGray
                            )
                            if (street == currentStreet) {
                                Icon(
                                    imageVector = Icons.Default.LocationOn,
                                    contentDescription = "Selected",
                                    tint = EmeraldPrimary,
                                    modifier = Modifier.size(16.dp)
                                )
                            }
                        }
                    }
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

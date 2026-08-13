package com.rahbar.app.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.GpsFixed
import androidx.compose.material.icons.filled.LocationOn
import androidx.compose.material.icons.filled.PhoneInTalk
import androidx.compose.material.icons.filled.Person
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.rahbar.app.model.Language
import com.rahbar.app.theme.EmeraldPrimary
import com.rahbar.app.theme.EmeraldLight

@Composable
fun Header(
    language: Language,
    currentStreet: String,
    isGpsLive: Boolean,
    gpsAccuracyLabel: String?,
    onToggleLanguage: () -> Unit,
    onEmergencyClick: () -> Unit,
    onProfileClick: () -> Unit,
    onLocationClick: () -> Unit
) {
    val isUrdu = language == Language.UR

    Row(
        modifier = Modifier
            .fillMaxWidth()
            .background(Color.White)
            .padding(horizontal = 12.dp, vertical = 8.dp),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
    ) {
        // Left: Branding Logo
        Row(
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(6.dp),
            modifier = Modifier.clickable { onProfileClick() }
        ) {
            Box(
                modifier = Modifier
                    .size(32.dp)
                    .clip(CircleShape)
                    .background(EmeraldPrimary),
                contentAlignment = Alignment.Center
            ) {
                Text(
                    text = "ر",
                    color = Color.White,
                    fontWeight = FontWeight.Bold,
                    fontSize = 18.sp
                )
            }
            Column {
                Text(
                    text = if (isUrdu) "رہبر" else "RAHBAR",
                    fontWeight = FontWeight.Black,
                    fontSize = 14.sp,
                    color = EmeraldPrimary
                )
                Text(
                    text = if (isUrdu) "پاکستان" else "Pakistan AI",
                    fontSize = 9.sp,
                    color = Color.Gray
                )
            }
        }

        // Middle: Location Badge
        Surface(
            onClick = onLocationClick,
            shape = RoundedCornerShape(16.dp),
            color = EmeraldLight.copy(alpha = 0.5f),
            modifier = Modifier.border(0.5.dp, EmeraldPrimary.copy(alpha = 0.3f), RoundedCornerShape(16.dp))
        ) {
            Row(
                modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(4.dp)
            ) {
                Icon(
                    imageVector = if (isGpsLive) Icons.Default.GpsFixed else Icons.Default.LocationOn,
                    contentDescription = "Location",
                    tint = EmeraldPrimary,
                    modifier = Modifier.size(12.dp)
                )
                Text(
                    text = currentStreet.take(18) + if (currentStreet.length > 18) "..." else "",
                    fontSize = 10.sp,
                    fontWeight = FontWeight.Bold,
                    color = EmeraldPrimary
                )
            }
        }

        // Right: Language Toggle & Emergency Call Button
        Row(
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(6.dp)
        ) {
            // Language Toggle
            Box(
                modifier = Modifier
                    .clip(CircleShape)
                    .background(Color(0xFFF3F4F6))
                    .clickable { onToggleLanguage() }
                    .padding(horizontal = 8.dp, vertical = 4.dp)
            ) {
                Text(
                    text = if (isUrdu) "EN" else "اردو",
                    fontSize = 10.sp,
                    fontWeight = FontWeight.ExtraBold,
                    color = EmeraldPrimary
                )
            }

            // Emergency Dial button
            IconButton(
                onClick = onEmergencyClick,
                modifier = Modifier
                    .size(32.dp)
                    .background(Color(0xFFFEF2F2), CircleShape)
                    .border(1.dp, Color(0xFFFCA5A5), CircleShape)
            ) {
                Icon(
                    imageVector = Icons.Default.PhoneInTalk,
                    contentDescription = "Emergency Helpline",
                    tint = Color(0xFFDC2626),
                    modifier = Modifier.size(16.dp)
                )
            }
        }
    }
}

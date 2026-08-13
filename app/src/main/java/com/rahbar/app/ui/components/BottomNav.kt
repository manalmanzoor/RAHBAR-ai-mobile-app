package com.rahbar.app.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.rahbar.app.model.Language
import com.rahbar.app.model.ScreenId
import com.rahbar.app.theme.EmeraldPrimary

data class NavTabItem(
    val id: ScreenId,
    val icon: ImageVector,
    val labelUr: String,
    val labelEn: String
)

@Composable
fun BottomNav(
    currentScreen: ScreenId,
    language: Language,
    onTabSelected: (ScreenId) -> Unit
) {
    val isUrdu = language == Language.UR

    val tabs = listOf(
        NavTabItem(ScreenId.VOICE_GREETING, Icons.Default.Mic, "آواز", "Voice"),
        NavTabItem(ScreenId.ANSWER, Icons.Default.Bolt, "پیشگوئی", "Answer"),
        NavTabItem(ScreenId.MY_STREET, Icons.Default.HomeWork, "میری گلی", "Street"),
        NavTabItem(ScreenId.ASK_RAHBAR, Icons.Default.Chat, "رہبر چیٹ", "Ask Rahbar"),
        NavTabItem(ScreenId.ALERTS, Icons.Default.Notifications, "اطلاعات", "Alerts"),
        NavTabItem(ScreenId.MAP, Icons.Default.Map, "نقشہ", "Map"),
        NavTabItem(ScreenId.IMPACT, Icons.Default.BarChart, "اثرات", "Impact")
    )

    Row(
        modifier = Modifier
            .fillMaxWidth()
            .background(Color.White)
            .padding(vertical = 4.dp, horizontal = 2.dp),
        horizontalArrangement = Arrangement.SpaceAround,
        verticalAlignment = Alignment.CenterVertically
    ) {
        tabs.forEach { tab ->
            val isSelected = currentScreen == tab.id
            val activeColor = EmeraldPrimary
            val inactiveColor = Color.Gray

            Column(
                horizontalAlignment = Alignment.CenterHorizontally,
                verticalArrangement = Arrangement.Center,
                modifier = Modifier
                    .clip(CircleShape)
                    .clickable { onTabSelected(tab.id) }
                    .padding(horizontal = 4.dp, vertical = 2.dp)
            ) {
                Box(
                    modifier = Modifier
                        .size(36.dp)
                        .clip(CircleShape)
                        .background(if (isSelected) EmeraldPrimary.copy(alpha = 0.12f) else Color.Transparent),
                    contentAlignment = Alignment.Center
                ) {
                    Icon(
                        imageVector = tab.icon,
                        contentDescription = tab.labelEn,
                        tint = if (isSelected) activeColor else inactiveColor,
                        modifier = Modifier.size(20.dp)
                    )
                }
                Text(
                    text = if (isUrdu) tab.labelUr else tab.labelEn,
                    fontSize = 9.sp,
                    fontWeight = if (isSelected) FontWeight.ExtraBold else FontWeight.Normal,
                    color = if (isSelected) activeColor else inactiveColor
                )
            }
        }
    }
}

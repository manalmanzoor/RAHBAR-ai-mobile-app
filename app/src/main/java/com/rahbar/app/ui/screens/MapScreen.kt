package com.rahbar.app.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.rahbar.app.model.Language
import com.rahbar.app.theme.EmeraldPrimary
import com.rahbar.app.ui.components.PakistanMapComposable

@Composable
fun MapScreen(
    language: Language,
    currentStreet: String
) {
    val isUrdu = language == Language.UR

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(14.dp)
    ) {
        Text(
            text = if (isUrdu) "پاکستان لوڈ شیڈنگ ہیٹ میپ" else "Pakistan Regional Outage Heatmap",
            fontWeight = FontWeight.Black,
            fontSize = 18.sp,
            color = EmeraldPrimary
        )

        Text(
            text = "Live Grid Substation Risk Map for $currentStreet and twin cities.",
            fontSize = 12.sp,
            color = androidx.compose.ui.graphics.Color.Gray
        )

        PakistanMapComposable()
    }
}

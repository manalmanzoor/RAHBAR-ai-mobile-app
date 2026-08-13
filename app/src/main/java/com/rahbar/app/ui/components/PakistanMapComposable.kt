package com.rahbar.app.ui.components

import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.rahbar.app.theme.EmeraldPrimary

@Composable
fun PakistanMapComposable(
    modifier: Modifier = Modifier
) {
    Card(
        modifier = modifier
            .fillMaxWidth()
            .height(240.dp),
        colors = CardDefaults.cardColors(containerColor = Color.White),
        shape = RoundedCornerShape(16.dp)
    ) {
        Box(modifier = Modifier.fillMaxSize()) {
            Canvas(modifier = Modifier.fillMaxSize()) {
                val canvasWidth = size.width
                val canvasHeight = size.height

                // Islamabad Grid Station Node (Pulsing)
                val isbX = canvasWidth * 0.58f
                val isbY = canvasHeight * 0.35f

                // Rawalpindi Substation Node
                val rwpX = canvasWidth * 0.56f
                val rwpY = canvasHeight * 0.42f

                // Lahore Node
                val lhrX = canvasWidth * 0.68f
                val lhrY = canvasHeight * 0.58f

                // Connecting Grid Lines
                drawLine(
                    color = EmeraldPrimary.copy(alpha = 0.4f),
                    start = Offset(isbX, isbY),
                    end = Offset(rwpX, rwpY),
                    strokeWidth = 3f
                )

                drawLine(
                    color = Color(0xFFF59E0B).copy(alpha = 0.5f),
                    start = Offset(rwpX, rwpY),
                    end = Offset(lhrX, lhrY),
                    strokeWidth = 3f
                )

                // Draw Grid Nodes
                drawCircle(color = Color(0xFFEF4444), radius = 18f, center = Offset(isbX, isbY))
                drawCircle(color = Color.White, radius = 8f, center = Offset(isbX, isbY))

                drawCircle(color = Color(0xFFF59E0B), radius = 14f, center = Offset(rwpX, rwpY))
                drawCircle(color = Color.White, radius = 6f, center = Offset(rwpX, rwpY))

                drawCircle(color = EmeraldPrimary, radius = 14f, center = Offset(lhrX, lhrY))
                drawCircle(color = Color.White, radius = 6f, center = Offset(lhrX, lhrY))
            }

            Column(
                modifier = Modifier
                    .align(Alignment.BottomStart)
                    .padding(12.dp)
                    .background(Color.White.copy(alpha = 0.9f), RoundedCornerShape(8.dp))
                    .padding(8.dp)
            ) {
                Text(text = "🔴 Islamabad/Soan: 80% Load Risk", fontSize = 10.sp, fontWeight = FontWeight.Bold, color = Color(0xFFDC2626))
                Text(text = "🟠 Rawalpindi: Moderate Load", fontSize = 10.sp, fontWeight = FontWeight.Bold, color = Color(0xFFD97706))
                Text(text = "🟢 Lahore Feeder: Normal Grid", fontSize = 10.sp, fontWeight = FontWeight.Bold, color = EmeraldPrimary)
            }
        }
    }
}

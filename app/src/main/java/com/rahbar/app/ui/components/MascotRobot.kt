package com.rahbar.app.ui.components

import androidx.compose.animation.core.*
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.scale
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.rahbar.app.theme.EmeraldPrimary

@Composable
fun MascotRobot(
    isListening: Boolean = false,
    isSpeaking: Boolean = false,
    modifier: Modifier = Modifier
) {
    val infiniteTransition = rememberInfiniteTransition(label = "mascot")

    val pulseScale by infiniteTransition.animateFloat(
        initialValue = 1.0f,
        targetValue = if (isListening) 1.25f else 1.05f,
        animationSpec = infiniteRepeatable(
            animation = tween(800, easing = LinearEasing),
            repeatMode = RepeatMode.Reverse
        ),
        label = "pulse"
    )

    Box(
        modifier = modifier
            .size(100.dp)
            .scale(if (isListening || isSpeaking) pulseScale else 1.0f),
        contentAlignment = Alignment.Center
    ) {
        // Outer glow pulse ring
        if (isListening) {
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .clip(CircleShape)
                    .background(EmeraldPrimary.copy(alpha = 0.2f))
            )
        }

        // Robot Head
        Column(
            modifier = Modifier
                .size(76.dp)
                .clip(RoundedCornerShape(24.dp))
                .background(Color.White)
                .border(2.dp, EmeraldPrimary, RoundedCornerShape(24.dp))
                .padding(8.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.SpaceBetween
        ) {
            // Top Antenna
            Box(
                modifier = Modifier
                    .size(8.dp)
                    .clip(CircleShape)
                    .background(if (isListening) Color(0xFFEF4444) else EmeraldPrimary)
            )

            // Robot Eyes
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceEvenly
            ) {
                Box(
                    modifier = Modifier
                        .size(10.dp)
                        .clip(CircleShape)
                        .background(EmeraldPrimary)
                )
                Box(
                    modifier = Modifier
                        .size(10.dp)
                        .clip(CircleShape)
                        .background(EmeraldPrimary)
                )
            }

            // Robot Mouth
            if (isSpeaking) {
                Row(
                    horizontalArrangement = Arrangement.spacedBy(2.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Box(modifier = Modifier.size(3.dp, 8.dp).background(EmeraldPrimary, CircleShape))
                    Box(modifier = Modifier.size(3.dp, 12.dp).background(EmeraldPrimary, CircleShape))
                    Box(modifier = Modifier.size(3.dp, 6.dp).background(EmeraldPrimary, CircleShape))
                }
            } else {
                Box(
                    modifier = Modifier
                        .width(20.dp)
                        .height(3.dp)
                        .background(EmeraldPrimary, RoundedCornerShape(2.dp))
                )
            }
        }
    }
}

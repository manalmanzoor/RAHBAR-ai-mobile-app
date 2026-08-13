package com.rahbar.app.data

data class IescoFeederSchedule(
    val feederName: String,
    val division: String,
    val scheduledSlots: List<String>,
    val category: String
)

object IescoScheduleData {
    val feederSchedules = listOf(
        IescoFeederSchedule(
            feederName = "Soan Garden Feeder",
            division = "Islamabad Suburban",
            scheduledSlots = listOf("06:00 PM - 09:00 PM"),
            category = "Residential Category A"
        ),
        IescoFeederSchedule(
            feederName = "G-9 Substation Feeder",
            division = "Islamabad City",
            scheduledSlots = listOf("02:00 PM - 04:00 PM"),
            category = "Urban Residential"
        ),
        IescoFeederSchedule(
            feederName = "Kuri Road Feeder",
            division = "Islamabad East",
            scheduledSlots = listOf("05:00 PM - 07:00 PM"),
            category = "Suburban Mixed"
        )
    )
}

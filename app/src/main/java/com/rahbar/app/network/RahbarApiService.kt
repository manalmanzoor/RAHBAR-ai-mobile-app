package com.rahbar.app.network

import com.rahbar.app.model.MemoryContext
import com.rahbar.app.model.PredictionResponse
import com.rahbar.app.model.ChatMessage
import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.POST

data class PredictRequest(
    val street: String,
    val weatherTemp: Int = 40,
    val recentPings: List<Map<String, Any>> = emptyList()
)

data class ChatRequest(
    val message: String,
    val history: List<ChatMessage> = emptyList(),
    val memoryContext: MemoryContext? = null,
    val street: String = "Street 12, Soan Garden"
)

data class ChatResponse(
    val textUr: String,
    val textEn: String,
    val spokenRomanUrdu: String,
    val hasPrediction: Boolean = false,
    val timeRange: String? = null,
    val probability: String? = null
)

interface RahbarApiService {

    @POST("/api/predict")
    suspend fun getPredict(@Body request: PredictRequest): Response<PredictionResponse>

    @POST("/api/chat")
    suspend fun sendChat(@Body request: ChatRequest): Response<ChatResponse>
}

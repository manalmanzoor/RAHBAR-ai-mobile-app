package com.rahbar.app.data

import android.content.Context
import com.google.gson.Gson
import com.google.gson.reflect.TypeToken
import com.rahbar.app.model.MemoryContext

class MemoryRepository(context: Context) {

    private val prefs = context.getSharedPreferences("rahbar_memory_prefs", Context.MODE_PRIVATE)
    private val gson = Gson()

    fun getMemory(): MemoryContext {
        val name = prefs.getString("user_name", "Manal Manzoor") ?: "Manal Manzoor"
        val street = prefs.getString("detected_street", "Street 12, Soan Garden") ?: "Street 12, Soan Garden"
        
        val qJson = prefs.getString("recent_questions", "[]") ?: "[]"
        val qType = object : TypeToken<List<String>>() {}.type
        val questions: List<String> = try { gson.fromJson(qJson, qType) } catch (e: Exception) { emptyList() }

        val pJson = prefs.getString("recent_predictions", "[]") ?: "[]"
        val pType = object : TypeToken<List<String>>() {}.type
        val predictions: List<String> = try { gson.fromJson(pJson, pType) } catch (e: Exception) { emptyList() }

        return MemoryContext(
            userName = name,
            detectedStreet = street,
            recentQuestions = questions,
            recentPredictions = predictions
        )
    }

    fun updateStreet(newStreet: String) {
        prefs.edit().putString("detected_street", newStreet).apply()
    }

    fun addQuestion(question: String) {
        val current = getMemory()
        val updated = (listOf(question) + current.recentQuestions).distinct().take(5)
        prefs.edit().putString("recent_questions", gson.toJson(updated)).apply()
    }

    fun clearMemory() {
        prefs.edit().clear().apply()
    }
}

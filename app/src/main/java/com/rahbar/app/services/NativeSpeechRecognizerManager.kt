package com.rahbar.app.services

import android.content.Context
import android.content.Intent
import android.os.Bundle
import android.speech.RecognitionListener
import android.speech.RecognizerIntent
import android.speech.SpeechRecognizer
import android.util.Log

interface SpeechCallbacks {
    fun onStart()
    fun onRmsChanged(volumeDb: Float) // 0..100
    fun onPartialResult(text: String)
    fun onFinalResult(text: String)
    fun onError(errorMsg: String, isPermission: Boolean)
    fun onEnd()
}

class NativeSpeechRecognizerManager(private val context: Context) {

    private var speechRecognizer: SpeechRecognizer? = null
    private var isListening = false

    fun isSupported(): Boolean {
        return SpeechRecognizer.isRecognitionAvailable(context)
    }

    fun startListening(callbacks: SpeechCallbacks) {
        stopListening()

        if (!isSupported()) {
            callbacks.onError("Speech recognition is not supported on this device.", false)
            callbacks.onEnd()
            return
        }

        try {
            speechRecognizer = SpeechRecognizer.createSpeechRecognizer(context).apply {
                setRecognitionListener(object : RecognitionListener {
                    override fun onReadyForSpeech(params: Bundle?) {
                        Log.d("SpeechRecognizer", "onReadyForSpeech")
                        callbacks.onStart()
                        isListening = true
                    }

                    override fun onBeginningOfSpeech() {
                        Log.d("SpeechRecognizer", "onBeginningOfSpeech")
                    }

                    override fun onRmsChanged(rmsdB: Float) {
                        // Normalize rmsdB (typically -2..12) to 0..100
                        val normalized = ((rmsdB + 2f) / 14f * 100f).coerceIn(0f, 100f)
                        callbacks.onRmsChanged(normalized)
                    }

                    override fun onBufferReceived(buffer: ByteArray?) {}

                    override fun onEndOfSpeech() {
                        Log.d("SpeechRecognizer", "onEndOfSpeech")
                        isListening = false
                    }

                    override fun onError(error: Int) {
                        isListening = false
                        val (msg, isPerm) = mapErrorCode(error)
                        Log.w("SpeechRecognizer", "onError: $error -> $msg")
                        callbacks.onError(msg, isPerm)
                        callbacks.onEnd()
                    }

                    override fun onResults(results: Bundle?) {
                        isListening = false
                        val matches = results?.getStringArrayList(SpeechRecognizer.RESULTS_RECOGNITION)
                        val text = matches?.firstOrNull() ?: ""
                        if (text.isNotBlank()) {
                            callbacks.onFinalResult(text)
                        } else {
                            callbacks.onError("سنائی نہیں دیا، دوبارہ بولیں / Didn't catch that, please try again.", false)
                        }
                        callbacks.onEnd()
                    }

                    override fun onPartialResults(partialResults: Bundle?) {
                        val matches = partialResults?.getStringArrayList(SpeechRecognizer.RESULTS_RECOGNITION)
                        val text = matches?.firstOrNull() ?: ""
                        if (text.isNotBlank()) {
                            callbacks.onPartialResult(text)
                        }
                    }

                    override fun onEvent(eventType: Int, params: Bundle?) {}
                })
            }

            val intent = Intent(RecognizerIntent.ACTION_RECOGNIZE_SPEECH).apply {
                putExtra(RecognizerIntent.EXTRA_LANGUAGE_MODEL, RecognizerIntent.LANGUAGE_MODEL_FREE_FORM)
                putExtra(RecognizerIntent.EXTRA_LANGUAGE, "ur-PK")
                putExtra(RecognizerIntent.EXTRA_LANGUAGE_PREFERENCE, "ur-PK")
                putExtra(RecognizerIntent.EXTRA_ONLY_RETURN_LANGUAGE_PREFERENCE, false)
                putExtra(RecognizerIntent.EXTRA_PARTIAL_RESULTS, true)
                putExtra(RecognizerIntent.EXTRA_MAX_RESULTS, 3)
            }

            speechRecognizer?.startListening(intent)

        } catch (e: Exception) {
            Log.e("SpeechRecognizer", "Failed to start listening", e)
            callbacks.onError("Could not initialize native speech engine: ${e.localizedMessage}", false)
            callbacks.onEnd()
        }
    }

    fun stopListening() {
        if (isListening || speechRecognizer != null) {
            try {
                speechRecognizer?.stopListening()
                speechRecognizer?.destroy()
            } catch (e: Exception) {
                Log.w("SpeechRecognizer", "Error destroying speech recognizer", e)
            }
            speechRecognizer = null
            isListening = false
        }
    }

    private fun mapErrorCode(error: Int): Pair<String, Boolean> {
        return when (error) {
            SpeechRecognizer.ERROR_INSUFFICIENT_PERMISSIONS ->
                Pair("Microphone permission denied by Android system.", true)
            SpeechRecognizer.ERROR_AUDIO ->
                Pair("Audio recording error. Check microphone hardware.", false)
            SpeechRecognizer.ERROR_NO_MATCH ->
                Pair("سنائی نہیں دیا، دوبارہ بولیں / Didn't catch any voice, please try again.", false)
            SpeechRecognizer.ERROR_SPEECH_TIMEOUT ->
                Pair("Speech timeout. Tap mic to speak again.", false)
            SpeechRecognizer.ERROR_NETWORK, SpeechRecognizer.ERROR_NETWORK_TIMEOUT ->
                Pair("Network connection required for voice recognition.", false)
            else ->
                Pair("Speech recognition error ($error). Please try again or type.", false)
        }
    }
}

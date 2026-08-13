package com.rahbar.app.services

import android.content.Context
import android.speech.tts.TextToSpeech
import android.speech.tts.UtteranceProgressListener
import android.util.Log
import java.util.Locale

class NativeTextToSpeechManager(context: Context) : TextToSpeech.OnInitListener {

    private var tts: TextToSpeech? = TextToSpeech(context.applicationContext, this)
    private var isInitialized = false

    override fun onInit(status: Int) {
        if (status == TextToSpeech.SUCCESS) {
            val resultUr = tts?.setLanguage(Locale("ur", "PK"))
            if (resultUr == TextToSpeech.LANG_MISSING_DATA || resultUr == TextToSpeech.LANG_NOT_SUPPORTED) {
                // Fallback to Hindi / English which provides clear phonetics for Roman Urdu
                val resultHi = tts?.setLanguage(Locale("hi", "IN"))
                if (resultHi == TextToSpeech.LANG_MISSING_DATA || resultHi == TextToSpeech.LANG_NOT_SUPPORTED) {
                    tts?.setLanguage(Locale.US)
                }
            }
            isInitialized = true
            Log.d("TTS", "Native TextToSpeech engine initialized successfully")
        } else {
            Log.e("TTS", "Native TextToSpeech initialization failed with status $status")
        }
    }

    fun speak(
        text: String,
        onStart: (() -> Unit)? = null,
        onDone: (() -> Unit)? = null,
        onError: (() -> Unit)? = null
    ) {
        if (!isInitialized || tts == null) {
            Log.w("TTS", "TTS not initialized yet")
            onError?.invoke()
            return
        }

        stop()

        val utteranceId = "rahbar_tts_" + System.currentTimeMillis()
        tts?.setOnUtteranceProgressListener(object : UtteranceProgressListener() {
            override fun onStart(uttId: String?) {
                onStart?.invoke()
            }

            override fun onDone(uttId: String?) {
                onDone?.invoke()
            }

            @Deprecated("Deprecated in Java")
            override fun onError(uttId: String?) {
                onError?.invoke()
            }
        })

        val params = android.os.Bundle()
        tts?.speak(text, TextToSpeech.QUEUE_FLUSH, params, utteranceId)
    }

    fun stop() {
        if (tts?.isSpeaking == true) {
            tts?.stop()
        }
    }

    fun shutdown() {
        stop()
        tts?.shutdown()
        tts = null
    }
}

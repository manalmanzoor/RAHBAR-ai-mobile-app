package com.rahbar.app

import android.app.Application
import android.util.Log

class RahbarApplication : Application() {
    override fun onCreate() {
        super.onCreate()
        Log.d("RahbarApplication", "Rahbar Native Android Application Started")
    }
}

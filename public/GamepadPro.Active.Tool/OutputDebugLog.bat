pushd %~dp0
@echo off
setlocal EnableDelayedExpansion

set PATH=%PATH%;C:\Windows\System32

adb shell touch /data/local/tmp/.chaozhuousetestserver

start "logcat-win" /min cmd /c "adb logcat -c & adb logcat > debug.log"

adb shell sh /sdcard/.chaozhuo.gameassistant2/inject.sh

pause
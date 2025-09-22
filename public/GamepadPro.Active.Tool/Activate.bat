pushd %~dp0
@echo off
setlocal EnableDelayedExpansion

set adb_port=5555
set msgTitle="ActiveTool (https://dysquard.github.io/pgpa/)"

set PATH=%PATH%;C:\Windows\System32

if exist "adb.exe" (
	echo "success"
) else (
	goto step3_1
)

adb kill-server
choice /c yn /t 1 /d y /n >nul

:step1
for /f "tokens=2" %%i in ('adb devices') do (
  if "%%i"=="unauthorized" goto step1_2
)
adb disconnect
adb root

if %ERRORLEVEL% == 1 goto step1_1
if %ERRORLEVEL% == 0 goto step3

:step1_1
echo Wsh.Echo MsgBox("Phone not found" + vbCrLf + "1. Make sure your phone's USB Debugging is on;   " + vbCrLf + "2. Reconnect your phone to PC via USB cable;" + vbCrLf + "3. Click Retry;" + vbCrLf + "4. If still fails, install the corresponding USB Driver of your phone from its official website.",vbRetryCancel,%msgTitle%) >tmp.vbs
for /f %%i in ('cscript tmp.vbs //nologo //e:vbscript') do (set "ret=%%i")
del /q tmp.vbs

echo %ret%
if %ret%==4 goto step1
if %ret%==2 exit

:step1_2
echo Wsh.Echo MsgBox("Tap OK button on your phone's popup window and click retry." + vbCrLf + "If popup not shown, click Cancel and run me again.",vbRetryCancel,%msgTitle%) >tmp.vbs
for /f %%i in ('cscript tmp.vbs //nologo //e:vbscript') do (set "ret=%%i")
del /q tmp.vbs

echo %ret%
if %ret%==4 goto step1
if %ret%==2 exit

:step3
set "ret=0"
adb shell mkdir /data/local/tmp/2
adb push .\scripts\. /data/local/tmp/2/
adb shell sh /data/local/tmp/2/inject2.sh

choice /c yn /t 3 /d y /n >nul

echo Wsh.Echo MsgBox("Activation completed, please launch APP 'Panda Gamepad Pro' or 'Panda Mouse Pro' on your phone and check if activated." + vbCrLf + "If activation fails after unplugging, please run ActivateWifi.bat.",vbOKOnly,%msgTitle%) >tmp.vbs
for /f %%i in ('cscript tmp.vbs //nologo //e:vbscript') do (set "ret=%%i")
del /q tmp.vbs

echo %ret%
exit

:step3_1
echo Wsh.Echo MsgBox("Please extract before run." + vbCrLf + "Right click the .zip or .rar file and select Extract Here then run it from the folder you extracted.",vbOKOnly,%msgTitle%) >tmp.vbs
for /f %%i in ('cscript tmp.vbs //nologo //e:vbscript') do (set "ret=%%i")
del /q tmp.vbs

echo %ret%
exit
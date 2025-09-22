pushd %~dp0
@echo off
setlocal EnableDelayedExpansion

set adb_port=5555
set msgTitle="ActiveTool (https://dysquard.github.io/pgpa/)"

set PATH=%PATH%;C:\Windows\System32

if exist "adb.exe" (
	echo "success"
) else (
	goto step5_1
)

:step1
adb kill-server
choice /c yn /t 1 /d y /n >nul
adb devices
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

// check phone and ps at same wlan
:step3
adb disconnect >nul
for /f "tokens=2 delims= " %%i in ('adb shell ip addr^| findstr "wlan0"^| findstr "inet"') do (set ipport=%%i)
if "%ipport%" == "" goto step3_1

echo %ipport%

for /f "tokens=1 delims=/" %%i in ("%ipport%") do (set phone_ip=%%i)
echo phone_ip: %phone_ip%

for /f "tokens=4" %%a in ('route print^|findstr 0.0.0.0.*0.0.0.0') do (
 set pc_ip=%%a
)
if "%pc_ip%" == "" goto step3_1
echo pc_ip: %pc_ip%

for /f "delims=. tokens=3" %%i in ("%phone_ip%") do (
 set phone_ip3=%%i
)

for /f "delims=. tokens=3" %%j in ("%pc_ip%") do (
 set pc_ip3=%%j
)

echo phone_ip3: %phone_ip3%
echo pc_ip3: %pc_ip3%

if "%phone_ip3%" == "%pc_ip3%" (
  echo "OK"
) else (
  goto step3_1
)

set sn=""
for /f %%i in ('adb get-serialno') do ( set sn=%%i )
echo sn: %sn%
if %sn%=="" goto step3_1

adb tcpip %adb_port%

adb connect %phone_ip%

choice /c yn /t 3 /d y /n >nul

set /a ret=1
for /f "tokens=1" %%i in ('adb devices') do (
	echo %%i | findstr %phone_ip% >nul
	if !errorlevel! equ 0 (set /a ret=0)
)
if %ret%==0 goto step4
if %ret%==1 goto step3_1

:step3_1
echo Wsh.Echo MsgBox("Failed, please ensure WIFI on your phone is connected and in the same LAN(local network) with your PC.",vbRetryCancel,%msgTitle%) >tmp.vbs
for /f %%i in ('cscript tmp.vbs //nologo //e:vbscript') do (set "ret=%%i")
del /q tmp.vbs
if %ret%==4 goto step3
if %ret%==2 exit

:step4
for /f "tokens=1" %%i in ('adb devices') do (
  if %%i==%sn% goto step4_1
)

adb -s %phone_ip%:%adb_port% shell mkdir /data/local/tmp/2
adb -s %phone_ip%:%adb_port% push .\scripts\. /data/local/tmp/2/
adb -s %phone_ip%:%adb_port% shell sh /data/local/tmp/2/inject2.sh

choice /c yn /t 3 /d y /n >nul

echo Wsh.Echo MsgBox("Activation completed, please launch APP 'Panda Gamepad Pro' on your phone and check if activated." + vbCrLf + "If activation fails, try to turn on/off USB Debugging, unplug/plug phone and try again.",vbOKOnly,%msgTitle%) >tmp.vbs
for /f %%i in ('cscript tmp.vbs //nologo //e:vbscript') do (set "ret=%%i")
del /q tmp.vbs

echo %ret%
exit

:step4_1
echo Wsh.Echo MsgBox("Now, please unplug your phone from PC and click Retry to continue activation.",vbRetryCancel,%msgTitle%) >tmp.vbs
for /f %%i in ('cscript tmp.vbs //nologo //e:vbscript') do (set "ret=%%i")
del /q tmp.vbs
if %ret%==4 goto step4
if %ret%==2 exit

:step5_1
echo Wsh.Echo MsgBox("Please extract before run." + vbCrLf + "Right click the .zip or .rar file and select Extract Here then run it from the folder you extracted.",vbOKOnly,%msgTitle%) >tmp.vbs
for /f %%i in ('cscript tmp.vbs //nologo //e:vbscript') do (set "ret=%%i")
del /q tmp.vbs

echo %ret%
exit
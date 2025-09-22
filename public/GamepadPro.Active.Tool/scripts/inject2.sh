#!/system/bin/sh
SDK=$(echo $(getprop ro.build.version.sdk))
echo $SDK
O=26

if [ $SDK -lt $O ]; then
    PS_ARGS=""
else
    PS_ARGS="-A"
fi

set a=`ps $PS_ARGS | grep com.android.adnap:daemon`;
if [ $2 ]; then
    echo '1'
    kill $2
    kill -9 $2
fi

TMP_PATH=/data/local/tmp/2

CONFIG_INI=config.ini
DAEMON_DEX=daemon.dex
INJECT_DEX=inject.dex

export a=`cat $TMP_PATH/$CONFIG_INI`;
echo $a
arr=(${a//,/ })
for data in ${arr[@]}
do
    set a=`ps $PS_ARGS | grep $data:i`;
    if [ $2 ]; then
        echo '2'
        kill $2
        kill -9 $2
    fi
done

sleep 1

chmod -R 777 $TMP_PATH

if [ -f /system/bin/app_process32 ]; then
    APP_PROCESS="app_process32"
else
    APP_PROCESS="app_process"
fi

for data in ${arr[@]}
do
    if [ -e $TMP_PATH/$data$INJECT_DEX ]; then
        (nohup $APP_PROCESS -Djava.class.path=$TMP_PATH/$data$INJECT_DEX $TMP_PATH/ com.chaozhuo.gameassistant.inject.InjectService > /dev/null 2>&1 &)
    fi
done

(nohup $APP_PROCESS -Djava.class.path=$TMP_PATH/$DAEMON_DEX $TMP_PATH/ com.chaozhuo.gameassistant.daemon.DaemonService > /dev/null 2>&1 &)

sleep 2

SUCCESS=0
for data in ${arr[@]}
do
    set a=`ps $PS_ARGS | grep $data:i`;
    if [ $2 ]; then
    SUCCESS=1
    fi
done

if [ $SUCCESS -eq 0 ]; then
    APP_PROCESS="app_process"
    for data in ${arr[@]}
    do
        if [ -e $TMP_PATH/$data$INJECT_DEX ]; then
            (nohup $APP_PROCESS -Djava.class.path=$TMP_PATH/$data$INJECT_DEX $TMP_PATH/ com.chaozhuo.gameassistant.inject.InjectService > /dev/null 2>&1 &)
        fi
    done

    (nohup $APP_PROCESS -Djava.class.path=$TMP_PATH/$DAEMON_DEX $TMP_PATH/ com.chaozhuo.gameassistant.daemon.DaemonService > /dev/null 2>&1 &)
fi
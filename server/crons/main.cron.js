/* Cron tasks for daemons , crate by Rost */

const cron        = require('node-cron');
const fork        = require('child_process').fork;
const path        = require('path');

const config      = require('../../config');

let ACCOUNTS_PROCESS = 0;
let ACCOUNTS_STAT_PROCESS = 0;
let GLOBAL_STAT_PROCESS = 0;
let NEW_GLOBAL_STAT_PROCESS = 0;
let PRODUCERS_PROCESS = 0;

module.exports = () => {
        
        cron.schedule('*/10 * * * *', () => {
            if (ACCOUNTS_PROCESS === 0){
              console.log('====== running daemon analytics account 1');
              startAccountsDaemon();
            }
        });
        
        //cron.schedule('*/1 * * * *', () => {
        /*   if (ACCOUNTS_STAT_PROCESS === 0){
              console.log('====== global stat daemon');
              startGlobalStatAnalytics();
            }
        });*/

        cron.schedule('*/1 * * * *', () => {
           if (ACCOUNTS_STAT_PROCESS === 0){
              console.log('====== new global stat daemon');
              newStartGlobalStatAnalytics();
            }
        });

        cron.schedule('0 0 0 * * *', () => {
            if (GLOBAL_STAT_PROCESS === 0){
              console.log('running account analytics daemon 2');
              startAccountsAnalytics();
            }
        });

        cron.schedule('0 0 0 * * *', () => {
            if (PRODUCERS_PROCESS === 0){
              console.log('running PRODUCERS PROCESS 2');
              startAccountsAnalytics();
            }
        });

        startAccountsDaemon();
        newStartGlobalStatAnalytics();
        //startGlobalStatAnalytics();
        startProducersInfoDaemon();
        if (config.TPS_ENABLE){
            startTPSdaemon();
        }
        //startAccountsAnalytics();
}

function startTPSdaemon(){
        let forkProcess = fork(path.join(__dirname, '../daemons/max.tps.daemon.js'));
        forkProcess.on('close', () => {
              console.log('\x1b[33m%s\x1b[0m', '====== Process TPS close Error');
              startTPSdaemon();
        });
}

function startProducersInfoDaemon(){
        PRODUCERS_PROCESS += 1;
        let forkProcess = fork(path.join(__dirname, '../daemons/producers.daemon.js'));
        forkProcess.on('close', res => {
              console.log('\x1b[36m%s\x1b[0m', '====== Process stat PRODUCERS daemon end');
              PRODUCERS_PROCESS = 0;
        });
}

function startAccountsDaemon(){
        ACCOUNTS_PROCESS += 1;
        let forkProcess = fork(path.join(__dirname, '../daemons/accounts.stat.daemon.js'));
        forkProcess.on('close', res => {
              console.log('\x1b[36m%s\x1b[0m', '====== Process stat ACCOUNTS daemon end');
              ACCOUNTS_PROCESS = 0;
        });
}

function startAccountsAnalytics(){
        ACCOUNTS_STAT_PROCESS += 1;
        let forkProcess = fork(path.join(__dirname, '../daemons/accounts.analytics.daemon.js'));
        forkProcess.on('close', res => {
              console.log('\x1b[36m%s\x1b[0m' ,'====== Process ANALYTICS daemon end');
              ACCOUNTS_STAT_PROCESS = 0;
        });
}

function newStartGlobalStatAnalytics(){
        NEW_GLOBAL_STAT_PROCESS += 1;
        let forkProcess = fork(path.join(__dirname, '../daemons/new.global.analytics.daemon.js'));
        forkProcess.on('close', res => {
              console.log('\x1b[36m%s\x1b[0m', '====== Process NEW GLOBAL STAT daemon end');
              NEW_GLOBAL_STAT_PROCESS = 0;
        });
}

/*function startGlobalStatAnalytics(){
        GLOBAL_STAT_PROCESS += 1;
        let forkProcess = fork(path.join(__dirname, '../daemons/global.analytics.daemon.js'));
        forkProcess.on('close', res => {
              console.log('\x1b[36m%s\x1b[0m', '====== Process GLOBAL STAT daemon end');
              GLOBAL_STAT_PROCESS = 0;
        });
}*/

var ws = null;
var توقعاتسابقة = [];
var currentIndex = 0;
var انتظارالجولات = [];

function openWebSocket() {
    var url = 'wss://eg1xbet.com/games-frame/sockets/crash?whence=110&fcountry=66&ref=1&gr=0&appGuid=00000000-0000-0000-0000-000000000000&lng=en';
    ws = new WebSocket(url);
    ws.onopen = function() {
        console.log('WebSocket opened');
        ws.send('{"protocol":"json","version":1}\x1e');
        ws.send('{"arguments":[{"activity":30,"currency":119}],"invocationId":"0","target":"Guest","type":1}\x1e');
    };
    ws.onclose = function() {
        console.log('WebSocket closed');
        ws = null;
    };
    ws.onmessage = function(event) {
        var data = JSON.parse(event.data.slice(0, -1));
        if (data.target === 'OnCrash') {
            انتظارالجولات.push(data.arguments[0].f);
            document.getElementById('loadingSpinner').style.display = 'none';
            عرضالتوقعالتالي();
        }
    };
    ws.onerror = function(event) {
        console.error('WebSocket error:', event);
    };
}

function عرضالتوقعالتالي() {
    if (انتظارالجولات.length > 1) {
        توقعاتسابقة.push(انتظارالجولات.shift());
        var crashValueElement = document.getElementById('crashValue');
        crashValueElement.innerText = توقعاتسابقة[توقعاتسابقة.length - 1];
        currentIndex++;
    } else {
        document.getElementById('crashValue').innerText = 'انتظار...';
    }
}

function resetGame() {
    currentIndex = 0;
    توقعاتسابقة = [];
    انتظارالجولات = [];
    document.getElementById('crashValue').innerText = '0.00';
    document.getElementById('loadingSpinner').style.display = 'block';
}

openWebSocket();

document.getElementById('loadingSpinner').style.display = 'block';

document.getElementById('showButton').addEventListener('click', function() {
    عرضالتوقعالتالي();
});

document.getElementById('resetButton').addEventListener('click', function() {
    resetGame();
});
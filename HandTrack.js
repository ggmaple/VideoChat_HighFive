const myVideo = document.getElementById("my-video");
const theirVideo = document.getElementById("their-video");
const myCanvas = document.getElementById("my-canvas");
const my_ctx = myCanvas.getContext("2d");
const theirCanvas = document.getElementById("their-canvas");
const their_ctx = theirCanvas.getContext("2d");
const HighFive_mode = document.getElementById("HighFive-mode");

const options = {
    flipHorizontal: false, // 水平方向の反転
    maxNumBoxes: 1, // 検出するボックスの最大数
    scoreThreshold: 0.65 // 予測信頼度のしきい値
};

let state = false;
let model;  // 繰り返し利用するために読み込んだ機械学習モデルを格納しておく
const hand = new Image();
hand.src = "hand_right.png";  // 画像指定

HighFive_mode.addEventListener("click", HighFiveMode);

// my_ctx.font = "18pt Arial";
// my_ctx.fillText("モデル読込中...", 50, 50);

handTrack.load(options).then(function(model_data) {
    model = model_data;
});

// 「手」の検出と結果の出力を繰り返し実行する
function startDetection() {
    //自カメラの手を検出し、相手カメラ映像に画像を反映
    // model.detect(myVideo).then(predictions => {
    //     HandPrediction(predictions, their_ctx, theirVideo);
    //     if (state) requestAnimationFrame(startDetection);
    // });
    //　同時に２つトラッキングすると重くなる

    //相手カメラの手を検出し、自カメラ映像に画像を反映
    model.detect(theirVideo).then(predictions => {
        HandPrediction(predictions, my_ctx, myVideo);
        if (state) requestAnimationFrame(startDetection);
    });
}

// 停止ボタンが押された時にリアルタイム検出の処理を中断する
function HighFiveMode() {
    if(state){
        state = false;
        HighFive_mode.innerText = "ハイタッチモードをオンにする";
    }else{
        state = true;
        HighFive_mode.innerText = "ハイタッチモードをオフにする";
        // requestAnimationFrame(startDetection);
        startDetection();
    }
}

function HandPrediction(predictions, ctx, video){
    const width = 400;
    const height = 300;
    ctx.clearRect(0, 0, width, height); //キャンバス内クリア

    //カメラ映像描画
    ctx.drawImage(video, 0, 0, width, height);

    predictions.forEach(prediction => {   
        // 手の座標、サイズ取得
        const x = prediction.bbox[0];
        const y = prediction.bbox[1];
        const handWidth = prediction.bbox[2];
        const handHeight = prediction.bbox[3];
        // 手の画像を表示
        ctx.drawImage(hand, x, y, handWidth, handHeight);
       
      });
}
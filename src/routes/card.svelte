<script>
    let rotation = -15;
    let Y = 0;
    let answer = "";

    function handleMouseMove(event) {
        const screenHeight = window.innerHeight;
        const screenWidth = window.innerWidth;
        const mouseX = event.clientX;
        const mouseY = event.clientY;

        const percentageX = 100 - (mouseX / screenWidth) * 100;
        Y = (mouseY / screenHeight)*100 -50;

        rotation = (percentageX - 50) / 4;

        answer = percentageX > 50 ? "I am too lazy..." : "It's me, sir!";
    }
</script>

<div class="card" id="cardShadow"></div>
<div class="card" id="cardframe" style="transform: translate({-50 - rotation*2}%, {Y}px) rotate({-rotation}deg);">
    <div id="goggins"></div>
    <div id="answerOverlay" style="transform: translate(-25%, -{100-(Math.abs(rotation*3))}%) rotate({rotation}deg);">
        <span id="answer" style="transform: translate({-50}%, 0);">{answer}</span>
    </div>
</div>
<div id="window" on:mousemove={handleMouseMove}></div>

<style>
    #window{
        position: fixed;
        width: 100vw;
        height: 100vh;
        top: 0;
        left: 0;
    }

    .card {
        position: fixed;
        height: 50vh;
        width: 50vh;
        border-radius: 3vh;
        left: 50%;
        bottom: 15%;
        transform: translate(-50%, 0);
        transition: 50ms;
    }

    #cardShadow{
        background: #131313;
    }

    #cardframe{
        position: fixed;
        overflow: hidden;

    }

    #goggins{
        position: absolute;
        height: 100%;
        width: 100%;
        background: url("https://www.babelio.com/users/AVT_David-Goggins_4998.jpg");
        background-size: cover;
    }

    #answerOverlay{
        position: absolute;
        height: 100%;
        width: 200%;
        top: 0;
        left: 0;
        background: #00000050;
        transition: 50ms;
        text-align: center;
    }

    span{
        position: absolute;
        bottom: 10%;
        left: 50%;
        font-size: 1.5rem;
    }
</style>
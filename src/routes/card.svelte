<script>
    let answer = "";
    let isAnimating = false;

    // cardframe
    let initialRotation = 0;
    let rotation = 0;
    let targetTranslateX = 0;
    let targetTranslateY = 0;
    let currentTranslateX = 0;
    let currentTranslateY = 0;
    let initialTranslateX = 0;
    let initialTranslateY = 0;

    // animation
    const duration = 400;
    let startTime;

    function easeInBack(t) {
        let jump = (-initialTranslateY + 50) * 0.02;
        return t * ((jump + 1) * t - jump);
    }

    function animate(timestamp) {
        if (!startTime) startTime = timestamp;

        const elapsed = timestamp - startTime;
        const progress = Math.min(elapsed / duration, 1);

        rotation = initialRotation + (initialRotation*10 - initialRotation) * progress;
        currentTranslateX = initialTranslateX + (targetTranslateX - initialTranslateX) * progress;
        currentTranslateY = initialTranslateY + (targetTranslateY - initialTranslateY) * easeInBack(progress);

        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            startTime = null;
        }
    }

    function handleMouseMove(event) {
        if(isAnimating) return;
        const screenHeight = window.innerHeight;
        const screenWidth = window.innerWidth;
        const mouseX = event.clientX;
        const mouseY = event.clientY;

        const percentageX = 1 - (mouseX / screenWidth);

        currentTranslateX = -50 - rotation*2;
        currentTranslateY = (mouseY / screenHeight)*100 -50;
        rotation = lerp(-50, 50, percentageX) / 3.5;

        answer = percentageX > 0.5 ? "I am too lazy..." : "It's me, sir!";
    }

    function click(event){
        if(isAnimating) return;
        const screenWidth = window.innerWidth;
        const mouseX = event.clientX;
        const percentageX = 1 - (mouseX / screenWidth);

        percentageX > 0.5 ? swapLeft() : swapRight()
    }

    function swapLeft(){
        isAnimating = true;
        initialRotation = rotation;
        initialTranslateX = currentTranslateX;
        initialTranslateY = currentTranslateY;
        targetTranslateX = -50 + ((currentTranslateX + 50) * 8);
        console.log(currentTranslateY);
        targetTranslateY = 600;
        requestAnimationFrame(animate);
        isAnimating = false
    }

    function swapRight(){
        isAnimating = true;
        initialRotation = rotation;
        initialTranslateX = currentTranslateX;
        initialTranslateY = currentTranslateY;
        targetTranslateX = -50 + ((currentTranslateX + 50) * 8) ;
        console.log(currentTranslateX);
        targetTranslateY = 600;
        requestAnimationFrame(animate);
        isAnimating = false;
    }

    function easeInOut(t) {
        return t * t * t * (6 * t * t - 15 * t + 10);
    }

    function lerp(a, b, t) {
        return a + easeInOut(t) * (b - a);
    }

</script>

<div class="card" id="cardShadow"></div>
<div class="card" id="cardframe" style="transform: translate({currentTranslateX}%, {currentTranslateY}px) rotate({-rotation}deg);">
    <div id="goggins"></div>
    <div id="answerOverlay" style="transform: translate(-25%, {-100+(Math.abs(rotation*3))}%) rotate({rotation}deg);">
        <span id="answer" style="transform: translate({-50}%, 0);">{answer}</span>
    </div>
</div>
<div id="window" role="presentation" on:mousemove={handleMouseMove} on:click={click}></div>

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
<script>
    import {isQuestionVisible, lightMode, questionIndex, loginOn} from './helpers.js';
    import { onMount } from 'svelte';
    export let data;

    let answer = "";
    let actualQuestionIndex = 1;
    const total = data.props.cards.length;
    let isAnimating = false;
    let isVisible = true;
    let mouseX;
    let mouseY;

    // cardframe
    let initialRotation = 0;
    let rotation = 0;
    let Yrotation = 0;
    let Xrotation = 0;
    let targetTranslateX = 0;
    let targetTranslateY = 0;
    let targetRotation = 0;
    let currentTranslateX = -45;
    let currentTranslateY = 10;
    let initialTranslateX = 0;
    let initialTranslateY = 0;

    // animation
    const duration = 400;
    let startTime;

    onMount(() => {
        document.body.addEventListener('mousemove', handleMouseMove);
        document.body.addEventListener('click', click);
    });

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
            nextCard();
            isVisible = false;
            resetCardPos();
            requestAnimationFrame(newCard)
        }
    }

    function resetCardPos() {
        rotation = 0;
        Yrotation = 180;
        currentTranslateX = -50;
        currentTranslateY = 0;
    }

    function newCard(timestamp) {
        isVisible = true;
        if (!startTime) startTime = timestamp;

        const screenHeight = window.innerHeight;
        const screenWidth = window.innerWidth;
        const percentageX = 1 - (mouseX / screenWidth);
        targetRotation = lerp(-50, 50, percentageX) / 3.5;
        targetTranslateX = -50 - targetRotation * 2;
        targetTranslateY = (mouseY / screenHeight)*100 -50;

        const elapsed = timestamp - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const XrotMovement = 60;

        Yrotation = 180 + (easeInOut(progress) * 180)
        if ( progress < 0.5 ){
            initialRotation = targetRotation * easeInOut(progress*2) * -1;
            initialTranslateX =  -50 + 30 * easeInOut(progress*2) * -2;
            initialTranslateY =  50 * easeInOut(progress*2);
            Xrotation = XrotMovement * easeInOut(progress*2);
            rotation = initialRotation
            currentTranslateX =  initialTranslateX;
            currentTranslateY =  initialTranslateY;
        } else {
            let progressSecondPart = (progress - 0.5) * 2
            Xrotation = XrotMovement - XrotMovement * easeInOut(progressSecondPart);
            rotation = initialRotation + (targetRotation - initialRotation) * easeInOut(progressSecondPart);
            currentTranslateX = initialTranslateX + (targetTranslateX - initialTranslateX) * easeInOut(progressSecondPart);
            currentTranslateY = initialTranslateY + (targetTranslateY - initialTranslateY) * easeInOut(progressSecondPart);
        }

        if (progress < 1) {
            requestAnimationFrame(newCard);
        } else {
            startTime = null;
            isAnimating = false
        }
    }

    function handleMouseMove(event) {
        mouseX = event.clientX;
        mouseY = event.clientY;
        if(isAnimating) return;
        const screenHeight = window.innerHeight;
        const screenWidth = window.innerWidth;

        const percentageX = 1 - (mouseX / screenWidth);

        currentTranslateX = -50 - rotation*2;
        currentTranslateY = (mouseY / screenHeight)*100 -50;
        rotation = lerp(-50, 50, percentageX) / 3.5;

        answer = percentageX > 0.5 ? "I don't know" : "I know !";
    }


    function click(event){
        if (event.clientY <= 70) return;
        if(isAnimating) return;
        console.log($loginOn)
        if($loginOn) return;
        isAnimating = true;

        const screenWidth = window.innerWidth;
        const mouseX = event.clientX;
        const percentageX = 1 - (mouseX / screenWidth);

        initialRotation = rotation;
        initialTranslateX = currentTranslateX;
        initialTranslateY = currentTranslateY;
        targetTranslateX = -50 + ((currentTranslateX + 50) * 8);
        targetTranslateY = 600;

        percentageX > 0.5 ? swapLeft() : swapRight()
        requestAnimationFrame(animate);
    }

    function nextCard(){
        actualQuestionIndex ++ ;
        if ($questionIndex >= data.props.cards.length) return;
        isQuestionVisible.set(false);
        setTimeout(() => {
            questionIndex.set($questionIndex+1);
            isQuestionVisible.set(true);
        }, 300);
    }

    function swapLeft(){
    }

    function swapRight(){
    }

    function easeInOut(t) {
        return 0.5 - Math.cos(t * Math.PI) / 2;
    }

    function lerp(a, b, t) {
        return a + easeInOut(t) * (b - a);
    }

    function easeInBack(t) {
        let jump = (-initialTranslateY + 50) * 0.02;
        return t * ((jump + 1) * t - jump);
    }
</script>

{#if actualQuestionIndex < total}
    <div id="cardDeck" class={$lightMode ? "light-mode card" : "card"}></div>
{/if}

{#if isVisible && actualQuestionIndex <= total }
    <div id="outer-card">
        <div class="card" id="cardframe" style="transform: translate({currentTranslateX}%, {currentTranslateY}px) rotate({-rotation}deg) rotateY({Yrotation}deg) rotateX({Xrotation}deg);">
            <div id="front">
                <div id="goggins"></div>
                <div id="answerOverlay" style="transform: translate(-25%, {-100+(Math.abs(rotation*3))}%) rotate({rotation}deg);">
                    <span id="answer" style="transform: translate({-50}%, 0);">{answer}</span>
                </div>
            </div>
            <div id="back" class={$lightMode ? "light-mode" : ""}>
                <div id="backCard" class={$lightMode ? "light-mode" : ""}></div>
            </div>
        </div>
    </div>
{/if}


<style>
    #outer-card{
        position: fixed;
        top: 0;
        height: 100vh;
        width: 100vw;
        perspective: 500px;
    }

    .card {
        position: fixed;
        height: 50vh;
        width: 50vh;
        border-radius: 3vh;
        left: 50%;
        bottom: 15%;
        transform: translate(-50%, 0);
        transition: 50ms ease-out;
    }

    #front,
    #back {
        position: absolute;
        width: 100%;
        height: 100%;
        backface-visibility: hidden;
    }

    #front{
        transform: rotateY(0deg);
        overflow: hidden;
        border-radius: 3vh;
    }

    #back{
        transform: rotateY(180deg);
        background: #131313;
        background: url("https://www.dmarge.com/wp-content/uploads/2021/08/goggins2-1-1200x800.jpg");
        background-size: cover;
        background-position: center;
        border-radius: 3vh;
    }

    #cardDeck{
        background: #131313;
        background: url("https://www.dmarge.com/wp-content/uploads/2021/08/goggins2-1-1200x800.jpg");
        background-size: cover;
        background-position: center;
    }

    .light-mode#cardDeck,
    #back.light-mode {
        background: #e1e1e1;
    }

    #cardframe{
        transform-style: preserve-3d;
    }

    #goggins{
        height: 100%;
        width: 100%;
        background: url("https://www.babelio.com/users/AVT_David-Goggins_4998.jpg");
        background-size: cover;
        backface-visibility: hidden;
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
        color: #fff;
    }

    span{
        position: absolute;
        bottom: 10%;
        left: 50%;
        font-size: 1.5rem;
    }
</style>
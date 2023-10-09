<script>
    import {isQuestionVisible, lightMode, questionIndex} from './store.js';
    import { onMount, onDestroy } from 'svelte';
    import { createEventDispatcher } from 'svelte';
    export let data;

    const dispatch = createEventDispatcher();
    let answer = "";
    let isAnimating = false;

    // cardframe
    let initialRotation = 0;
    let rotation = 0;
    let targetTranslateX = 0;
    let targetTranslateY = 0;
    let currentTranslateX = -50;
    let currentTranslateY = 0;
    let initialTranslateX = 0;
    let initialTranslateY = 0;

    // animation
    const duration = 400;
    let startTime;

    onMount(() => {
        document.body.addEventListener('mousemove', handleMouseMove);
        document.body.addEventListener('click', click);
    });

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
            nextCard();
            requestAnimationFrame(newCard)
            isAnimating = false
        }
    }


    function newCard(timestamp) {

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

        answer = percentageX > 0.5 ? "I don't know" : "I know !";
    }


    function click(event){
        if (event.clientY <= 70) return;
        if(isAnimating) return;
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
        if ($questionIndex >= data.cards.length) return;
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
        return t * t * t * (6 * t * t - 15 * t + 10);
    }

    function lerp(a, b, t) {
        return a + easeInOut(t) * (b - a);
    }

</script>

<div id="cardDeck" class={$lightMode ? "light-mode card" : "card"}></div>

<div id="outer-card">
    <div class="card" id="cardframe" style="transform: translate({currentTranslateX}%, {currentTranslateY}px) rotate({-rotation}deg);">
        <div id="front">
            <div id="goggins"></div>
            <div id="answerOverlay" style="transform: translate(-25%, {-100+(Math.abs(rotation*3))}%) rotate({rotation}deg);">
                <span id="answer" style="transform: translate({-50}%, 0);">{answer}</span>
            </div>
        </div>
        <div id="back">
            <div id="backCard" class={$lightMode ? "light-mode card" : "card"}></div>
        </div>
    </div>
</div>

<style>

    .card {
        position: fixed;
        height: 50vh;
        width: 50vh;
        border-radius: 3vh;
        left: 50%;
        bottom: 15%;
        transform: translate(-50%, 0);
        transition: 50ms;
        z-index: 9;
    }

    .card:hover{
        transform: rotateY(180deg);
    }

    #cardDeck{
        background: #131313;
    }

    .light-mode#cardDeck {
        background: #e1e1e1;
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
        color: #fff;
    }

    span{
        position: absolute;
        bottom: 10%;
        left: 50%;
        font-size: 1.5rem;
    }
</style>
<script>
    import {isQuestionVisible, lightMode, questionIndex, loginOn, CreateCardFormOn} from './helpers.js';
    import {fade} from 'svelte/transition';
    import {onMount, tick} from 'svelte';
    import Answer from './Answer.svelte';
    import { goto } from '$app/navigation';

    export let data;
    $: deck = data?.deck;
    $: card = deck ? deck[$questionIndex] : null;

    $: total = deck.length;
    let option = "";
    let swap = 1;
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
    let isAnimating = false;
    let isVisible = true;
    let exit = false;

    // theme
    $: facesUrls = data?.theme;
    let faceIndex = 1;
    $: currentBackgroundUrl = facesUrls[faceIndex];

    onMount(() => {
        // preload images
        facesUrls.forEach(url => {
            const img = new Image();
            img.src = url;
        });

        // event listeners
        document.body.addEventListener('mousemove', handleMouseMove);
        document.body.addEventListener('click', click);

        console.log(card);
    });

    // throw card animation
    async function animate(timestamp) {
        if (!startTime) startTime = timestamp;

        const elapsed = timestamp - startTime;
        const progress = Math.min(elapsed / duration, 1);

        rotation = initialRotation + (initialRotation * 10 - initialRotation) * progress;
        currentTranslateX = initialTranslateX + (targetTranslateX - initialTranslateX) * progress;
        currentTranslateY = initialTranslateY + (targetTranslateY - initialTranslateY) * easeInBack(progress);

        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            startTime = null;
            await nextCard();
            if (exit) return;
            isVisible = false;
            resetCardPos();
            let screenWidth = window.innerWidth;
            defineOption(1 - (mouseX / screenWidth));
            requestAnimationFrame(newCard)
        }
    }

    // reset card position in the center after throwing it and before turning a new one
    function resetCardPos() {
        rotation = 0;
        Yrotation = 180;
        currentTranslateX = -50;
        currentTranslateY = 0;
    }

    // turn a new card animation
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

        // update card position
        currentTranslateX = -50 - rotation*2;
        currentTranslateY = (mouseY / screenHeight)*100 -50;
        rotation = lerp(-50, 50, percentageX) / 3.5;
        defineOption(percentageX);
    }

    function click(event){
        if (event.clientY <= 70) return; // click on the header disabled
        if(isAnimating || $loginOn || $CreateCardFormOn) return;

        const screenWidth = window.innerWidth;
        const mouseX = event.clientX;
        const percentageX = 1 - (mouseX / screenWidth);
        if (percentageX > 0.36 && percentageX < 0.64) return; // click on the middle of the card disabled

        // getting initial values to launch animation
        isAnimating = true;
        initialRotation = rotation;
        initialTranslateX = currentTranslateX;
        initialTranslateY = currentTranslateY;
        targetTranslateX = -50 + ((currentTranslateX + 50) * 8);
        targetTranslateY = 600;

        percentageX > 0.5 ? swapLeft() : swapRight()
        requestAnimationFrame(animate); // launch animation
    }

    function defineOption(x){
        if (card.answered && card.known) {
            option = x > 0.5 ? "That's what i thought !" : "That was not what i thought...";
        } else if (card.answered && !card.known) {
            option = x > 0.5 ? "Ok !" : "Ok !";
        } else if (card.actions) {
            option = x > 0.5 ? card.actions[0] : card.actions[1];
        } else {
            option = x > 0.5 ? "I know" : "I don't know";
        }
    }

    async function nextCard(){
        if ($questionIndex >= deck.length) return;
        isQuestionVisible.set(false);

        console.log("card avant: ", $questionIndex, "/", total);
        console.log(card);

        card.actions ? executeActions() : handleCard();

        setTimeout(() => {
            isQuestionVisible.set(true);
        }, 300);

        await tick();
        console.log("card apres: ", $questionIndex, "/", total);
        console.log(card);
    }

    function handleCard(){
        if (!card.answered) {
            card.answered = true;
            swap === 0 ? card.known = true : card.known = false;
        }
        else if (!card.known) {
            console.log("on remet la carte a la fin du deck");
            if ($questionIndex < total) questionIndex.set($questionIndex+1);
        } else {
            swap === 0 ? console.log("parfait") : console.log("dommage");
            if ($questionIndex < total) questionIndex.set($questionIndex+1);
        }
    }

    function executeActions(){
        console.log("card action found", card.actions);
        switch (card.actions[swap]) {
            case "log in":
                loginOn.set(true);
                break;
            case "Sign up":
                goto("/sign_up");
                break;
        }
    }

    async function swapLeft(){
        swap = 0;
    }

    async function swapRight(){
        swap = 1;
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

{#if $questionIndex < total-1 || !card.answered}
    <div id="cardDeck" class={$lightMode ? "light-mode card backCard" : "card backCard"}></div>
{/if}

{#if isVisible && $questionIndex <= total-1 }
    <div id="outer-card">
        <div class="card" id="cardFrame" style="transform: translate({currentTranslateX}%, {currentTranslateY}px) rotate({-rotation}deg) rotateY({Yrotation}deg) rotateX({Xrotation}deg);">
            <div id="front">
                <div id="face" style="background-image: url({currentBackgroundUrl});">
                    {#if card.answered}
                        <Answer card={card} />
                    {/if}
                    {#if !isAnimating}
                        <div id="answerOverlay" transition:fade={{ duration: 200 }}
                             style="transform: translate(-25%, {-100 + (Math.abs(rotation * 3))}%) rotate({rotation}deg);">
                            <span id="answer" style="transform: translate(-50%, 0);">{option}</span>
                        </div>
                    {/if}
                </div>
            </div>
            <div id="back" class={$lightMode ? "light-mode backCard" : "backCard"}></div>
        </div>
    </div>
{/if}


<style>
    #outer-card {
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
        transition: 80ms ease-out;
    }

    #cardFrame {
        transform-style: preserve-3d;
    }

    #front,
    #back {
        position: absolute;
        width: 100%;
        height: 100%;
        backface-visibility: hidden;
    }

    #front {
        transform: rotateY(0deg);
        overflow: hidden;
        border-radius: 3vh;
    }

    #back {
        transform: rotateY(180deg);
    }

    .backCard {
        background: #131313;
        background: url("https://wallpaperaccess.com/full/3954357.jpg") center;
        background-size: cover;
        border-radius: 3vh;
        box-shadow: inset 0 0 0 8px #13131380;
    }

    .light-mode#cardDeck,
    #back.light-mode {
        background: #e1e1e1;
    }

    #face {
        height: 100%;
        width: 100%;
        background: url("https://cdn.discordapp.com/attachments/399312290333327360/1170028348479643789/image.png?ex=65578cd0&is=654517d0&hm=4c4b918818372636dbe9a9826134033eae48b2390ae868afa6b064f2df1dc057&") center;
        background-size: 180%;
        backface-visibility: hidden;
    }

    #answerOverlay {
        position: absolute;
        height: 100%;
        width: 200%;
        top: 0;
        left: 0;
        background: #00000050;
        text-align: center;
        color: #fff;
        transition: 80ms ease-out;
    }

    #answer {
        position: absolute;
        bottom: 10%;
        left: 50%;
        font-size: 1.5rem;
    }
</style>
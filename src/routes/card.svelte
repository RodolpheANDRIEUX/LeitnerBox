<script>
    import {isQuestionVisible, lightMode, questionIndex, loginOn, CreateCardFormOn} from './store.js';
    import {fade} from 'svelte/transition';
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

    // theme
    const facesUrls = [
        'https://cdn.discordapp.com/attachments/399312290333327360/1170043802099142676/ADCreHftsZ38XDjg1HNh46SStWXSrvkUhHfjU0_-cYlpnAVXZy3ZKcaz4CP2VkWJo5xOsIcXT-1y7UwqGzM9Nlq7eRZ2ZZZAL0SLNaSzu_5N6voOoGISjW9mfRt4LgeND4oc7zj1_pM1fZp8ajBZA6YCw-KLX1wJGlq5mtq0Rhw2iO-_hhA5ksLz0SmuEP1w3H9BX5A6-Xpy3JZpf4MyWyYE2Wddf78XolXikilv8Fcq0PTuZ04wVWJg_WS_P2bWrOBQ8QqNF_KU9Eum2F6q1NsYOFBdwWHPRRnwi0lsNiPNlpSIN9r4ufPzwgIrB-WWxMZpG2j-d53UtNPUsEFXd1DspuwbE9bnNOau2JLmaYr2q1Cv-SE7r0WJ-KRyH2VPCTP9fjYZ4mOgY6yj2e4oYQpMDrfLw9hgoPjT68ANHo_kEiXx876rVdm4nUrYDLiEZ5EjfSZRv2xGFFeirWytVDyh6nJqzzg8yWRuv6q_xsn4Pds0o4rdUQEHRlKb..png?ex=65579b34&is=65452634&hm=90344b3f38732533236b9780ad7be503b069de822168e0bb9790c03b4a2c566b&',
        'https://cdn.discordapp.com/attachments/399312290333327360/1170028348479643789/image.png?ex=65578cd0&is=654517d0&hm=4c4b918818372636dbe9a9826134033eae48b2390ae868afa6b064f2df1dc057&',
        'https://cdn.discordapp.com/attachments/399312290333327360/1170028496823779368/image.png?ex=65578cf3&is=654517f3&hm=d08dd52c40671fb1b232bdc6d16d41a3a00d1a9e9c4a71508549ba9604eeb4e4&',
        'https://cdn.discordapp.com/attachments/399312290333327360/1170028577190854708/image.png?ex=65578d06&is=65451806&hm=6a9f9f76744d7d01dab661a44aa632572310846adf706aca6d880f5b0135e7dc&',
        'https://cdn.discordapp.com/attachments/399312290333327360/1170028660913348659/image.png?ex=65578d1a&is=6545181a&hm=1c982a5252048821e56a5ed784628b51e2e75ffc2397784a46d0c8926194e9ce&'
    ];
    let faceIndex = 1;
    let currentBackgroundUrl = facesUrls[faceIndex];

    onMount(() => {
        // preload images
        facesUrls.forEach(url => {
            const img = new Image();
            img.src = url;
        });

        // event listeners
        document.body.addEventListener('mousemove', handleMouseMove);
        document.body.addEventListener('click', click);
    });

    // throw card animation
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

        answer = percentageX > 0.5 ? "I don't know" : "I know !";
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

    function nextCard(){
        actualQuestionIndex ++ ;
        if ($questionIndex >= data.props.cards.length) return;
        isQuestionVisible.set(false);
        setTimeout(() => {
            questionIndex.set($questionIndex+1);
            isQuestionVisible.set(true);
        }, 300);
    }

    async function swapLeft(){
        if (faceIndex < facesUrls.length - 1) {
            setTimeout(() => {
                faceIndex++;
                currentBackgroundUrl = facesUrls[faceIndex];
            }, duration);
        }
    }

    async function swapRight(){
        if (faceIndex > 0) {
            setTimeout(() => {
                faceIndex = faceIndex >= 2 ? 1 : faceIndex - 1;
                currentBackgroundUrl = facesUrls[faceIndex];
            }, duration);0
        }
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
                <div id="face" style="background-image: url({currentBackgroundUrl});"></div>
                {#if !isAnimating}
                <div id="answerOverlay" transition:fade={{ duration: 200 }} style="transform: translate(-25%, {-100+(Math.abs(rotation*3))}%) rotate({rotation}deg);">
                    <span id="answer" style="transform: translate({-50}%, 0);">{answer}</span>
                </div>
                {/if}
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
        transition: 80ms ease-out;
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
        background: url("https://wallpaperaccess.com/full/3954357.jpg") center;
        background-size: cover;
        border-radius: 3vh;
    }

    #cardDeck{
        background: #131313;
        background: url("https://wallpaperaccess.com/full/3954357.jpg") center;
        background-size: cover;
    }

    .light-mode#cardDeck,
    #back.light-mode {
        background: #e1e1e1;
    }

    #cardframe{
        transform-style: preserve-3d;
    }

    #face{
        height: 100%;
        width: 100%;
        background: url("https://cdn.discordapp.com/attachments/399312290333327360/1170028348479643789/image.png?ex=65578cd0&is=654517d0&hm=4c4b918818372636dbe9a9826134033eae48b2390ae868afa6b064f2df1dc057&") center;
        background-size: 180%;
        backface-visibility: hidden;
    }

    #answerOverlay{
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

    span{
        position: absolute;
        bottom: 10%;
        left: 50%;
        font-size: 1.5rem;
    }
</style>
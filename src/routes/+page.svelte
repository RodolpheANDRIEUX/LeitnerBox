<script>
    import Progress from "./progress.svelte";
    import Card from "./card.svelte";
    import {fade} from 'svelte/transition';
    import {isQuestionVisible, deckIndex, deckStore } from "$lib/store.js";
    import {onMount} from "svelte";

    export let data;

    let loaded = false;

    onMount(() => {
        console.log('Data: ', data);
        if (data && data.deck) {
            deckStore.set(data.deck);
        }

        loaded = true;
    });

</script>

{#if !loaded}
    <div class="loading-screen" transition:fade={{ duration: 500 }}></div>
{/if}

<div id="core">
    {#if $isQuestionVisible && $deckStore[$deckIndex]}
        <div id="question"
             transition:fade={{ duration: 300, easing: t => --t*t*t+1 }}>
            {$deckStore[$deckIndex]?.question}
        </div>

    {/if}

    <div>{data?.user?.name ?? 'Vous n\'etes pas connecté'}</div>

    <Card {data}/>
    <Progress {data}/>
</div>

<style>
    .loading-screen {
        position: absolute;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: #2e2e2e;
        z-index: 9;
    }

    #question {
        padding: 100px 25% 20px 25%;
        text-align: center;
        font-size: 2rem;
    }
</style>

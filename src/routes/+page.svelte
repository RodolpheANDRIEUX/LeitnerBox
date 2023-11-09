<script>
    import Progress from "./progress.svelte";
    import Card from "./card.svelte";
    import {fade} from 'svelte/transition';
    import {isQuestionVisible, questionIndex} from "./helpers.js";

    export let data;

    const cards = data.props.cards;
    const user = data.props.user;
</script>

<div id="core">
    {#if $isQuestionVisible && $questionIndex < cards.length}
        <div id="question"
             transition:fade={{ duration: 300, easing: t => --t*t*t+1 }}>{cards[$questionIndex].question}</div>
    {/if}
    <Card {data}/>
    <Progress {data}/>
</div>

<div> User {user ? user.name : 'Loading...'}</div>

<style>
    #question {
        padding: 100px 25% 20px 25%;
        text-align: center;
        font-size: 2rem;
    }
</style>

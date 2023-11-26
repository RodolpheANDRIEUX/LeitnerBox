<script>
    import {lightMode, questionIndex} from "./helpers.js";

    export let data;

    const total = data.deck.length;
    $: progressWidth = ($questionIndex / total) * 100;
</script>

<div id="bg" class={$lightMode ? "light-mode" : ""}></div>
<div id="progress"  style="width: {progressWidth}%;"></div>

<style>
    * {
        position: absolute;
        height: 8px;
        bottom: 0;
        left: 0;
    }

    #bg {
        background: #131313;
        width: 100vw;
    }

    #bg.light-mode{
        background: #e1e1e1;
    }

    #progress {
        background: #ff0000;
        transition: width 0.3s ease-in-out;
    }
</style>

<script>
    import { deckStore, deckIndex} from "$lib/store.js";

</script>

<div id="background">
    <div id="answer">{$deckStore[$deckIndex]?.answer}</div>
</div>

<style>

    #background {
        height: 100%;
        width: 100%;
        background: #00000080;
    }

    #answer {
        width: 100%;
        position: absolute;
        font-size: 2em;
        text-align: center;
        top: 50%;
        transform: translateY(-70%);
    }

</style>
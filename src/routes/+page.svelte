<script>
    import Progress from "./progress.svelte";
    import Card from "./card.svelte";
    import { lightMode } from './store.js';

    function handleMouseMove(event) {
        const screenHeight = window.innerHeight;
        const mouseY = event.clientY;

        const percentage = 100 - (mouseY / screenHeight) * 100;

        let progressWidth = `${percentage}%`;
    }

</script>

<div id="core">
    <div id="question">Who's gonna carry the Boats ?</div>
    <Card />
    <Progress />
</div>



<style>
    #question{
        padding: 40px 25% 20px 25%;
        text-align: center;
        font-size: 2rem;
    }
</style>

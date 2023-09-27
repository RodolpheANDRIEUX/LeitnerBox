<script>
    import Header from "./header.svelte";
    import Progress from "./progress.svelte";
    import Card from "./card.svelte";

    function handleMouseMove(event) {
        const screenHeight = window.innerHeight;
        const mouseY = event.clientY;

        const percentage = 100 - (mouseY / screenHeight) * 100;

        let progressWidth = `${percentage}%`;
    }

</script>

<Header />
<div id="question">Who's gonna carry the Boats ?</div>
<Card />
<Progress />

<style>
    #question{
        padding: 130px 25% 20px 25%;
        text-align: center;
        font-size: 2rem;
    }
</style>


<div id="randomParent">

    <div class="card">
        <div class="card-front">
            <p>Front Side</p>
        </div>
        <div class="card-back">
            <p>Back Side</p>
        </div>
    </div>
</div>



<style>
    #randomParent{
        perspective: 1000px;
    }

    .card {
        margin: 0 0 0 200px;
        width: 300px;
        height: 200px;

        border: red dashed 2px;
        transition: 1s;
        transform-style: preserve-3d;
    }

    .card-inner {
        width: 100%;
        height: 100%;
        position: relative;
        transform-style: preserve-3d;
        transition: transform 0.999s;
        border: dashed green 2px;
    }

    .card:hover {
        transform: rotateY(180deg);
    }

    .card-front,
    .card-back {
        position: absolute;
        width: 100%;
        height: 100%;
        backface-visibility: hidden;
    }

    .card-front {
        background-color: #6A2C70;
        transform: rotateY(0deg);
    }

    .card-back {
        background-color: #F08A5D;
        transform: rotateY(180deg);
    }

</style>
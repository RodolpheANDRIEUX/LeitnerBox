

    <div id="outer-card">
        <div class="card" id="cardframe" >
            <div id="front">
                <div id="cardBG"></div>
                <div id="solution">Hello</div>
                <div class="circle" id="circle1"></div>
                <div class="circle" id="circle2"></div>
            </div>
            <div id="back">
                <div id="backCard" ></div>
            </div>
        </div>
    </div>

<style>
    #outer-card{
        position: fixed;
        top: 0;
        height: 100vh;
        width: 100vw;
        perspective: 500px;
    }

    .card {
        position: absolute;
        height: 50vh;
        width: 50vh;
        border-radius: 3vh;
        left: 50%;
        bottom: 15%;
        transform: rotateY(-180deg) translate(50%, 0);
        transition: .4s ease-out;
    }

    #outer-card:hover #cardframe {
        transform: rotateY(-0deg) translate(-50%, 0);
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
        background: url("https://www.dmarge.com/wp-content/uploads/2021/08/goggins2-1-1200x800.jpg");
        background-size: cover;
        background-position: center;
        border-radius: 3vh;
    }

    #cardframe{
        transform-style: preserve-3d;
    }

    #solution{
        backdrop-filter: blur(40px);
        -webkit-backdrop-filter: blur(0);
        position: absolute;
        width: 99%;
        border: #007BFF dashed 2px;
    }

    .circle{
        position: absolute;
        height: 400px;
        width: 400px;
        border-radius: 200px;
        border: solid #00ffd150 2px;
    }

    #circle1{
        transform: translate(35%, 25%);
    }

    #circle2{
        transform: translate(15%, 40%);
    }

    #cardBG {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        border-radius: 21px;
        border: solid 2px;
        background: linear-gradient(to bottom right, blue, #00ffff);
    }

</style>
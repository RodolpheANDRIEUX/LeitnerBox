<script>
import {lightMode} from "./store.js";
</script>

<div id="bg" class={$lightMode ? "light-mode" : ""}></div>
<div id="progress"></div>

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
        width: 50%;
    }
</style>

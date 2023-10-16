<script>
    import {fade, slide} from "svelte/transition";
    import {lightMode} from "./store.js";

    let fields = {
        'inputQuestion': '',
        'inputAnswer': ''
    };

    let fieldStates = {};

    function updateValue(fieldKey, value) {
        fields[fieldKey] = value;
    }
</script>

<div id="container" on:click|stopPropagation transition:fade={{ duration: 200 }} >
    <div id="title" transition:slide={{ duration: 200 }}>Login</div>

    <form method="post">
        {#each Object.keys(fields) as fieldKey}
            <div class="input-group" >
                <input value={fields[fieldKey]}
                       on:input={(e) => updateValue(fieldKey, e.target.value)}
                       class:focus-or-filled={fieldStates[fieldKey]}
                       on:focus={() => (fieldStates[fieldKey] = true)}
                       on:blur={() => (fieldStates[fieldKey] = fields[fieldKey] !== "")}
                       autocomplete="off"
                       type={fieldKey === 'inputAnswer' ? 'password' : 'text'}
                       id={fieldKey}
                       name={fieldKey}>
                <label for={fieldKey}>{fieldKey === 'inputQuestion' ? 'Username' : 'Password'}</label>
            </div>
        {/each}

        <button type="submit" transition:slide={{ duration: 200 }}>Submit</button>

<!--        <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 30 30">-->
<!--            <path-->
<!--                    transition:draw={{ duration: 5000 }}-->
<!--                    d="M15,3C8.373,3,3,8.373,3,15c0,5.623,3.872,10.328,9.092,11.63C12.036,26.468,12,26.28,12,26.047v-2.051 c-0.487,0-1.303,0-1.508,0c-0.821,0-1.551-0.353-1.905-1.009c-0.393-0.729-0.461-1.844-1.435-2.526 c-0.289-0.227-0.069-0.486,0.264-0.451c0.615,0.174,1.125,0.596,1.605,1.222c0.478,0.627,0.703,0.769,1.596,0.769 c0.433,0,1.081-0.025,1.691-0.121c0.328-0.833,0.895-1.6,1.588-1.962c-3.996-0.411-5.903-2.399-5.903-5.098 c0-1.162,0.495-2.286,1.336-3.233C9.053,10.647,8.706,8.73,9.435,8c1.798,0,2.885,1.166,3.146,1.481C13.477,9.174,14.461,9,15.495,9 c1.036,0,2.024,0.174,2.922,0.483C18.675,9.17,19.763,8,21.565,8c0.732,0.731,0.381,2.656,0.102,3.594 c0.836,0.945,1.328,2.066,1.328,3.226c0,2.697-1.904,4.684-5.894,5.097C18.199,20.49,19,22.1,19,23.313v2.734 c0,0.104-0.023,0.179-0.035,0.268C23.641,24.676,27,20.236,27,15C27,8.373,21.627,3,15,3z"></path>-->
<!--        </svg>-->

    </form>
</div>


<style>

    #title {
        font-size: 1.2rem;
        letter-spacing: .2rem;
    }

    #container{
        position: fixed;
        top: 80px;
        right: 10px;
        z-index: 12;
        border: solid #9e9e9e 2px;
        border-radius: 30px;
        width: 280px;
        height: 350px;
        text-align: center;
        padding: 20px;
        margin: 10px;
    }

    .input-group{
        position: relative;
        margin: 20px;
    }

    button {
        background-color: #1a73e8;
        border-radius: 8px;
        color: #fff;
        padding: 10px 20px;
        border: 2px solid transparent;
        cursor: pointer;
        transition: .3s;
    }

    button:hover {
        background: transparent;
        border-color: #1a73e8;
    }

    input {
        color: white;
        border: solid 2px #9e9e9e;
        border-radius: 1rem;
        background: none;
        padding: 1rem;
        font-size: 1rem;
        letter-spacing: .1rem;
        transition: border 150ms cubic-bezier(0.4,0,0.2,1);
    }

    label {
        position: absolute;
        left: 30px;
        color: #9e9e9e;
        letter-spacing: .1rem;
        pointer-events: none;
        transform: translateY(1rem);
        transition: 150ms cubic-bezier(0.4,0,0.2,1);
    }

    .focus-or-filled {
        outline: none;
        border: 2px solid #1a73e8;
    }

    .focus-or-filled ~ label {
        transform: translateY(-50%) scale(0.8);
        background-color: #212121;
        padding: 0 .2em;
        color: #1a73e8;
    }
</style>
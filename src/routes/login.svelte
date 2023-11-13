<script>
    import {fade, slide} from "svelte/transition";
    import {CreateCardFormOn, lightMode, loginOn} from "./helpers.js";

    export let form;

    let fields = {
        'mail': '',
        'password': ''
    };

    let fieldStates = {};

    function updateValue(fieldKey, value) {
        fields[fieldKey] = value;
    }

    function closeLogin(event){
        event.stopPropagation();
        loginOn.set(false);
        CreateCardFormOn.set(false);
        window.location.href = '/sign_up'
    }


</script>

<div id="container" transition:fade={{ duration: 200 }}>
    <div id="title" transition:slide={{ duration: 200 }}>Login</div>
    <div id="signup" transition:slide={{ duration: 200 }}><a href="/sign_up" on:click|preventDefault={closeLogin} >sign up</a></div>

    {#if form?.error}
        <p>{form.error}</p>
    {/if}

    <form method="POST" action="?/login">
        {#each Object.keys(fields) as fieldKey}
            <div class="input-group">
                <input value={fields[fieldKey]}
                       on:input={(e) => updateValue(fieldKey, e.target.value)}
                       class:focus-or-filled={fieldStates[fieldKey]}
                       on:focus={() => (fieldStates[fieldKey] = true)}
                       on:blur={() => (fieldStates[fieldKey] = fields[fieldKey] !== "")}
                       autocomplete="off"
                       type={fieldKey === 'password' ? 'password' : 'text'}
                       id={fieldKey}
                       name={fieldKey}>
                <label class={$lightMode ? "light-mode" : ""} for={fieldKey}>{fieldKey}</label>
            </div>
        {/each}
        <button type="submit" transition:slide={{ duration: 200 }}>Submit</button>
    </form>
</div>


<style>

    #title {
        font-size: 1.2rem;
        letter-spacing: .2rem;
    }

    #signup {
        margin-top: 10px;
        font-size: .8rem;
        letter-spacing: .2rem;
    }

    #container {
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

    .input-group {
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
        transition: border 150ms cubic-bezier(0.4, 0, 0.2, 1);
    }

    label {
        position: absolute;
        left: 30px;
        color: #9e9e9e;
        letter-spacing: .1rem;
        pointer-events: none;
        transform: translateY(1rem);
        transition: 150ms cubic-bezier(0.4, 0, 0.2, 1);
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

    .focus-or-filled ~ label.light-mode{
        background-color: #ffffff;
    }
</style>
<script>
    import {fade, slide} from "svelte/transition";
    import {applyAction, deserialize} from "$app/forms";
    import {invalidateAll} from "$app/navigation";
    import {lightMode, loginOn} from "$lib/store.js";

    let fields = {
        'username': '',
        'mail': '',
        'password': '',
        'confirm password': ''
    };

    let fieldStates = {};
    let errorMessage = '';

    function updateValue(fieldKey, value) {
        fields[fieldKey] = value;
    }

    async function handleSubmit(event) {
        if (!validateForm(event)) return;
        const data = new FormData(event.currentTarget);

        const response = await fetch(event.currentTarget.action, {
            method: 'POST',
            body: data
        });

        const result = deserialize(await response.text());
        console.log("form response: ", result);

        if (result.type === 'failure') {
            errorMessage = result.data.error;
        }

        if (result.type === 'success') {
            await invalidateAll(); // rerun `load` functions
            loginOn.set(false);
        }

        await applyAction(result);
    }

    function validateForm(event) {

        // for (let key in fields) {
        //     if (!fields[key]) {
        //         errorMessage = `${key} is required`;
        //         return false;
        //     }
        // }
        //
        // const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        // if (!emailRegex.test(fields.mail)){
        //     errorMessage = 'The email address is not valid.';
        //     return false;
        // }
        //
        // if (!fields.mail.includes('@')) {
        //     errorMessage = 'The email address is not valid.';
        //     return false;
        // }
        //
        // const hasUppercase = /[A-Z]/.test(fields.password);
        // const hasLowercase = /[a-z]/.test(fields.password);
        // const hasDigits = /\d/.test(fields.password);
        //
        // if (!hasUppercase || !hasLowercase || !hasDigits) {
        //     errorMessage = 'The password must contain at least one uppercase letter, one lowercase letter, and one digit.';
        //     return false;
        // }
        //
        // if (fields.password.length < 8) {
        //     errorMessage = 'The password must be at least 8 characters long';
        //     return false;
        // }
        //
        // if (fields.password !== fields['confirm password']) {
        //     errorMessage = 'Passwords do not match.';
        //     return false;
        // }

        return true;
    }


    function determineInputType(fieldKey) {
        return fieldKey.includes('password') ? 'password' : 'text';
    }
</script>

<div id="container" transition:fade={{ duration: 200 }}>
    <div id="title" transition:slide={{ duration: 200 }}>Sign up</div>
    {#if errorMessage}
        <p id="errorMessage" transition:slide={{ duration: 400 }}>{errorMessage}</p>
    {/if}
    <form method="POST" on:submit|preventDefault={handleSubmit}>
        {#each Object.keys(fields) as fieldKey}
            <div class="input-group">
                <input value={fields[fieldKey]}
                       on:input={(e) => updateValue(fieldKey, e.target.value)}
                       class:focus-or-filled={fieldStates[fieldKey]}
                       on:focus={() => (fieldStates[fieldKey] = true)}
                       on:blur={() => (fieldStates[fieldKey] = fields[fieldKey] !== "")}
                       type={determineInputType(fieldKey)}
                       id={fieldKey} name={fieldKey} autocomplete="off">
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

    #container {
        position: absolute;
        top: 100px;
        left: 50%;
        transform: translate(-50%, 0);
        border: solid #9e9e9e 2px;
        border-radius: 30px;
        width: 350px;
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
        left: 50px;
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
        background-color: #1e1e1e;
        padding: 0 .2em;
        color: #1a73e8;
    }

    .focus-or-filled ~ label.light-mode{
        background-color: #ffffff;
    }

    #errorMessage {
        color: red;
        font-size: .8rem;
        margin: 15px 0 0 0 ;
        padding: 0;
    }
</style>
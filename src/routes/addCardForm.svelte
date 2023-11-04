<script>
    import {fade, slide} from "svelte/transition";
    import {lightMode} from "./store.js";

    let errorMessage = '';

    const handleSubmit = async () => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const response = await fetch("?/createCard", {
            method: "POST",
            body: formData
        });
        const result = await response.json();

        if (response.status === 401) {
            errorMessage = response.body;
        }
    };

</script>

<div id="container" transition:fade={{ duration: 200 }} >
    <div id="title" transition:slide={{ duration: 200 }}>Add a <span>new card</span></div>

    {#if errorMessage}
        <p>{errorMessage}</p>
    {/if}

    <form on:submit|preventDefault={handleSubmit}>
        <div class="input-group">
            <label for="question">Question</label>
            <input class={$lightMode ? "light-mode" : ""} id="question" autocomplete="off" required />
        </div>

        <div class="input-group">
            <label for="answer">Answer</label>
            <textarea class={$lightMode ? "light-mode" : ""} id="answer" autocomplete="off" rows="5" required></textarea>
        </div>

        <div class="input-group">
            <label for="file">Add image?</label>
            <input type="file" id="file" name="file" required>
        </div>

        <button class={$lightMode ? "light-mode" : ""} type="submit" transition:slide={{ duration: 200 }}>Add</button>
    </form>
</div>


<style>

    #title {
        font-size: 1.2rem;
        letter-spacing: .2rem;
        margin-bottom: 2rem;
    }

    #title span {
        color: #ff0000;
    }

    #container{
        z-index: 5;
        position: absolute;
        top: 100px;
        left: 50%;
        transform: translate(-50%, 0);
        border: solid #9e9e9e 2px;
        border-radius: 30px;
        width: 90%;
        height: 70%;
        text-align: center;
        padding: 20px;
        margin: 10px;
    }

    .input-group{
        margin: 20px;
        display: block;
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

    button.light-mode:hover {
        color: #1a73e8;
        transform: rotate(999deg);
    }

    button:hover {
        background: transparent;
        border-color: #1a73e8;
    }

    input, textarea {
        display: block;
        width: calc(100% - 2rem);
        color: white;
        border: solid 2px #9e9e9e;
        border-radius: 1rem;
        background: none;
        padding: 1rem;
        font-size: 1rem;
        letter-spacing: .2rem;
        resize: none;
    }

    textarea::-webkit-scrollbar {
        display: none;
    }

    textarea {
        font-family: 'Arial', sans-serif;
        -ms-overflow-style: none;
        scrollbar-width: none;
        overflow-y: scroll;
    }

     input.light-mode  {
        color: #1e1e1e;
    }

    label {
        display: block;
        margin-bottom: .5rem;
        color: #9e9e9e;
        letter-spacing: .1rem;
        text-align: left;
        padding-left: 1rem;
    }

</style>
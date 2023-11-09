<script>
    import {fade, slide} from "svelte/transition";
    import {lightMode} from "./store.js";

    let isHighlighted = false;

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    function handleDragEnter(e) {
        preventDefaults(e);
        isHighlighted = true;
    }

    function handleDragLeave(e) {
        preventDefaults(e);
        isHighlighted = false;
    }

    function handleDragOver(e) {
        preventDefaults(e);
    }

    function handleDrop(e) {
        preventDefaults(e);
        isHighlighted = false;
        let dt = e.dataTransfer;
        let files = dt.files;
        handleFiles(files);
    }

    function handleFiles(files) {
        ([...files]).forEach(uploadFile);
    }

    function uploadFile(file) {
        console.log('File name:', file.name);
        // Todo afficher l'image
    }

    let errorMessage = '';

    const handleSubmit = async (e) => {
        preventDefaults(e)
        const formData = new FormData(e.target);
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

        <div class="flex-container">
            <div class="input-group" id="answer-container">
                <label for="answer">Answer</label>
                <textarea class={$lightMode ? "light-mode" : ""} id="answer" autocomplete="off" rows="5" required></textarea>
            </div>
            <div class="input-group" id="file-container">
                <label for="file_input"
                       id="file_button"
                       class:highlight={isHighlighted}
                       on:dragenter={handleDragEnter}
                       on:dragleave={handleDragLeave}
                       on:dragover={handleDragOver}
                       on:drop={handleDrop}>Image</label>
                <input type="file" id="file_input" name="file_input" style="display: none;">
            </div>
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

    .flex-container {
        display: flex;
        justify-content: space-between;
    }

    #answer-container{
        flex: 2;
    }

    #file-container{
        flex: 1;
        padding-top: 1.5rem;
    }

    .input-group{
        margin: 20px;
        display: block;
    }

    button, #file_button {
        background-color: #1a73e8;
        border-radius: 8px;
        color: #fff;
        padding: 10px 20px;
        border: 2px solid transparent;
        cursor: pointer;
        transition: .3s;
    }

    #file_button {
        background: #9e9e9e10;
        border: 2px dashed #9e9e9e;
        border-radius: 1rem;
        padding: 0;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    #file_button.highlight {
        background: #1a73e8;
        border: solid 2px #9e9e9e;
    }

    button.light-mode:hover, #file_button.light-mode:hover {
        color: #1a73e8;
    }

    button:hover, #file_button:hover {
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
        transition: .3s;
    }

    input:focus, textarea:focus {
        border-color: #1a73e8;
        outline: none;
    }

    input:focus, textarea:focus label {
        border-color: #1a73e8;
        outline: none;
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
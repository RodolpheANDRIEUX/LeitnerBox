<script>
    import {fade} from "svelte/transition";
    import Toggle from "./toggle.svelte";
    import Login from "./login.svelte";
    import AddCardForm from "./addCardForm.svelte"
    import {CreateCardFormOn, lightMode, loginOn} from "./store.js";

    function toggleLogin() {
        loginOn.update(value => !value);
    }

    function toggleCreateCard() {
        CreateCardFormOn.update(value => !value);
    }
</script>

<div id="frame" class={$lightMode ? "light-mode" : ""}>

    <div class="icon-group left">
        <div class="header_element" id="addCard" role="button" tabindex="0" on:keydown on:click={toggleCreateCard}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        </div>

        <div class="header_element">
            <svg id="fastMode" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6">
                <path fill-rule="evenodd" d="M14.615 1.595a.75.75 0 01.359.852L12.982 9.75h7.268a.75.75 0 01.548 1.262l-10.5 11.25a.75.75 0 01-1.272-.71l1.992-7.302H3.75a.75.75 0 01-.548-1.262l10.5-11.25a.75.75 0 01.913-.143z" clip-rule="evenodd" />
            </svg>
        </div>
    </div>


    <div class="icon-group right">

        <Toggle />


        <div class="header_element" id="login" role="button" tabindex="0" on:keydown on:click={toggleLogin}>
            <svg class="w-6 h-6" fill="currentColor"
                 viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" clip-rule="evenodd" />
            </svg>
        </div>
    </div>
</div>

<slot />

{#if $CreateCardFormOn}
    <div class={$lightMode ? "light-mode blurLayout" : "blurLayout"} id="blurLayoutAddCard" role="button" tabindex="0" on:keydown on:click|stopPropagation={toggleCreateCard} transition:fade={{ duration: 100 }}></div>
    <AddCardForm {CreateCardFormOn}/>
{/if}

{#if $loginOn}
    <div class="blurLayout" id="blurLayoutLogin" role="button" tabindex="0" on:keydown on:click|stopPropagation={toggleLogin} transition:fade={{ duration: 100 }}></div>
    <Login {loginOn}/>
{/if}

<style>

    .blurLayout{
        position: fixed;
        height: 100%;
        width: 100%;
        top: 0;
        left: 0;
        backdrop-filter: blur(10px);
    }

    #blurLayoutAddCard {
        z-index: 4;
        background: #1e1e1ee1;
    }

    #blurLayoutAddCard.light-mode {
        z-index: 4;
        background: #ffffffe1;
    }

    #blurLayoutLogin {
        z-index: 9;
    }

    svg{
        height: 40px;
    }

    #frame {
        box-sizing: border-box;
        position: fixed;
        top: 0;
        z-index: 10;
        height: 70px;
        width: 100vw;
        background: #2e2e2e;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 20px 0 20px;
    }

    #frame.light-mode{
        background: #e1e1e1;
    }

    .icon-group {
        z-index: 11;
        display: flex;
        align-items: center;
        gap: 20px;
    }

    .header_element{
        cursor: pointer;
    }
</style>
<!--@todo : notification pour confirmer la création de la carte-->
<!--@todo : utiliser des prefetch onmouseover https://kit.svelte.dev/docs/link-options  https://www.youtube.com/watch?v=EQy-AYhZIlE&ab_channel=Huntabyte-->

<script>

</script>


<main>
    <h1>Formulaire de validation</h1>

    <form method="post">

            <label for="inputQuestion">Question :</label>
            <input type="text" id="inputQuestion" name="question">


            <label for="inputAnswer">Réponse :</label>
            <input autocomplete="off" type="text" id="inputAnswer" name="answer">

        <button type="submit">Valider</button>
    </form>
</main>

<style>
    main {
        text-align: center;
        margin: 20px;
    }

    label {
        display: block;
        margin-bottom: 8px;
    }

    input {
        width: 100%;
        padding: 8px;
        margin-bottom: 16px;
    }

    button {
        background-color: #007bff;
        color: #fff;
        padding: 10px 20px;
        border: none;
        cursor: pointer;
    }

    button:hover {
        background-color: #0056b3;
    }
</style>



<main>
    <h1>Ajouter une nouvelle carte :</h1>


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
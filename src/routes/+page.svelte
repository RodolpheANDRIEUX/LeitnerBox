

<main>
    <h1>Formulaire de validation</h1>

    <div>
        <label for="inputQuestion">Question :</label>
        <input type="text"  id="inputQuestion" name="inputQuestion">
    </div>

    <div>
        <label for="inputAnswer">Réponse :</label>
        <input type="text"  id="inputAnswer" name="inputAnswer">
    </div>

    <button id="submitButton">Valider</button>
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


<!--<script>-->
<!--    let inputQuestion ='';-->
<!--    let inputAnswer = '';-->
<!--    const submitButton = document.getElementById('submitButton');-->


<!--    submitButton.addEventListener('click', sendData);-->
<!--    async function sendData() {-->
<!--        console.log("test");-->

<!--        const response = await fetch('/api/save-data', {-->
<!--            method: 'POST',-->
<!--            headers: {-->
<!--                'Content-Type': 'application/json',-->
<!--            },-->
<!--            body: JSON.stringify({question: inputQuestion, answer: inputAnswer}),-->
<!--        });-->
<!--        if (response.ok) {-->
<!--            alert("Data send with success"); //remplacer par un console.log-->
<!--        } else {-->
<!--            alert("Error HTTP: " + response.status); //remplacer par un console.log-->
<!--        }-->

<!--    }-->
<!--</script>-->

<!--<!DOCTYPE html >-->
<!--<html>-->
<!--<head>-->
<!--    <title>Votre Page</title>-->
<!--</head>-->
<!--<body>-->
<!--<main>-->
<!--    <h1>Formulaire de validation</h1>-->

<!--    <form action="/api/save-data" method="POST">-->
<!--        <div>-->
<!--            <label for="inputQuestion">Question :</label>-->
<!--            <input type="text" id="inputQuestion" name="question">-->
<!--        </div>-->

<!--        <div>-->
<!--            <label for="inputAnswer">Réponse :</label>-->
<!--            <input type="text" id="inputAnswer" name="answer">-->
<!--        </div>-->

<!--        <button type="submit">Valider</button>-->
<!--    </form>-->

<!--</main>-->

<!--<script>-->
<!--    let inputQuestion = '';-->
<!--    let inputAnswer = '';-->

<!--    async function sendData() {-->
<!--        const response = await fetch('/api/save-data', {-->
<!--            method: 'POST',-->
<!--            headers: {-->
<!--                'Content-Type': 'application/json',-->
<!--            },-->
<!--            body: JSON.stringify({question: inputQuestion, answer: inputAnswer}),-->
<!--        });-->
<!--        if (response.ok) {-->
<!--            console.log("Data send with success");-->
<!--        } else {-->
<!--            console.log("Error HTTP: " + response.status);-->
<!--        }-->
<!--    }-->
<!--</script>-->
<!--</body>-->
<!--</html>-->


<!DOCTYPE html>
<html>
<head>
    <title>Votre Page</title>
</head>
<body>
<main>
    <h1>Formulaire de validation</h1>

    <form id="dataForm">
        <div>
            <label for="inputQuestion">Question :</label>
            <input type="text" id="inputQuestion" name="question">
        </div>

        <div>
            <label for="inputAnswer">Réponse :</label>
            <input type="text" id="inputAnswer" name="answer">
        </div>

        <button type="button" onclick="sendData()">Valider</button>
    </form>

</main>

<script>
    async function sendData() {
        const form = document.getElementById('dataForm');
        const formData = new FormData(form);
        const inputQuestion = formData.get('question');
        const inputAnswer = formData.get('answer');

        const response = await fetch('/api/save-data', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ question: inputQuestion, answer: inputAnswer }),
        });
        if (response.ok) {
            console.log("Data send with success");
        } else {
            console.log("Error HTTP: " + response.status);
        }
    }
</script>
</body>
</html>



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



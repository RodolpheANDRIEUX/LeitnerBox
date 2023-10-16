<script>
    let fields = {
        'inputQuestion': '',
        'inputAnswer': ''
    };

    let fieldStates = {};

    function updateValue(fieldKey, value) {
        fields[fieldKey] = value;
    }
</script>

<main>
    <h1>Login</h1>

    <form method="post">
        {#each Object.keys(fields) as fieldKey}
            <div class="input-group">
                <input value={fields[fieldKey]}
                       on:input={(e) => updateValue(fieldKey, e.target.value)}
                       class:focus-or-filled={fieldStates[fieldKey]}
                       on:focus={() => (fieldStates[fieldKey] = true)}
                       on:blur={() => (fieldStates[fieldKey] = fields[fieldKey] !== "")}
                       autocomplete="off"
                       type={fieldKey === 'inputAnswer' ? 'password' : 'text'}
                       id={fieldKey}
                       name={fieldKey}>
                <label for={fieldKey}>{fieldKey === 'inputQuestion' ? 'Username:' : 'Password:'}</label>
            </div>
        {/each}

        <button type="submit">Submit</button>
    </form>
</main>


<style>

    h1 {
        font-size: 1.2rem;
        letter-spacing: .2rem;
    }

    main{
        border: solid #018786 1px;
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
        background-color: #007bff;
        border-radius: 3px;
        color: #fff;
        padding: 10px 20px;
        border: 2px solid transparent;
        cursor: pointer;
        transition: .3s;
    }

    button:hover {
        background: transparent;
        border-color: #0056b3;
    }

    input {
        border: solid 2px #9e9e9e;
        border-radius: 1rem;
        background: none;
        padding: 1rem;
        font-size: 1rem;
        letter-spacing: .1rem;
        color: #f5f5f5;
        transition: border 150ms cubic-bezier(0.4,0,0.2,1);
    }

    label {
        position: absolute;
        left: 30px;
        color: #ffffffcc;
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
        color: #2196f3;
    }
</style>
function carregarConteudo() {

    console.log('carrearConteudo')

    const callSection = document.querySelector('.callSection')
    callSection.style.display = 'block'

}

function getLeadersList(){
    const selectedLeader = document.getElementById('leaderName');
    const names = hcList.map((row)=>{
        return row[15]
    });

    const uniqueNames = [...new Set(names.flat())].filter(String).sort();

    var defaultOption = document.createElement('option');
    defaultOption.textContent = 'Team Leader';
    defaultOption.disabled = true;
    defaultOption.selected = true;
    selectedLeader.appendChild(defaultOption);

    uniqueNames.forEach((row)=>{
        var option = document.createElement('option');
        option.text = row;
        selectedLeader.add(option);
    });
};

async function callGenarate(){
    const leaderName = document.getElementById('leaderName').value;
    const dataBody = document.querySelector('#data-table tbody');
    console.log(leaderName)

    dataBody.innerHTML = '';

    const data = hcList.filter((row)=>{
        return row[15] === leaderName
    })

    const props = data.map((row)=>{
        return [row[1], row[21], row[7], row[9], row[3]]
    })

    console.log(props)

    props.forEach(async (row)=>{
        var tr = document.createElement('tr');
        var nameCell = document.createElement('td');
        nameCell.textContent = row[0];
        tr.appendChild(nameCell);
        var grootCell = document.createElement('td');
        grootCell.textContent = row[1];
        tr.appendChild(grootCell);
        var scaleCell = document.createElement('td');
        scaleCell.textContent = row[2];
        tr.appendChild(scaleCell);
        var statusCell = document.createElement('td');
        statusCell.textContent = row[3];
        tr.appendChild(statusCell);

        var statusJustify = document.createElement('td');

        var justify = document.createElement('select');
        justify.className = 'justificativa';
        var statusContainer = document.createElement('div');
        statusContainer.classList.add('status-container');
        statusContainer.style.display = 'flex';

        var cargo = row[4];
        var statusRow = row[3];

        var optiondefault = await geraOptionsDefault(cargo, statusRow);
        justify.appendChild(optiondefault.value);

        var circle = document.createElement('div');
        circle.classList.add('status-circle');
        circle.style.backgroundColor = optiondefault.circleColor;

        statusContainer.appendChild(circle);
        
        var report = document.createElement('div');
        report.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 24 24" fill="none">
                <rect width="24" height="24" fill="transparent"/>
                <path fill-rule="evenodd" clip-rule="evenodd" d="M11 13C11 13.5523 11.4477 14 12 14C12.5523 14 13 13.5523 13 13V10C13 9.44772 12.5523 9 12 9C11.4477 9 11 9.44772 11 10V13ZM13 15.9888C13 15.4365 12.5523 14.9888 12 14.9888C11.4477 14.9888 11 15.4365 11 15.9888V16C11 16.5523 11.4477 17 12 17C12.5523 17 13 16.5523 13 16V15.9888ZM9.37735 4.66136C10.5204 2.60393 13.4793 2.60393 14.6223 4.66136L21.2233 16.5431C22.3341 18.5427 20.8882 21 18.6008 21H5.39885C3.11139 21 1.66549 18.5427 2.77637 16.5431L9.37735 4.66136Z" fill="#ddbe0d"/>
            </svg>
        `
        report.classList.add('reportProblem');

        report.addEventListener('click', function(event){
            let row = event.target.closest('tr');
            let name = row.children[0].textContent;
            let idGroot = parseFloat(row.children[1].textContent);
            let status = row.children[3].textContent;
            let props = [
                name, idGroot, status
            ]

            console.log(`${name} - ${idGroot} - ${status}`)


            const customPrompt = document.getElementById('customPrompt');
            const closeButton = document.querySelector('.close');
            const submitButton = document.getElementById('submitDescription');
            
            const dataReport = document.querySelector('.dataReport');
            
            customPrompt.style.display = 'block';
            
            dataReport.innerHTML = `
            <p>${idGroot}</p> - <p>${name.slice(0, 20)}...</p> - <p>${status}</p>
            `
            
            props = props.filter((r)=>{
                return r[0] !== ''
            });
            
            console.log(`${props} - filter`)
            
            submitButton.addEventListener('click', function() {
                let descriptionInput = document.getElementById('occurrenceDescription');
                let description = descriptionInput.value;
                props.push(description);
                // document.getElementById('occurrenceDescription').value = '';
                
                submitButton.innerHTML = `
                    <div class="rotate"></div>
                `
                setTimeout(()=>{
                    submitButton.innerHTML = `
                        Enviar
                    `
                    console.log(props);
                    console.log('limpando props...');
                    props = [];

                    console.log(props)
                    customPrompt.style.display = 'none';
                }, 5000);
            });

            closeButton.addEventListener('click', function() {
                customPrompt.style.display = 'none';
            });
        });

        statusContainer.appendChild(report);
        
        var values = await geraOptions(cargo, statusRow);
        values.forEach((value)=>{
            var option = document.createElement('option');
            option.textContent = value;
            justify.appendChild(option);
        })

        statusJustify.appendChild(justify);
        statusJustify.appendChild(statusContainer);
        tr.appendChild(statusJustify);

        dataBody.appendChild(tr);

    });
};

// quando estiver conectado com DB essa função deve buscar primeiro a base e verificar se já existe resposta

function geraOptionsDefault(cargo, statusRow){
    var option = document.createElement('option');
    option.selected = true;
    var colorName = 'red';
    let answer = ''; // substituir por operação para buscar a resposta...

    if(answer === '' && statusRow === 'ATIVO'){
        option.textContent = 'pendente';
    }else{
        option.textContent = statusRow;      
    }

    (answer === '' && statusRow === 'ATIVO') ? option.textContent = 'pendente' :
    (answer === '' && statusRow === 'DSR - Escala') ? option.textContent = statusRow :
    (answer === '' && (statusRow !== 'DSR - Escala' && statusRow !== 'ATIVO')) ? option.textContent = statusRow : option.textContent = '';

    (answer === '' && statusRow === 'DSR - Escala') ? colorName = '#3b8bed' :
    (answer === '' && (statusRow !== 'DSR - Escala' && statusRow !== 'ATIVO')) ? colorName = '#c4b10b' : '#21c40b';

    const props = {value: option, circleColor: colorName}

    return props
}

function geraOptions(cargo, statusRow){
    let values = []
    if(statusRow === 'DSR - Escala'){
        optionsDSR.forEach((optionText)=>{
            if(optionText !== statusRow){
                values.push(optionText);
            }
        })
    }else if(statusRow === 'ATIVO'){
        options.forEach((optionText)=>{
            if(optionText !== statusRow){
                values.push(optionText);
            }
        })
    }else{
        values.push(statusRow);
    }

    return values;
};

function saveAnswres(){
    // console.log('saved!')
    // const btn = document.getElementById('btnSave')
    // let dataAnswer = [];
    // var pending = false;

    // const rows = document.querySelectorAll('#data-table tbody tr');
    // rows.forEach((row)=>{
    //     var name = row.querySelector('td:nth-child(1)').textContent;
    //     var idGroot = row.querySelector('td:nth-child(2)').textContent;
    //     var answer = row.querySelector('.justificativa').value;
        
    //     dataAnswer.push([name, idGroot, answer]);

    //     if(answer === 'pendente'){
    //         pending = true   
    //     };
    // });

    // if(pending){
    //     alert('Justificativas pendente!');
    //     return
    // };

    const dados = {
        nome: 'Nome do usuário',
        id_groot: 123,
        status: 'Ativo',
        categoria_status: 'Categoria A'
    }

    const csrftoken = getCookie('csrftoken');

    fetch('/salvar_dados/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken,
        },
        body: JSON.stringify(dados),
    })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error('Erro', error));

    

    btn.innerHTML = `<div class="rotate"></div>`;

    setTimeout(()=>{
        console.log(dataAnswer);
        btn.innerHTML = `confirmed!`;
    },5000);
}


function enviarDados(){
    const dados = {
        nome: 'Nome do usuário',
        id_groot: 123,
        status: 'Ativo',
        categoria_status: 'Categoria A'
    }

    const csrftoken = getCookie('csrftoken');

    fetch('/salvar_dados/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken,
        },
        body: JSON.stringify(dados),
    })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error('Erro', error));
}
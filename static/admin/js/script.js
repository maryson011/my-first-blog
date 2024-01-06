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
        justify.onchange = updateAnswerInDB;
        var statusContainer = document.createElement('div');
        statusContainer.classList.add('status-container');
        statusContainer.style.display = 'flex';

        var cargo = row[4];
        var statusRow = row[3];

        var optiondefault = await geraOptionsDefault(row[0], cargo, statusRow);
        justify.appendChild(optiondefault.value);
        justify.id = optiondefault.id;

        if(optiondefault.bacgroundName === 1){justify.style.backgroundColor = 'red'}

        const layOutJustify = justify.style
        layOutJustify.textAlign = 'center';

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

        report.addEventListener('click', async function(event){
            var row = event.target.closest('tr');
            var name = row.children[0].textContent;
            var idGroot = parseFloat(row.children[1].textContent);
            var status = row.children[3].textContent;
            
            console.log(`${name} - ${idGroot} - ${status}`)
            
            
            const customPrompt = document.getElementById('customPrompt');
            const closeButton = document.querySelector('.close');
            const submitButton = document.getElementById('submitDescription');
            
            const dataReport = document.querySelector('.dataReport');
            
            customPrompt.style.display = 'block';
            
            dataReport.innerHTML = `
            <p id="idgrootReport">${idGroot}</p> - <p id="nameReport">${name.slice(0, 20)}...</p> - <p id="statusReport">${status}</p>
            `

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

function updateAnswerInDB(event){
    let id = event.target.id;
    let value = event.target.value;

    fetch(`/update_status/?id=${id}&status=${value}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken'),
        },
    })
        .then(response => response.json())
        .then(data => {
            console.log('Sucesso ao atualizar o status no banco:', data);
        })
        .catch(error => {
            console.error('Erro ao atualizar o status no banco:', error);
        });
};

function getReport(){
    const dataReport = document.querySelector('.dataReport');
    let descriptionInput = document.getElementById('occurrenceDescription').value;
    let idGroot = document.getElementById('idgrootReport').textContent;
    let status = document.getElementById('statusReport').textContent;

    const props = [
        [idGroot, status, descriptionInput]
    ]

    document.getElementById('occurrenceDescription').value = '';
    let btnReport = document.getElementById('submitDescription')

    fetch(btnReport.getAttribute('data-url'), {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken'),
        },
        body: JSON.stringify({ props }),
    })
        .then(response => response.json())
        .then(data => {
            console.log('Sucesso:', data);
            btnReport.innerHTML = 'Confirmed!';
            console.log('ultimo props');
            console.log(props);

            idGroot = '';
            status = '';
            document.getElementById('occurrenceDescription').value = '';
        })
        .catch((error) => {
            console.error('Erro:', error);
            btnReport.innerHTML = 'Error!';
        });

    setTimeout(()=>{
        btnReport.innerHTML = `
            Enviar
        `

        console.log(props)
        customPrompt.style.display = 'none';
    }, 5000);
}


async function geraOptionsDefault(name, cargo, statusRow){
    var option = document.createElement('option');
    option.selected = true;
    var colorName = 'red';
    var bacgroundName;
    let answer = await getDadosFromBackend(name);
    var id;

    (answer.length > 0) ? option.textContent = answer[0].status:
    (answer.length === 0 && statusRow === 'ATIVO') ? option.textContent = 'FJ - Falta Injustificada' :
    (answer.length === 0 && statusRow === 'DSR - Escala') ? option.textContent = statusRow :
    (answer.length === 0 && (statusRow !== 'DSR - Escala' && statusRow !== 'ATIVO')) ? option.textContent = statusRow : option.textContent = '';

    (answer.length === 0 && statusRow === 'DSR - Escala') ? colorName = '#3b8bed' :
    (answer.length === 0 && (statusRow !== 'DSR - Escala' && statusRow !== 'ATIVO')) ? colorName = '#c4b10b' : '#21c40b';

    (answer.length > 0) ? id = answer[0].id: id = 0

    bacgroundName = (option.textContent === 'FJ - Falta Injustificada') ? 1 : 0


    const props = {value: option, circleColor: colorName, id: id, bacgroundName: bacgroundName}

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

function getCategory(value){
    const categorys = {
        'BH - Banco de Horas': 'Não gestionável',
        'FI - Falta Injustificada': 'Gestionável',
        'FJ - Abono Fretado': 'Não gestionável',
        'FJ - Abono Gestor': 'Não gestionável',
        'FJ - Abono Treinamento': 'Não gestionável',
        'FJ - Acompanhamento Filho': 'Não gestionável',
        'FJ - Atestado': 'Não gestionável',
        'FJ - Audiência Judicial / Convocação': 'Não gestionável',
        'FJ - Falecimento 1º grau': 'Não gestionável',
        'FJ - Falecimento 2º grau': 'Não gestionável',
        'FJ - Licença Casamento': 'Não gestionável',
        'FJ - Licença Doação de Sangue': 'Não gestionável',
        'FJ - Licença Eleitoral': 'Não gestionável',
        'FJ - Licença Mudança': 'Não gestionável',
        'FJ - Licença Paternidade': 'Não gestionável',
        'FJ - Licença Vestibular': 'Não gestionável',
        'FJ - Serviço Militar': 'Não gestionável',
        'FR - Feriado': 'Não gestionável',
        'HCD - HC Divergente': 'Gestionável',
        'Presente': 'Não gestionável',
        'SIE - Sinergia Externa': 'Não gestionável',
        'JA - Dia de Curso': 'Não gestionável'
    }

    return categorys[value] || '';
}

const closeButtonAlert = document.getElementById('close');

closeButtonAlert.addEventListener('click', function() {
    const alertPrompt = document.getElementById('alertPrompt');
    alertPrompt.style.display = 'none';
});


async function saveAnswers() {

    console.log('saved!')
    const btn = document.getElementById('btnSave')
    let dataAnswer = [];
    var pending = false;
    let arr = [];

    const rows = document.querySelectorAll('#data-table tbody tr');
    rows.forEach(async (row)=>{
        var name = row.querySelector('td:nth-child(1)').textContent;
        var idGroot = row.querySelector('td:nth-child(2)').textContent;
        var answer = row.querySelector('.justificativa').value;
        var categoria_status = getCategory(answer);
        
        dataAnswer.push([name, idGroot, answer, categoria_status]);
        
        if(answer === 'pendente'){
            pending = true   
        };
    });

    if(pending){
        alert('Justificativas pendente!');
        return
    };

    btn.innerHTML = `<div class="rotate"></div>`;

    try{
        const existingData = await getDadosFromBackend(dataAnswer[0][0]);

        if (existingData.length > 0) {
            document.getElementById('alertPrompt').style.display = 'block';

            document.querySelector('.dataMensage').style.display = 'flex';
            document.querySelector('.dataMensage').style.flexDirection = 'column';
            document.querySelector('.dataMensage').style.justifyContent = 'center';
            
            document.querySelector('.dataMensage').innerHTML = `
                <h5 class="alert-text">Você já realizou o reporte da chamada hoje.</h5>
                <p class="instruction-text">Caso queira corrigir algum status, altere apenas no nome que precisa.</p>
            `
            btn.innerHTML = 'Error!';
            return;
        }   
    
        fetch(btn.getAttribute('data-url'), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken'),
            },
            body: JSON.stringify({ dataAnswer }),
        })
            .then(response => response.json())
            .then(data => {
                console.log('Sucesso:', data);
                btn.innerHTML = 'Confirmed!';
            })
    } catch (error) {
        console.error('Erro:', error);
        btn.innerHTML = 'Error!';
    };

}


function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].trim();
            // Verifica se o cookie inicia com o nome desejado
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}


async function getDadosFromBackend(nome){
    try{
        const today = new Date();
        const formattedDate = `${today.getFullYear()}-${(today.getMonth()+1).toString().padStart(2,'0')}-${today.getDate().toString().padStart(2,'0')}`;
        const formattedLaunchDate = formattedDate.split('T')[0];

        const queryParamns = new URLSearchParams({
            nome: nome,
            lauch_date: formattedLaunchDate,  
        })

        const response = await fetch(`/get_dados/?${queryParamns}`);
        const data = await response.json();

        return data.dados

    } catch (error) {
        console.error('Erro ao obter dados', error);
    }
}
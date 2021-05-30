const formulario= document.querySelector("#cotizar-seguro");
const spinner= document.querySelector("#cargando");

function Seguro(marca, anio, tipoSeguro){
    this.marca=marca;
    this.anio=anio;
    this.tipoSeguro=tipoSeguro;
};

Seguro.prototype.calcular= function(){
    /*
        valor= asiatico 1.05 / americano 1.15 / europeo 1.25
    */
    let resultado;
    const base= 2000;

    switch(this.marca) {
        case "asiatico":
            resultado=base * 1.05;
        break;

        case "americano":
            resultado=base * 1.15;
        break;

        case "europeo":
            resultado=base * 1.25;
        break;

        default:
        break;
    }

    let anioNum= parseInt(this.anio);

    const diferenciaAnios=  new Date().getFullYear() - anioNum //anyiguedad actual del auto
    resultado -=  ((diferenciaAnios * 3) * resultado) /100;

    if(this.tipoSeguro==="basico"){
        resultado= resultado * 1.3;
    }else{
        resultado= resultado * 1.5;
    }
    return resultado;
}

function UI(){

};

const ui= new UI();

UI.prototype.llenarOpcionesAnios= function(){
    const max= new Date().getFullYear(), min= max-20;
    const selectAnio= document.querySelector("#anio");

    for(let x=max; x>min;x--){
        let opc= document.createElement("option");
        opc.textContent=x;
        opc.value=x;

        selectAnio.appendChild(opc);
    }
};

UI.prototype.mostrarMensaje= function(mensaje){
    const pe= document.createElement("p");
    // const otroDiv= document.querySelector()

    if(mensaje==="error"){
        pe.textContent="Complete todos los campos para continuar!!!";
        pe.classList.add("error");
    }else{
        pe.textContent="Cotizando...";
        pe.classList.add("exito");
    }
    
    formulario.insertBefore(pe, document.querySelector("#algo"));

    setTimeout( ()=> {
        pe.remove();
    }, 3000 );
};

UI.prototype.mostrarResultado= function(seguro, res){
    const resu= document.querySelector("#resultado");
    const diiv= document.createElement("div");
    diiv.classList.add("m-3");
    
    diiv.innerHTML= `
        <p class="fw-bold text-center"> RESUMEN  </p>
        <p class="fw-bold"> Total a pagar: <span class="fw-normal">  $${res} </span></p>
        <p class="fw-bold"> Marca: <span class="fw-normal"> ${seguro.marca}- Modelo: ${seguro.anio} </span></p>
        <p class="fw-bold"> Tipo seguro: <span class="fw-normal"> ${seguro.tipoSeguro} </span></p>
    `;
    
    //mostrar spinner
    spinner.classList.remove("visually-hidden");

    setTimeout( ()=> {
        spinner.style.display="none";
        resu.style.display="flex";
        resu.style.justifyContent= "center";
        resu.appendChild(diiv);
    }, 3000);
    
};

eventListeners();

function eventListeners(){
    document.addEventListener("DOMContentLoaded", ()=>{
        ui.llenarOpcionesAnios();
    });

    formulario.addEventListener("submit", cotizarSeguro);
}

function cotizarSeguro(e){
    e.preventDefault();

    const resu= document.querySelector("#resultado");
    resu.style.display="none";

    const marca= document.querySelector("#marca").value;
    const anio= document.querySelector("#anio").value;
    const tipo = document.querySelector('input[name="tipo"]:checked').value;

    if(marca==="" || anio===""){
        ui.mostrarMensaje("error");
        return;
    }

    spinner.style.display="flex";
    ui.mostrarMensaje("exito");
    
    //ocultar cotizaciones previas
    const resultados= document.querySelector("#resultado div");
    if(resultados!= null){
        resultados.remove();
    }

    const secure= new Seguro(marca, anio, tipo);
    const total= secure.calcular();

    ui.mostrarResultado(secure, total);
}

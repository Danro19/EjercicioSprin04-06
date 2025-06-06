const API_BASE_URL = '/api/v1/funcionarios'; // URL base de tu API
const messageArea = document.getElementById('messageArea');
const funcionariosTableBody = document.getElementById('funcionariosTable').getElementsByTagName('tbody')[0];
let currentFuncionariosList = []; // Para almacenar la lista actual de funcionarios

// --- Funciones para mostrar mensajes ---
function mostrarMensaje(texto, tipo = 'success') {
    messageArea.textContent = texto;
    messageArea.className = tipo; // 'success' o 'error'
    setTimeout(() => {
        messageArea.textContent = '';
        messageArea.className = '';
    }, 5000); // El mensaje desaparece después de 5 segundos
}

// --- Limpiar formulario ---
function limpiarFormulario() {
    document.getElementById('funcionarioId').value = '';
    document.getElementById('nombre').value = '';
    document.getElementById('cargo').value = '';
    document.getElementById('departamento').value = '';
    document.getElementById('telefono').value = '';
    mostrarMensaje('Formulario limpiado.', 'success');
}

// --- Renderizar tabla de funcionarios (Optimizado con DocumentFragment) ---
function renderizarTabla(funcionarios) {
    funcionariosTableBody.innerHTML = ''; // Limpiar tabla existente
    currentFuncionariosList = funcionarios; // Actualizar la lista global

    const fragment = document.createDocumentFragment(); // Crear un DocumentFragment

    if (!funcionarios || funcionarios.length === 0) {
        const tr = document.createElement('tr');
        const td = document.createElement('td');
        td.setAttribute('colspan', 6);
        td.textContent = 'No hay funcionarios para mostrar.';
        td.style.textAlign = 'center';
        tr.appendChild(td); // Corregido: td debe ser hijo de tr
        fragment.appendChild(tr);
    } else {
        funcionarios.forEach(func => {
            const tr = document.createElement('tr');
            tr.dataset.id = func.id; // Guardar el ID en la fila para fácil acceso

            const tdId = document.createElement('td');
            tdId.textContent = func.id;
            tr.appendChild(tdId);

            const tdNombre = document.createElement('td');
            tdNombre.textContent = func.nombre;
            tr.appendChild(tdNombre);

            const tdCargo = document.createElement('td');
            tdCargo.textContent = func.cargo;
            tr.appendChild(tdCargo);

            const tdDepartamento = document.createElement('td');
            tdDepartamento.textContent = func.departamento;
            tr.appendChild(tdDepartamento);

            const tdTelefono = document.createElement('td');
            tdTelefono.textContent = func.telefono;
            tr.appendChild(tdTelefono);

            // Crear celda de acciones
            const tdAcciones = document.createElement('td');
            const btnEditar = document.createElement('button');
            btnEditar.textContent = 'Editar';
            btnEditar.className = 'button-edit';
            btnEditar.dataset.action = 'edit'; // Identificador para la delegación de eventos
            // btnEditar.dataset.id = func.id; // Alternativamente, poner el ID aquí
            tdAcciones.appendChild(btnEditar);

            const btnEliminar = document.createElement('button');
            btnEliminar.textContent = 'Eliminar';
            btnEliminar.className = 'button-delete';
            btnEliminar.dataset.action = 'delete'; // Identificador para la delegación de eventos
            // btnEliminar.dataset.id = func.id; // Alternativamente, poner el ID aquí
            tdAcciones.appendChild(btnEliminar);
            
            tr.appendChild(tdAcciones);

            fragment.appendChild(tr); // Agregar la fila completa al fragmento
        });
    }
    funcionariosTableBody.appendChild(fragment); // Agregar el fragmento completo al tbody de una vez
}

// --- Manejador de clics para la tabla (Delegación de Eventos) ---
function handleTableClick(event) {
    const target = event.target; // El elemento clickeado
    if (target.tagName === 'BUTTON') {
        const action = target.dataset.action;
        const row = target.closest('tr'); // Encuentra la fila (tr) más cercana
        if (!row) return;

        const funcionarioId = row.dataset.id; // Obtener el ID del funcionario desde la fila

        if (action === 'edit') {
            const funcionario = currentFuncionariosList.find(f => f.id == funcionarioId); // Usar '==' para comparar string con número si es necesario, o parsear funcionarioId
            if (funcionario) {
                cargarFuncionarioParaEditar(funcionario);
            }
        } else if (action === 'delete') {
            eliminarFuncionario(funcionarioId);
        }
    }
}


// --- Cargar todos los funcionarios ---
async function cargarTodosLosFuncionarios() {
    try {
        const response = await fetch(API_BASE_URL);
        if (response.status === 204) { // No Content
            renderizarTabla([]);
            mostrarMensaje('No hay funcionarios registrados.', 'success');
            return;
        }
        if (!response.ok) {
            throw new Error(`Error HTTP ${response.status}: ${response.statusText}`);
        }
        const funcionarios = await response.json();
        renderizarTabla(funcionarios);
        // No mostramos mensaje aquí para no ser repetitivo si ya hay datos
    } catch (error) {
        console.error('Error al cargar funcionarios:', error);
        mostrarMensaje(`Error al cargar funcionarios: ${error.message}`, 'error');
        renderizarTabla([]); // Limpiar tabla en caso de error
    }
}

// --- Buscar por ID ---
async function buscarPorId() {
    const id = document.getElementById('searchId').value;
    if (!id) {
        mostrarMensaje('Por favor, ingrese un ID para buscar.', 'error');
        return;
    }
    try {
        const response = await fetch(`${API_BASE_URL}/${id}`);
        if (response.status === 404) {
            mostrarMensaje(`Funcionario con ID ${id} no encontrado.`, 'error');
            renderizarTabla([]);
            return;
        }
        if (!response.ok) {
            throw new Error(`Error HTTP ${response.status}: ${response.statusText}`);
        }
        const funcionario = await response.json();
        renderizarTabla([funcionario]); // Renderizar como un array de un solo elemento
        mostrarMensaje(`Funcionario con ID ${id} encontrado.`, 'success');
    } catch (error) {
        console.error('Error al buscar por ID:', error);
        mostrarMensaje(`Error al buscar por ID: ${error.message}`, 'error');
    }
}

// --- Buscar por Nombre ---
async function buscarPorNombre() {
    const nombre = document.getElementById('searchNombre').value;
    if (!nombre) {
        mostrarMensaje('Por favor, ingrese un nombre para buscar.', 'error');
        return;
    }
    try {
        const response = await fetch(`${API_BASE_URL}?nombre=${encodeURIComponent(nombre)}`);
         if (response.status === 204) {
            renderizarTabla([]);
            mostrarMensaje(`No se encontraron funcionarios con el nombre "${nombre}".`, 'success');
            return;
        }
        if (!response.ok) {
            throw new Error(`Error HTTP ${response.status}: ${response.statusText}`);
        }
        const funcionarios = await response.json();
        renderizarTabla(funcionarios);
        mostrarMensaje(`Resultados para "${nombre}" cargados.`, 'success');
    } catch (error) {
        console.error('Error al buscar por nombre:', error);
        mostrarMensaje(`Error al buscar por nombre: ${error.message}`, 'error');
    }
}

// --- Buscar por Departamento ---
async function buscarPorDepartamento() {
    const depto = document.getElementById('searchDepartamento').value;
    if (!depto) {
        mostrarMensaje('Por favor, ingrese un departamento para buscar.', 'error');
        return;
    }
    try {
        const response = await fetch(`${API_BASE_URL}?departamento=${encodeURIComponent(depto)}`);
        if (response.status === 204) {
            renderizarTabla([]);
            mostrarMensaje(`No se encontraron funcionarios en el departamento "${depto}".`, 'success');
            return;
        }
        if (!response.ok) {
            throw new Error(`Error HTTP ${response.status}: ${response.statusText}`);
        }
        const funcionarios = await response.json();
        renderizarTabla(funcionarios);
        mostrarMensaje(`Resultados para el departamento "${depto}" cargados.`, 'success');
    } catch (error) {
        console.error('Error al buscar por departamento:', error);
        mostrarMensaje(`Error al buscar por departamento: ${error.message}`, 'error');
    }
}

// --- Guardar (Crear o Actualizar) Funcionario ---
async function guardarFuncionario() {
    const id = document.getElementById('funcionarioId').value;
    const funcionario = {
        nombre: document.getElementById('nombre').value,
        cargo: document.getElementById('cargo').value,
        departamento: document.getElementById('departamento').value,
        telefono: document.getElementById('telefono').value
    };

    if (!funcionario.nombre || !funcionario.cargo || !funcionario.departamento) {
        mostrarMensaje('Nombre, Cargo y Departamento son obligatorios.', 'error');
        return;
    }

    let url = API_BASE_URL;
    let method = 'POST';

    if (id) { 
        url += `/${id}`;
        method = 'PUT';
    }

    try {
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(funcionario)
        });

        if (!response.ok) {
            const errorData = await response.text(); 
            throw new Error(`Error HTTP ${response.status}: ${response.statusText}. Detalles: ${errorData}`);
        }

        const resultado = await response.json(); 
        mostrarMensaje(`Funcionario ${id ? 'actualizado' : 'creado'} con ID ${resultado.id}.`, 'success');
        limpiarFormulario();
        cargarTodosLosFuncionarios(); 
    } catch (error) {
        console.error('Error al guardar funcionario:', error);
        mostrarMensaje(`Error al guardar: ${error.message}`, 'error');
    }
}

// --- Cargar datos de funcionario en el formulario para editar ---
function cargarFuncionarioParaEditar(funcionario) {
    document.getElementById('funcionarioId').value = funcionario.id;
    document.getElementById('nombre').value = funcionario.nombre;
    document.getElementById('cargo').value = funcionario.cargo;
    document.getElementById('departamento').value = funcionario.departamento;
    document.getElementById('telefono').value = funcionario.telefono;
    mostrarMensaje(`Editando funcionario ID: ${funcionario.id}.`, 'success');
    window.scrollTo(0, 0); 
}

// --- Eliminar Funcionario ---
async function eliminarFuncionario(id) { // Ahora solo necesita el ID
    if (!confirm(`¿Está seguro de que desea eliminar al funcionario con ID ${id}?`)) {
        return;
    }
    try {
        const response = await fetch(`${API_BASE_URL}/${id}`, {
            method: 'DELETE'
        });
        if (response.status === 204) { 
            mostrarMensaje(`Funcionario con ID ${id} eliminado.`, 'success');
        } else if (response.status === 404) {
             mostrarMensaje(`Funcionario con ID ${id} no encontrado para eliminar.`, 'error');
        } else if (!response.ok) {
            throw new Error(`Error HTTP ${response.status}: ${response.statusText}`);
        }
        cargarTodosLosFuncionarios(); 
    } catch (error) {
        console.error('Error al eliminar funcionario:', error);
        mostrarMensaje(`Error al eliminar: ${error.message}`, 'error');
    }
}

// --- Carga inicial de datos y configuración de event listener para la tabla ---
document.addEventListener('DOMContentLoaded', () => {
    cargarTodosLosFuncionarios();
    funcionariosTableBody.addEventListener('click', handleTableClick); // Añadir el event listener al tbody
});
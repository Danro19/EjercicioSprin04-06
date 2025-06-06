package com.c4.funcionariosspringrest.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.c4.funcionariosspringrest.model.Funcionario;
import com.c4.funcionariosspringrest.repository.FuncioanrioRepository;

@Service
public class FuncionarioService {

    @Autowired
    private FuncioanrioRepository funcioanrioRepository;

    @Transactional(readOnly = true)
    public List<Funcionario> obtenerTodosLosfFuncionarios(){
        return funcioanrioRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Optional<Funcionario> obtenerFuncionarioPorID(Long id){
        if (id != null)
            return funcioanrioRepository.findById(id);
        return Optional.empty();
    }   

    @Transactional(readOnly = true)
    public List<Funcionario> buscarPorDepartamento(String departamento){
        if(departamento== null || departamento.trim().isEmpty())
        return new ArrayList<>();
        return funcioanrioRepository.findByDepartamentoContainingAllIgnoreCase(departamento);
    }

    @Transactional(readOnly = true)
    public List<Funcionario> buscarPorNombre(String nombre){
        if (nombre==null || nombre.trim().isEmpty())
        return new ArrayList<>();
        
        return funcioanrioRepository.findByNombreContainingAllIgnoreCase(nombre);
    }

    @Transactional
    public Funcionario crearNuevoFuncionario(Funcionario funcionario){
        if (funcionario==null){
            throw new IllegalArgumentException("El funcionario no puede ser nulo para poderlo crear");
        }
        if (funcionario.getId() != null)
        throw new IllegalArgumentException("El ID debe ser nulo para poder crear un funcionario");

        return funcioanrioRepository.save(funcionario);
    }

    
    @Transactional
    public void eliminarFuncionarioPorId(Long id){
        if (id==null){
            throw new IllegalArgumentException("El ID no puede ser nulo para eliminar un funcionario");
        }
        if (!funcioanrioRepository.existsById(id))
        throw new IllegalArgumentException("Funcionario con el ID: " + id + " no existe para poder eliminarlo");

        funcioanrioRepository.deleteById(id);
    }

    @Transactional
    public Funcionario actualizarFuncionarioExistente(Long id, Funcionario FuncionarioNuevo ){
        if (id == null || FuncionarioNuevo == null)
            throw new IllegalArgumentException("El ID y los datos del funcionario no pueden ser nulos para actualizar.");
        Optional<Funcionario> funcionarioExiste = funcioanrioRepository.findById(id);
        if(!funcionarioExiste.isPresent())
            throw new RuntimeException("Funcionario con ID "+ id +  " no existe");
        
        int filasAfectadas  = funcioanrioRepository.actualizarFuncionarioConJPQL(id, FuncionarioNuevo.getNombre(), FuncionarioNuevo.getCargo(), FuncionarioNuevo.getDepartamento(), FuncionarioNuevo.getTelefono());

        if (filasAfectadas > 0)
            return funcioanrioRepository.findById(id)
                    .orElseThrow(()-> new RuntimeException("Error al recuperar funcionario despues de actualizar"));
        else 
            throw new RuntimeException("La actualizacion del funcionario con ID: "+ id + "no afecto ninguna fila");
    }

}
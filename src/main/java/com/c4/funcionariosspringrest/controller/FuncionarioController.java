package com.c4.funcionariosspringrest.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.c4.funcionariosspringrest.model.Funcionario;
import com.c4.funcionariosspringrest.service.FuncionarioService;
import org.springframework.web.bind.annotation.PutMapping;



@RestController
@RequestMapping("/api/v1/funcionarios")
public class FuncionarioController {
    @Autowired
    private FuncionarioService funcionarioService;

    @GetMapping
    public ResponseEntity<List<Funcionario>> obtenerFuncionarios(@RequestParam(required = false) String nombre, @RequestParam(required = false) String departamento){

        List<Funcionario> funcionarios;
        if(nombre != null && !nombre.trim().isEmpty())
            funcionarios =funcionarioService.buscarPorNombre(nombre);
        else if (departamento != null && !departamento.trim().isEmpty())
        funcionarios=funcionarioService.buscarPorDepartamento(departamento);
        else 
            funcionarios = funcionarioService.obtenerTodosLosfFuncionarios();

        if(!funcionarios.isEmpty())
            return ResponseEntity.ok(funcionarios); // 200 = ok

        return ResponseEntity.noContent().build(); // 204 = No content
    }

    @GetMapping("/{id}")
    public ResponseEntity<Funcionario> obtenerPorID(@PathVariable Long id){
        Optional<Funcionario> funcionario = funcionarioService.obtenerFuncionarioPorID(id);

        return funcionario.map(ResponseEntity::ok)
            .orElseGet(() -> ResponseEntity.notFound().build()); // 404 no found
    }
    @PostMapping
    public ResponseEntity<Funcionario> crearFuncionario(@RequestBody Funcionario funcionario){
        try {
            if(funcionario.getId() != null)
                return ResponseEntity.badRequest().build();
            Funcionario nuevFuncionario = funcionarioService.crearNuevoFuncionario(funcionario);

            return ResponseEntity.status(HttpStatus.CREATED).body(nuevFuncionario); // 201 creado
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
        
    } 
    @DeleteMapping("/{id}")
    public ResponseEntity<Funcionario> eliminarFuncionario(@PathVariable long id){
        try {
               funcionarioService.eliminarFuncionarioPorId(id);
               return ResponseEntity.noContent().build(); // 204 no content
        } catch (Exception e) {
            if (e.getMessage()!=null && e.getMessage().contains("no encontrado"))
            return ResponseEntity.notFound().build();

            return ResponseEntity.badRequest().build();
        }
    } 

    @PutMapping("/{id}")
    public ResponseEntity<Funcionario> actualizarFuncionario(@PathVariable Long id, @RequestBody Funcionario detallesFuncionario) {
        try {
            Funcionario funcionario = funcionarioService.actualizarFuncionarioExistente(id, detallesFuncionario);
            return ResponseEntity.ok(funcionario);
        } catch (Exception e) {
            if (e.getMessage()!=null && e.getMessage().contains("no encontrado"))
            return ResponseEntity.notFound().build();

            return ResponseEntity.badRequest().build();
        }
        
        
    }

}

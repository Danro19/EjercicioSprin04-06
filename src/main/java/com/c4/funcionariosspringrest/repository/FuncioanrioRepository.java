package com.c4.funcionariosspringrest.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.c4.funcionariosspringrest.model.Funcionario;

import jakarta.transaction.Transactional;

@Repository
public interface  FuncioanrioRepository extends JpaRepository<Funcionario, Long>{

    List<Funcionario> findByNombreContainingAllIgnoreCase(String nombre);
    List<Funcionario> findByDepartamentoContainingAllIgnoreCase(String departamento);


    @Modifying
    @Transactional
    @Query("Update Funcionario f set f.nombre = :nombre, f.cargo = :cargo, f.departamento = :departamento, f.telefono = :telefono where f.id = :id")
    int actualizarFuncionarioConJPQL (
        @Param("id") Long id, @Param("nombre") String nombre,
        @Param("cargo") String cargo,
        @Param("Departamento") String departamento,
        @Param("telefono") String telefono
    );

    


}

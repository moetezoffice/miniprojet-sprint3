package tn.mesplantes.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.Entity;
import jakarta.persistence.Column;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "categorie")
public class Type {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_cat")
    private Long id;

    @Column(name = "nom_cat")
    @NotBlank
    private String nom;

    @JsonIgnore
    @OneToMany(mappedBy = "type")
    private List<Plante> plantes = new ArrayList<>();

    public Type() {
    }

    public Type(String nom) {
        this.nom = nom;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNom() {
        return nom;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public List<Plante> getPlantes() {
        return plantes;
    }

    public void setPlantes(List<Plante> plantes) {
        this.plantes = plantes;
    }
}

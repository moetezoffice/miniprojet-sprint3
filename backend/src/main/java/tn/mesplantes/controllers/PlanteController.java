package tn.mesplantes.controllers;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import tn.mesplantes.dto.PlantePayload;
import tn.mesplantes.entities.Plante;
import tn.mesplantes.services.PlanteService;

import java.util.List;

@RestController
@RequestMapping("/api")
public class PlanteController {
    private final PlanteService planteService;

    public PlanteController(PlanteService planteService) {
        this.planteService = planteService;
    }

    @GetMapping
    public List<Plante> getAll() {
        return planteService.findAll();
    }

    @GetMapping("/{id:\\d+}")
    public Plante getById(@PathVariable("id") Long id) {
        return planteService.findById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Plante create(@Valid @RequestBody PlantePayload payload) {
        return planteService.create(payload);
    }

    @PutMapping("/{id:\\d+}")
    public Plante update(@PathVariable("id") Long id, @Valid @RequestBody PlantePayload payload) {
        return planteService.update(id, payload);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable("id") Long id) {
        planteService.delete(id);
    }

    @GetMapping("/rechercheParNom")
    public List<Plante> searchByName(@RequestParam(name = "nom", required = false) String nom) {
        return planteService.findByNom(nom);
    }

    @GetMapping("/rechercheExacte")
    public List<Plante> searchByExactName(@RequestParam("nom") String nom) {
        return planteService.findByExactNom(nom);
    }

    @GetMapping("/prodscat/{typeId}")
    public List<Plante> searchByType(@PathVariable("typeId") Long typeId) {
        return planteService.findByType(typeId);
    }

    @GetMapping("/rechercheParPrix")
    public List<Plante> searchByNameAndPrice(@RequestParam("nom") String nom,
                                             @RequestParam("prix") Double prix) {
        return planteService.findByNomEtPrix(nom, prix);
    }

    @GetMapping("/trieNom")
    public List<Plante> sortByName() {
        return planteService.findByOrderByNomAsc();
    }

    @GetMapping("/trieNomPrix")
    public List<Plante> sortByNameAndPrice() {
        return planteService.trierParNomEtPrix();
    }
}

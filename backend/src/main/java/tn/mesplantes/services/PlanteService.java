package tn.mesplantes.services;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import tn.mesplantes.dto.PlantePayload;
import tn.mesplantes.entities.Plante;
import tn.mesplantes.entities.Type;
import tn.mesplantes.repositories.PlanteRepository;
import tn.mesplantes.repositories.TypeRepository;

import java.time.LocalDate;
import java.util.List;

@Service
@Transactional
public class PlanteService {
    private final PlanteRepository planteRepository;
    private final TypeRepository typeRepository;

    public PlanteService(PlanteRepository planteRepository, TypeRepository typeRepository) {
        this.planteRepository = planteRepository;
        this.typeRepository = typeRepository;
    }

    @Transactional(readOnly = true)
    public List<Plante> findAll() {
        return planteRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Plante findById(Long id) {
        return planteRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Plante introuvable"));
    }

    public Plante create(PlantePayload payload) {
        Plante plante = new Plante();
        remplir(plante, payload);
        return planteRepository.save(plante);
    }

    public Plante update(Long id, PlantePayload payload) {
        Plante plante = findById(id);
        remplir(plante, payload);
        return planteRepository.save(plante);
    }

    public void delete(Long id) {
        if (!planteRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Plante introuvable");
        }
        planteRepository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public List<Plante> findByNom(String nom) {
        return planteRepository.findByNomContainingIgnoreCase(nom == null ? "" : nom.trim());
    }

    @Transactional(readOnly = true)
    public List<Plante> findByExactNom(String nom) {
        return planteRepository.findByNomIgnoreCase(nom == null ? "" : nom.trim());
    }

    @Transactional(readOnly = true)
    public List<Plante> findByType(Long typeId) {
        return planteRepository.findByType_Id(typeId);
    }

    @Transactional(readOnly = true)
    public List<Plante> findByType(Type type) {
        return planteRepository.findByType(type);
    }

    @Transactional(readOnly = true)
    public List<Plante> findByNomEtPrix(String nom, Double prix) {
        return planteRepository.findByNomEtPrix(nom == null ? "" : nom.trim(), prix);
    }

    @Transactional(readOnly = true)
    public List<Plante> findByOrderByNomAsc() {
        return planteRepository.findByOrderByNomAsc();
    }

    @Transactional(readOnly = true)
    public List<Plante> trierParNomEtPrix() {
        return planteRepository.trierParNomEtPrix();
    }

    private void remplir(Plante plante, PlantePayload payload) {
        Type type = typeRepository.findById(payload.typeId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Type inconnu"));
        plante.setNom(payload.nom().trim());
        plante.setPrix(payload.prix());
        plante.setDateCreation(payload.dateCreation() == null ? LocalDate.now() : payload.dateCreation());
        plante.setType(type);
    }
}

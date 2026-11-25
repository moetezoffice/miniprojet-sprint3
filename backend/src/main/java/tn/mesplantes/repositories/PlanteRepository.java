package tn.mesplantes.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.data.rest.core.annotation.RestResource;
import org.springframework.data.repository.query.Param;
import org.springframework.data.jpa.repository.Query;
import tn.mesplantes.entities.Plante;
import tn.mesplantes.entities.Type;

import java.util.List;

@RepositoryRestResource(path = "plantes", collectionResourceRel = "plantes", excerptProjection = PlanteProjection.class)
public interface PlanteRepository extends JpaRepository<Plante, Long> {
    @RestResource(path = "findByNom", rel = "findByNom")
    List<Plante> findByNomIgnoreCase(@Param("nom") String nom);

    @RestResource(path = "findByNomContaining", rel = "findByNomContaining")
    List<Plante> findByNomContainingIgnoreCase(@Param("nom") String nom);

    @RestResource(path = "findByTypeId", rel = "findByTypeId")
    List<Plante> findByType_Id(@Param("id") Long id);

    List<Plante> findByType(Type type);

    @Query("select p from Plante p where lower(p.nom) like lower(concat('%', :nom, '%')) and p.prix > :prix")
    List<Plante> findByNomEtPrix(@Param("nom") String nom, @Param("prix") Double prix);

    List<Plante> findByOrderByNomAsc();

    @Query("select p from Plante p order by p.nom asc, p.prix desc")
    List<Plante> trierParNomEtPrix();
}

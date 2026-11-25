package tn.mesplantes.repositories;

import org.springframework.data.rest.core.config.Projection;
import tn.mesplantes.entities.Plante;
import tn.mesplantes.entities.Type;

import java.time.LocalDate;

@Projection(name = "resumePlante", types = Plante.class)
public interface PlanteProjection {
    Long getId();

    String getNom();

    Double getPrix();

    LocalDate getDateCreation();

    Type getType();
}

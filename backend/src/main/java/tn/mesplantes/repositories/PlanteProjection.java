package tn.mesplantes.repositories;

import org.springframework.data.rest.core.config.Projection;
import tn.mesplantes.entities.Plante;
import tn.mesplantes.entities.Type;

import java.math.BigDecimal;
import java.time.Instant;

@Projection(name = "resumePlante", types = Plante.class)
public interface PlanteProjection {
    Long getId();

    String getNom();

    BigDecimal getPrix();

    Instant getDateCreation();

    Type getType();
}

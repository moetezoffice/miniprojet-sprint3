package tn.mesplantes.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.Instant;

public record PlantePayload(
        @NotBlank String nom,
        @NotNull @DecimalMin("0.0") BigDecimal prix,
        Instant dateCreation,
        @NotNull Long typeId
) {
}

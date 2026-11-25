package tn.mesplantes.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public record PlantePayload(
        @NotBlank String nom,
        @NotNull @DecimalMin("0.0") Double prix,
        LocalDate dateCreation,
        @NotNull Long typeId
) {
}

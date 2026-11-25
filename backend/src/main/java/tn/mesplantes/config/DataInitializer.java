package tn.mesplantes.config;

import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import tn.mesplantes.entities.Plante;
import tn.mesplantes.entities.Type;
import tn.mesplantes.repositories.PlanteRepository;
import tn.mesplantes.repositories.TypeRepository;

import java.util.Locale;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Configuration
public class DataInitializer {
    @Bean
    ApplicationRunner initializeTypesAndAttachExistingPlants(TypeRepository typeRepository,
                                                               PlanteRepository planteRepository) {
        return args -> {
            if (typeRepository.count() == 0) {
                typeRepository.saveAll(List.of(
                        new Type("Plantes d’intérieur"),
                        new Type("Succulentes"),
                        new Type("Plantes aromatiques")
                ));
            }

            Map<String, Type> types = typeRepository.findAll().stream()
                    .collect(Collectors.toMap(type -> type.getNom().toLowerCase(Locale.ROOT), Function.identity()));
            Type interior = types.get("plantes d’intérieur");
            Type succulentes = types.get("succulentes");
            Type aromatiques = types.get("plantes aromatiques");
            List<Plante> plantes = planteRepository.findAll();
            for (Plante plante : plantes) {
                if (plante.getType() == null) {
                    String nom = plante.getNom().toLowerCase(Locale.ROOT);
                    if (nom.contains("aloe")) {
                        plante.setType(succulentes);
                    } else if (List.of("basilic", "romarin", "menthe", "lavande", "thym")
                            .stream().anyMatch(nom::contains)) {
                        plante.setType(aromatiques);
                    } else {
                        plante.setType(interior);
                    }
                }
            }
            planteRepository.saveAll(plantes);
        };
    }
}

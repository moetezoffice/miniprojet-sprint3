package tn.mesplantes.config;

import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import tn.mesplantes.entities.Type;
import tn.mesplantes.repositories.TypeRepository;

import java.util.List;

@Configuration
public class DataInitializer {
    @Bean
    ApplicationRunner initializeTypes(TypeRepository typeRepository) {
        return args -> {
            if (typeRepository.count() == 0) {
                typeRepository.saveAll(List.of(
                        new Type("Plantes d’intérieur"),
                        new Type("Succulentes"),
                        new Type("Plantes aromatiques")
                ));
            }
        };
    }
}

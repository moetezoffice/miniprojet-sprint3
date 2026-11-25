package tn.mesplantes.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import tn.mesplantes.entities.Type;

@RepositoryRestResource(path = "types", collectionResourceRel = "types")
public interface TypeRepository extends JpaRepository<Type, Long> {
}

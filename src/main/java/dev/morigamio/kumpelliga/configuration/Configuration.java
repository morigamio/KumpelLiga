package dev.morigamio.kumpelliga.configuration;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.Getter;

@Entity
@Getter
public class Configuration {

    @Id
    private String param_key;
    private String param_value;

    public Configuration() {
        // JPA
    }
}

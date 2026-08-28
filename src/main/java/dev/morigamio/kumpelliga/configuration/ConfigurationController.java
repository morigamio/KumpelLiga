package dev.morigamio.kumpelliga.configuration;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ConfigurationController {

    final ConfigurationRepository configurationRepository;

    public ConfigurationController(ConfigurationRepository configurationRepository) {
        this.configurationRepository = configurationRepository;
    }


    @PostMapping("/configuration")
    public ResponseEntity<Configuration> addConfiguration(@RequestBody Configuration configuration){
        configurationRepository.save(configuration);
        return new ResponseEntity<>(configuration, HttpStatus.OK);
    }
}

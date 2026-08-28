package dev.morigamio.kumpelliga.oddsclient.oddsapi;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

public record Market(String key, @JsonProperty("last_updated")String lastUpdated, List<Outcome> outcomes) {
}

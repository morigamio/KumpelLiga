package dev.morigamio.kumpelliga.oddsclient.oddsapi;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

record Market(String key, @JsonProperty("last_updated")String lastUpdated, List<Outcome> outcomes) {
}

package dev.morigamio.kumpelliga.oddsclient.oddsapi;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

public record Bookmaker(String key, String title, @JsonProperty("last_updated")String lastUpdated, List<Market> markets) {}



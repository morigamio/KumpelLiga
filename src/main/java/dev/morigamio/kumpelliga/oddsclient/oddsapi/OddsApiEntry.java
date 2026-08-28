package dev.morigamio.kumpelliga.oddsclient.oddsapi;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.time.Instant;
import java.util.List;

public record OddsApiEntry(@JsonProperty("home_team") String homeTeam,
                           @JsonProperty("away_team") String awayTeam,
                           @JsonProperty("commence_time") Instant matchTime,
                           @JsonProperty("bookmakers") List<Bookmaker> bookmakers) {
}

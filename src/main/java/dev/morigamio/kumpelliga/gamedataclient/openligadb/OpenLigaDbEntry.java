package dev.morigamio.kumpelliga.gamedataclient.openligadb;

import java.time.LocalDateTime;

public record OpenLigaDbEntry(Long matchID,
                              LocalDateTime matchDateTime,
                              LocalDateTime lastUpdateDateTime,
                              Group group,
                              Team team1,
                              Team team2,
                              MatchResult[] matchResults,
                              boolean matchIsFinished) {
}
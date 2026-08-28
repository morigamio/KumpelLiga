package dev.morigamio.kumpelliga.league.dto;

import dev.morigamio.kumpelliga.league.League;
import dev.morigamio.kumpelliga.participant.ReadParticipantDTO;

import java.util.List;

public record ReadLeagueDTO(long id, String name, String admin, List<ReadParticipantDTO> participants){

    public static ReadLeagueDTO from(League league) {
        return new ReadLeagueDTO(
                league.getId(),
                league.getName(),
                league.getAdmin().getName(),
                ReadParticipantDTO.from(league.getParticipants())
        );
    }
}

package dev.morigamio.kumpelliga.league;

import java.math.BigDecimal;
import java.util.Collection;
import java.util.List;

record ReadParticipantDTO(Long id, String name, Participant.Status status, BigDecimal balance, BigDecimal avgWinRate, BigDecimal highestWin) {

    public static ReadParticipantDTO from(Participant participant) {
        return new ReadParticipantDTO(
                participant.getId(),
                participant.getAccount().getName(),
                participant.getStatus(),
                participant.getBalance(),
                participant.avgWinRate(),
                participant.getHighestWin()
        );
    }

    public static List<ReadParticipantDTO> from(Collection<Participant> participants) {
        return participants.stream()
                .map(participant -> new ReadParticipantDTO(
                        participant.getId(),
                        participant.getAccount().getName(),
                        participant.getStatus(),
                        participant.getBalance(),
                        participant.avgWinRate(),
                        participant.getHighestWin()
                )).toList();
    }
}

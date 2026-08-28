package dev.morigamio.kumpelliga.participant;

import java.math.BigDecimal;
import java.util.Collection;
import java.util.List;

public record ReadParticipantDTO(Long id, String name, String status, BigDecimal balance) {

    public static ReadParticipantDTO from(Participant participant) {
        return new ReadParticipantDTO(
                participant.getId(),
                participant.getAccount().getName(),
                participant.getStatus(),
                participant.getBalance()
        );
    }

    public static List<ReadParticipantDTO> from(Collection<Participant> participants) {
        return participants.stream()
                .map(p -> new ReadParticipantDTO(
                        p.getId(),
                        p.getAccount().getName(),
                        p.getStatus(),
                        p.getBalance()
                )).toList();
    }
}

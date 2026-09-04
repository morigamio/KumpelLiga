package dev.morigamio.kumpelliga.game;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Getter
public class GameDay {
    @Id
    private int gameDay;
    private LocalDateTime updateTimeStamp;
}

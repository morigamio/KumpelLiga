package dev.morigamio.kumpelliga.exception;

public class LeagueAlreadyExistsException extends RuntimeException {
    public LeagueAlreadyExistsException(String name) {

        super("Name %s is already taken".formatted(name));
    }
}

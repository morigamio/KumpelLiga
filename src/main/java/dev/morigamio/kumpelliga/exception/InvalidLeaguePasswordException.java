package dev.morigamio.kumpelliga.exception;

public class InvalidLeaguePasswordException extends RuntimeException {
    public InvalidLeaguePasswordException() {
        super("Password is not correct");
    }
}

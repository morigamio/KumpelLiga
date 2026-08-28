package dev.morigamio.kumpelliga.exception;

public class PrincipalAccountNotFoundException extends RuntimeException {
  public PrincipalAccountNotFoundException(String message) {
    super(message);
  }
}

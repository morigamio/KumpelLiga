package dev.morigamio.kumpelliga.exception;

public class ResourceAlreadyExistsException extends RuntimeException {
    public ResourceAlreadyExistsException(Class<?> type, String name) {
        super("%s %s already exists".formatted(type.getSimpleName(), name));
    }
}

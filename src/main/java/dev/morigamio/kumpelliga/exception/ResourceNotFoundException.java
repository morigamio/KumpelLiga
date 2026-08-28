package dev.morigamio.kumpelliga.exception;

public class ResourceNotFoundException extends RuntimeException{
    public ResourceNotFoundException(Class<?> type, long id) {
        super("%s with ID %d not found".formatted(type.getSimpleName(),id));
    }
}

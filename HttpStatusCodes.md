# HTTP-Statuscodes — Spickzettel

## Erfolg (2xx)

| Code | Name       | Wann                                                                                             |
|------|------------|--------------------------------------------------------------------------------------------------|
| 200  | OK         | Erfolg mit Antwort-Body (GET-Ergebnisse, Suche — auch bei leerer Liste `[]`)                     |
| 201  | Created    | Neue Ressource erstellt (Liga angelegt) — idealerweise mit `Location`-Header zur neuen Ressource |
| 204  | No Content | Erfolg, aber nichts zurückzugeben (Mitglied hinzugefügt, Ressource gelöscht)                     |

## Client-Fehler (4xx)

| Code | Name                 | Wann                                                                                                     |
|------|----------------------|----------------------------------------------------------------------------------------------------------|
| 400  | Bad Request          | Syntaktisch kaputt: ungültiges JSON, falscher Typ, unbekannter Enum-Wert (macht Spring automatisch)      |
| 401  | Unauthorized         | Nicht eingeloggt / keine gültigen Credentials (kommt mit Spring Security)                                |
| 403  | Forbidden            | Eingeloggt, aber keine Berechtigung (fremde Liga bearbeiten)                                             |
| 404  | Not Found            | Ressource im **Pfad** existiert nicht (`/leagues/999`)                                                   |
| 409  | Conflict             | Widerspricht dem aktuellen Zustand (schon Mitglied, Liga bereits gestartet, Optimistic-Locking-Konflikt) |
| 422  | Unprocessable Entity | Syntaktisch okay, aber inhaltlich nicht verarbeitbar: Referenz-ID im **Body** existiert nicht            |

## Server-Fehler (5xx)

| Code | Name                  | Wann                                                                                                                      |
|------|-----------------------|---------------------------------------------------------------------------------------------------------------------------|
| 500  | Internal Server Error | Unbehandelte Exception — sollte **nie** die Antwort auf fehlerhaften Client-Input sein; wenn doch, fehlt ein 4xx-Handling |

## Merkregeln

- **Pfad-ID falsch → 404, Body-ID falsch → 422**
- **400 = Syntax kaputt, 422 = Semantik kaputt**
- **401 = „Wer bist du?", 403 = „Dich kenne ich, aber nein."**
- **Leere Suchergebnisse → 200 mit `[]`, nicht 404**
- **5xx heißt immer: Fehler liegt bei dir, nicht beim Client**
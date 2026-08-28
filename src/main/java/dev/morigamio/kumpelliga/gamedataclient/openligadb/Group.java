package dev.morigamio.kumpelliga.gamedataclient.openligadb;

import com.fasterxml.jackson.annotation.JsonProperty;

public record Group(@JsonProperty("groupOrderID") int groupOrderId) {
}

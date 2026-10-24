package dev.morigamio.kumpelliga.gamedataclient.openligadb;

import com.fasterxml.jackson.annotation.JsonProperty;

record Group(@JsonProperty("groupOrderID") int groupOrderId) {
}

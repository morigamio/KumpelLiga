package dev.morigamio.kumpelliga.gamedataclient.openligadb;

import jakarta.annotation.PreDestroy;
import lombok.extern.slf4j.Slf4j;
import org.eclipse.paho.client.mqttv3.IMqttDeliveryToken;
import org.eclipse.paho.client.mqttv3.MqttAsyncClient;
import org.eclipse.paho.client.mqttv3.MqttCallbackExtended;
import org.eclipse.paho.client.mqttv3.MqttConnectOptions;
import org.eclipse.paho.client.mqttv3.MqttException;
import org.eclipse.paho.client.mqttv3.MqttMessage;
import org.eclipse.paho.client.mqttv3.persist.MemoryPersistence;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;

// receives live game updates from the OpenLigaDB MQTT broker
@Component
@Slf4j
@ConditionalOnProperty(name = "gamedata.provider", havingValue = "openLigaDb")
class MQTTSubscriber implements MqttCallbackExtended {
    private static final int QOS = 1;

    private final String brokerUrl;
    private final String clientId; // fixed per environment, so the broker can keep the session
    private MqttAsyncClient client;

    MQTTSubscriber(@Value("${mqtt.broker-url}") String brokerUrl, @Value("${mqtt.client-id}") String clientId) {
        this.brokerUrl = brokerUrl;
        this.clientId = clientId;
    }

    @EventListener(ApplicationReadyEvent.class)
    public void connect() {
        try {
            client = new MqttAsyncClient(brokerUrl, clientId, new MemoryPersistence());
            client.setCallback(this);
            MqttConnectOptions options = new MqttConnectOptions();
            options.setAutomaticReconnect(true);
            options.setCleanSession(false); // persistent session: the broker keeps messages missed while we were offline
            client.connect(options).waitForCompletion();
        } catch (MqttException e) {
            log.error("Connecting to MQTT broker %s failed".formatted(brokerUrl), e);
        }
    }

    // called after the first connect and after every automatic reconnect, because subscriptions are lost on reconnect
    @Override
    public void connectComplete(boolean reconnect, String serverURI) {
        String topic = buildTopic();
        try {
            client.subscribe(topic, QOS); // not waiting here, blocking inside a Paho callback can deadlock
            log.info("%s to MQTT broker %s, subscribing to %s".formatted(reconnect ? "Reconnected" : "Connected", serverURI, topic));
        } catch (MqttException e) {
            log.error("Subscribing to MQTT topic %s failed".formatted(topic), e);
        }
    }

    @Override
    public void messageArrived(String topic, MqttMessage message) {
        String payload = new String(message.getPayload(), StandardCharsets.UTF_8);
        log.info("MQTT message on %s: %s".formatted(topic, payload));
    }

    @Override
    public void connectionLost(Throwable cause) {
        log.warn("Connection to MQTT broker lost, reconnecting automatically", cause);
    }

    @Override
    public void deliveryComplete(IMqttDeliveryToken token) {
        // only relevant for publishing, which we never do
    }

    @PreDestroy
    public void disconnect() {
        if (client == null) return;
        try {
            if (client.isConnected()) client.disconnect().waitForCompletion();
            client.close();
        } catch (MqttException e) {
            log.error("Disconnecting from MQTT broker failed", e);
        }
    }

    private String buildTopic() {
        return "openligadb/%s/%d/#".formatted(OpenLigaDbSettings.LEAGUE, OpenLigaDbSettings.SEASON);
    }
}

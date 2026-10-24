package dev.morigamio.kumpelliga.account;

import jakarta.persistence.*;
import lombok.Getter;

@Entity
@Getter
public class Account {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String name;
    private String password;

    protected Account() {}

    protected Account(String name, String password) {
        this.name = name;
        this.password = password;
    }
}

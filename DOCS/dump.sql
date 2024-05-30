-- Criação da tabela Equipe sem a constraint de líder
CREATE TABLE Equipe (
    id UUID PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL, -- Minimo de 5 caracteres
  	CONSTRAINT name_length CHECK (char_length(name) > 5)
);

-- Criação da tabela Usuario
CREATE TABLE Usuario (
    id UUID PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL, -- Minimo de 5 caracteres
    email VARCHAR(255) NOT NULL, -- Regex: nome@email.co
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    password VARCHAR(255) NOT NULL, -- Minimo de 8 caracteres com letra e numero
    squad UUID,
    is_admin BOOLEAN NOT NULL DEFAULT FALSE,
    CONSTRAINT fk_squad FOREIGN KEY (squad) REFERENCES Equipe(id),
  	CONSTRAINT username_length CHECK (char_length(username) > 5),
  	CONSTRAINT password_length CHECK (char_length(password) > 8),
  	CONSTRAINT email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  	CONSTRAINT password_format CHECK (char_length(password) > 8 AND password ~* '^(?=.*[A-Za-z])(?=.*\d).+$'),
    CONSTRAINT admin_squad CHECK (NOT is_admin OR squad IS NULL)
);

-- Adicionando a constraint de líder na tabela Equipe
ALTER TABLE Equipe
ADD COLUMN leader UUID,
ADD CONSTRAINT fk_leader FOREIGN KEY (leader) REFERENCES Usuario(id);
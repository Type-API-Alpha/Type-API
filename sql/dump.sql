-- Criação da tabela Equipe sem a constraint de líder
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE Team (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL, -- Minimo de 5 caracteres
  	CONSTRAINT name_length CHECK (char_length(name) > 5)
);

-- Criação da tabela Usuario
CREATE TABLE "User" (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL, -- Minimo de 5 caracteres
    email VARCHAR(255) NOT NULL, -- Regex: nome@email.co
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    squad UUID,
    is_admin BOOLEAN NOT NULL DEFAULT FALSE,
    CONSTRAINT fk_squad FOREIGN KEY (squad) REFERENCES Team(id),
  	CONSTRAINT username_length CHECK (char_length(username) > 5),
    CONSTRAINT admin_squad CHECK (NOT is_admin OR squad IS NULL)
);

-- Adicionando a constraint de líder na tabela Equipe
ALTER TABLE Team
ADD COLUMN leader UUID NOT NULL,
ADD CONSTRAINT fk_leader FOREIGN KEY (leader) REFERENCES "User"(id);
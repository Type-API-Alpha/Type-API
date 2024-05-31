INSERT INTO Team (id, name) VALUES ('550e8400-e29b-41d4-a716-446655440000', 'TeamAlpha');

INSERT INTO "User" (id, username, email, first_name, last_name, password, squad, is_admin) VALUES 
('550e8400-e29b-41d4-a716-446655440001', 'Carlos', 'carlinhos@hotmail.com', 'Carlos', 'Do Front', 'Password123', '550e8400-e29b-41d4-a716-446655440000', FALSE),
('550e8400-e29b-41d4-a716-446655440002', 'Cesaar', 'cesinha@gmail.com', 'Cesar', 'Do Back', 'Password123', '550e8400-e29b-41d4-a716-446655440000', FALSE);

INSERT INTO "User" (id, username, email, first_name, last_name, password, is_admin) VALUES
('550e8400-e29b-41d4-a716-446655440003', 'Ligiaa', 'liginha@hotmail.com', 'Ligina', 'A Braba', 'Password123', FALSE),
('550e8400-e29b-41d4-a716-446655440004', 'Neutom', 'neutim@gmail.com', 'Neutom', 'The Master', 'Password123', TRUE);
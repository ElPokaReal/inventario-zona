-- Script para actualizar los roles del sistema
-- Cambiar de: administrador, supervisor, técnico
-- A: administrador, usuario, técnico

USE inventario_db;

-- Primero, actualizar los roles existentes
UPDATE roles SET nombre = 'usuario' WHERE nombre = 'supervisor';

-- Verificar que los roles estén correctos
SELECT * FROM roles;

-- Opcional: Si necesitas reiniciar los IDs, puedes usar:
-- DELETE FROM roles;
-- INSERT INTO roles (id, nombre) VALUES 
-- (1, 'administrador'),
-- (2, 'usuario'), 
-- (3, 'técnico'); 